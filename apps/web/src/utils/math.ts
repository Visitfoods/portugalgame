import type { Vec2 } from './types'

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const dist = (a: Vec2, b: Vec2) => Math.hypot(a.x - b.x, a.y - b.y);

export const rng = (min: number, max: number) => Math.random() * (max - min) + min;
export const rngInt = (min: number, max: number) => Math.floor(rng(min, max + 1));

export const nowSec = () => performance.now() / 1000;

