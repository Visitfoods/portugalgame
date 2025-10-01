export function HowTo(onPlay: () => void, onBack: () => void) {
  const el = document.createElement('div');
  el.className = 'home-screen fixed inset-0 flex flex-col items-center justify-start p-0 overflow-hidden';
  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>

    <!-- Nuvens topo (marquee) -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-delay: -18s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 52s; --ab-delay: -9s;"/>

    <div class="relative z-10 w-full flex flex-col items-center pb-[160px]">
      <!-- Logo -->
      <div class="relative mt-4 w-full h-[70px] flex items-start justify-center overflow-visible">
        <img id="ab-logo" src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="relative z-[10] w-[110px] md:w-[130px] h-auto ab-logo-white"/>
      </div>

      <!-- Título -->
      <h1 class="w-10/12 max-w-[720px] mx-auto text-center text-white font-[800] uppercase tracking-[0.09em] leading-tight mt-2 text-[clamp(26px,9vw,48px)]">COMO JOGAR</h1>

      <!-- Regras (SVGs) -->
      <div class="w-10/12 max-w-[720px] mx-auto mt-3 flex flex-col items-stretch gap-3 md:gap-4">
        <img src="/assets/graphics/Regra-1.svg" alt="Regra 1" class="block w-full h-auto mx-auto"/>
        <img src="/assets/graphics/Regra-2.svg" alt="Regra 2" class="block w-full h-auto mx-auto"/>
        <img src="/assets/graphics/Regra-3.svg" alt="Regra 3" class="block w-full h-auto mx-auto"/>
        <img src="/assets/graphics/Regra-4.svg" alt="Regra 4" class="block w-full h-auto mx-auto"/>
        <img src="/assets/graphics/Regra-5.svg" alt="Regra 5" class="block w-full h-auto mx-auto"/>
        <img src="/assets/graphics/Regra-6.svg" alt="Regra 6" class="block w-full h-auto mx-auto"/>
      </div>

      <!-- Botões de ação -->
      <img id="play" src="/assets/graphics/Botao-Jogar_Normal.svg" alt="Jogar" class="btn-play fixed left-1/2 -translate-x-1/2 bottom-[calc(env(safe-area-inset-bottom,0px)+140px)] w-6/12 max-w-[280px] h-auto cursor-pointer active:scale-[.98] transition z-[30]"/>
    </div>

    <!-- Nuvens base + elemento gráfico -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: -25s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -31s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-0 w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

    <!-- Botão de som (canto inferior esquerdo) -->
    <button id="sound" class="ab-icon-btn fixed left-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Som">
      <img id="sound-icon" src="/assets/graphics/icon_Volume-On.svg" alt=""/>
    </button>

    <!-- Botão Home (centro inferior) -->
    <button id="home" class="ab-icon-btn fixed left-1/2 -translate-x-1/2 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Início">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#243a79" d="M12 3.2l8 6.4v10a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V14H10v6.1a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1V9.6l8-6.4zM3.6 9L2 10.3l.8 1 .8-.6V9zm18.4 1.3L20.4 9v1.7l.8.6.8-1z"/>
      </svg>
    </button>

  `;

  // Ligações
  const playBtn = el.querySelector<HTMLImageElement>('#play')!;
  const playSrcNormal = '/assets/graphics/Botao-Jogar_Normal.svg';
  const playSrcPressed = '/assets/graphics/Botao-Jogar_Pressed.svg';
  const setPressed = (pressed: boolean) => { playBtn.src = pressed ? playSrcPressed : playSrcNormal; };
  playBtn.onpointerdown = () => setPressed(true);
  playBtn.onpointerup = () => setPressed(false);
  playBtn.onpointerleave = () => setPressed(false);
  playBtn.onpointercancel = () => setPressed(false);
  playBtn.onclick = () => onPlay();
  // Bot�o Home ? voltar � Home
  el.querySelector<HTMLButtonElement>('#home')!.onclick = () => onBack();
  // Botão voltar não é necessário nesta versão; usa o botão de som ou navegação do SO

  // Som on/off com persistência (igual à Home)
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







