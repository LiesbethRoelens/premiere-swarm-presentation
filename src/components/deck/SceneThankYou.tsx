import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Kicker, Logo, Mark } from "./ui";
import { usePrintMode } from "./print";

// Deterministic decoration fields: fixed numbers so server and client markup match.
const MARKS = [
  { x: 110, y: 120, size: 150, rot: -14, op: 0.22, dur: 7.5, delay: 0 },
  { x: 1680, y: 90, size: 120, rot: 18, op: 0.2, dur: 8.5, delay: 0.6 },
  { x: 300, y: 780, size: 96, rot: 8, op: 0.18, dur: 6.5, delay: 1.2 },
  { x: 1560, y: 700, size: 170, rot: -22, op: 0.16, dur: 9, delay: 0.3 },
  { x: 880, y: 60, size: 78, rot: 26, op: 0.24, dur: 7, delay: 1.6 },
  { x: 60, y: 520, size: 64, rot: -8, op: 0.16, dur: 8, delay: 0.9 },
  { x: 1800, y: 420, size: 88, rot: 12, op: 0.18, dur: 7.8, delay: 2 },
  { x: 520, y: 300, size: 54, rot: 30, op: 0.14, dur: 6.8, delay: 0.4 },
  { x: 1320, y: 250, size: 60, rot: -26, op: 0.14, dur: 8.2, delay: 1.1 },
  { x: 1120, y: 860, size: 70, rot: 16, op: 0.16, dur: 7.2, delay: 1.8 },
  { x: 240, y: 420, size: 40, rot: -20, op: 0.12, dur: 6.2, delay: 2.4 },
  { x: 1420, y: 520, size: 44, rot: 22, op: 0.12, dur: 6.6, delay: 0.8 },
] as const;

const SNOW = [
  { x: 180, y: 260, size: 8, op: 0.5, dur: 4.2, delay: 0 },
  { x: 430, y: 140, size: 6, op: 0.4, dur: 3.6, delay: 0.7 },
  { x: 700, y: 220, size: 10, op: 0.45, dur: 5, delay: 1.4 },
  { x: 1010, y: 150, size: 6, op: 0.4, dur: 4.6, delay: 0.3 },
  { x: 1250, y: 120, size: 8, op: 0.5, dur: 3.9, delay: 1.9 },
  { x: 1520, y: 220, size: 6, op: 0.4, dur: 4.4, delay: 0.9 },
  { x: 1760, y: 300, size: 10, op: 0.45, dur: 5.2, delay: 2.3 },
  { x: 90, y: 700, size: 8, op: 0.45, dur: 4.1, delay: 1.2 },
  { x: 640, y: 880, size: 6, op: 0.4, dur: 3.7, delay: 0.5 },
  { x: 1620, y: 880, size: 8, op: 0.45, dur: 4.8, delay: 1.6 },
] as const;

// A Christmas tree drawn in the brand's own dot language, with persona-coloured baubles.
const TREE_ROWS: [number, number[]][] = [
  [96, [110]],
  [120, [88, 110, 132]],
  [144, [66, 88, 110, 132, 154]],
  [168, [44, 66, 88, 110, 132, 154, 176]],
  [192, [22, 44, 66, 88, 110, 132, 154, 176, 198]],
  [216, [110]],
  [236, [110]],
];
const BAUBLES: Record<string, string> = {
  "110,120": "var(--persona-digital)",
  "66,144": "var(--persona-family)",
  "110,144": "var(--persona-skeptic)",
  "132,168": "var(--persona-digital)",
  "44,192": "var(--persona-family)",
  "176,192": "var(--persona-skeptic)",
};

function DotTree() {
  return (
    <svg viewBox="0 0 220 250" className="h-full w-full" role="img" aria-label="Christmas tree drawn in Telefónica dots">
      <path d="M110 20L119 43L142 52L119 61L110 84L101 61L78 52L101 43Z" fill="var(--navy-foreground)" />
      {TREE_ROWS.map(([y, xs]) =>
        xs.map((x) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={y > 200 ? 10 : 8}
            fill={BAUBLES[`${x},${y}`] ?? "var(--navy-foreground)"}
            opacity={y > 200 ? 0.9 : 0.82}
          />
        )),
      )}
    </svg>
  );
}

const AUTHORS = [
  "Guillermo Sánchez Illán",
  "Samuel Santos Hernán",
  "Pablo Armingol Robles",
  "Javier Velázquez Martínez",
  "Liesbeth Roelens",
] as const;

export function SceneThankYou() {
  const print = usePrintMode();
  const reduced = useReducedMotion();
  const still = print || reduced;
  return (
    <div className="slide-content bg-brand flex flex-col items-center justify-center px-24 text-center text-navy-foreground">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 16%, color-mix(in oklab, var(--navy-foreground) 16%, transparent) 0%, transparent 62%)" }}
      />

      <motion.div className="absolute inset-0" initial={still ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        {MARKS.map((m, i) => (
          <span
            key={i}
            className="thankyou-mark pointer-events-none absolute block"
            style={{ left: m.x, top: m.y, width: m.size, height: m.size, opacity: m.op, color: "var(--navy-foreground)", "--rot": `${m.rot}deg`, "--dur": `${m.dur}s`, "--delay": `${m.delay}s` } as CSSProperties}
          >
            <Mark />
          </span>
        ))}
        {SNOW.map((s, i) => (
          <span
            key={`s${i}`}
            className="thankyou-snow pointer-events-none absolute block rounded-full bg-navy-foreground"
            style={{ left: s.x, top: s.y, width: s.size, height: s.size, opacity: s.op, "--op": s.op, "--dur": `${s.dur}s`, "--delay": `${s.delay}s` } as CSSProperties}
          />
        ))}
      </motion.div>

      <div className="thankyou-tree pointer-events-none absolute bottom-[96px] left-[96px] w-[220px]" style={{ opacity: still ? 0.9 : undefined }}>
        <DotTree />
      </div>

      <motion.div className="relative" initial={still ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Kicker className="text-navy-foreground/80">Premiere Swarm · Christmas campaign simulation</Kicker>
        <h1 className="slide-title-lg mt-6">Thank You</h1>
        <p className="slide-body mt-6 text-navy-foreground/85">Feliz Navidad</p>
      </motion.div>

      <motion.div
        className="relative mt-14"
        initial={still ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        <span className="slide-kicker text-navy-foreground/60">Built by</span>
        <div className="mx-auto mt-5 grid max-w-[1360px] grid-cols-6 gap-4">
          {AUTHORS.map((name, i) => (
            <span
              key={name}
              className={`rounded-2xl bg-navy-foreground/12 px-6 py-4 text-center slide-body font-bold ring-1 ring-navy-foreground/25 ${
                i < 3 ? "col-span-2" : "col-span-3"
              }`}
            >
              {name}
            </span>
          ))}
        </div>
      </motion.div>

      <Logo tone="white" />
    </div>
  );
}
