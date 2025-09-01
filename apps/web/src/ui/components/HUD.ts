export class HUD {
  private root: HTMLElement;
  private timeEl: HTMLElement;
  private scoreEl: HTMLElement;
  private mouthEl: HTMLElement;
  private fxRoot: HTMLElement;

  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'fixed top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-none z-30';
    this.timeEl = document.createElement('div');
    this.scoreEl = document.createElement('div');
    this.mouthEl = document.createElement('div');
    this.timeEl.className = 'text-sm md:text-base bg-black/40 rounded px-3 py-2 backdrop-blur-sm';
    this.scoreEl.className = 'text-base md:text-2xl font-semibold bg-black/40 rounded px-4 py-2 backdrop-blur-sm';
    this.mouthEl.className = 'text-xs md:text-sm bg-black/30 rounded px-3 py-2 hidden md:block';
    this.root.append(this.timeEl, this.mouthEl, this.scoreEl);
    document.body.appendChild(this.root);

    this.fxRoot = document.createElement('div');
    this.fxRoot.className = 'fixed inset-0 pointer-events-none z-30';
    document.body.appendChild(this.fxRoot);
  }

  setTimeLeft(seconds: number) {
    const s = Math.ceil(seconds);
    const mm = String(Math.floor(s / 60)).padStart(2,'0');
    const ss = String(s % 60).padStart(2,'0');
    this.timeEl.textContent = `Tempo: ${mm}:${ss}`;
  }

  setScore(score: number) {
    this.scoreEl.textContent = `Pontuação: ${score}`;
  }

  setMouth(open: boolean) {
    this.mouthEl.textContent = open ? 'Boca: aberta' : 'Boca: fechada';
  }

  popupCanvasPx(x: number, y: number, delta: number, canvas: HTMLCanvasElement) {
    // Convert canvas px -> CSS px
    const cssScaleX = window.innerWidth / canvas.width;
    const cssScaleY = window.innerHeight / canvas.height;
    const left = x * cssScaleX;
    const top = y * cssScaleY;
    const el = document.createElement('div');
    el.textContent = (delta > 0 ? `+${delta}` : `${delta}`);
    el.className = `absolute select-none font-bold ${delta>0 ? 'text-green-400' : 'text-red-400'}`;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    el.style.transform = 'translate(-50%, -50%) translateY(0)';
    el.style.transition = 'transform 700ms ease-out, opacity 700ms ease-out';
    el.style.opacity = '1';
    this.fxRoot.appendChild(el);
    // trigger
    requestAnimationFrame(() => {
      el.style.transform = 'translate(-50%, -50%) translateY(-40px)';
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 800);
  }

  destroy() { this.root.remove(); this.fxRoot.remove(); }
}
