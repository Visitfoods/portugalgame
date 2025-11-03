import { AuthService, getCachedUser, setCachedUser } from '../../services/auth';
import { BackgroundMusic } from '../../core/engine/Audio';
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
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover min-h-screen"/>

    <!-- Nuvens topo (marquee infinito com instâncias desfasadas) -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-delay: 0s;"/>
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-24 left-0 w-[28%] max-w-[220px] -z-10 opacity-70 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 54s; --ab-delay: -23s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 52s; --ab-delay: -26s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-10 right-0 w-[30%] max-w-[230px] -z-10 opacity-60 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 40s; --ab-delay: -20s;"/>


    <div class="relative z-10 w-full min-h-screen flex items-center justify-center pt-28 pb-24">
      <div class="flex flex-col items-center">
        <!-- Ícone de utilizador -->
        <div class="mb-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <img src="/assets/graphics/profile-icon.svg" alt="Perfil" class="w-8 h-8 brightness-0 invert"/>
        </div>
        <!-- Título maior e mais grosso -->
        <div class="text-white text-2xl md:text-3xl font-[800] tracking-[0.06em] whitespace-nowrap">A MINHA CONTA</div>

        <div id="card" class="mt-3 w-11/12 max-w-[680px] min-w-[320px] sm:min-w-[360px] bg-white/90 text-[#0a2960] rounded-[22px] shadow-[0_12px_28px_rgba(2,20,60,0.22)] overflow-hidden p-4 sm:p-5">
          <div id="content" class="space-y-2 sm:space-y-3 text-center"></div>
        </div>

      </div>
    </div>

    <!-- Nuvens base + elemento gráfico -->
    <!-- Nuvens base com marquee e clones desfasados para loop contínuo -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: 0s;"/>
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[28px] left-[-140px] w-[70%] max-w-[700px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 62s; --ab-delay: -35s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -32s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[22px] right-[-140px] w-[72%] max-w-[720px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 76s; --ab-delay: -38s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-[-60px] w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

    <!-- Botão de som (canto inferior esquerdo) -->
    <button id="sound" class="ab-icon-btn fixed left-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Som">
      <img id="sound-icon" src="/assets/graphics/icon_Volume-On.svg" alt=""/>
    </button>

    <!-- Botão Home (canto inferior direito) -->
    <button id="home" class="ab-icon-btn fixed right-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Início">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#243a79" d="M12 3.2l8 6.4v10a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V14H10v6.1a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1V9.6l8-6.4zM3.6 9L2 10.3l.8 1 .8-.6V9zm18.4 1.3L20.4 9v1.7l.8.6.8-1z"/>
      </svg>
    </button>
  `;

  const content = el.querySelector<HTMLDivElement>('#content')!;
  const home = el.querySelector<HTMLButtonElement>('#home')!;
  home.onclick = () => onBack();

  // Som on/off (global)
  (function attachSoundToggle(root: HTMLElement) {
    const soundBtn = root.querySelector<HTMLButtonElement>('#sound');
    const soundIcon = root.querySelector<HTMLImageElement>('#sound-icon');
    if (!soundBtn || !soundIcon) return;
    const updateSoundIcon = () => {
      const muted = (localStorage.getItem('ab-muted') === '1');
      soundIcon.src = muted ? '/assets/graphics/Icon_Volume-Muted.svg' : '/assets/graphics/icon_Volume-On.svg';
      try { soundBtn.setAttribute('aria-pressed', muted ? 'true' : 'false'); } catch {}
    };
    updateSoundIcon();
    const toggleMute = () => {
      const current = (localStorage.getItem('ab-muted') === '1');
      try { localStorage.setItem('ab-muted', current ? '0' : '1'); } catch {}
      updateSoundIcon();
      try { BackgroundMusic.syncFromStorage(); } catch {}
    };
    soundBtn.onclick = () => toggleMute();
    soundBtn.addEventListener('touchstart', (e) => { try { e.preventDefault(); } catch {} toggleMute(); }, { passive: false });
  })(el);

  async function render() {
    const cached = userStore.getUser() || getCachedUser();
    if (!cached?.uid) {
      content.innerHTML = `
        <div class="space-y-3">
          <div class="text-sm text-center">
            <div>ENTRA OU CRIA UMA CONTA</div>
            <div class="text-xs">PARA SUBMETER A TUA PONTUAÇÃO.</div>
          </div>
          <div class="flex justify-center gap-3">
            <button id="login" class="px-6 py-2 rounded-full bg-[#1f4590] text-white font-semibold whitespace-nowrap min-w-[190px]">ENTRAR / REGISTAR</button>
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
          <div>ESTÁS AUTENTICADO MAS FALTA COMPLETAR O PERFIL.</div>
          <div class="text-sm opacity-70">COMPLETA JÁ O TEU PERFIL PARA AVANÇAR.</div>
          <div class="flex justify-center gap-3">
            <button id="logout" class="px-3 py-2 text-xs rounded-full bg-white/20 text-[#0a2960] border border-[#0a2960]/30 hover:bg-white/30 transition whitespace-nowrap">TERMINAR SESSÃO</button>
            ${needsBasic
              ? '<button id="register" class="px-4 py-2 rounded-full bg-[#1f4590] text-white font-semibold text-xs whitespace-nowrap">COMPLETAR REGISTO</button>'
              : '<button id="complete" class="px-4 py-2 rounded-full bg-[#1f4590] text-white font-semibold text-xs whitespace-nowrap">ESCOLHER USERNAME</button>'}
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

    // Função para formatar timestamp de forma minimalista
    const formatDateTime = (timestamp: unknown): string => {
      if (!timestamp) return '';
      let date: Date | null = null;
      
      try {
        // Tratar timestamp do Firestore
        if (typeof timestamp === 'object' && timestamp !== null) {
          const ts = timestamp as any;
          
          // Se tem método toDate (Timestamp object do Firestore v9+)
          if (typeof ts.toDate === 'function') {
            date = ts.toDate();
          }
          // Se tem seconds e nanoseconds (formato do Firestore)
          else if (typeof ts.seconds === 'number') {
            // Timestamp em segundos, converter para milissegundos
            date = new Date(ts.seconds * 1000);
            // Se tiver nanoseconds, adicionar precisão
            if (ts.nanoseconds) {
              date = new Date(ts.seconds * 1000 + ts.nanoseconds / 1000000);
            }
          }
          // Formato interno do Firestore (com _seconds)
          else if (typeof ts._seconds === 'number') {
            date = new Date(ts._seconds * 1000);
            if (ts._nanoseconds) {
              date = new Date(ts._seconds * 1000 + ts._nanoseconds / 1000000);
            }
          }
          // Verificar se é um objeto Date
          else if (ts instanceof Date) {
            date = ts;
          }
        }
        // Se é um número (timestamp em milissegundos ou segundos)
        else if (typeof timestamp === 'number') {
          // Se for muito pequeno, assume-se segundos, senão milissegundos
          date = timestamp < 10000000000 ? new Date(timestamp * 1000) : new Date(timestamp);
        }
        
        if (!date || isNaN(date.getTime())) {
          return '';
        }
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const scoreDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        
        if (scoreDate.getTime() === today.getTime()) {
          return `Hoje, ${timeStr}`;
        } else if (scoreDate.getTime() === yesterday.getTime()) {
          return `Ontem, ${timeStr}`;
        } else {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          return `${day}/${month}, ${timeStr}`;
        }
      } catch (e) {
        console.warn('Erro ao formatar timestamp:', e, timestamp);
        return '';
      }
    };

    const scores = await listUserScores(cached.uid, 100);
    
    // Debug: verificar se timestamp está presente
    const firstScore = scores[0];
    if (firstScore) {
      console.log('Primeiro score:', firstScore);
      console.log('Timestamp do primeiro score:', firstScore.timestamp);
      console.log('Tipo do timestamp:', typeof firstScore.timestamp);
    }
    
    content.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="font-[800] text-xl">@${profile.username}</div>
          <button id="logout" class="px-2 py-1.5 text-xs rounded-full bg-white/20 text-[#0a2960] border border-[#0a2960]/30 hover:bg-white/30 transition">Terminar sessão</button>
        </div>
        <div class="text-sm opacity-80">Jogos submetidos: ${scores.length}</div>
        <div class="mt-2">
          <div class="font-[800] mb-1">Histórico</div>
          <div class="max-h-[200px] sm:max-h-[280px] md:max-h-[320px] overflow-auto divide-y-2 divide-[#1f4590]/20 pr-4">
            ${scores.map(s => {
              const dateTime = formatDateTime(s.timestamp);
              console.log('Score:', s.score, 'Timestamp:', s.timestamp, 'DateTime formatado:', dateTime);
              return `<div class="flex items-center justify-between py-1.5 sm:py-2">
                <div class="flex flex-col gap-0.5 items-start">
                  <div class="text-sm sm:text-base">@${s.username}</div>
                  ${dateTime ? `<div class="text-xs opacity-60 self-start">${dateTime}</div>` : ''}
                </div>
                <div class="font-[800] text-sm sm:text-base">${s.score}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;
    content.querySelector<HTMLButtonElement>('#logout')!.onclick = async () => { await AuthService.signOut(); setCachedUser(null); render(); };
  }

  render();
  
  // Escutar mudanças no userStore para atualizar automaticamente
  const unsubscribe = userStore.subscribe(() => {
    render();
  });
  
  // Cleanup quando o elemento for removido
  const originalRemove = el.remove;
  el.remove = function() {
    unsubscribe();
    originalRemove.call(this);
  };
  
  return el;
}


