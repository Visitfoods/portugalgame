export class HUD {
  private root: HTMLElement;
  private timeEl: HTMLElement;
  private scoreNum: HTMLElement;
  private mouthEl: HTMLElement;
  private fxRoot: HTMLElement;

  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'fixed inset-0 pointer-events-none z-30';
    this.timeEl = document.createElement('div');
    this.mouthEl = document.createElement('div');
    this.mouthEl.className = 'hidden';

    // New timer circle (center/top)
    const tWrap = document.createElement('div');
    tWrap.className = 'absolute left-1/2 -translate-x-1/2 w-[110px] h-[110px] md:w-[130px] md:h-[130px] rounded-full bg-white/95 text-[#0a2960] shadow-[0_12px_28px_rgba(2,20,60,0.25)] flex flex-col items-center justify-center';
    // position near top center, logo clearance + safe area
    (tWrap.style as any).top = 'calc(env(safe-area-inset-top, 0px) + 96px)';
    const tLbl = document.createElement('div');
    tLbl.className = 'text-[12px] md:text-sm font-[800] tracking-[0.12em]';
    tLbl.textContent = 'TEMPO';
    this.timeEl.className = 'text-2xl md:text-3xl font-[800] leading-none mt-1';
    this.timeEl.textContent = '00:00';
    tWrap.append(tLbl, this.timeEl);

    // New score circle (bottom-right)
    const sWrap = document.createElement('div');
    sWrap.className = 'absolute right-3 md:right-4 w-[84px] h-[84px] md:w-[96px] md:h-[96px] rounded-full bg-white text-[#0a2960] shadow-[0_10px_24px_rgba(2,20,60,0.25)] flex flex-col items-center justify-center';
    (sWrap.style as any).bottom = 'calc(env(safe-area-inset-bottom, 0px) + 24px)';
    const sLbl = document.createElement('div');
    sLbl.className = 'text-[9px] md:text-[10px] tracking-[0.22em] font-bold uppercase opacity-90';
    sLbl.textContent = 'PONTOS';
    this.scoreNum = document.createElement('div');
    this.scoreNum.className = 'text-2xl md:text-3xl font-[800] leading-none';
    this.scoreNum.textContent = '0';
    sWrap.append(sLbl, this.scoreNum);

    this.root.append(tWrap, sWrap, this.mouthEl);
    document.body.appendChild(this.root);

    this.fxRoot = document.createElement('div');
    this.fxRoot.className = 'fixed inset-0 pointer-events-none z-30';
    document.body.appendChild(this.fxRoot);
  }

  setTimeLeft(seconds: number) {
    const s = Math.max(0, Math.ceil(seconds));
    const mm = String(Math.floor(s / 60)).padStart(2,'0');
    const ss = String(s % 60).padStart(2,'0');
    this.timeEl.textContent = `${mm}:${ss}`;
  }

  setScore(score: number) {
    const prev = Number(this.scoreNum.textContent || '0');
    this.scoreNum.textContent = String(score);
    if (score !== prev) {
      try { this.scoreNum.classList.remove('ab-pop'); (this.scoreNum as any).offsetWidth; this.scoreNum.classList.add('ab-pop'); } catch {}
    }
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

