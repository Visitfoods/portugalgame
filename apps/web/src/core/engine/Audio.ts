export class Sfx {
  // Global mute state shared across instances
  private static muted = ((): boolean => {
    try { return localStorage.getItem('ab-muted') === '1'; } catch { return false; }
  })();
  static setMuted(v: boolean) { Sfx.muted = v; try { localStorage.setItem('ab-muted', v ? '1' : '0'); } catch {} }
  static isMuted() { return Sfx.muted; }
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
    try { if (localStorage.getItem('ab-muted') === '1') return; } catch {}
    if (Sfx.muted) return;
    const a = name === 'pop' ? this.pop : name === 'buzz' ? this.buzz : this.tick;
    a.currentTime = 0;
    a.play().catch(() => {});
  }
}
