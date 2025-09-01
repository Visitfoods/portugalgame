export type Debuff = 'STUN'|'MOUTH_LAG'|'NARROW_WINDOW'|'LONG_COOLDOWN'|'WINDBURST'|'DIZZY'|'CURSE5X'|'INVERT';
type ActiveDebuff = { type: Debuff; until: number };

export const Penalty = {
  strikes: 0,
  lastBadAt: 0,
  history: [] as number[],
  active: [] as ActiveDebuff[],
  timePenaltyUsed: false,
  consecBad: 0,

  addStrike(now: number) {
    this.strikes++;
    this.lastBadAt = now;
    this.history.push(now);
    this.history = this.history.filter(t => now - t <= 10000);

    const in3s = this.history.filter(t => now - t <= 3000).length;
    const in5s = this.history.filter(t => now - t <= 5000).length;
    const in7s = this.history.filter(t => now - t <= 7000).length;
    const in10s = this.history.length;

    if (in3s >= 3 && !this.has('STUN')) this.add('STUN', now + 1000);
    if (in5s >= 4) {
      if (!this.has('LONG_COOLDOWN')) this.add('LONG_COOLDOWN', now + 4000);
      if (!this.has('NARROW_WINDOW')) this.add('NARROW_WINDOW', now + 5000);
    }
    if (in7s >= 5) {
      if (!this.has('WINDBURST')) this.add('WINDBURST', now + 4000);
      if (!this.has('MOUTH_LAG')) this.add('MOUTH_LAG', now + 4000);
    }
    if (in10s > 6 && !this.timePenaltyUsed) {
      this.timePenaltyUsed = true;
      return { timePenalty: 2000 };
    }
    return { timePenalty: 0 };
  },

  onBad(now: number) {
    this.consecBad++;
    const res = this.addStrike(now);
    // 2 erros seguidos => DIZZY 15s
    if (this.consecBad >= 2) this.add('DIZZY', now + 15000);
    return res;
  },

  onGood() { this.consecBad = 0; },

  decay(now: number) {
    if (this.strikes > 0 && now - this.lastBadAt > 3000) {
      this.strikes--; this.lastBadAt = now;
    }
  },

  update(now: number) {
    this.active = this.active.filter(d => d.until > now);
    this.decay(now);
  },

  add(type: Debuff, until: number) {
    const d = this.active.find(x => x.type === type);
    if (d) d.until = Math.max(d.until, until);
    else this.active.push({ type, until });
  },

  has(type: Debuff) { return this.active.some(d => d.type === type); },

  canTrigger(): boolean { return !this.has('STUN'); },
  inputDelayMs(): number { return this.has('MOUTH_LAG') ? 200 : 0; },
  triggerWindowMs(base=350): number { return this.has('NARROW_WINDOW') ? Math.max(150, base - 150) : base; },
  cooldownMs(base=380): number { return this.has('LONG_COOLDOWN') ? base*2 : base; },

  applyToDiff<T extends { drift:number; spawnMs:[number,number]; scale?: number }>(diff: T): T {
    if (this.has('WINDBURST')) {
      diff = { ...diff, drift: diff.drift * 1.8, spawnMs: [diff.spawnMs[0]*0.9, diff.spawnMs[1]*0.9] } as T;
    }
    if (this.has('DIZZY')) {
      const scale = (diff as any).scale ?? 1;
      diff = { ...(diff as any), drift: diff.drift * 2.2, scale: scale * 0.9 } as T;
    }
    return diff;
  }
};
