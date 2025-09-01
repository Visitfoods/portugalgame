import { rng, rngInt } from "../../utils/math";
import type { SpawnedItem, ItemKind } from "../../utils/types";

let NEXT_ID = 1;

export class Spawner {
  private w: number;
  private h: number;
  private acc = 0;
  private nextIn = 0.8; // seconds

  constructor(w: number, h: number) {
    this.w = w; this.h = h;
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
      const kind: ItemKind = Math.random() < 0.65 ? 'good' : 'bad';
      const radius = rngInt(16, 28);
      items.push({ id: NEXT_ID++, kind, pos: { x, y }, vel: { x: vx, y: speed }, radius });
    }
  }
}

