export class HUD {
  private root: HTMLElement;
  private timeEl: HTMLElement;
  private scoreWrap: HTMLElement;
  private scoreLabel: HTMLElement;
  private scoreNum: HTMLElement;
  private mouthEl: HTMLElement;
  private fxRoot: HTMLElement;
  private badges: HTMLElement;

  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'fixed inset-x-0 top-0 p-3 pointer-events-none z-30';
    this.timeEl = document.createElement('div');
    this.mouthEl = document.createElement('div');
    this.timeEl.className = 'absolute left-3 top-3 text-xs md:text-sm bg-black/30 rounded px-2 py-1 backdrop-blur-sm';
    this.mouthEl.className = 'absolute right-3 top-3 text-xs md:text-sm bg-black/30 rounded px-2 py-1 hidden md:block';

    // Centered SCORE card
    this.scoreWrap = document.createElement('div');
    this.scoreWrap.className = 'mx-auto mt-3 flex flex-col items-center justify-center rounded-2xl px-4 py-2 bg-white/90 text-[#0a2960] shadow-[0_6px_20px_rgba(0,0,0,0.18)] w-max pointer-events-none';
    this.scoreLabel = document.createElement('div');
    this.scoreLabel.className = 'text-[10px] tracking-[0.2em] font-semibold opacity-80';
    this.scoreLabel.textContent = 'SCORE';
    this.scoreNum = document.createElement('div');
    this.scoreNum.className = 'text-2xl md:text-4xl font-extrabold leading-none';
    this.scoreNum.textContent = '0';
    this.scoreWrap.append(this.scoreLabel, this.scoreNum);

    this.badges = document.createElement('div');
    this.badges.className = 'hidden';

    this.root.append(this.scoreWrap, this.timeEl, this.mouthEl);
    document.body.appendChild(this.root);

    this.fxRoot = document.createElement('div');
    this.fxRoot.className = 'fixed inset-0 pointer-events-none z-30';
    document.body.appendChild(this.fxRoot);
  }

  setTimeLeft(seconds: number) {
    const s = Math.ceil(seconds);
    const mm = String(Math.floor(s / 60)).padStart(2,'0');
    const ss = String(s % 60).padStart(2,'0');
    this.timeEl.textContent = `Tempo ${mm}:${ss}`;
  }

  setScore(score: number) {
    this.scoreNum.textContent = String(score);
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

  setDebuffs(active: { type: string; until: number }[]) {
    // standby: hidden
  }

  destroy() { this.root.remove(); this.fxRoot.remove(); }
}
