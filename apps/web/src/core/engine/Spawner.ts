import { rng, rngInt } from "../../utils/math";
import type { SpawnedItem, ItemKind, ItemSprites } from "../../utils/types";

let NEXT_ID = 1;

export class Spawner {
  private w: number;
  private h: number;
  private acc = 0;
  private nextIn = 0.8; // seconds
  private sprites: ItemSprites;

  constructor(w: number, h: number, sprites: ItemSprites) {
    this.w = w; this.h = h; this.sprites = sprites;
    this.scheduleNext();
  }

  resize(w: number, h: number) { this.w = w; this.h = h; }

  private scheduleNext() {
    this.nextIn = rng(0.8, 1.2);
    this.acc = 0;
  }

  maybeSpawn(dt: number, items: SpawnedItem[]) {
    this.acc += dt;
    if (this.acc >= this.nextIn) {
      this.scheduleNext();
      const x = rng(24, this.w - 24);
      const y = -32; // above top
      const speed = rng(80, 140); // px/s
      const vx = rng(-20, 20);
      // If there are no bad sprites yet, spawn only good
      const hasBad = this.sprites.bad.length > 0;
      const kind: ItemKind = (Math.random() < 0.75 || !hasBad) ? 'good' : 'bad';
      const size = rngInt(48, 72);
      const radius = Math.floor(size * 0.45);
      const pool = kind === 'good' ? this.sprites.good : this.sprites.bad;
      const img = pool.length ? pool[rngInt(0, pool.length - 1)] : undefined;
      items.push({ id: NEXT_ID++, kind, pos: { x, y }, vel: { x: vx, y: speed }, radius, size, img });
    }
  }
}
