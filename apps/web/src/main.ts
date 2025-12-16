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
import { ensureAutoplayAudioGate, isDesktopDevice } from './platform/DeviceGuard'
import { getUserProfile } from './services/user'
import { ensureFirestoreOnline, getFirebaseAuth } from './lib/firebase'
import { userStore } from './services/userStore'
import { submitScore } from './services/score'
import { Account } from './ui/screens/Account'
import { TermsAndConditions } from './ui/screens/TermsAndConditions'
import { FaceTracker } from './core/ar/FaceTracker'
import { BackgroundMusic } from './core/engine/Audio'

// Função para mostrar modal de sucesso personalizado
function showSuccessModal(message: string, onClose: () => void) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';
  
  modal.innerHTML = `
    <div class="relative w-full max-w-[90vw] max-w-[420px] bg-white/95 rounded-[22px] shadow-[0_20px_40px_rgba(2,20,60,0.3)] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-center p-4 border-b-2 border-[#243b78]/30 bg-[#243b78]">
        <div class="flex items-center gap-3">
          <img src="/assets/graphics/trophy.svg" alt="Troféu" class="w-6 h-6"/>
          <h2 class="text-xl font-[800] text-white">SUCESSO!</h2>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-6 text-center">
        <div class="text-[#0a2960] font-[600] text-lg mb-4">${message}</div>
        <div class="text-[#0a2960]/70 text-sm mb-6">A TUA PONTUAÇÃO FOI GUARDADA COM SUCESSO!</div>
        <button id="close-success-modal" class="w-full px-6 py-3 rounded-full bg-[#1f4590] text-white font-[800] text-lg shadow-[0_8px_20px_rgba(2,20,60,0.35)] border border-white/50 active:scale-[.98] transition">
          CONTINUAR
        </button>
      </div>
    </div>
  `;

  // Fechar modal
  const closeBtn = modal.querySelector<HTMLButtonElement>('#close-success-modal')!;
  closeBtn.onclick = () => {
    modal.remove();
    onClose();
  };
  
  // Fechar ao clicar fora
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
      onClose();
    }
  };

  // ESC para fechar
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEsc);
      onClose();
    }
  };
  document.addEventListener('keydown', handleEsc);

  document.body.appendChild(modal);
}

// Função para mostrar modal de aviso desktop (não pode ser fechado)
function showDesktopWarningModal() {
  // Verificar se já existe um modal
  const existingModal = document.querySelector('#desktop-warning-modal');
  if (existingModal) {
    return; // Já existe, não mostrar novamente
  }

  const modal = document.createElement('div');
  modal.id = 'desktop-warning-modal';
  modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm';
  
  modal.innerHTML = `
    <div class="relative w-full max-w-[90vw] max-w-[420px] bg-white/95 rounded-[22px] shadow-[0_20px_40px_rgba(2,20,60,0.3)] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-center p-4 border-b-2 border-[#243b78]/30 bg-[#243b78]">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          <h2 class="text-xl font-[800] text-white">AVISO</h2>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-6 text-center">
        <div class="text-[#0a2960] font-[600] text-lg mb-4">ESTE JOGO É APENAS PARA TELEMÓVEL</div>
        <div class="text-[#0a2960]/70 text-sm mb-6">
          Para jogares, deves aceder a este jogo através do teu telemóvel ou tablet.
          <br/><br/>
          O jogo utiliza a câmara frontal do dispositivo para funcionar corretamente e não está disponível para computadores desktop.
        </div>
      </div>
    </div>
  `;

  // NÃO permitir fechar o modal - bloquear cliques fora
  modal.onclick = (e) => {
    // Prevenir que feche ao clicar fora
    e.stopPropagation();
  };

  document.body.appendChild(modal);
}

// Função para mostrar modal de erro personalizado
function showErrorModal(message: string, onClose?: () => void) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';
  
  modal.innerHTML = `
    <div class="relative w-full max-w-[90vw] max-w-[420px] bg-white/95 rounded-[22px] shadow-[0_20px_40px_rgba(2,20,60,0.3)] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-center p-4 border-b-2 border-[#dc2626]/30 bg-[#dc2626]">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <h2 class="text-xl font-[800] text-white">ERRO!</h2>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-6 text-center">
        <div class="text-[#0a2960] font-[600] text-lg mb-6">${message}</div>
        <button id="close-error-modal" class="w-full px-6 py-3 rounded-full bg-[#dc2626] text-white font-[800] text-lg shadow-[0_8px_20px_rgba(220,38,38,0.35)] border border-white/50 active:scale-[.98] transition">
          OK
        </button>
      </div>
    </div>
  `;

  // Fechar modal
  const closeBtn = modal.querySelector<HTMLButtonElement>('#close-error-modal')!;
  closeBtn.onclick = () => {
    modal.remove();
    if (onClose) onClose();
  };
  
  // Fechar ao clicar fora
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
      if (onClose) onClose();
    }
  };

  // ESC para fechar
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEsc);
      if (onClose) onClose();
    }
  };
  document.addEventListener('keydown', handleEsc);

  document.body.appendChild(modal);
}

