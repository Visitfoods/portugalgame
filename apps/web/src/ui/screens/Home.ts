export function Home(onPlay: () => void, onHow?: () => void, onRanking?: () => void) {
  const el = document.createElement('div');
  // Full-screen stage; on Home we want content aligned to the top
  // Use explicit utilities instead of the shared `.screen` (which centers vertically)
  el.className = 'home-screen fixed inset-0 flex flex-col items-center justify-start p-0 overflow-hidden';
  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>

    <!-- Nuvens topo (marquee infinito com instâncias desfasadas) -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-delay: -8s;"/>
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-24 left-0 w-[28%] max-w-[220px] -z-10 opacity-70 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 54s; --ab-delay: -35s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 52s; --ab-delay: -15s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-10 right-0 w-[30%] max-w-[230px] -z-10 opacity-60 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 40s; --ab-delay: -35s;"/>

    <!-- Conteúdo principal -->
    <div class="relative z-10 w-full flex flex-col items-center">
      <!-- Logo com parallax de nuvens (algumas atrás e outras à frente) -->
      <div class="relative mt-6 w-full h-[70px] flex items-start justify-center overflow-visible">
        <!-- Nuvem atrás do logotipo -->
        <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-2 left-0 w-[28%] max-w-[240px] opacity-70 z-[5] ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 56s; --ab-delay: -18s;"/>
        <!-- Logotipo -->
        <img id="ab-logo" src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="relative z-[10] w-[150px] md:w-[180px] h-auto ab-logo-white"/>
        <!-- Nuvem à frente do logotipo -->
        <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-4 right-0 w-[26%] max-w-[220px] opacity-80 z-[20] ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 50s; --ab-delay: -32s;"/>
      </div>

      <!-- Container único para ambas as animações (mesmo espaço) -->
      <div class="home-title-slot relative mt-4 w-10/12 max-w-[720px] h-[260px] md:h-[320px] overflow-visible">
        <!-- Primeira animação: Título do jogo -->
        <div id="title-container" class="absolute inset-0 flex items-center justify-center ab-anim-fade-out">
          <img id="title" src="/assets/graphics/Titulo-Jogo.svg" alt="Apanha os Sabores de Portugal" class="relative z-[2] w-full h-auto ab-anim-fade-zoom-in"/>
          <!-- Clones enormes para o efeito de revelar -->
          <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute left-[-10%] top-[12%] w-[120%] z-[3] ab-reveal-cloud-left"/>
          <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute right-[-10%] top-[10%] w-[126%] z-[3] ab-reveal-cloud-right"/>
        </div>

        <!-- Segunda animação: 50 anos 50 prémios (mesmo espaço) -->
        <div id="title-50anos-container" class="absolute inset-0 flex items-center justify-center">
          <img id="title-50anos" src="/assets/graphics/50anos-50premios.svg" alt="50 Anos 50 Prémios" class="relative z-[2] w-full h-auto ab-anim-fade-zoom-in-delayed"/>
          <!-- Clones enormes para o efeito de revelar (segunda animação) -->
          <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute left-[-10%] top-[12%] w-[120%] z-[3] ab-reveal-cloud-left-delayed"/>
          <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute right-[-10%] top-[10%] w-[126%] z-[3] ab-reveal-cloud-right-delayed"/>
        </div>
      </div>

      <!-- Nuvens 05/06 pequenas por baixo do título (marquee lento) -->
      <div class="relative mt-2 w-10/12 max-w-[720px] h-8 overflow-visible">
        <img src="/assets/graphics/Nuvem-05.svg" alt="" class="absolute top-0 left-0 w-[18%] opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 60s; --ab-delay: -12s;"/>
        <img src="/assets/graphics/Nuvem-06.svg" alt="" class="absolute top-1 right-0 w-[16%] opacity-90 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 58s; --ab-delay: -33s;"/>
      </div>

      <!-- Botões principais -->
      <img id="play" src="/assets/graphics/Botao-Jogar_Normal.svg" alt="Jogar" class="btn-play mt-20 w-7/12 max-w-[320px] h-auto cursor-pointer active:scale-[.98] transition"/>
      <button id="how" class="home-glass-btn btn-how mt-7 w-5/12 max-w-[240px] px-4 py-2 rounded-full text-white font-semibold text-sm md:text-base whitespace-nowrap border border-white/60 bg-white/15 backdrop-blur-sm shadow-[0_6px_16px_rgba(2,20,60,0.25)] active:scale-[.98] transition">COMO JOGAR</button>

      <!-- Ícones inferiores -->
            <div class="bottom-icons mt-12 flex items-center justify-center gap-6 md:gap-8 mb-[72px] md:mb-[84px]">
        <button id="account" class="ab-icon-btn" aria-label="Conta">
          <img src="/assets/graphics/profile-icon.svg" alt=""/>
        </button>
        <button id="ranking" class="ab-icon-btn" aria-label="Ranking">
          <img src="/assets/graphics/Botao-Ranking.svg" alt=""/>
        </button>
        <button id="info" class="ab-icon-btn" aria-label="Informa��o">
          <img src="/assets/graphics/Botao-Info.svg" alt=""/>
        </button>
      </div>
    </div>

    <!-- Nuvens base + elemento gráfico -->
    <!-- Nuvens base com marquee e clones desfasados para loop contínuo -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: -10s;"/>
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[28px] left-[-140px] w-[70%] max-w-[700px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 62s; --ab-delay: -41s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -20s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[22px] right-[-140px] w-[72%] max-w-[720px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 76s; --ab-delay: -58s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-[-60px] w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

    <!-- Camada para "chuva" de ícones -->
    <div id="icon-rain" class="pointer-events-none absolute inset-0 z-[1] overflow-visible"></div>
    <!-- Bot�o de som (canto inferior esquerdo) -->
    <button id="sound" class="ab-icon-btn fixed left-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Som">
      <img id="sound-icon" src="/assets/graphics/icon_Volume-On.svg" alt=""/>
    </button>

  `;

  // Ligações
  // Estado pressed do botão JOGAR
  const playBtn = el.querySelector<HTMLImageElement>('#play')!;
  const playSrcNormal = '/assets/graphics/Botao-Jogar_Normal.svg';
  const playSrcPressed = '/assets/graphics/Botao-Jogar_Pressed.svg';
  const setPressed = (pressed: boolean) => {
    playBtn.src = pressed ? playSrcPressed : playSrcNormal;
  };
  playBtn.onpointerdown = () => setPressed(true);
  playBtn.onpointerup = () => setPressed(false);
  playBtn.onpointerleave = () => setPressed(false);
  playBtn.onpointercancel = () => setPressed(false);
  playBtn.onclick = () => onPlay();
  el.querySelector<HTMLButtonElement>('#how')!.onclick = () => { if (onHow) onHow(); else alert('Como jogar: manter o rosto visivel e centrado. Abre a boca para apanhar os icones. Evita os falsos!'); };
  el.querySelector<HTMLButtonElement>('#account')!.onclick = () => { const fn = (onHow as any)?.gotoAccount; if (typeof fn === 'function') fn(); else alert('Conta: em breve.'); };
  el.querySelector<HTMLButtonElement>('#ranking')!.onclick = () => { if (onRanking) onRanking(); else alert('Ranking: em breve.'); };
  el.querySelector<HTMLButtonElement>('#info')!.onclick = () => alert('Projeto Alves Bandeira — WebAR jogo promocional.');
  // Som on/off com persistência
  const soundBtn = el.querySelector<HTMLButtonElement>('#sound')!;
  const soundIcon = el.querySelector<HTMLImageElement>('#sound-icon')!;
    const updateSoundIcon = () => {
    const muted = (localStorage.getItem('ab-muted') === '1');
    soundIcon.src = muted ? '/assets/graphics/Icon_Volume-Muted.svg' : '/assets/graphics/icon_Volume-On.svg';
    try {
      soundBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
      soundBtn.title = muted ? 'Som desligado' : 'Som ligado';
      soundIcon.classList.remove('ab-icon-swap');
      // force reflow to retrigger animation
      void (soundIcon as any).offsetWidth;
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
  // iOS Safari: garantir toggle no toque sem click duplicado
  soundBtn.addEventListener('touchstart', (e) => { try { e.preventDefault(); } catch {} toggleMute(); }, { passive: false });
  soundBtn.onkeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMute(); }
  };

  // Press feedback for icon buttons (iOS-friendly)
  el.querySelectorAll<HTMLButtonElement>('.ab-icon-btn, .home-glass-btn').forEach(btn => {
    const set = (on: boolean) => btn.classList.toggle('is-pressing', on);
    btn.addEventListener('pointerdown', () => set(true));
    ['pointerup','pointerleave','pointercancel'].forEach(evt => btn.addEventListener(evt, () => set(false)));
  });
  // Chuva de ícones "good" após a animação do título
  // Sequência: garantir que o segundo título só aparece depois do primeiro
  try {
    const title50 = el.querySelector<HTMLImageElement>('#title-50anos')!;
    const revealCloudsDelayed = el.querySelectorAll<HTMLElement>('.ab-reveal-cloud-left-delayed, .ab-reveal-cloud-right-delayed');
    title50.style.visibility = 'hidden';
    revealCloudsDelayed.forEach(c => (c.style.visibility = 'hidden'));
    setTimeout(() => {
      title50.style.visibility = 'visible';
      revealCloudsDelayed.forEach(c => (c.style.visibility = 'visible'));
    }, 2950);
  } catch {}

  // Loop das animações do título: reinicia a cada ~6s
  function restartAnimation(n: HTMLElement) {
    n.style.animation = 'none';
    // force reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (n as any).offsetHeight;
    n.style.animation = '';
  }

  function startSequenceOnce() {
    const tContainer = el.querySelector<HTMLElement>('#title-container');
    const t1 = el.querySelector<HTMLImageElement>('#title');
    const clouds1 = el.querySelectorAll<HTMLElement>('.ab-reveal-cloud-left, .ab-reveal-cloud-right');
    const t2 = el.querySelector<HTMLImageElement>('#title-50anos');
    const clouds2 = el.querySelectorAll<HTMLElement>('.ab-reveal-cloud-left-delayed, .ab-reveal-cloud-right-delayed');
    if (!tContainer || !t1 || !t2) return;

    // Esconder fase 2 durante a fase 1
    t2.style.visibility = 'hidden';
    clouds2.forEach(c => (c.style.visibility = 'hidden'));

    // Reiniciar ambas as fases
    restartAnimation(t1);
    restartAnimation(tContainer);
    clouds1.forEach(c => restartAnimation(c));
    restartAnimation(t2);
    clouds2.forEach(c => restartAnimation(c));

    // Mostrar fase 2 no momento do seu delay (3s)
    setTimeout(() => {
      if (!el.isConnected) return;
      t2.style.visibility = 'visible';
      clouds2.forEach(c => (c.style.visibility = 'visible'));
    }, 3000);
  }

  // Arranque imediato e loop contínuo
  startSequenceOnce();
  const seqInterval = window.setInterval(() => {
    if (!el.isConnected) { clearInterval(seqInterval); return; }
    startSequenceOnce();
  }, 6000);

  const rainLayer = el.querySelector<HTMLDivElement>('#icon-rain')!;
  const titleEl = el.querySelector<HTMLImageElement>('#title')!;
  const revealClouds = el.querySelectorAll<HTMLElement>('.ab-reveal-cloud-left, .ab-reveal-cloud-right');

  let started = false;
  let spawnTimer: number | undefined;

  function startIconRain() {
    if (started) return; started = true;
    // Carregar apenas os ícones bons do manifest
    fetch('/assets/items/manifest.json').then(r => r.json()).then((m: {good?: unknown[]}) => {
      const goods = (Array.isArray(m?.good) ? m!.good : []).filter((s): s is string => typeof s === 'string');
      if (!goods.length) return;

      const target = () => {
        const btn = playBtn.getBoundingClientRect();
        return { x: btn.left + btn.width/2, y: btn.top + btn.height*0.45 };
      };

      const titleBox = () => {
        // zona larga em torno do título para parecer "por trás"
        const wrap = titleEl.getBoundingClientRect();
        return { left: wrap.left - 40, right: wrap.right + 40, top: wrap.top - 10, bottom: wrap.bottom + 10 };
      };

      function spawnOnce() {
        if (!el.isConnected) { if (spawnTimer) { clearInterval(spawnTimer); } return; }
        const g = goods[Math.floor(Math.random()*goods.length)] as string;
        const img = document.createElement('img');
        img.src = g;
        img.alt = '';
        img.draggable = false;
        img.className = 'absolute will-change-transform select-none drop-shadow-[0_6px_8px_rgba(0,0,0,0.25)]';
        
        // Posição inicial: fora do ecrã (de cima)
        const viewportWidth = window.innerWidth;
        const startX = Math.random() * viewportWidth; // posição horizontal aleatória
        const startY = -100; // começa fora do ecrã (acima)
        const startScale = 0.8 + Math.random()*0.4; // escala inicial
        
        const end = target();
        const jitter0 = (Math.random()*60 - 30); // embudo com ligeiro desvio que morre ao longo do tempo
        const rot = (Math.random()*20 - 10);
        const dur = 2200 + Math.random()*2200; // 2.2s a 4.4s

        const size = 40 + Math.random()*22; // 40-62px
        img.style.width = `${size}px`;
        img.style.height = 'auto';
        img.style.zIndex = '1'; // atrás do título (que está a z [2])

        rainLayer.appendChild(img);

        const t0 = performance.now();
        function tick(now: number) {
          if (!img.isConnected) return;
          const p = Math.min(1, (now - t0) / dur);
          // easing para funil
          const ease = p*p*(3-2*p);
          const x = startX + (end.x + jitter0*(1-ease) - startX) * ease;
          const y = startY + (end.y - startY) * Math.pow(ease, 0.85);
          const scale = startScale * (0.85 + 0.15*(1-ease));
          img.style.transform = `translate(${x}px, ${y}px) rotate(${rot*(1-ease)}deg) scale(${scale})`;
          if (p < 1 && el.isConnected) {
            requestAnimationFrame(tick);
          } else {
            img.remove();
          }
        }
        requestAnimationFrame(tick);
      }

      // spawn contínuo em loop, desfasado
      spawnTimer = window.setInterval(spawnOnce, 380);
      // lança alguns de arranque
      for (let i=0;i<4;i++) setTimeout(spawnOnce, i*180);
    }).catch(() => {});
  }

  // Iniciar quando as nuvens de revelação terminarem (usar a mais longa)
  let ended = 0;
  revealClouds.forEach(c => c.addEventListener('animationend', () => {
    ended++;
    if (ended >= revealClouds.length) startIconRain();
  }, { once: true }));
  // Fallback de segurança
  setTimeout(startIconRain, 2600);

  return el;
}
















