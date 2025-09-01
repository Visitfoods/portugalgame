export class Score {
  value = 0;
  add(delta: number) { this.value += delta; }
  reset() { this.value = 0; }
}

export class Timer60s {
  private startAt = 0;
  private duration = 60; // seconds
  constructor(durationSec = 60) { this.duration = durationSec; }
  start(nowSec: number) { this.startAt = nowSec; }
  timeLeft(nowSec: number) { return Math.max(0, this.duration - (nowSec - this.startAt)); }
  done(nowSec: number) { return this.timeLeft(nowSec) <= 0; }
}