// Função para mostrar modal de informação personalizado
function showInfoModal(message: string, onClose?: () => void) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';
  
  modal.innerHTML = `
    <div class="relative w-full max-w-[90vw] max-w-[420px] bg-white/95 rounded-[22px] shadow-[0_20px_40px_rgba(2,20,60,0.3)] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-center p-4 border-b-2 border-[#1f4590]/30 bg-[#1f4590]">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h2 class="text-xl font-[800] text-white">INFORMAÇÃO</h2>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-6 text-center">
        <div class="text-[#0a2960] font-[600] text-lg mb-6">${message}</div>
        <button id="close-info-modal" class="w-full px-6 py-3 rounded-full bg-[#1f4590] text-white font-[800] text-lg shadow-[0_8px_20px_rgba(31,69,144,0.35)] border border-white/50 active:scale-[.98] transition">
          OK
        </button>
      </div>
    </div>
  `;

  // Fechar modal
  const closeBtn = modal.querySelector<HTMLButtonElement>('#close-info-modal')!;
  closeBtn.onclick = () => {
    modal.remove();
    if (onClose) onClose();
  };
  
  // Fechar ao clicar fora
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
      if (onClose) onClose();
    }
  };

  // ESC para fechar
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEsc);
      if (onClose) onClose();
    }
  };
  document.addEventListener('keydown', handleEsc);

  document.body.appendChild(modal);
}

const app = document.getElementById('app')!;

function mount(el: HTMLElement) {
  app.innerHTML = '';
  app.appendChild(el);
}

function startFlow() {
  try { BackgroundMusic.init(); } catch {}
  const home = Home(() => startGameDirect(), Object.assign(() => showHowTo(), { gotoAccount: () => showAccount() }), () => showRanking(), () => showTerms());
  mount(home);
  
  // Mostrar aviso permanente se for desktop (não pode fechar)
  if (isDesktopDevice()) {
    showDesktopWarningModal();
  }
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

function showTerms() {
  const terms = TermsAndConditions(() => startFlow());
  mount(terms);
}

async function startGameDirect() {
  // Bloquear completamente em desktop
  if (isDesktopDevice()) {
    showDesktopWarningModal();
    return;
  }

  try {
    // Garante desbloqueio de áudio em iOS (primeiro gesto do utilizador)
    try { ensureAutoplayAudioGate(); } catch {}
    // Solicitar permissão diretamente no clique do botão JOGAR
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    // Fecha imediatamente; o ecrã do jogo reabre a câmara
    stream.getTracks().forEach(t => t.stop());
    mount(Game((score) => {
      // PAUSA para garantir que o DOM está estável antes de montar ResultSummary
      // Isto resolve problemas de botões não funcionarem
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          mount(ResultSummary(
            score,
            () => handleSubmitScoreFlow(score, () => startFlow()),
            () => startGameDirect(),
            () => startFlow()
          ));
        });
      });
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
        // PAUSA para garantir que o DOM está estável antes de montar ResultSummary
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            mount(ResultSummary(
              score,
              () => handleSubmitScoreFlow(score, () => startFlow()),
              () => startGameDirect(),
              () => startFlow()
            ));
          });
        });
      }, () => startFlow()));
    } catch (e) {
      showErrorModal('NÃO FOI POSSÍVEL ACEDER À CÂMARA.');
      startFlow();
    }
  }, () => startFlow());
  mount(perms);
}

// Initialize central user store (auth + profile sync)
userStore.init().catch(() => {});
startFlow();

// Pré-aquecer o Face Landmarker em idle para reduzir cold start no primeiro jogo
function prewarmFaceLandmarker() {
  const schedule = (cb: () => void) => {
    try {
      (window as any).requestIdleCallback ? (window as any).requestIdleCallback(cb, { timeout: 3000 }) : setTimeout(cb, 1200);
    } catch {
      setTimeout(cb, 1200);
    }
  };
  schedule(() => {
    try { new FaceTracker().init().catch(() => {}); } catch {}
  });
}
prewarmFaceLandmarker();

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

