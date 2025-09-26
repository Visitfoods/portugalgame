import { AuthService, setCachedUser } from '../../services/auth';
import { getUserProfile } from '../../services/user';

export function AuthComplete(onNeedsProfile: () => void, onDone: (score?: number) => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';
  el.innerHTML = `
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>
    <div class="relative z-10 w-full h-full flex items-center justify-center">
      <div class="text-white text-xl font-[800] tracking-[0.06em]">A processar autenticação…</div>
    </div>
  `;

  (async () => {
    try {
      const user = await AuthService.completeMagicLink();
      const profile = await getUserProfile(user.uid);
      setCachedUser({ uid: user.uid, email: user.email || undefined, username: profile?.username, displayName: profile?.displayName });
      let pending: number | undefined;
      try {
        const raw = localStorage.getItem('ab-pending-score');
        if (raw) { pending = Number(raw); localStorage.removeItem('ab-pending-score'); }
      } catch {}
      if (!profile?.username) { onNeedsProfile(); return; }
      onDone(pending);
    } catch (e) {
      alert('Falha a concluir o login. Volta a abrir o link.');
      onDone();
    }
  })();

  return el;
}


