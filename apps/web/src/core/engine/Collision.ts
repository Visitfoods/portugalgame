import type { Vec2 } from "../../utils/types";
import { dist } from "../../utils/math";

export function collidesMouth(mouth: Vec2, obj: Vec2, mouthRadiusPx = 28): boolean {
  return dist(mouth, obj) <= mouthRadiusPx;
}

export function pointInEllipse(x: number, y: number, cx: number, cy: number, rx: number, ry: number): boolean {
  if (rx <= 0 || ry <= 0) return false;
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  return (dx * dx + dy * dy) <= 1;
}
