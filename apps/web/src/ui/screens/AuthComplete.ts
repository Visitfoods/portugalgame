import { AuthService, setCachedUser } from '../../services/auth';
import { getUserProfile } from '../../services/user';
import { getFirebaseAuth } from '../../lib/firebase';

export function AuthComplete(onNeedsProfile: () => void, onDone: (score?: number) => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';
  el.innerHTML = `
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>
    <div class="relative z-10 w-full h-full flex items-center justify-center">
      <div class="text-white text-xl font-[800] tracking-[0.06em]">A processar autenticação…</div>
    </div>
  `;

  // Fallback de segurança: se algo ficar pendurado, decide em ~3s
  const fallbackTimer = window.setTimeout(async () => {
    try {
      const cur = getFirebaseAuth().currentUser;
      let pending: number | undefined;
      try { const raw = localStorage.getItem('ab-pending-score'); if (raw) { pending = Number(raw); localStorage.removeItem('ab-pending-score'); } } catch {}
      if (!cur) { onDone(); return; }
      const profile = await getUserProfile(cur.uid);
      if (!profile?.username) { onNeedsProfile(); return; }
      onDone(pending);
    } catch { onDone(); }
  }, 3000);

  (async () => {
    // Se o URL atual não é um link válido de login por e‑mail, sair sem pedir nada
    try {
      if (!AuthService.isEmailLink()) { onDone(); return; }
    } catch {}
    try {
      const user = await AuthService.completeMagicLink();
      const profile = await getUserProfile(user.uid);
      setCachedUser({ uid: user.uid, email: user.email || undefined, username: profile?.username, displayName: profile?.displayName });
      let pending: number | undefined;
      try {
        const raw = localStorage.getItem('ab-pending-score');
        if (raw) { pending = Number(raw); localStorage.removeItem('ab-pending-score'); }
      } catch {}
      clearTimeout(fallbackTimer);
      if (!profile?.username) { onNeedsProfile(); return; }
      onDone(pending);
    } catch (e: any) {
      // Se não for um fluxo válido ou faltar email em cache, ignora sem bloquear o jogo
      const code = e?.code || e?.message || '';
      if (String(code).includes('missing-email-for-magic-link')) { onDone(); return; }
      onDone();
    }
  })();

  return el;
}


