import type { Vec2 } from "../../utils/types";
import { dist } from "../../utils/math";

export function collidesMouth(mouth: Vec2, obj: Vec2, mouthRadiusPx = 28): boolean {
  return dist(mouth, obj) <= mouthRadiusPx;
}

export function pointInRotEllipse(x: number, y: number, cx: number, cy: number, rx: number, ry: number, rot: number): boolean {
  if (rx <= 0 || ry <= 0) return false;
  const cos = Math.cos(-rot), sin = Math.sin(-rot);
  const dx = x - cx, dy = y - cy;
  // rotate point into ellipse frame
  const rxp = dx * cos - dy * sin;
  const ryp = dx * sin + dy * cos;
  const nx = rxp / rx;
  const ny = ryp / ry;
  return (nx * nx + ny * ny) <= 1;
}
