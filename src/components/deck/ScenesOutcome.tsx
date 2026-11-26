import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { metrics, personaScores, personas, results } from "./data";
import { baseWhatIf, simulateWhatIf, type WhatIf } from "./whatif";
import { Kicker, Logo } from "./ui";
import { usePrintMode } from "./print";

const axis = { fontSize: 16, fill: "var(--muted-foreground)" };

/* Celebration bits for the winner reveal. Deterministic so server and client markup match. */
const CONFETTI_COLORS = [
  "var(--navy-foreground)",
  "var(--navy)",
  "var(--campaign-b)",
  "var(--persona-family)",
  "var(--persona-digital)",
  "var(--persona-skeptic)",
  "var(--brand-glow)",
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n: number) => Math.round(n * 10) / 10;

const FALLING = (() => {
  const rnd = seeded(20261126);
  return Array.from({ length: 90 }, (_, i) => ({
    id: i,
    x: r1(rnd() * 1920),
    w: r1(9 + rnd() * 11),
    h: r1(14 + rnd() * 16),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: r1(rnd() * 2.6),
    dur: r1(3.1 + rnd() * 2.8),
    drift: r1((rnd() - 0.5) * 340),
    spin: r1((rnd() > 0.5 ? 1 : -1) * (320 + rnd() * 700)),
    round: rnd() > 0.55,
  }));
})();

const BURST = (() => {
  const rnd = seeded(777);
  return Array.from({ length: 30 }, (_, i) => {
    const a = (i / 30) * Math.PI * 2 + rnd() * 0.35;
    const d = r1(280 + rnd() * 460);
    return {
      id: i,
      x: r1(Math.cos(a) * d),
      y: r1(Math.sin(a) * d * 0.7),
      size: r1(12 + rnd() * 14),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: r1(rnd() * 0.4),
    };
  });
})();

const RINGS = [0, 0.5, 1];