// Verificar se voltamos de um login bem-sucedido
window.addEventListener('load', () => {
  // Verificar se há pontuação pendente e utilizador autenticado
  setTimeout(() => {
    const pendingScore = localStorage.getItem('ab-pending-score');
    const cached = getCachedUser();
    if (pendingScore && cached?.uid) {
      const score = Number(pendingScore);
      if (!isNaN(score)) {
        console.log('Detectado login bem-sucedido com pontuação pendente:', score);
        // Remover pontuação do localStorage ANTES de submeter para evitar loop
        try { localStorage.removeItem('ab-pending-score'); } catch {}
        // Remover modal de login se existir
        const existingModal = document.querySelector('[class*="fixed inset-0 z-[70]"]');
        if (existingModal) {
          existingModal.remove();
        }
        // Submeter automaticamente
        handleSubmitScoreFlow(score, () => startFlow());
        return;
      }
    }
  }, 500);
});

// Auth route handling for email link completion
window.addEventListener('load', () => {
  const path = new URL(location.href).pathname;
  if (path === '/auth-complete') {
    const goNeedsProfile = () => {
      mount(Register(() => {
        const pending = Number(localStorage.getItem('ab-pending-score') || '');
        try { localStorage.removeItem('ab-pending-score'); } catch {}
        if (!isNaN(pending)) {
          handleSubmitScoreFlow(pending, () => startFlow());
        } else {
          startFlow();
        }
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

function resolveAuthedUser() {
  const cached = getCachedUser();
  if (cached?.uid) return cached;

  const authUser = getFirebaseAuth().currentUser;
  if (authUser?.uid) {
    const fallback = {
      uid: authUser.uid,
      email: authUser.email || undefined,
      username: cached?.username,
      displayName: authUser.displayName || cached?.displayName,
    };
    setCachedUser(fallback);
    return fallback;
  }

  return cached;
}

type SubmitUser = NonNullable<ReturnType<typeof resolveAuthedUser>>;

function handleSubmitScoreFlow(score: number, onAfter: () => void) {
  const cached = resolveAuthedUser();
  if (!cached?.uid) {
    document.body.appendChild(EmailLogin(() => {
      // Apos login bem-sucedido, submeter automaticamente a pontuacao
      handleSubmitScoreFlow(score, onAfter);
    }, () => {
      // Se cancelar, voltar ao fluxo normal
      onAfter();
    }, () => score));
    return;
  }

  const ensureSubmit = (user: SubmitUser, refreshProfile = true) => {
    if (refreshProfile) {
      (async () => {
        try {
          const prof = await getUserProfile(user.uid);
          if (prof?.username) {
            setCachedUser({ uid: user.uid, email: user.email, username: prof.username, displayName: prof.displayName || user.displayName });
          }
        } catch {}
      })();
    }
    (async () => {
      try {
        const latest = getCachedUser() || user;
        try { localStorage.removeItem('ab-pending-score'); } catch {}
        await submitScore({ uid: user.uid, username: latest.username!, displayName: latest.displayName, score });
        showSuccessModal('PONTUAÇÃO SUBMETIDA!', onAfter);
      } catch (e) {
        showErrorModal('FALHA AO SUBMETER PONTUAÇÃO.');
      }
    })();
  };

  const baseUser = cached as SubmitUser;

  if (!baseUser.username) {
    (async () => {
      try {
        const prof = await getUserProfile(baseUser.uid);
        if (prof?.username) {
          const enriched: SubmitUser = {
            uid: baseUser.uid,
            email: baseUser.email,
            username: prof.username,
            displayName: prof.displayName || baseUser.displayName,
          };
          setCachedUser(enriched);
          ensureSubmit(enriched, false);
          return;
        }
      } catch {}
      // Guardar pontos no localStorage para preservar durante o registo
      try { localStorage.setItem('ab-pending-score', String(score)); } catch {}
      mount(Register(() => {
        // Depois de registar, submeter os pontos automaticamente
        handleSubmitScoreFlow(score, onAfter);
      }, () => {
        // Se cancelar, limpar pontos pendentes e voltar
        try { localStorage.removeItem('ab-pending-score'); } catch {}
        onAfter();
      }));
    })();
    return;
  }

  ensureSubmit(baseUser);
}
