import { AuthService, getCachedUser, setCachedUser } from '../../services/auth';
import { getUserProfile } from '../../services/user';
import { UsernamePicker } from './UsernamePicker';
import { EmailLogin } from '../components/EmailLogin';
import { listUserScores } from '../../services/score';

export function Account(onBack: () => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';
  el.innerHTML = `
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>
    <div class="relative z-10 w-full flex flex-col items-center">
      <div class="relative mt-1 w-full h-[70px] flex items-start justify-center overflow-visible">
        <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="relative z-[10] w-[110px] md:w-[130px] h-auto ab-logo-white"/>
      </div>
      <div class="mt-2 text-white text-2xl md:text-3xl font-[800] tracking-[0.06em]">A Minha Conta</div>

      <div id="card" class="mt-3 w-11/12 max-w-[680px] bg-white/90 text-[#0a2960] rounded-[22px] shadow-[0_12px_28px_rgba(2,20,60,0.22)] overflow-hidden p-5">
        <div id="content" class="space-y-3"></div>
      </div>

      <div class="mt-5 w-9/12 max-w-[420px] flex flex-col items-center gap-4">
        <button id="back" class="home-glass-btn px-6 py-2 rounded-full text-white font-semibold border border-white/60 bg-white/15 backdrop-blur-sm shadow-[0_6px_16px_rgba(2,20,60,0.25)] active:scale-[.98]">VOLTAR</button>
      </div>
    </div>
  `;

  const content = el.querySelector<HTMLDivElement>('#content')!;
  const back = el.querySelector<HTMLButtonElement>('#back')!;
  back.onclick = () => onBack();

  async function render() {
    const cached = getCachedUser();
    if (!cached?.uid) {
      content.innerHTML = `
        <div class="space-y-3">
          <div class="text-base">Não estás autenticado.</div>
          <div class="flex gap-3">
            <button id="login" class="px-5 py-2 rounded-full bg-[#1f4590] text-white font-semibold">Entrar / Registar</button>
          </div>
        </div>`;
      content.querySelector<HTMLButtonElement>('#login')!.onclick = () => {
        document.body.appendChild(EmailLogin(() => { setTimeout(render, 500); }, () => {}));
      };
      return;
    }

    // Show loading + logout while profile loads
    content.innerHTML = `
      <div class="space-y-3">
        <div class="text-sm opacity-80">A carregar…</div>
        <div class="flex gap-3">
          <button id="logout" class="px-5 py-2 rounded-full bg-white/20 text-[#0a2960] border border-[#0a2960]/30">Terminar sessão</button>
        </div>
      </div>`;
    content.querySelector<HTMLButtonElement>('#logout')!.onclick = async () => { await AuthService.signOut(); setCachedUser(null); render(); };

    const profile = await Promise.race([
      getUserProfile(cached.uid),
      new Promise<null>(resolve => setTimeout(() => resolve(null), 1500))
    ] as const) as any;
    if (!profile?.username) {
      content.innerHTML = `
        <div class="space-y-3">
          <div>Estás autenticado mas falta completar o perfil.</div>
          <div class="text-sm opacity-70">Completa já o teu perfil para avançar.</div>
          <div class="flex gap-3">
            <button id="complete" class="px-5 py-2 rounded-full bg-[#1f4590] text-white font-semibold">Escolher username</button>
            <button id="logout" class="px-5 py-2 rounded-full bg-white/20 text-[#0a2960] border border-[#0a2960]/30">Terminar sessão</button>
          </div>
        </div>`;
      content.querySelector<HTMLButtonElement>('#logout')!.onclick = async () => { await AuthService.signOut(); setCachedUser(null); render(); };
      content.querySelector<HTMLButtonElement>('#complete')!.onclick = () => {
        const picker = UsernamePicker(() => { picker.remove(); render(); }, () => { picker.remove(); });
        document.body.appendChild(picker);
      };
      return;
    }

    const scores = await listUserScores(cached.uid, 100);
    content.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="font-[800] text-xl">@${profile.username}</div>
          <button id="logout" class="px-4 py-2 rounded-full bg-white/20 text-[#0a2960] border border-[#0a2960]/30">Terminar sessão</button>
        </div>
        <div class="text-sm opacity-80">${profile.displayName || ''}</div>
        <div class="text-sm opacity-80">Jogos submetidos: ${scores.length}</div>
        <div class="mt-2">
          <div class="font-[800] mb-1">Histórico</div>
          <div class="max-h-[320px] overflow-auto divide-y-2 divide-[#1f4590]/20">
            ${scores.map(s => `<div class="flex items-center justify-between py-2">
              <div>@${s.username}</div>
              <div class="font-[800]">${s.score}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>`;
    content.querySelector<HTMLButtonElement>('#logout')!.onclick = async () => { await AuthService.signOut(); setCachedUser(null); render(); };
  }

  render();
  return el;
}


