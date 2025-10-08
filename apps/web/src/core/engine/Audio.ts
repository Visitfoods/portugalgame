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

export class BackgroundMusic {
  private static audio: HTMLAudioElement | null = null;
  private static initialized = false;

  static init(): void {
    if (BackgroundMusic.initialized) return;
    BackgroundMusic.initialized = true;
    const a = new Audio('/music/saboresdeportugal-game_Music.mp3');
    a.loop = true;
    a.preload = 'auto';
    a.volume = 0.5;
    BackgroundMusic.audio = a;

    // Definir mute por defeito na primeira visita (evita bloqueios de autoplay)
    try { if (localStorage.getItem('ab-muted') == null) localStorage.setItem('ab-muted', '1'); } catch {}

    // Desbloquear em iOS no primeiro gesto do utilizador e iniciar se não estiver muted
    const unlock = () => {
      const muted = (localStorage.getItem('ab-muted') === '1');
      a.play().then(() => { if (muted) { a.pause(); a.currentTime = 0; } }).catch(() => {});
    };
    try {
      window.addEventListener('pointerdown', unlock, { once: true } as any);
      window.addEventListener('click', unlock as any, { once: true } as any);
      window.addEventListener('touchstart', unlock as any, { once: true, passive: true } as any);
    } catch {}

    BackgroundMusic.syncFromStorage();
  }

  static setMuted(muted: boolean): void {
    const a = BackgroundMusic.audio;
    if (!a) return;
    if (muted) {
      try { a.pause(); } catch {}
    } else {
      a.play().catch(() => {});
    }
  }

  static syncFromStorage(): void {
    try {
      const muted = (localStorage.getItem('ab-muted') === '1');
      BackgroundMusic.setMuted(muted);
    } catch {
      BackgroundMusic.setMuted(false);
    }
  }
}