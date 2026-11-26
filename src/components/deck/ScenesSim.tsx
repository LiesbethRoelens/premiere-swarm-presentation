import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mirofish from "@/assets/mirofish.jpg.asset.json";
import { chats, personas, type CampaignId, type Chat } from "./data";
import { Kicker, Logo } from "./ui";
import { usePrintMode } from "./print";

const colorOf = (id: string) => personas.find((p) => p.id === id)!.color;
const nameOf = (id: string) => personas.find((p) => p.id === id)!.name.replace("The ", "");

function Fish({ color, i, running }: { color: string; i: number; running: boolean }) {
  const path = useMemo(() => {
    const r = (k: number) => {
      const x = Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    const r1 = (n: number) => Math.round(n * 10) / 10;
    return {
      // polar points inside the water, well within the bowl's rim
      x: [0, 1, 2, 3, 0].map((k) => r1(350 + Math.cos(r(k) * 6.283) * Math.sqrt(r(k + 20)) * 220)),
      y: [0, 1, 2, 3, 0].map((k) => r1(400 + Math.sin(r(k) * 6.283) * Math.sqrt(r(k + 20)) * 170)),
      d: 9 + r(30) * 8,
    };
  }, [i]);
  return (
    <motion.g
      initial={{ x: (path.x[0] ?? 0), y: (path.y[0] ?? 0) }}
      animate={running ? { x: path.x, y: path.y } : { x: 350 + ((path.x[0] ?? 350) - 350) * 0.7, y: 560 + (i % 6) * 6 }}
      transition={running ? { duration: path.d, repeat: Infinity, ease: "easeInOut" } : { duration: 1 }}
    >
      <ellipse rx={22} ry={11} fill={color} />
      <path d="M18 0 L34 -11 L34 11 Z" fill={color} />
      <circle cx={-10} cy={-3} r={2.5} fill="var(--navy)" />
    </motion.g>
  );
}

/* 4 — Launch experiment */
export function SceneMiroFish() {
  const [campaign, setCampaign] = useState<CampaignId>("B");
  const print = usePrintMode();
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(print ? 15 : 0);
  const [feed, setFeed] = useState<Chat[]>(print ? chats.B.slice(0, 4).reverse() : []);

  useEffect(() => {
    if (print) return;
    setFeed([]);
    setRound(0);
  }, [campaign, print]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setRound((r) => Math.min(r + 1, 15));
    }, 1500);
    return () => clearInterval(t);
  }, [running, campaign]);

  useEffect(() => {
    if (round === 0 || print) return;
    if (round >= 15) setRunning(false);
    const list = chats[campaign];
    const c = list[(round - 1) % list.length]!;
    setFeed((f) => [c, ...f.filter((x) => x !== c)].slice(0, 4));
  }, [round, campaign]);


  const toggle = () => {
    if (round >= 15) {
      setRound(0);
      setFeed([]);
      setRunning(true);
      return;
    }
    setRunning((r) => !r);
  };

  const k = round / 15;
  const stats =
    campaign === "A"
      ? { conv: Math.round(k * 3120), shares: Math.round(k * 1480), sent: Math.round(k * 80) }
      : { conv: Math.round(k * 5480), shares: Math.round(k * 4210), sent: Math.round(k * 72) };

  return (
    <div className="slide-content bg-brand-deep px-28 pt-20 text-navy-foreground">
      <div className="flex items-start justify-between">
        <div>
          <Kicker className="text-navy-foreground/85">Step 1 · Simulate</Kicker>
          <h2 className="slide-title mt-4">Launch experiment</h2>
        </div>
        <div className="flex items-center gap-6">
          <span className="slide-caption text-navy-foreground/70">Powered by</span>
          <img src={mirofish.url} alt="MiroFish" className="h-[90px] rounded-2xl bg-background px-4 py-2" />
        </div>
      </div>

      <div className="mt-10 flex gap-16">
        <div className="relative">
          <button
            onClick={toggle}
            className="relative block h-[700px] w-[700px] rounded-full border-[6px] border-navy-foreground/45 bg-navy-foreground/10 shadow-[0_0_140px_-30px_oklch(1_0_1/60%)]"
            aria-label="Start simulation"
          >
            <svg width={700} height={700} className="absolute inset-[-6px]">
              <defs>
                <clipPath id="bowl-clip"><circle cx={350} cy={350} r={340} /></clipPath>
                <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-tint)" stopOpacity={0.92} />
                  <stop offset="55%" stopColor="var(--brand-glow)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="var(--brand-glow)" stopOpacity={0.95} />
                </linearGradient>
              </defs>
              <g clipPath="url(#bowl-clip)">
                <motion.path
                  fill="url(#water)"
                  animate={{ d: [
                    "M0 175 Q 175 155 350 175 T 700 175 V 700 H 0 Z",
                    "M0 175 Q 175 195 350 175 T 700 175 V 700 H 0 Z",
                    "M0 175 Q 175 155 350 175 T 700 175 V 700 H 0 Z",
                  ] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <ellipse cx={350} cy={690} rx={330} ry={80} fill="var(--navy)" opacity={0.35} />
                {Array.from({ length: 10 }, (_, b) => (
                  <motion.circle
                    key={b}
                    cx={180 + b * 37}
                    r={4 + (b % 3) * 2}
                    fill="none"
                    stroke="var(--navy-foreground)"
                    strokeOpacity={0.5}
                    initial={{ cy: 640 }}
                    animate={{ cy: [640, 190], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 5 + (b % 4), repeat: Infinity, delay: b * 0.7, ease: "easeIn" }}
                  />
                ))}
              </g>
              <g clipPath="url(#bowl-clip)">
                {Array.from({ length: 24 }, (_, i) => (
                  <Fish key={i} i={i} color={personas[i % 3]!.color} running={running || print} />
                ))}
              </g>
            </svg>
            {!running && round === 0 && (
              <span className="slide-body-lg absolute inset-0 flex items-center justify-center font-bold">
                <span className="flex h-[140px] w-[140px] items-center justify-center rounded-full bg-navy-foreground pl-3 text-[64px] text-navy shadow-[0_0_70px_oklch(1_0_1/55%)]">▶</span>
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex gap-3">
            {(["A", "B"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCampaign(c)}
                className={`slide-chrome rounded-full px-7 py-3 font-bold ring-2 transition ${
                  campaign === c
                    ? "bg-navy-foreground text-navy ring-navy-foreground/70"
                    : "bg-navy-foreground/12 text-navy-foreground/85 ring-navy-foreground/25 hover:bg-navy-foreground hover:text-navy hover:ring-navy-foreground/70"
                }`}
              >
                Campaign {c} · {c === "A" ? "Emotion" : "Entertainment"}
              </button>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-4 gap-5">
            {[
              ["Round", `${String(round).padStart(2, "0")}/15`],
              ["Conversations", stats.conv.toLocaleString("en")],
              ["Shares", stats.shares.toLocaleString("en")],
              ["Positive", `${stats.sent}%`],
            ].map(([l, v]) => (
              <div key={l} className="rounded-3xl bg-navy-foreground/12 p-6 ring-1 ring-navy-foreground/25">
                <div className="slide-chrome text-navy-foreground/60">{l}</div>
                <div className="slide-subtitle mt-2 font-extrabold tabular-nums">{v}</div>
              </div>
            ))}
          </div>
          <div className="slide-kicker mt-10 text-navy-foreground/85">Live agent conversations</div>
          <div className="mt-5 flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {feed.map((c) => (
                <motion.div
                  key={`${campaign}-${c.agent}-${c.text}`}
                  layout
                  initial={{ opacity: 0, x: 60, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-3xl bg-background p-5 text-foreground"
                  style={{ borderLeft: `10px solid ${colorOf(c.persona)}` }}
                >
                  <div className="slide-chrome font-bold" style={{ color: colorOf(c.persona) }}>
                    {nameOf(c.persona)} · Agent #{c.agent}
                  </div>
                  <div className="slide-caption mt-1">“{c.text}”</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Logo tone="white" />
    </div>
  );
}
