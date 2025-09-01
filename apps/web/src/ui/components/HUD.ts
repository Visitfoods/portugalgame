export class HUD {
  private root: HTMLElement;
  private timeEl: HTMLElement;
  private scoreEl: HTMLElement;
  private mouthEl: HTMLElement;

  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'fixed top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-none';
    this.timeEl = document.createElement('div');
    this.scoreEl = document.createElement('div');
    this.mouthEl = document.createElement('div');
    this.timeEl.className = 'text-sm md:text-base bg-black/40 rounded px-3 py-2';
    this.scoreEl.className = 'text-sm md:text-base bg-black/40 rounded px-3 py-2';
    this.mouthEl.className = 'text-xs md:text-sm bg-black/40 rounded px-3 py-2';
    this.root.append(this.timeEl, this.mouthEl, this.scoreEl);
    document.body.appendChild(this.root);
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

  destroy() { this.root.remove(); }
}

