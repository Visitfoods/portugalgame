import { BackgroundMusic } from '../../core/engine/Audio';

export function HowTo(onPlay: () => void, onBack: () => void) {
  const el = document.createElement('div');
  el.className = 'home-screen fixed inset-0 flex flex-col items-center justify-center p-0 overflow-hidden';
  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover min-h-screen"/>

    <!-- Nuvens topo (marquee infinito com instâncias desfasadas) -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-delay: 0s;"/>
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-24 left-0 w-[28%] max-w-[220px] -z-10 opacity-70 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 54s; --ab-delay: -23s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 52s; --ab-delay: -26s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-10 right-0 w-[30%] max-w-[230px] -z-10 opacity-60 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 40s; --ab-delay: -20s;"/>

    <div class="relative z-10 w-full max-w-[400px] mx-auto flex flex-col items-center howto-content howto-shell">

      <!-- TÃ­tulo -->
      <h1 class="howto-title w-10/12 max-w-[350px] mx-auto text-center text-white font-[800] uppercase tracking-[0.09em] leading-tight text-[clamp(18px,6vw,32px)]">COMO JOGAR</h1>

      <!-- Regras (SVGs) -->
      <div class="w-10/12 max-w-[350px] mx-auto mt-2 flex flex-col items-stretch gap-2 md:gap-3 howto-rules">
        <img src="/assets/graphics/Regra-1.svg" alt="Regra 1" class="block w-full h-auto mx-auto max-w-[300px]"/>
        <img src="/assets/graphics/Regra-3.svg" alt="Regra 3" class="block w-full h-auto mx-auto max-w-[300px]"/>
        <img src="/assets/graphics/Regra-4.svg" alt="Regra 4" class="block w-full h-auto mx-auto max-w-[300px]"/>
        <img src="/assets/graphics/Regra-5.svg" alt="Regra 5" class="block w-full h-auto mx-auto max-w-[300px]"/>
        <img src="/assets/graphics/Regra-6.svg" alt="Regra 6" class="block w-full h-auto mx-auto max-w-[300px]"/>
      </div>

      <!-- Botões de ação -->
      <img id="play" src="/assets/graphics/Botao-Jogar_Normal.svg" alt="Jogar" class="btn-play howto-play h-auto cursor-pointer active:scale-[.98] transition w-8/12 max-w-[200px]"/>
    </div>

    <!-- Nuvens base + elemento gráfico -->
    <!-- Nuvens base com marquee e clones desfasados para loop contínuo -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: 0s;"/>
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[28px] left-[-140px] w-[70%] max-w-[700px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 62s; --ab-delay: -35s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -32s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[22px] right-[-140px] w-[72%] max-w-[720px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 76s; --ab-delay: -38s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-[-60px] w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

    <!-- BotÃ£o de som (canto inferior esquerdo) -->
    <button id="sound" class="ab-icon-btn fixed left-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Som">
      <img id="sound-icon" src="/assets/graphics/icon_Volume-On.svg" alt=""/>
    </button>

    <!-- BotÃ£o Home (canto inferior direito) -->
    <button id="home" class="ab-icon-btn fixed right-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px);" aria-label="InÃ­cio">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#243a79" d="M12 3.2l8 6.4v10a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V14H10v6.1a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1V9.6l8-6.4zM3.6 9L2 10.3l.8 1 .8-.6V9zm18.4 1.3L20.4 9v1.7l.8.6.8-1z"/>
      </svg>
    </button>

  `;

  // LigaÃ§Ãµes
  const playBtn = el.querySelector<HTMLImageElement>('#play')!;
  const playSrcNormal = '/assets/graphics/Botao-Jogar_Normal.svg';
  const playSrcPressed = '/assets/graphics/Botao-Jogar_Pressed.svg';
  const setPressed = (pressed: boolean) => { playBtn.src = pressed ? playSrcPressed : playSrcNormal; };
  playBtn.onpointerdown = () => setPressed(true);
  playBtn.onpointerup = () => setPressed(false);
  playBtn.onpointerleave = () => setPressed(false);
  playBtn.onpointercancel = () => setPressed(false);
  playBtn.onclick = () => onPlay();
  // Botï¿½o Home ? voltar ï¿½ Home
  el.querySelector<HTMLButtonElement>('#home')!.onclick = () => onBack();
  // BotÃ£o voltar nÃ£o Ã© necessÃ¡rio nesta versÃ£o; usa o botÃ£o de som ou navegaÃ§Ã£o do SO

  // Som on/off com persistÃªncia (igual Ã  Home)
  const soundBtn = el.querySelector<HTMLButtonElement>('#sound')!;
  const soundIcon = el.querySelector<HTMLImageElement>('#sound-icon')!;
  const updateSoundIcon = () => {
    const muted = (localStorage.getItem('ab-muted') === '1');
    soundIcon.src = muted ? '/assets/graphics/Icon_Volume-Muted.svg' : '/assets/graphics/icon_Volume-On.svg';
    try {
      soundBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
      soundBtn.title = muted ? 'Som desligado' : 'Som ligado';
      soundIcon.classList.remove('ab-icon-swap');
      void (soundIcon as any).offsetWidth; // reflow
      soundIcon.classList.add('ab-icon-swap');
    } catch {}
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
  soundBtn.onkeydown = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMute(); } };

  // Press feedback for glass buttons and icons
  el.querySelectorAll<HTMLButtonElement>('.ab-icon-btn, .home-glass-btn').forEach(btn => {
    const set = (on: boolean) => btn.classList.toggle('is-pressing', on);
    btn.addEventListener('pointerdown', () => set(true));
    ['pointerup','pointerleave','pointercancel'].forEach(evt => btn.addEventListener(evt, () => set(false)));
  });

  return el;
}




