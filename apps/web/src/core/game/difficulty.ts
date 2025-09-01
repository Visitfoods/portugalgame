export type Diff = {
  spawnMs: [number, number];
  vy: [number, number];
  fakeRatio: number;
  scale: number;       // multiplicador de tamanho dos bons
  maxSimul: number;
  drift: number;       // amplitude px de oscilação lateral
  sideSpawns: boolean; // permitir spawns laterais
};

export const DIFF_STAGES: { t: number; v: Diff }[] = [
  { t: 0,  v: { spawnMs: [900, 700], vy: [220, 280], fakeRatio: 0.20, scale: 1.0, maxSimul: 3, drift: 0,  sideSpawns: false } },
  { t: 20, v: { spawnMs: [750, 550], vy: [260, 340], fakeRatio: 0.35, scale: 0.9, maxSimul: 4, drift: 10, sideSpawns: false } },
  { t: 40, v: { spawnMs: [600, 400], vy: [320, 420], fakeRatio: 0.50, scale: 0.8, maxSimul: 5, drift: 20, sideSpawns: true } },
];

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const easeInQuad = (p: number) => p * p;

export function getDiffAt(tSec: number, bias = 0): Diff {
  // bias ∈ [-0.2, +0.2] (negativo=mais fácil; positivo=mais difícil)
  const stages = DIFF_STAGES;
  const nextIdx = stages.findIndex(s => s.t > tSec);
  const ai = nextIdx === -1 ? stages.length - 1 : Math.max(0, nextIdx - 1);
  const a = stages[ai]!;
  const b = stages[ai + 1] ?? a;
  const span = (b!.t - a!.t) || 1;
  const p = clamp((tSec - a!.t) / span, 0, 1);
  const e = easeInQuad(p);

  const S = (ka: Diff, kb: Diff): Diff => ({
    spawnMs: [
      lerp(ka.spawnMs[0], kb.spawnMs[0], e),
      lerp(ka.spawnMs[1], kb.spawnMs[1], e)
    ].map(v => v * (1 - 0.5 * bias)) as [number, number],
    vy: [
      lerp(ka.vy[0], kb.vy[0], e) * (1 + 0.35 * bias),
      lerp(ka.vy[1], kb.vy[1], e) * (1 + 0.35 * bias)
    ] as [number, number],
    fakeRatio: clamp(lerp(ka.fakeRatio, kb.fakeRatio, e) + 0.2 * bias, 0, 0.8),
    scale: lerp(ka.scale, kb.scale, e) * (1 - 0.1 * bias),
    maxSimul: Math.round(lerp(ka.maxSimul, kb.maxSimul, e) + 0.8 * bias),
    drift: lerp(ka.drift, kb.drift, e) * (1 + 0.5 * bias),
    sideSpawns: kb.sideSpawns || ka.sideSpawns
  });
  return S(a!.v, b!.v);
}
