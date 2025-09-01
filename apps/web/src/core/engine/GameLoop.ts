import type { GameState, SpawnedItem, MouthEllipse, ItemSprites } from "../../utils/types";
import type { Vec2 } from "../../utils/types";
import { collidesMouth, pointInRotEllipse } from "./Collision";
import { Spawner } from "./Spawner";
import { Score, Timer60s } from "./Score";
import { nowSec } from "../../utils/math";
import { Sfx } from "./Audio";

export interface GameHUD {
  onScoreUpdate(score: number): void;
  onTimeUpdate(secondsLeft: number): void;
  onStateChange(state: GameState): void;
  onPopup?(x: number, y: number, delta: number): void;
}

export class GameLoop {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: GameState = 'idle';
  private items: SpawnedItem[] = [];
  private spawner: Spawner;
  private score = new Score();
  private timer = new Timer60s(60);
  private hud: GameHUD;
  private sfx = new Sfx();

  private lastT = 0;
  private req = 0;
  private mouthPos: Vec2 = { x: 0, y: 0 };
  private mouthOpen = false;
  private mouthEllipse: MouthEllipse = { cx: 0, cy: 0, rx: 10, ry: 6, rot: 0 };

  constructor(canvas: HTMLCanvasElement, hud: GameHUD, sprites: ItemSprites) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D not supported');
    this.ctx = ctx;
    this.spawner = new Spawner(canvas.width, canvas.height, sprites);
    this.hud = hud;
  }

  resize(w: number, h: number) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.spawner.resize(w, h);
  }

  setMouth(pos: Vec2, open: boolean) {
    this.mouthPos = pos;
    this.mouthOpen = open;
  }

  setMouthMask(ellipse: MouthEllipse, open: boolean) {
    this.mouthEllipse = ellipse;
    this.mouthOpen = open;
  }

  start() {
    if (this.state !== 'idle') return;
    this.state = 'running';
    this.hud.onStateChange(this.state);
    this.items = [];
    this.score.reset();
    const t = nowSec();
    this.timer.start(t);
    this.lastT = t;
    this.sfx.unlock();
    this.tick(t);
  }

  stop() {
    this.state = 'finished';
    this.hud.onStateChange(this.state);
    cancelAnimationFrame(this.req);
    // Clear items so nothing remains drawn on last frame
    this.items = [];
  }

  getScore(): number { return this.score.value; }

  private tick = (t: number) => {
    const now = nowSec();
    const dt = Math.min(0.05, now - this.lastT);
    this.lastT = now;

    if (this.state === 'running') {
      this.update(dt);
      this.render();
      this.hud.onTimeUpdate(this.timer.timeLeft(now));
      if (this.timer.done(now)) {
        this.stop();
      }
    }
    this.req = requestAnimationFrame(this.tick);
  }

  private update(dt: number) {
    this.spawner.maybeSpawn(dt, this.items);
    const W = this.canvas.width; const H = this.canvas.height;
    for (let i = this.items.length - 1; i >= 0; i--) {
      const o = this.items[i];
      // Defensive guard (TS):
      if (!o) continue;
      // Integrate motion (with sway + spin)
      o.age = (o.age ?? 0) + dt;
      o.baseX = (o.baseX ?? o.pos.x) + o.vel.x * dt;
      const sway = (o.swayAmp ?? 0) * Math.sin(2 * Math.PI * (o.swayFreq ?? 0) * (o.age ?? 0));
      const newX = (o.baseX ?? o.pos.x) + sway;
      const newY = o.pos.y + o.vel.y * dt;
      o.rot = (o.rot ?? 0) + (o.spin ?? 0) * dt;
      const outOfBounds = newY > H + 40 || newX < -40 || newX > W + 40;
      if (outOfBounds) {
        this.items.splice(i, 1);
        continue;
      }
      // Collision decision uses pre-splice local vars
      const hitCircle = collidesMouth(this.mouthPos, { x: newX, y: newY }, 28);
      const hitEllipse = pointInRotEllipse(newX, newY, this.mouthEllipse.cx, this.mouthEllipse.cy, this.mouthEllipse.rx, this.mouthEllipse.ry, this.mouthEllipse.rot);
      const hit = this.mouthOpen && (hitEllipse || hitCircle);
      if (hit) {
        const kind = o.kind;
        this.items.splice(i, 1);
        if (kind === 'good') { this.score.add(1); this.sfx.play('pop'); }
        else { this.score.add(-1); this.sfx.play('buzz'); }
        this.hud.onScoreUpdate(this.score.value);
        // popup effect in canvas coordinates
        this.hud.onPopup?.(newX, newY, kind === 'good' ? 1 : -1);
        continue;
      }
      // Commit motion after checks
      o.pos.x = newX;
      o.pos.y = newY;
    }
  }

  private render() {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);

    // subtle background grid for debug
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = '#fff';
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    ctx.restore();

    // items (draw sprite if available)
    for (const o of this.items) {
      if (o.img) {
        const s = o.size;
        ctx.save();
        ctx.translate(o.pos.x, o.pos.y);
        ctx.rotate(o.rot ?? 0);
        ctx.drawImage(o.img, -s/2, -s/2, s, s);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.fillStyle = o.kind === 'good' ? '#1c8aff' : '#ff8400';
        ctx.arc(o.pos.x, o.pos.y, o.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // mouth debug point
    ctx.beginPath();
    ctx.fillStyle = this.mouthOpen ? '#22c55e' : '#ef4444';
    ctx.arc(this.mouthPos.x, this.mouthPos.y, 3, 0, Math.PI*2);
    ctx.fill();

    // mouth capture ellipse mask (rotated)
    ctx.save();
    ctx.globalAlpha = this.mouthOpen ? 0.18 : 0.10;
    ctx.fillStyle = this.mouthOpen ? '#22c55e' : '#ef4444';
    ctx.beginPath();
    ctx.ellipse(this.mouthEllipse.cx, this.mouthEllipse.cy, this.mouthEllipse.rx, this.mouthEllipse.ry, this.mouthEllipse.rot, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.mouthOpen ? '#22c55e' : '#ef4444';
    ctx.stroke();
    ctx.restore();
  }
}
