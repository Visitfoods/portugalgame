export class Sfx {
  private pop = new Audio();
  private buzz = new Audio();
  private tick = new Audio();
  private unlocked = false;

  constructor() {
    // Minimal inline beeps using WebAudio would be better, but keep simple for MVP
    this.pop.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQgAAAAA"; // tiny silent
    this.buzz.src = this.pop.src;
    this.tick.src = this.pop.src;
  }

  unlock() {
    if (this.unlocked) return;
    const unlockOne = (a: HTMLAudioElement) => a.play().then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
    unlockOne(this.pop); unlockOne(this.buzz); unlockOne(this.tick);
    this.unlocked = true;
  }

  play(name: 'pop' | 'buzz' | 'tick') {
    const a = name === 'pop' ? this.pop : name === 'buzz' ? this.buzz : this.tick;
    a.currentTime = 0;
    a.play().catch(() => {});
  }
}

