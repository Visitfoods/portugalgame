import { validateUsername, claimUsername, isUsernameAvailable } from '../../services/user';
import { getCachedUser, setCachedUser } from '../../services/auth';
import { userStore } from '../../services/userStore';

import { ensureFirestoreOnline } from '../../lib/firebase';

export function UsernamePicker(onCreated: () => void, onCancel?: () => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';
  el.innerHTML = `
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover min-h-screen"/>
    <div class="relative z-10 w-full flex flex-col items-center">
      <div class="relative mt-1 w-full h-[70px] flex items-start justify-center overflow-visible">
        <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="relative z-[10] w-[150px] md:w-[180px] h-auto ab-logo-white"/>
      </div>
      <div class="mt-2 text-white text-2xl md:text-3xl font-[800] tracking-[0.06em]">Escolhe o teu username</div>
      <div class="mt-3 w-11/12 max-w-[640px] bg-white/90 text-[#0a2960] rounded-[22px] shadow-[0_12px_28px_rgba(2,20,60,0.22)] overflow-hidden p-5">
        <div class="space-y-3">
          <input id="username" type="text" placeholder="username" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-[#1f4590]/30"/>
          <input id="display" type="text" placeholder="Nome para mostrar (opcional)" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-[#1f4590]/30"/>
          <div id="rules" class="text-xs opacity-70">3-20 caracteres, letras/números/_; reservado: admin, system, alvesbandeira, moderator.</div>
          <div class="flex gap-3">
            <button id="cancel" class="home-glass-btn flex-1 px-4 py-2 rounded-full text-[#0a2960] border border-[#0a2960]/30 bg-white/70">Cancelar</button>
            <button id="create" class="flex-1 px-4 py-2 rounded-full bg-[#1f4590] text-white font-semibold">Criar Perfil</button>
          </div>
          <div id="msg" class="text-xs"></div>
        </div>
      </div>
    </div>
  `;

  const u = el.querySelector<HTMLInputElement>('#username')!;
  const d = el.querySelector<HTMLInputElement>('#display')!;
  const btnCreate = el.querySelector<HTMLButtonElement>('#create')!;
  const btnCancel = el.querySelector<HTMLButtonElement>('#cancel')!;
  const msg = el.querySelector<HTMLDivElement>('#msg')!;

  let ok = false;
  let debounce: number | undefined;
  u.oninput = () => {
    const v = u.value.trim();
    const res = validateUsername(v);
    ok = res.ok;
    msg.textContent = res.ok ? 'A verificar disponibilidade…' : `Inválido: ${res.reason}`;
    msg.style.color = res.ok ? '#555' : '#a11';
    if (!res.ok) return;
    if (debounce) window.clearTimeout(debounce);
    debounce = window.setTimeout(async () => {
      try {
        await ensureFirestoreOnline();
        const available = await isUsernameAvailable(v);
        ok = available;
        msg.textContent = available ? 'Disponível.' : 'Indisponível.';
        msg.style.color = available ? '#1f7a2f' : '#a11';
      } catch {
        ok = false;
        msg.textContent = 'Sem ligação. Tenta novamente.';
        msg.style.color = '#a11';
      }
    }, 250);
  };

  btnCancel.onclick = () => { onCancel && onCancel(); };
  btnCreate.onclick = async () => {
    if (!ok) { msg.textContent = 'Corrige o username.'; msg.style.color = '#a11'; return; }
    const cached = userStore.getUser() || getCachedUser();
    if (!cached?.uid) { msg.textContent = 'Sessão inválida. Reentra pelo link.'; return; }
    try {
      await ensureFirestoreOnline();
      const profile = await claimUsername(cached.uid, cached.email, u.value.trim(), d.value.trim() || undefined);
      setCachedUser({ uid: profile.uid, email: profile.email, username: profile.username, displayName: profile.displayName });
      try { await userStore.setProfile(profile); } catch {}
      onCreated();
    } catch (e) {
      msg.textContent = 'Username indisponível ou erro de rede.';
      msg.style.color = '#a11';
    }
  };

  return el;
}






