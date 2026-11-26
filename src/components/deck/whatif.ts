import { results, type Scores } from "./data";

export type WhatIf = {
  warmth: boolean; // add a family-warmth closing moment
  priceClarity: boolean; // add a clear family-plan offer
  humour: number; // 0-100, original creative = 70
  channel: "social" | "tv";
};

export const baseWhatIf: WhatIf = { warmth: false, priceClarity: false, humour: 70, channel: "social" };

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Illustrative re-simulation of Road B with creative tweaks. */
export function simulateWhatIf(w: WhatIf): Scores {
  const b = results.B;
  const h = (w.humour - 70) / 30; // -2.3 .. 1
  const s = { ...b };
  s.amplification += h * 6 + (w.channel === "social" ? 0 : -9);
  s.viewing += w.channel === "tv" ? 4 : 0;
  s.risk += h > 0 ? h * 9 : h * 2;
  s.sentiment += h * -2;
  if (w.warmth) {
    s.sentiment += 12;
    s.recommendation += 4;
    s.amplification -= 2;
  }
  if (w.priceClarity) {
    s.clarity += 6;
    s.recommendation += 5;
    s.risk -= 5;
  }
  return Object.fromEntries(Object.entries(s).map(([k, v]) => [k, clamp(v)])) as Scores;
}
