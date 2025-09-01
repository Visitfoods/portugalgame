import { rng, rngInt } from "../../utils/math";
import type { SpawnedItem, ItemKind, ItemSprites } from "../../utils/types";
import type { Diff } from "../game/difficulty";

let NEXT_ID = 1;

export class Spawner {
  private w: number;
  private h: number;
  private acc = 0;
  private nextIn = 0.8; // seconds
  private sprites: ItemSprites;
  private lastSpawn = 0; // ms timeline
  private nextSpawn = 800; // ms

  constructor(w: number, h: number, sprites: ItemSprites) {
    this.w = w; this.h = h; this.sprites = sprites;
    this.scheduleNext();
  }

  resize(w: number, h: number) { this.w = w; this.h = h; }

  private scheduleNext() {
    this.nextIn = rng(0.6, 1.1);
    this.acc = 0;
  }

  tick(nowMs: number, dt: number, items: SpawnedItem[], diff: Diff) {
    // limit simultaneous
    if (items.length >= diff.maxSimul) return;
    if (nowMs - this.lastSpawn < this.nextSpawn) return;
    this.lastSpawn = nowMs;
    // schedule next spawn
    this.nextSpawn = rng(diff.spawnMs[0], diff.spawnMs[1]);

    // choose kind
    const hasBad = this.sprites.bad.length > 0;
    const kind: ItemKind = (Math.random() < diff.fakeRatio && hasBad) ? 'bad' : 'good';

    // side/top spawn
    const sideSpawn = diff.sideSpawns && Math.random() < 0.25;
    const fromSide = sideSpawn ? (Math.random() < 0.5 ? 'left' : 'right') : 'top';

    const pool = kind === 'good' ? this.sprites.good : this.sprites.bad;
    const img = pool.length ? pool[rngInt(0, pool.length - 1)] : undefined;
    const baseSize = rngInt(96, 180) * (kind === 'good' ? diff.scale : diff.scale * 1.1);
    const size = Math.max(64, Math.min(220, Math.floor(baseSize)));
    const radius = Math.floor(size * 0.42);

    let x = rng(32, this.w - 32);
    let y = -40;
    let vx = rng(-40, 40);
    let vy = rng(diff.vy[0], diff.vy[1]);
    if (fromSide === 'left') { x = -40; y = rng(80, this.h * 0.7); vx = rng(60, 120); vy = rng(10, 60); }
    if (fromSide === 'right') { x = this.w + 40; y = rng(80, this.h * 0.7); vx = -rng(60, 120); vy = rng(10, 60); }

    // Avoid overcrowding: keep min distance from existing
    const minDist = 64;
    for (let tries = 0; tries < 6; tries++) {
      const ok = items.every(it => Math.hypot((it.pos.x - x), (it.pos.y - y)) > minDist);
      if (ok) break;
      x = rng(32, this.w - 32);
      y = fromSide === 'top' ? -40 : rng(80, this.h * 0.7);
    }

    items.push({
      id: NEXT_ID++, kind,
      pos: { x, y }, vel: { x: vx, y: vy },
      radius, size, img,
      baseX: x,
      age: 0,
      swayAmp: diff.drift,
      swayFreq: rng(0.5, 1.5),
      rot: rng(0, Math.PI * 2),
      spin: rng(-1.0, 1.0)
    });
  }
}
