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

  const cleanup = (clearCanvas = true) => {
    trackingActive = false;
    try { tracker.stop(); } catch {}
    try { feed.stop(); } catch {}
    window.removeEventListener('resize', resize);
    try { hud.destroy(); } catch {}
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
      loop.setMouth(pos, open);
      // anti-cheat mouth trigger
      const t = performance.now();
      const firedAt = mouthTrigger(t, open);
      if (firedAt) loop.registerMouthTrigger(firedAt);
      // update debuff badges (lazy import once)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _win1 = window as any;
      if (!_win1.__penalty) {
        import('../../core/game/penalty').then(m => { _win1.__penalty = m.Penalty; hud.setDebuffs(m.Penalty.active); }).catch(()=>{});
      } else {
        hud.setDebuffs(_win1.__penalty.active);
      }
      // apply drunk filter to camera video when dizzy
      const _win2 = window as any;
      const hasPenalty = _win2.__penalty?.has?.bind(_win2.__penalty);
      if (hasPenalty && _win2.__penalty.has('DIZZY')) {
        video.style.filter = 'blur(1.1px) saturate(0.7) hue-rotate(8deg) contrast(1.05)';
      } else {
        video.style.filter = '';
      }

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
