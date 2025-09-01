import { Penalty } from './penalty'

let open = false;
let lastTriggerAt = 0; // ms

// Returns timestamp (ms) when trigger fires, or 0 if none
export function mouthTrigger(nowMs: number, isOpen: boolean): number {
  if (!Penalty.canTrigger()) return 0;
  const COOLDOWN = Penalty.cooldownMs(380);
  const DELAY = Penalty.inputDelayMs();

  let firedAt = 0;
  if (isOpen !== open) {
    open = isOpen;
    if (open && (nowMs - lastTriggerAt) > COOLDOWN) {
      firedAt = nowMs + DELAY;
      lastTriggerAt = firedAt; // reserve immediately
    }
  }
  return firedAt;
}

export function resetMouthTrigger() {
  open = false; lastTriggerAt = 0;
}

