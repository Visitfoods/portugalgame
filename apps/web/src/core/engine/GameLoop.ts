import type { GameState, SpawnedItem } from "../../utils/types";
import type { Vec2 } from "../../utils/types";
import { collidesMouth } from "./Collision";
import { Spawner } from "./Spawner";
import { Score, Timer60s } from "./Score";
import { nowSec } from "../../utils/math";
import { Sfx } from "./Audio";

export interface GameHUD {
  onScoreUpdate(score: number): void;
  onTimeUpdate(secondsLeft: number): void;
  onStateChange(state: GameState): void;
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

  constructor(canvas: HTMLCanvasElement, hud: GameHUD) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D not supported');
    this.ctx = ctx;
    this.spawner = new Spawner(canvas.width, canvas.height);
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
      o.pos.x += o.vel.x * dt;
      o.pos.y += o.vel.y * dt;
      // bounds
      if (o.pos.y > H + 40 || o.pos.x < -40 || o.pos.x > W + 40) {
        this.items.splice(i, 1);
        continue;
      }
      if (collidesMouth(this.mouthPos, o.pos, 28) && this.mouthOpen) {
        this.items.splice(i, 1);
        if (o.kind === 'good') { this.score.add(1); this.sfx.play('pop'); }
        else { this.score.add(-1); this.sfx.play('buzz'); }
        this.hud.onScoreUpdate(this.score.value);
      }
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

    // items
    for (const o of this.items) {
      ctx.beginPath();
      ctx.fillStyle = o.kind === 'good' ? '#1c8aff' : '#ff8400';
      ctx.arc(o.pos.x, o.pos.y, o.radius, 0, Math.PI * 2);
      ctx.fill();
      // marker
      ctx.fillStyle = '#0b0f14';
      ctx.font = `${Math.max(12, o.radius)}px Inter, system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(o.kind === 'good' ? '+1' : '-1', o.pos.x, o.pos.y);
    }

    // mouth debug
    ctx.beginPath();
    ctx.fillStyle = this.mouthOpen ? '#22c55e' : '#ef4444';
    ctx.arc(this.mouthPos.x, this.mouthPos.y, 10, 0, Math.PI*2);
    ctx.fill();
  }
}
