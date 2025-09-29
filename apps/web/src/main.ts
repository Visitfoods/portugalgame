import './styles.css'
import { Home } from './ui/screens/Home'
import { HowTo } from './ui/screens/HowTo'
import { Ranking } from './ui/screens/Ranking'
import { Permissions } from './ui/screens/Permissions'
import { Game } from './ui/screens/Game'
import { Result as ResultForm } from './ui/screens/ResultNew'
import { Register } from './ui/screens/Register'
import { ResultSummary } from './ui/screens/ResultSummary'
import { EmailLogin } from './ui/components/EmailLogin'
import { AuthComplete } from './ui/screens/AuthComplete'
import { UsernamePicker } from './ui/screens/UsernamePicker'
import { AuthService, getCachedUser, setCachedUser } from './services/auth'
import { getUserProfile } from './services/user'
import { ensureFirestoreOnline } from './lib/firebase'
import { userStore } from './services/userStore'
import { submitScore } from './services/score'
import { Account } from './ui/screens/Account'

const app = document.getElementById('app')!;

function mount(el: HTMLElement) {
  app.innerHTML = '';
  app.appendChild(el);
}

function startFlow() {
  const home = Home(() => startGameDirect(), Object.assign(() => showHowTo(), { gotoAccount: () => showAccount() }), () => showRanking());
  mount(home);
}

function showHowTo() {
  const how = HowTo(() => startGameDirect(), () => startFlow());
  mount(how);
}

function showRanking() {
  const r = Ranking(() => startGameDirect(), () => startFlow());
  mount(r);
}

function showAccount() {
  const acc = Account(() => startFlow());
  mount(acc);
}

async function startGameDirect() {
  try {
    // Solicitar permissão diretamente no clique do botão JOGAR
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    // Fecha imediatamente; o ecrã do jogo reabre a câmara
    stream.getTracks().forEach(t => t.stop());
    mount(Game((score) => {
      const goForm = () => mount(ResultForm(score, () => startFlow()));
      mount(ResultSummary(score, () => handleSubmitScoreFlow(score, goForm), () => startFlow()));
    }, () => startFlow()));
  } catch (e) {
    // Fallback para o ecrã de permissões, caso falhe ou seja negado
    askPermissions();
  }
}

function askPermissions() {
  const perms = Permissions(async () => {
    try {
      // Permissions are requested when Game screen starts the camera
      mount(Game((score) => {
        const goForm = () => mount(ResultForm(score, () => startFlow()));
        mount(ResultSummary(score, () => handleSubmitScoreFlow(score, goForm), () => startFlow()));
      }, () => startFlow()));
    } catch (e) {
      alert('Não foi possível aceder à câmara.');
      startFlow();

// Try to consume Google redirect results on any route
AuthService.consumeGoogleRedirect().then(u => {
  if (u) {
    try { setCachedUser({ uid: u.uid, email: u.email || undefined, displayName: (u as any).displayName || undefined }); } catch {}
  }
});
    }
  }, () => startFlow());
  mount(perms);
}

// Initialize central user store (auth + profile sync)
userStore.init().catch(() => {});
startFlow();

// Ensure Firestore network is enabled (avoids transient offline state)
ensureFirestoreOnline().catch(() => {});

// Keep local cache in sync with Firebase auth state (handles popup sign-in)
AuthService.onAuth(async (u) => {
  try {
    if (u) {
      // Preserve existing username if present; otherwise try to fetch profile
      const existing = getCachedUser();
      let username = existing?.username;
      let displayName = (u as any).displayName || existing?.displayName || undefined;
      if (!username) {
        try {
          const prof = await getUserProfile(u.uid);
          if (prof?.username) {
            username = prof.username;
            displayName = prof.displayName || displayName;
          }
        } catch {}
      }
      setCachedUser({ uid: u.uid, email: u.email || undefined, username, displayName });
    } else {
      setCachedUser(null);
    }
  } catch {}
});

// Redirect consumption é tratado na userStore.init()

// Auth route handling for email link completion
window.addEventListener('load', () => {
  const path = new URL(location.href).pathname;
  if (path === '/auth-complete') {
    const goNeedsProfile = () => {
      mount(Register(() => {
        mount(UsernamePicker(() => {
          const pending = Number(localStorage.getItem('ab-pending-score') || '');
          try { localStorage.removeItem('ab-pending-score'); } catch {}
          if (!isNaN(pending)) {
            handleSubmitScoreFlow(pending, () => startFlow());
          } else {
            startFlow();
          }
        }, () => startFlow()));
      }, () => startFlow()));
    };
    const done = (score?: number) => {
      if (typeof score === 'number') {
        handleSubmitScoreFlow(score, () => startFlow());
      } else {
        startFlow();

// Redirect consumo tratado na userStore.init()
      }
    };
    mount(AuthComplete(goNeedsProfile, done));
  }
});

function handleSubmitScoreFlow(score: number, onAfter: () => void) {
  const cached = getCachedUser();
  // Se não autenticado → modal email
  if (!cached?.uid) {
    document.body.appendChild(EmailLogin(() => {}, () => {}, () => score));
    return;
  }
  // Se autenticado mas sem username → usar o novo ecrã Register (que já cria username)
  if (!cached.username) {
    mount(Register(() => {
      // Depois de registar, voltar a esta rotina
      handleSubmitScoreFlow(score, onAfter);
    }, () => onAfter()));
    return;
  }
  // (mantemos a tentativa de obter perfil para garantir dados atualizados)
  (async () => {
    try {
      const prof = await getUserProfile(cached.uid);
      if (prof?.username) {
        setCachedUser({ uid: cached.uid, email: cached.email, username: prof.username, displayName: prof.displayName || cached.displayName });
      }
    } catch {}
  })();
  // Já autenticado com username → submeter
  (async () => {
    try {
      await submitScore({ uid: cached.uid, username: cached.username!, displayName: cached.displayName, score });
      alert('Pontuação submetida!');
      onAfter();
    } catch (e) {
      alert('Falha ao submeter pontuação.');
    }
  })();
}

