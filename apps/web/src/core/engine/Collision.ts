import type { Vec2 } from "../../utils/types";
import { dist } from "../../utils/math";

export function collidesMouth(mouth: Vec2, obj: Vec2, mouthRadiusPx = 28): boolean {
  return dist(mouth, obj) <= mouthRadiusPx;
}

