import { AuthService, getCachedUser, setCachedUser } from '../../services/auth';
import { getUserProfile } from '../../services/user';
import { UsernamePicker } from './UsernamePicker';
import { Register } from './Register';
import { EmailLogin } from '../components/EmailLogin';
import { listUserScores } from '../../services/score';
import { userStore } from '../../services/userStore';

export function Account(onBack: () => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';
  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>

    <!-- Nuvens topo -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-cloud-scroll-dur: -18s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 52s; --ab-cloud-scroll-dur: -9s;"/>

    <!-- Logo independente -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[10] w-full flex justify-center">
      <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="w-[150px] md:w-[180px] h-auto ab-logo-white"/>
    </div>

    <div class="relative z-10 w-full flex flex-col items-center">
      <div class="mt-20 text-white text-2xl md:text-3xl font-[800] tracking-[0.06em]">A Minha Conta</div>

      <div id="card" class="mt-3 w-11/12 max-w-[680px] bg-white/90 text-[#0a2960] rounded-[22px] shadow-[0_12px_28px_rgba(2,20,60,0.22)] overflow-hidden p-4 sm:p-5">
        <div id="content" class="space-y-2 sm:space-y-3 text-center"></div>
      </div>

      <div class="mt-3 sm:mt-5 w-9/12 max-w-[420px] flex flex-col items-center gap-3 sm:gap-4 pb-4">
        <button id="back" class="home-glass-btn px-6 py-2 rounded-full text-white font-semibold border border-white/60 bg-white/15 backdrop-blur-sm shadow-[0_6px_16px_rgba(2,20,60,0.25)] active:scale-[.98]">VOLTAR</button>
      </div>
    </div>

    <!-- Nuvens base + elemento gráfico -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-cloud-scroll-dur: -25s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-cloud-scroll-dur: -31s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-[-60px] w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

    <!-- Botão de som (canto inferior esquerdo) -->
    <button id="sound" class="ab-icon-btn fixed left-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Som">
      <img id="sound-icon" src="/assets/graphics/icon_Volume-On.svg" alt=""/>
    </button>
  `;

  const content = el.querySelector<HTMLDivElement>('#content')!;
  const back = el.querySelector<HTMLButtonElement>('#back')!;
  back.onclick = () => onBack();

  async function render() {
    const cached = userStore.getUser() || getCachedUser();
    if (!cached?.uid) {
      content.innerHTML = `
        <div class="space-y-3">
          <div class="text-base">Não estás autenticado.</div>
          <div class="flex justify-center gap-3">
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
        <div class="flex justify-center gap-3">
          <button id="logout" class="px-2 py-1.5 text-xs rounded-full bg-white/20 text-[#0a2960] border border-[#0a2960]/30 hover:bg-white/30 transition">Terminar sessão</button>
        </div>
      </div>`;
    content.querySelector<HTMLButtonElement>('#logout')!.onclick = async () => { await AuthService.signOut(); setCachedUser(null); render(); };

    const profile = await Promise.race([
      getUserProfile(cached.uid),
      new Promise<null>(resolve => setTimeout(() => resolve(null), 1500))
    ] as const) as any;
    if (!profile?.username) {
      const needsBasic = true; // agora o Register trata do username também
      content.innerHTML = `
        <div class="space-y-3">
          <div>Estás autenticado mas falta completar o perfil.</div>
          <div class="text-sm opacity-70">Completa já o teu perfil para avançar.</div>
          <div class="flex justify-center gap-3">
            ${needsBasic
              ? '<button id="register" class="px-5 py-2 rounded-full bg-[#1f4590] text-white font-semibold">Completar registo</button>'
              : '<button id="complete" class="px-5 py-2 rounded-full bg-[#1f4590] text-white font-semibold">Escolher username</button>'}
            <button id="logout" class="px-2 py-1.5 text-xs rounded-full bg-white/20 text-[#0a2960] border border-[#0a2960]/30 hover:bg-white/30 transition">Terminar sessão</button>
          </div>
        </div>`;
      content.querySelector<HTMLButtonElement>('#logout')!.onclick = async () => { await AuthService.signOut(); setCachedUser(null); render(); };
      const regBtn = content.querySelector<HTMLButtonElement>('#register');
      if (regBtn) {
        regBtn.onclick = () => {
          const reg = Register(() => { reg.remove(); render(); }, () => { reg.remove(); });
          document.body.appendChild(reg);
        };
      }
      const completeBtn = content.querySelector<HTMLButtonElement>('#complete');
      if (completeBtn) {
        completeBtn.onclick = () => {
          const reg = Register(() => { reg.remove(); render(); }, () => { reg.remove(); });
          document.body.appendChild(reg);
        };
      }
      return;
    }

    const scores = await listUserScores(cached.uid, 100);
    content.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="font-[800] text-xl">@${profile.username}</div>
          <button id="logout" class="px-2 py-1.5 text-xs rounded-full bg-white/20 text-[#0a2960] border border-[#0a2960]/30 hover:bg-white/30 transition">Terminar sessão</button>
        </div>
        <div class="text-sm opacity-80">Jogos submetidos: ${scores.length}</div>
        <div class="mt-2">
          <div class="font-[800] mb-1">Histórico</div>
          <div class="max-h-[200px] sm:max-h-[280px] md:max-h-[320px] overflow-auto divide-y-2 divide-[#1f4590]/20">
            ${scores.map(s => `<div class="flex items-center justify-between py-1.5 sm:py-2">
              <div class="text-sm sm:text-base">@${s.username}</div>
              <div class="font-[800] text-sm sm:text-base">${s.score}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>`;
    content.querySelector<HTMLButtonElement>('#logout')!.onclick = async () => { await AuthService.signOut(); setCachedUser(null); render(); };
  }

  render();
  return el;
}


