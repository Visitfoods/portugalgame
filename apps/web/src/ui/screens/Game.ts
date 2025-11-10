import { HUD } from "../components/HUD";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { CameraFeed } from "../../core/ar/CameraFeed";
import { FaceTracker } from "../../core/ar/FaceTracker";
import { MouthOpenDetector } from "../../core/ar/MouthOpenDetector";
import { GameLoop } from "../../core/engine/GameLoop";
import { loadItemSprites } from "../../core/engine/Assets";
import { BackgroundMusic } from "../../core/engine/Audio";

// Importar funções de modal do main.ts
declare function showErrorModal(message: string, onClose?: () => void): void;
import { mouthTrigger, resetMouthTrigger } from "../../core/game/mouthTrigger";
import type { Vec2 } from "../../utils/types";

type MascotController = {
  destroy(): void;
  onGoodCatch(): void;
  onBadCatch(reason?: 'wrong' | 'mouth'): void;
};

export function Game(onFinish: (score: number) => void, onCancel?: () => void) {
  const el = document.createElement('div');
  el.className = 'screen text-center gap-6 bg-[#243b78]';
  el.innerHTML = `
    <!-- Conteúdo principal -->
    <div class="flex flex-col items-center justify-center min-h-screen">
      <div class="text-white text-center px-4 text-lg">Coloca o teu rosto visível e centrado. O jogo começa já!</div>
    </div>
    
    <div id="controls" class="fixed top-3 left-3 z-40">
      <button id="btn-exit" class="px-3 py-2 rounded bg-black/50 text-white border border-white/20">Sair</button>
    </div>
  `;

  const video = document.getElementById('camera') as HTMLVideoElement;
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const stage = document.getElementById('stage') as HTMLDivElement;
  if (!video || !canvas) {
    showErrorModal('ELEMENTO DE JOGO EM FALTA. RECARREGA A PÁGINA.');
    onCancel?.();
    return el;
  }
  let hud: HUD | undefined;
  const feed = new CameraFeed(video);
  const tracker = new FaceTracker();
  const mouth = new MouthOpenDetector();
  let loop: GameLoop | undefined;
  let trackingActive = true;
  let bottomDecor: HTMLImageElement | null = null;
  let topLogoWrap: HTMLDivElement | null = null;
  let soundBtnEl: HTMLButtonElement | null = null;
  let devFinishBtn: HTMLButtonElement | null = null;
  let mouthOpenSince = 0;
  let prevMouthOpen = false;
  let lastMouthWarningAt = 0;
  let hasFinished = false; // Flag para garantir que onFinish só é chamado uma vez

  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    loop?.resize(w, h);
    // adjust top logo size responsively
    if (topLogoWrap) {
      const img = topLogoWrap.querySelector('img');
      if (img) {
        const computeW = () => Math.min(220, Math.max(120, Math.floor(window.innerWidth * 0.33)));
        (img as HTMLImageElement).style.width = computeW() + 'px';
      }
    }
  };
  window.addEventListener('resize', resize);

  let mascotCtl: MascotController | null = null;

  const cleanup = (clearCanvas = true) => {
    trackingActive = false;
    mouthOpenSince = 0;
    prevMouthOpen = false;
    lastMouthWarningAt = 0;
    try { tracker.stop(); } catch {}
    try { feed.stop(); } catch {}
    window.removeEventListener('resize', resize);
    try { hud?.destroy(); hud = undefined; } catch {}
    try { mascotCtl?.destroy(); mascotCtl = null; } catch {}
    try { bottomDecor?.remove(); bottomDecor = null; } catch {}
    try { topLogoWrap?.remove(); topLogoWrap = null; } catch {}
    try { soundBtnEl?.remove(); soundBtnEl = null; } catch {}
    try { devFinishBtn?.remove(); devFinishBtn = null; } catch {}
    if (clearCanvas) {
      try { const ctx = canvas.getContext('2d'); ctx && ctx.clearRect(0,0,canvas.width,canvas.height); } catch {}
    }
    video.classList.add('hidden');
    canvas.classList.add('hidden');
    try { loop?.stop(); loop = undefined; } catch {}
    resetMouthTrigger();
  };

  const start = async () => {
    // RESETAR hasFinished quando se inicia um novo jogo
    hasFinished = false;
    
    // RESETAR trackingActive para permitir tracking novamente
    trackingActive = true;
    
    // Garantir que o loop anterior está completamente parado antes de criar um novo
    if (loop) {
      try { 
        loop.stop(); 
        // Pequeno delay para garantir que o stop() terminou completamente
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch {}
    }
    
    // RESETAR estados do vídeo e canvas - remover todos os estilos que possam estar a bloquear
    video.classList.remove('hidden');
    video.style.display = '';
    video.style.pointerEvents = '';
    canvas.classList.remove('hidden');
    canvas.style.display = '';
    canvas.style.pointerEvents = '';
    canvas.classList.add('z-[2]');
    
    // Garantir que o stage também está ativo
    if (stage) {
      stage.style.pointerEvents = '';
    }

    // Recriar HUD se necessário (pode ter sido destruído no jogo anterior)
    if (!hud) {
      hud = new HUD();
    }

    // Loading overlay minimalista durante o arranque
    const loading = LoadingOverlay('A preparar...');
    loading.show('A CARREGAR SABORES DE PORTUGAL');
    
    // Bottom decorative element (same as other pages), positioned under mascot
    // Remover e recriar para garantir estado limpo
    if (bottomDecor) {
      try { bottomDecor.remove(); } catch {}
      bottomDecor = null;
    }
    if (!bottomDecor) {
      bottomDecor = document.createElement('img');
      bottomDecor.src = '/assets/graphics/Graphic-Element01.svg';
      bottomDecor.alt = '';
      // z-[2] so it sits above the canvas (also z-[2]) due to DOM order,
      // and below the mascot (z-[3]) to avoid covering it
      bottomDecor.className = 'absolute left-0 right-0 bottom-[-60px] w-full h-[140px] md:h-[180px] object-cover pointer-events-none z-[2]';
      (stage || document.body).appendChild(bottomDecor);
    }

    // Top centered Alves Bandeira logo, persistent during gameplay
    // Remover e recriar para garantir estado limpo
    if (topLogoWrap) {
      try { topLogoWrap.remove(); } catch {}
      topLogoWrap = null;
    }
    if (!topLogoWrap) {
      const wrap = document.createElement('div');
      wrap.className = 'absolute top-3 left-1/2 -translate-x-1/2 z-[4] pointer-events-none';
      const img = document.createElement('img');
      img.src = '/assets/graphics/Alves_Bandeira_logo.svg';
      img.alt = 'Alves Bandeira';
      img.className = 'ab-logo-white h-auto';
      // Responsive width between 120–220px
      const computeW = () => Math.min(220, Math.max(120, Math.floor(window.innerWidth * 0.33)));
      img.style.width = computeW() + 'px';
      // Width will also update via the existing resize() handler
      // keep a simple destroy hook tied to wrap removal
      wrap.appendChild(img);
      (stage || document.body).appendChild(wrap);
      topLogoWrap = wrap;
    }

    // Preload item sprites from manifest and warm up face landmarker in parallel
    const [sprites] = await Promise.all([
      loadItemSprites(),
      tracker.init().catch(()=>{})
    ]);
    
    // VERIFICAÇÃO: Garantir que os sprites foram carregados corretamente
    if (!sprites.good.length && !sprites.bad.length) {
      console.error('❌ Nenhum sprite carregado! Verifica o manifest.json');
      loading.hide();
      showErrorModal('ERRO AO CARREGAR ITENS DO JOGO. RECARREGA A PÁGINA.');
      return;
    }
    
    console.log(`✅ Sprites carregados: ${sprites.good.length} bons, ${sprites.bad.length} maus`);

    loading.show('A CARREGAR SABORES DE PORTUGAL');
    await feed.startFrontCamera();
    try { await tracker.start(video); } catch {}
    loading.hide();
    
    // Criar NOVO GameLoop com os sprites carregados
    // Garantir que hud está definido antes de criar o loop
    if (!hud) {
      console.error('❌ HUD não foi criado!');
      loading.hide();
      showErrorModal('ERRO AO INICIAR O JOGO. RECARREGA A PÁGINA.');
      return;
    }
    
    loop = new GameLoop(canvas, {
      onScoreUpdate: (s) => hud!.setScore(s),
      onTimeUpdate: (t) => hud!.setTimeLeft(t),
      onStateChange: (state) => {
        if (state === 'finished') {
          // CRÍTICO: Garantir que onFinish só é chamado UMA VEZ
          if (hasFinished) {
            console.warn('⚠️ Tentativa de chamar onFinish novamente - ignorando');
            return;
          }
          hasFinished = true;
          
          // IMPORTANTE: Capturar o score ANTES de fazer qualquer cleanup
          const finalScore = loop?.getScore() ?? 0;
          console.log('🏆 Score final capturado:', finalScore);
          
          // PARAR tracker e feed IMEDIATAMENTE para evitar flicker
          // Isto deve ser síncrono para não causar conflitos com a nova tela
          trackingActive = false;
          try { tracker.stop(); } catch {}
          try { feed.stop(); } catch {}
          
          // Pausar e limpar o video completamente
          try {
            video.pause();
            const stream = video.srcObject as MediaStream | null;
            if (stream) {
              stream.getTracks().forEach(t => t.stop());
            }
            video.srcObject = null;
          } catch {}
          
          // REMOVER TODOS os elementos do jogo IMEDIATAMENTE para evitar conflitos
          try { hud?.destroy(); hud = undefined; } catch {}
          try { mascotCtl?.destroy(); mascotCtl = null; } catch {}
          try { bottomDecor?.remove(); bottomDecor = null; } catch {}
          try { topLogoWrap?.remove(); topLogoWrap = null; } catch {}
          try { soundBtnEl?.remove(); soundBtnEl = null; } catch {}
          try { devFinishBtn?.remove(); devFinishBtn = null; } catch {}
          
          // Remover quaisquer elementos órfãos do DOM que possam estar a causar flicker
          try {
            document.querySelectorAll('[id*="meas-"], .ab-star, .ab-star-burst').forEach(el => el.remove());
          } catch {}
          
          // NÃO fazer nada com CSS para evitar interferir com os botões da próxima tela
          
          // Esconder canvas/video de forma não bloqueante
          // Usar requestAnimationFrame para evitar flicker
          requestAnimationFrame(() => {
            video.classList.add('hidden');
            video.style.pointerEvents = 'none';
            video.style.display = 'none';
            canvas.classList.add('hidden');
            canvas.style.pointerEvents = 'none';
            canvas.style.display = 'none';
            
            try {
              const stage = document.getElementById('stage');
              if (stage) {
                stage.style.pointerEvents = 'none';
              }
            } catch {}
          });
          
          // Chamar onFinish após um pequeno delay para garantir que tudo está limpo
          // O main.ts já tem um requestAnimationFrame duplo, mas adicionamos mais um aqui
          console.log('🚀 Chamando onFinish com score:', finalScore);
          requestAnimationFrame(() => {
            onFinish(finalScore);
          });
          
          // Fazer o resto do cleanup de forma não bloqueante
          const doCleanup = () => {
            mouthOpenSince = 0;
            prevMouthOpen = false;
            lastMouthWarningAt = 0;
            window.removeEventListener('resize', resize);
            if (true) {
              try { const ctx = canvas.getContext('2d'); ctx && ctx.clearRect(0,0,canvas.width,canvas.height); } catch {}
            }
            try { loop?.stop(); } catch {}
            resetMouthTrigger();
          };
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(doCleanup, { timeout: 100 });
          } else {
            setTimeout(doCleanup, 0);
          }
        }
      },
      onPopup: (x, y, delta) => {
        hud!.popupCanvasPx(x, y, delta, canvas);
        if (!mascotCtl) return;
        if (delta > 0) mascotCtl.onGoodCatch();
        else if (delta < 0) mascotCtl.onBadCatch('wrong');
      }
    }, sprites);
    resize();

    // 3-2-1 countdown
    await new Promise<void>((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 flex items-start justify-center pt-32 text-6xl font-bold bg-[#243b78]/80 z-[60]';
      let n = 3;
      const span = document.createElement('div');
      span.className = 'text-white';
      overlay.appendChild(span);
      document.body.appendChild(overlay);
      const id = setInterval(() => {
        if (n === 0) {
          clearInterval(id);
          overlay.remove();
          resolve();
        } else {
          span.textContent = String(n--);
        }
      }, 700);
    });

    // Só mostrar a câmara após o countdown (evita "zoom"/autoexposição antes do jogo)
    video.classList.remove('hidden');
    video.style.display = '';
    video.style.pointerEvents = '';
    video.classList.add('fixed','inset-0','w-full','h-full','object-cover','transform','-scale-x-100','z-[1]');

    // Garantir que o loop foi criado antes de iniciar
    if (!loop) {
      console.error('❌ GameLoop não foi criado!');
      loading.hide();
      showErrorModal('ERRO AO INICIAR O JOGO. RECARREGA A PÁGINA.');
      return;
    }
    
    loop.start();
    // Developer helper: finish button visible during countdown/gameplay
    if (!devFinishBtn) {
      const btn = document.createElement('button');
      btn.id = 'btn-finish-dev';
      btn.textContent = 'Terminar (dev)';
      btn.className = 'fixed top-3 right-3 z-[50] px-3 py-2 rounded bg-white/20 text-white border border-white/40 backdrop-blur-sm';
      btn.onclick = () => { try { cleanup(true); } catch {} try { onFinish(loop?.getScore() ?? 0); } catch { onFinish(0); } };
      document.body.appendChild(btn);
      devFinishBtn = btn;
    }

    // Sound toggle button (bottom-left)
    if (!soundBtnEl) {
      const b = document.createElement('button');
      b.className = 'ab-icon-btn fixed left-5 z-[40] pointer-events-auto';
      (b.style as any).bottom = 'calc(env(safe-area-inset-bottom, 0px) + 20px)';
      const img = document.createElement('img');
      img.alt = '';
      b.appendChild(img);
      const updateIcon = () => {
        const muted = (localStorage.getItem('ab-muted') === '1');
        img.src = muted ? '/assets/graphics/Icon_Volume-Muted.svg' : '/assets/graphics/icon_Volume-On.svg';
      };
      const toggle = () => { 
        const cur = (localStorage.getItem('ab-muted') === '1'); 
        try { localStorage.setItem('ab-muted', cur ? '0' : '1'); } catch {} 
        updateIcon(); 
        try { BackgroundMusic.syncFromStorage(); } catch {} 
      };
      updateIcon();
      b.onclick = () => toggle();
      b.addEventListener('touchstart', (e) => { try { e.preventDefault(); } catch {} toggle(); }, { passive: false });
      document.body.appendChild(b);
      soundBtnEl = b;
    }

    // Mascote animada com estados feliz/triste e balao de fala
    mascotCtl = await (async function mountMascot() {
      const stageEl = document.getElementById('stage') || document.body; // sobre o canvas
      const wrap = document.createElement('div');
      // Alinhar à direita e por baixo dos elementos (score: z-30; Graphic-Element01: z-[2])
      // Colocamos a mascote em z-[1] para ficar atrás de ambos
      wrap.className = 'absolute bottom-0 right-3 z-[1] pointer-events-none flex flex-col items-center gap-2';
      // Subir a posição vertical ~3x (apenas para cima)
      (wrap.style as any).bottom = 'calc(env(safe-area-inset-bottom, 0px) + 72px)';

      const bubbleWrap = document.createElement('div');
      bubbleWrap.className = 'relative flex items-center justify-center select-none pointer-events-none';
      bubbleWrap.style.opacity = '0';
      bubbleWrap.style.visibility = 'hidden';
      bubbleWrap.style.transform = 'translateY(8px)';
      bubbleWrap.style.transition = 'opacity 200ms ease, transform 220ms ease';
      bubbleWrap.style.display = 'none';

      const bubbleImg = document.createElement('img');
      bubbleImg.src = '/assets/graphics/balao-fala.svg';
      bubbleImg.alt = '';
      // Largura controlada via JS para permitir tamanho dinâmico
      bubbleImg.className = 'h-auto drop-shadow-sm';
      bubbleImg.style.width = '72px';
      bubbleWrap.appendChild(bubbleImg);

      const bubbleText = document.createElement('div');
      bubbleText.className = 'absolute inset-0 flex items-center justify-center px-2 pt-2 pb-3 text-[10px] leading-snug font-semibold text-white text-center drop-shadow';
      bubbleText.style.textShadow = '0 2px 6px rgba(7,27,66,0.45)';
      // Permitir várias linhas de texto dentro do balão
      bubbleText.style.whiteSpace = 'normal';
      bubbleText.style.wordBreak = 'break-word';
      (bubbleText.style as any).hyphens = 'auto';
      bubbleWrap.appendChild(bubbleText);

      wrap.appendChild(bubbleWrap);

      const img = document.createElement('img');
      img.alt = '';
      img.className = 'w-[110px] h-auto opacity-95 drop-shadow select-none';

      const w = Math.min(150, Math.max(92, Math.floor(window.innerWidth * 0.26)));
      img.style.width = `${w}px`;
      // A mascote não deve estar sempre visível; só aparece quando houver mensagem
      img.style.display = 'none';

      wrap.appendChild(img);
      stageEl.appendChild(wrap);

      function preload(src: string) {
        return new Promise<string>((res, rej) => {
          const i = new Image();
          i.onload = () => res(src);
          i.onerror = () => rej(src);
          i.src = src;
        });
      }

      const sequencePaths: Record<'happy' | 'sad', string[]> = {
        happy: [
          '/assets/graphics/mascote-feliz_frame1.svg',
          '/assets/graphics/mascote-feliz_frame2.svg',
          '/assets/graphics/mascote-feliz_frame3.svg',
          '/assets/graphics/mascote-feliz_frame4.svg'
        ],
        sad: [
          '/assets/graphics/mascote-triste_frame1.svg',
          '/assets/graphics/mascote-triste_frame2.svg',
          '/assets/graphics/mascote-triste_frame3.svg',
          '/assets/graphics/mascote-triste_frame4.svg'
        ]
      };

      const framesByMood: Record<'happy' | 'sad', string[]> = { happy: [], sad: [] };
      for (const mood of Object.keys(sequencePaths) as Array<'happy' | 'sad'>) {
        try {
          const loaded = await Promise.all(sequencePaths[mood].map(preload));
          framesByMood[mood] = loaded;
        } catch (err) {
          console.warn(`[Mascote] Falha ao carregar frames ${mood}:`, err);
        }
      }

      if (!framesByMood.happy.length && !framesByMood.sad.length) {
        wrap.remove();
        return {
          destroy() { /* noop */ },
          onGoodCatch() { /* noop */ },
          onBadCatch() { /* noop */ }
        } as MascotController;
      }

      if (!framesByMood.happy.length && framesByMood.sad.length) {
        framesByMood.happy = framesByMood.sad.slice();
      }
      if (!framesByMood.sad.length && framesByMood.happy.length) {
        framesByMood.sad = framesByMood.happy.slice();
      }

      const seq: number[] = [0, 1, 2, 3, 2, 1];
      let idx = 0;
      let raf = 0;
      let last = 0;
      const stepMs = 180;
      let activeMood: 'happy' | 'sad' = 'happy';

      const setInitialFrame = () => {
        const frames = framesByMood[activeMood];
        const firstIdx = seq[idx] ?? 0;
        img.src = frames[firstIdx % frames.length]!;
      };
      setInitialFrame();

      const tick = (t: number) => {
        if (!wrap.isConnected) return;
        if (!last) last = t;
        if (t - last >= stepMs) {
          last = t;
          idx = (idx + 1) % seq.length;
          const frames = framesByMood[activeMood];
          const fi = seq[idx] ?? 0;
          img.src = frames[fi % frames.length]!;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      const positiveMessages = [
        'Boa! Continua!',
        'Excelente, mais um ponto!',
        'Top! Mantém o ritmo!',
        'Fantástico! Mais sabor de Portugal.',
        'Muito bem! Captura portuguesa!'
      ];
      const negativeMessages = [
        'Acabaste de comer um alimento que não é português.',
        'Esse não conta. Procura os sabores portugueses.',
        'Cuidado! Só valem iguarias nacionais.',
        'Atenção: foca-te nos produtos de Portugal.',
        'Hmm... esse não era português.'
      ];
      const mouthMessages = [
        'Manter a boca sempre aberta não é válido.',
        'Fecha e volta a abrir no momento certo.',
        'Calma! Abre a boca quando o item chegar.',
        'Respira e espera pelo próximo sabor.',
        'Boca pronta, mas só na altura certa!'
      ];

      const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)] ?? arr[0] ?? '';
      let hideTimer = 0;
      let hideDisplayTimer = 0;

      const hideBubble = (immediate = false) => {
        if (hideTimer) { window.clearTimeout(hideTimer); hideTimer = 0; }
        if (hideDisplayTimer) { window.clearTimeout(hideDisplayTimer); hideDisplayTimer = 0; }
        bubbleWrap.style.opacity = '0';
        bubbleWrap.style.transform = 'translateY(8px)';
        bubbleWrap.style.visibility = 'hidden';
        if (immediate) {
          bubbleWrap.style.display = 'none';
          bubbleText.textContent = '';
          img.style.display = 'none';
          return;
        }
        hideDisplayTimer = window.setTimeout(() => {
          bubbleWrap.style.display = 'none';
          bubbleText.textContent = '';
          img.style.display = 'none';
          hideDisplayTimer = 0;
        }, 240);
      };

      const showBubble = (message: string) => {
        if (!message) return;
        if (hideTimer) { window.clearTimeout(hideTimer); hideTimer = 0; }
        if (hideDisplayTimer) { window.clearTimeout(hideDisplayTimer); hideDisplayTimer = 0; }
        bubbleText.textContent = message;
        // Calcular largura dinamicamente permitindo múltiplas linhas e assegurando que cabe em altura
        try {
          const cs = getComputedStyle(bubbleText);
          const meas = document.createElement('div');
          meas.textContent = message;
          meas.style.position = 'absolute';
          meas.style.visibility = 'hidden';
          meas.style.whiteSpace = 'normal';
          meas.style.wordBreak = 'break-word';
          (meas.style as any).hyphens = 'auto';
          meas.style.fontSize = cs.fontSize;
          meas.style.fontWeight = cs.fontWeight;
          meas.style.fontFamily = cs.fontFamily;
          meas.style.letterSpacing = cs.letterSpacing;
          document.body.appendChild(meas);

          const MIN_W = 90; // px
          const MAX_W = 220; // px
          const PAD_H = 20;  // padding vertical aproximado (pt+pb)
          const PAD_W = 12;  // padding horizontal aproximado (px esquerda+direita)
          const ar = (bubbleImg.naturalWidth > 0) ? (bubbleImg.naturalHeight / bubbleImg.naturalWidth) : 0.7;
          const candidates = [90, 110, 130, 150, 170, 190, 210, 220];

          let chosen = MIN_W;
          for (const w of candidates) {
            const bubbleH = w * ar; // altura do SVG à escala
            const contentW = Math.max(40, Math.floor(w - PAD_W));
            meas.style.width = contentW + 'px';
            const textH = meas.offsetHeight; // altura do texto em múltiplas linhas
            if ((textH + PAD_H) <= (bubbleH - 6)) { chosen = w; break; }
            chosen = w;
          }
          meas.remove();
          bubbleImg.style.width = Math.min(Math.max(chosen, MIN_W), MAX_W) + 'px';
        } catch {}
        bubbleWrap.style.display = 'flex';
        // Mostrar a mascote juntamente com o balão
        img.style.display = '';
        bubbleWrap.style.opacity = '0';
        bubbleWrap.style.transform = 'translateY(8px)';
        bubbleWrap.style.visibility = 'visible';
        // force reflow para animacao de opacidade
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        bubbleWrap.offsetHeight;
        bubbleWrap.style.opacity = '1';
        bubbleWrap.style.transform = 'translateY(0)';
        hideTimer = window.setTimeout(() => {
          hideBubble();
          hideTimer = 0;
        }, 2600);
      };

      const switchMood = (mood: 'happy' | 'sad') => {
        if (activeMood === mood) return;
        activeMood = mood;
        idx = 0;
        last = 0;
        setInitialFrame();
      };

      const controller: MascotController = {
        destroy() {
          if (hideTimer) window.clearTimeout(hideTimer);
          if (hideDisplayTimer) window.clearTimeout(hideDisplayTimer);
          hideBubble(true);
          if (raf) cancelAnimationFrame(raf);
          wrap.remove();
        },
        onGoodCatch() {
          switchMood('happy');
          showBubble(pick(positiveMessages));
        },
        onBadCatch(reason) {
          switchMood('sad');
          const pool = reason === 'mouth' ? mouthMessages : negativeMessages;
          showBubble(pick(pool));
        }
      };

      return controller;
    })();
    // tracking bridge → mouth position in canvas px
    const step = () => {
      const lm = tracker.getLandmarks();
      let open = false;
      let pos: Vec2 = { x: canvas.width * 0.5, y: canvas.height * 0.6 };
      if (lm && lm.length > 0) {
        open = mouth.update(lm);
        // Position
        const ul = lm[13];
        const ll = lm[14];
        if (ul && ll) {
          const cx = (ul.x + ll.x) * 0.5;
          const cy = (ul.y + ll.y) * 0.5;
          pos = { x: cx * canvas.width, y: cy * canvas.height };
        }
        // Ellipse capture region (smoothed inside detector)
        const ell = mouth.geometry(lm, canvas.width, canvas.height);
        if (ell && loop) loop.setMouthMask(ell, open);
      } else {
        mouth.update(null);
      }
      if (hud) hud.setMouth(open);
      // standby: sem INVERT controls
      if (loop) loop.setMouth(pos, open);
      // anti-cheat mouth trigger
      const t = performance.now();
      const firedAt = mouthTrigger(t, open);
      if (firedAt && loop) loop.registerMouthTrigger(firedAt);
      const warnCooldownMs = 3500;
      const holdThresholdMs = 2400;
      const justOpened = open && !prevMouthOpen;
      if (open) {
        if (!mouthOpenSince) mouthOpenSince = t;
      } else {
        mouthOpenSince = 0;
      }
      if (mascotCtl) {
        if (justOpened && firedAt === 0 && (t - lastMouthWarningAt) > warnCooldownMs) {
          mascotCtl.onBadCatch('mouth');
          lastMouthWarningAt = t;
        } else if (open && mouthOpenSince && (t - mouthOpenSince) > holdThresholdMs && (t - lastMouthWarningAt) > warnCooldownMs) {
          mascotCtl.onBadCatch('mouth');
          lastMouthWarningAt = t;
          mouthOpenSince = t;
        }
      }
      prevMouthOpen = open;
      // standby: não mostrar badges nem filtros/efeitos visuais
      video.style.filter = '';
      video.classList.add('-scale-x-100');
      stage.classList.remove('fx-wavy');

      if (!trackingActive) return;
      if (document.visibilityState === 'visible') requestAnimationFrame(step);
      else setTimeout(step, 250);
    };
    step();
  };

  // Exit button handler
  el.querySelector<HTMLButtonElement>('#btn-exit')!.onclick = () => {
    cleanup(true);
    onCancel?.();
  };

  start().catch(err => {
    console.error('Start failed:', err);
    const msg = (err && typeof err === 'object' && 'message' in (err as any)) ? (err as any).message : String(err);
    const hint = location.protocol !== 'https:' ? ' Abre com HTTPS.' : '';
    showErrorModal(`FALHA AO INICIAR CÂMARA/TRACKING. ${msg || ''}${hint}`);
  });

  return el;
}