/* 5 — Results */
export function SceneResults({ showWinner = false }: { showWinner?: boolean }) {
  const print = usePrintMode();
  const [winner, setWinner] = useState(showWinner);
  const data = metrics.map((m) => ({ name: m.label, A: results.A[m.key], B: results.B[m.key] }));
  return (
    <div className="slide-content bg-background px-28 pt-20 text-foreground">
      <Kicker>Step 2 · Compare</Kicker>
      <Logo tone="blue" />
      <h2 className="slide-title mt-4">Which campaign wins?</h2>
      <div className="mt-10 flex gap-14">
        <div className="h-[640px] flex-1 rounded-[32px] bg-card p-8 shadow-xl ring-1 ring-border">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={6}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={axis} interval={0} />
              <YAxis tick={axis} domain={[0, 100]} />
              <Legend wrapperStyle={{ fontSize: 22 }} />
              <Bar dataKey="A" name="Campaign A · Emotion" fill="var(--campaign-a)" radius={[10, 10, 0, 0]} animationDuration={1400} />
              <Bar dataKey="B" name="Campaign B · Entertainment" fill="var(--campaign-b)" radius={[10, 10, 0, 0]} animationDuration={1400} animationBegin={300} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex w-[520px] flex-col gap-6">
          <div className="slide-kicker text-muted-foreground">Engagement by persona</div>
          {personas.map((p) => (
            <div key={p.id}>
              <div className="slide-caption font-bold" style={{ color: p.color }}>{p.name}</div>
              {(["A", "B"] as const).map((c) => (
                <div key={c} className="mt-2 flex items-center gap-3">
                  <span className="slide-chrome w-6 font-bold">{c}</span>
                  <div className="h-5 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={c === "A" ? "h-full bg-campaign-a" : "h-full bg-campaign-b"}
                      initial={{ width: 0 }}
                      animate={{ width: `${personaScores[c][p.id]}%` }}
                      transition={{ duration: 1.2, delay: 0.4 }}
                    />
                  </div>
                  <span className="slide-chrome w-12 text-right tabular-nums">{personaScores[c][p.id]}</span>
                </div>
              ))}
            </div>
          ))}
          <button onClick={() => setWinner(true)} className="slide-body mt-auto rounded-full bg-brand px-8 py-5 font-bold text-primary-foreground">
            🏁 Reveal the winner
          </button>
        </div>
      </div>
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setWinner(false)}
            className="absolute inset-0 cursor-pointer overflow-hidden bg-brand text-navy-foreground"
          >
            {/* celebration: expanding rings */}
            {RINGS.map((d, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute rounded-full border-2 border-navy-foreground/45"
                style={{ left: 680, top: 260, width: 560, height: 560 }}
                initial={print ? false : { scale: 0.3, opacity: 0 }}
                animate={print ? { scale: 1 + i * 0.4, opacity: 0.22 } : { scale: [0.3, 2.3], opacity: [0.75, 0] }}
                transition={print ? { duration: 0 } : { duration: 2.8, delay: d, repeat: Infinity, ease: "easeOut" }}
              />
            ))}

            {/* celebration: burst out of the centre */}
            {BURST.map((b) => (
              <motion.div
                key={`burst-${b.id}`}
                className="absolute rounded-full"
                style={{ left: 960, top: 500, width: b.size, height: b.size, background: b.color }}
                initial={print ? false : { x: 0, y: 0, opacity: 0, scale: 0.4 }}
                animate={print ? { x: b.x, y: b.y, opacity: 0.9, scale: 1 } : { x: [0, b.x], y: [0, b.y], opacity: [1, 1, 0], scale: [0.4, 1, 0.6] }}
                transition={print ? { duration: 0 } : { duration: 1.9, delay: b.delay, ease: "easeOut" }}
              />
            ))}

            {/* celebration: falling confetti */}
            {FALLING.map((c) => (
              <motion.div
                key={`fall-${c.id}`}
                className="absolute top-0"
                style={{
                  left: c.x,
                  width: c.w,
                  height: c.h,
                  background: c.color,
                  borderRadius: c.round ? 999 : 3,
                }}
                initial={print ? false : { y: -90, x: 0, opacity: 0, rotate: 0 }}
                animate={
                  print
                    ? { y: 240 + (c.id % 9) * 90, x: c.drift / 2, opacity: 0.95, rotate: c.spin / 4 }
                    : { y: [-90, 1180], x: [0, c.drift], opacity: [0, 1, 1, 0], rotate: c.spin }
                }
                transition={
                  print
                    ? { duration: 0 }
                    : { duration: c.dur, delay: c.delay, repeat: Infinity, ease: "linear" }
                }
              />
            ))}

            <div className="relative flex h-full flex-col items-center justify-center text-center">
              <motion.div
                initial={print ? false : { scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={print ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 11, delay: 0.15 }}
                className="mb-10 flex h-[190px] w-[190px] items-center justify-center rounded-full bg-navy-foreground/15 text-[110px] ring-4 ring-navy-foreground/40"
                style={{ boxShadow: "0 0 100px oklch(1 0 1 / 45%)" }}
              >
                🏆
              </motion.div>
              <motion.div
                initial={print ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={print ? { duration: 0 } : { delay: 0.45 }}
                className="slide-kicker text-campaign-b"
              >
                Winner
              </motion.div>
              <motion.div
                initial={print ? false : { opacity: 0, scale: 0.7, letterSpacing: "0.2em" }}
                animate={{ opacity: 1, scale: 1, letterSpacing: "-0.05em" }}
                transition={print ? { duration: 0 } : { delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="slide-title-lg mt-4"
                style={{ textShadow: "0 0 70px oklch(1 0 1 / 40%)" }}
              >
                Campaign B
              </motion.div>
              <motion.div
                initial={print ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={print ? { duration: 0 } : { delay: 0.95 }}
                className="slide-subtitle mt-2 text-campaign-b"
              >
                Entertainment
              </motion.div>
            </div>

            <div className="slide-caption absolute bottom-16 left-0 right-0 text-center text-navy-foreground/55">
              Click to continue
            </div>
            <Logo tone="white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* 6 — Surprise */
export function SceneSurprise({ onNext }: { onNext?: () => void }) {
  return (
    <button
      type="button"
      onClick={onNext}
      className="slide-content bg-brand px-28 text-left text-navy-foreground"
    >
      <div className="flex h-full flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "-0.04em" }}
          transition={{ duration: 1.4 }}
          className="slide-title-lg"
        >
          It doesn't stop here…
        </motion.div>
        <div className="slide-caption mt-12 text-navy-foreground/70">Click to continue</div>
      </div>
      <Logo tone="white" />
    </button>
  );
}

/* 7 — What-if */
export function SceneWhatIf() {
  const print = usePrintMode();
  const start: WhatIf = print ? { ...baseWhatIf, warmth: true, priceClarity: true } : baseWhatIf;
  const [w, setW] = useState<WhatIf>(start);
  const [applied, setApplied] = useState<WhatIf>(start);
  const [runId, setRunId] = useState(0);
  const sim = simulateWhatIf(applied);
  const data = metrics.map((m) => ({ name: m.label, B: results.B[m.key], Bplus: sim[m.key] }));
  const toggle = (k: "warmth" | "priceClarity", label: string, hint: string) => (
    <button
      onClick={() => setW({ ...w, [k]: !w[k] })}
      className={`flex items-center justify-between rounded-3xl p-6 text-left ring-2 transition ${w[k] ? "bg-brand/10 ring-brand" : "bg-card ring-border"}`}
    >
      <div>
        <div className="slide-caption font-bold">{label}</div>
        <div className="slide-chrome mt-1 whitespace-normal text-muted-foreground">{hint}</div>
      </div>
      <span className={`ml-4 flex h-10 w-18 shrink-0 items-center rounded-full p-1 transition ${w[k] ? "justify-end bg-brand" : "justify-start bg-muted"}`}>
        <span className="h-8 w-8 rounded-full bg-background shadow" />
      </span>
    </button>
  );
  return (
    <div className="slide-content bg-background px-28 pt-20 text-foreground">
      <Kicker>Step 3 · What if?</Kicker>
      <Logo tone="blue" />
      <h2 className="slide-title mt-4">
        Can we make Campaign B <span className="text-brand">even better?</span>
      </h2>
      <div className="mt-10 flex gap-14">
        <div className="flex w-[600px] flex-col gap-5">
          {toggle("warmth", "Add a family-warmth ending", "Win back The Family-Oriented")}
          {toggle("priceClarity", "Add a clear family-plan offer", "Give Skeptics a reason to care")}
          <div className="rounded-3xl bg-card p-6 ring-2 ring-border">
            <div className="flex justify-between">
              <span className="slide-caption font-bold">Humour intensity</span>
              <span className="slide-caption tabular-nums text-brand">{w.humour}</span>
            </div>
            <input type="range" min={0} max={100} value={w.humour} onChange={(e) => setW({ ...w, humour: Number(e.target.value) })} className="mt-4 w-full accent-[var(--brand)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["social", "tv"] as const).map((c) => (
              <button key={c} onClick={() => setW({ ...w, channel: c })} className={`slide-caption rounded-3xl p-5 font-bold ring-2 ${w.channel === c ? "bg-brand text-primary-foreground ring-brand" : "bg-card ring-border"}`}>
                {c === "social" ? "Social-first" : "TV-first"}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setApplied(w);
              setRunId((r) => r + 1);
            }}
            className="slide-body mt-2 rounded-full bg-brand py-5 font-bold text-primary-foreground shadow-xl"
          >
            ↻ Re-simulate
          </button>
        </div>
        <div className="h-[700px] flex-1 rounded-[32px] bg-card p-8 shadow-xl ring-1 ring-border">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} key={runId}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={axis} interval={0} />
              <YAxis tick={axis} domain={[0, 100]} />
              <Legend wrapperStyle={{ fontSize: 22 }} />
              <Bar dataKey="B" name="Campaign B (original)" fill="var(--campaign-b)" fillOpacity={0.45} radius={[10, 10, 0, 0]} />
              <Bar dataKey="Bplus" name="Campaign B+ (what-if)" fill="var(--brand)" radius={[10, 10, 0, 0]} animationDuration={1400} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* 8 — Recommendation & close */
export function SceneClose() {
  const best = simulateWhatIf({ warmth: true, priceClarity: true, humour: 70, channel: "social" });
  return (
    <div className="slide-content bg-hero px-28 pt-24 text-navy-foreground">
      <Kicker className="text-brand-glow">Recommendation</Kicker>
      <h2 className="slide-title mt-4">
        Launch <span className="text-brand-glow">Road B+</span>
      </h2>
      <p className="slide-body-lg mt-6 max-w-[1300px] text-navy-foreground/85">
        Keep the humour, add a warm family ending and a clear family-plan offer, and go social-first.
      </p>
      <div className="mt-12 grid grid-cols-3 gap-10">
        {[
          ["Recommendation", best.recommendation, results.B.recommendation],
          ["Positive sentiment", best.sentiment, results.B.sentiment],
          ["Reputational risk", best.risk, results.B.risk],
        ].map(([l, v, o], i) => (
          <motion.div key={l} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.2 }} className="rounded-[32px] bg-navy-foreground/10 p-10">
            <div className="slide-caption text-navy-foreground/70">{l}</div>
            <div className="mt-3 text-[110px] font-extrabold leading-none tabular-nums">{v}</div>
            <div className="slide-caption mt-3 text-brand-glow">
              {Number(v) - Number(o) >= 0 ? "+" : ""}
              {Number(v) - Number(o)} vs. Road B
            </div>
          </motion.div>
        ))}
      </div>
      <motion.blockquote initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="slide-body mt-14 max-w-[1500px] border-l-8 border-brand pl-10 italic text-navy-foreground/90">
        “We're not replacing real market research. We're giving marketing teams a new way to explore creative ideas, discover potential reactions and challenge their assumptions before spending money in the real world.”
      </motion.blockquote>
      <div className="slide-subtitle absolute bottom-16 left-28 font-extrabold">
        Premiere <span className="text-brand-glow">Swarm</span> · Thank you
      </div>
      <Logo tone="white" />
    </div>
  );
}
