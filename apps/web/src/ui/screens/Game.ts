import { HUD } from "../components/HUD";
import { CameraFeed } from "../../core/ar/CameraFeed";
import { FaceTracker } from "../../core/ar/FaceTracker";
import { MouthOpenDetector } from "../../core/ar/MouthOpenDetector";
import { GameLoop } from "../../core/engine/GameLoop";
import { loadItemSprites } from "../../core/engine/Assets";
import { mouthTrigger, resetMouthTrigger } from "../../core/game/mouthTrigger";
import type { Vec2 } from "../../utils/types";

export function Game(onFinish: (score: number) => void, onCancel?: () => void) {
  const el = document.createElement('div');
  el.className = 'screen text-center gap-6';
  el.innerHTML = `
    <div class="text-2xl font-semibold">Preparar...</div>
    <div class="text-white/80">Coloca o teu rosto visível e centrado. O jogo começa já!</div>
    <div id="controls" class="fixed top-3 left-3 z-40">
      <button id="btn-exit" class="px-3 py-2 rounded bg-black/50 text-white border border-white/20">Sair</button>
    </div>
  `;

  const video = document.getElementById('camera') as HTMLVideoElement;
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const stage = document.getElementById('stage') as HTMLDivElement;
  const hud = new HUD();
  const feed = new CameraFeed(video);
  const tracker = new FaceTracker();
  const mouth = new MouthOpenDetector();
  let loop: GameLoop;
  let trackingActive = true;

  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    loop?.resize(w, h);
  };
  window.addEventListener('resize', resize);

  let mascotCtl: { destroy(): void } | null = null;

  const cleanup = (clearCanvas = true) => {
    trackingActive = false;
    try { tracker.stop(); } catch {}
    try { feed.stop(); } catch {}
    window.removeEventListener('resize', resize);
    try { hud.destroy(); } catch {}
    try { mascotCtl?.destroy(); mascotCtl = null; } catch {}
    if (clearCanvas) {
      try { const ctx = canvas.getContext('2d'); ctx && ctx.clearRect(0,0,canvas.width,canvas.height); } catch {}
    }
    video.classList.add('hidden');
    canvas.classList.add('hidden');
    try { loop?.stop(); } catch {}
    resetMouthTrigger();
  };

  const start = async () => {
    // Show camera background
    video.classList.remove('hidden');
    video.classList.add('fixed','inset-0','w-full','h-full','object-cover','transform','-scale-x-100','z-[1]');
    // Ensure canvas is visible for a replay
    canvas.classList.remove('hidden');
    canvas.classList.add('z-[2]');

    // Preload item sprites from manifest and warm up face landmarker in parallel
    const [sprites] = await Promise.all([
      loadItemSprites(),
      tracker.init().catch(()=>{})
    ]);

    await feed.startFrontCamera();
    await tracker.start(video);
    loop = new GameLoop(canvas, {
      onScoreUpdate: (s) => hud.setScore(s),
      onTimeUpdate: (t) => hud.setTimeLeft(t),
      onStateChange: (state) => {
        if (state === 'finished') {
          cleanup(true);
          onFinish(loop.getScore());
        }
      },
      onPopup: (x, y, delta) => hud.popupCanvasPx(x, y, delta, canvas)
    }, sprites);
    resize();

    // 3-2-1 countdown
    await new Promise<void>((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 flex items-center justify-center text-6xl font-bold bg-black/50';
      let n = 3;
      const span = document.createElement('div');
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

    loop.start();

    // Mascote animada (3 frames: 1-2-3-2-1 em loop)
    mascotCtl = await (async function mountMascot() {
      const stageEl = document.getElementById('stage') || document.body; // sobre o canvas
      const wrap = document.createElement('div');
      wrap.className = 'absolute bottom-3 left-1/2 -translate-x-1/2 z-[3] pointer-events-none';
      const img = document.createElement('img');
      img.alt = '';
      img.className = 'w-[110px] h-auto opacity-95 drop-shadow';

      // Ajuste responsivo para ecrãs maiores
      const w = Math.min(140, Math.max(90, Math.floor(window.innerWidth * 0.25)));
      img.style.width = `${w}px`;

      wrap.appendChild(img);
      stageEl.appendChild(wrap);

      // Primeiro tenta exatamente os .webp fornecidos (masctoe_Frame_1/2/3.webp)
      const directWebp = ['/assets/graphics/masctoe_Frame_1.webp','/assets/graphics/masctoe_Frame_2.webp','/assets/graphics/masctoe_Frame_3.webp'];
      function preload(src: string) { return new Promise<HTMLImageElement>((res, rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src; }); }
      let frames: string[] = [];
      try {
        const imgs = await Promise.all(directWebp.map(preload));
        frames = imgs.map(i => i.src);
      } catch {
        // Suporta múltiplas convenções de nome (fallback)
        const basePath = '/assets/graphics/';
        const frameNameSets: string[][] = [
          ['Mascote-01','Mascote-02','Mascote-03'],
          ['Mascote_01','Mascote_02','Mascote_03'],
          ['mascote_Frame_1','mascote_Frame_2','mascote_Frame_3'],
          ['masctoe_Frame_1','masctoe_Frame_2','masctoe_Frame_3']
        ];
        // Evitar tentar .png para não gerar 404 no console em produção
        const exts = ['.webp', '.svg'];
        outer: for (const names of frameNameSets) {
          for (const ext of exts) {
            const set = names.map(n => basePath + n + ext);
            try {
              const imgs = await Promise.all(set.map(preload));
              frames = imgs.map(i => i.src);
              break outer;
            } catch { /* tenta próximo formato/conjunto */ }
          }
        }
      }
      if (frames.length === 0) {
        console.warn('[Mascote] Frames não encontrados nas paths esperadas (*.webp/svg/png).');
      }
      if (frames.length === 0) {
        // Se não houver assets, não mostrar mascote
        wrap.remove();
        return { destroy() { /* noop */ } };
      }

      const seq: number[] = [0,1,2,1];
      let idx = 0;
      let raf = 0; let last = 0; const stepMs = 220;
      const firstIdx = seq[idx] ?? 0; img.src = frames[firstIdx]!;

      const tick = (t: number) => {
        if (!wrap.isConnected) return; // já limpo
        if (!last) last = t;
        if (t - last >= stepMs) {
          last = t;
          idx = (idx + 1) % seq.length;
          const fi = seq[idx] ?? 0; img.src = frames[fi]!;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      return {
        destroy() {
          if (raf) cancelAnimationFrame(raf);
          wrap.remove();
        }
      };
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
        if (ell) loop.setMouthMask(ell, open);
      } else {
        mouth.update(null);
      }
      hud.setMouth(open);
      // standby: sem INVERT controls
      loop.setMouth(pos, open);
      // anti-cheat mouth trigger
      const t = performance.now();
      const firedAt = mouthTrigger(t, open);
      if (firedAt) loop.registerMouthTrigger(firedAt);
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
    alert(`Falha ao iniciar câmara/tracking. ${msg || ''}${hint}`);
  });

  return el;
}
