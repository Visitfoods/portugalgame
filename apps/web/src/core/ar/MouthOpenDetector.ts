import type { Vec2 } from "../../utils/types";
import { dist } from "../../utils/math";

// Indices following MediaPipe FaceMesh landmark indices
// These defaults work well as a starting point; adjust per device after QA.
export const UPPER_LIP = 13;
export const LOWER_LIP = 14;
export const MOUTH_LEFT = 61;
export const MOUTH_RIGHT = 291;

export interface MouthConfig {
  thOn: number;  // threshold to turn ON (mouth opens)
  thOff: number; // threshold to turn OFF (mouth closes)
}

export class MouthOpenDetector {
  private state = false;
  private readonly cfg: MouthConfig;
  private lastChange = 0;
  private debounceMs = 80; // avoid flicker on rapid changes

  constructor(cfg: Partial<MouthConfig> = {}) {
    this.cfg = { thOn: 0.40, thOff: 0.32, ...cfg };
  }

  update(landmarks: Vec2[] | null): boolean {
    if (!landmarks) return (this.state = false);
    const ul = landmarks[UPPER_LIP];
    const ll = landmarks[LOWER_LIP];
    const ml = landmarks[MOUTH_LEFT];
    const mr = landmarks[MOUTH_RIGHT];
    if (!ul || !ll || !ml || !mr) return (this.state = false);
    const open = dist(ul, ll);
    const width = Math.max(dist(ml, mr), 1e-3);
    const mar = open / width;

    const now = performance.now();
    if (this.state) {
      // currently open -> stay open unless below off threshold
      if (mar < this.cfg.thOff && now - this.lastChange > this.debounceMs) {
        this.state = false;
        this.lastChange = now;
      }
    } else {
      if (mar > this.cfg.thOn && now - this.lastChange > this.debounceMs) {
        this.state = true;
        this.lastChange = now;
      }
    }
    return this.state;
  }

  isOpen(): boolean { return this.state; }
}

