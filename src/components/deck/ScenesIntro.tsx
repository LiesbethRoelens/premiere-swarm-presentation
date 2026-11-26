import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import clapper from "@/assets/clapper-cutout.png.asset.json";
import roadA from "@/assets/road-a.jpg.asset.json";
import roadB from "@/assets/road-b.jpg.asset.json";
import { personas } from "./data";
import { Kicker, Logo } from "./ui";
import { usePrintMode } from "./print";

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/* 1 — Opening */
export function SceneOpening() {
  const dots = useMemo(
    () =>
      Array.from({ length: 140 }, (_, i) => ({
        x: Math.round(rand(i) * 1920 * 10) / 10,
        y: Math.round(rand(i + 500) * 1080 * 10) / 10,
        r: Math.round((2 + rand(i + 900) * 5) * 10) / 10,
        c: ["var(--navy-foreground)", "var(--persona-family)", "var(--persona-digital)", "var(--persona-skeptic)"][i % 4],
        dx: Math.round(((rand(i + 7) - 0.5) * 60) * 10) / 10,
        dy: Math.round(((rand(i + 11) - 0.5) * 60) * 10) / 10,
        d: Math.round((4 + rand(i + 3) * 6) * 10) / 10,
      })),
    [],
  );
  return (
    <div className="slide-content bg-brand-hero text-navy-foreground">
      <svg className="absolute inset-0" width={1920} height={1080}>
        {dots.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={d.c}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.55, scale: 1 }}
            transition={{ delay: 0.2 + (i % 40) * 0.02, duration: 0.8 }}
            style={{ ["--dx" as string]: `${d.dx}px`, ["--dy" as string]: `${d.dy}px`, animation: `float-dot ${d.d}s ease-in-out infinite` }}
          />
        ))}
      </svg>
      <div className="relative flex h-full items-center gap-24 px-40">
        <motion.div
          initial={{ rotate: -25, y: -80, opacity: 0 }}
          animate={{ rotate: [-25, 6, -3, 0], y: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="shrink-0 drop-shadow-2xl"
        >
          <img src={clapper.url} alt="And... Reaction! clapperboard" className="h-[560px] w-[560px] object-contain" />
        </motion.div>
        <div className="max-w-[1000px]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <Kicker className="text-navy-foreground/80">Equinox · Hackathon 2026</Kicker>
          </motion.div>
          <motion.h1
            className="slide-title-lg mt-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            Premiere <span className="text-navy">Swarm</span>
          </motion.h1>
          <motion.p
            className="slide-subtitle mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            Rehearse your campaign before the world sees it.
          </motion.p>
          <motion.p
            className="slide-body mt-8 text-navy-foreground/85"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            What if we could simulate real-world campaign reactions using AI-powered multi-agent
            societies before spending millions on launch?
          </motion.p>
        </div>
      </div>
      <Logo tone="white" />
    </div>
  );
}

/* 2 — Two campaigns */
const roads = [
  {
    id: "A",
    label: "Road A · Emotion",
    title: "“A network that brings us together”",
    copy: "Warm & nostalgic",
    img: roadA.url,
    color: "bg-campaign-a",
  },
  {
    id: "B",
    label: "Road B · Entertainment",
    title: "“Christmas for everyone”",
    copy: "Funny & shareable",
    img: roadB.url,
    color: "bg-campaign-b",
  },
];
export function SceneCampaigns() {
  const print = usePrintMode();
  return (
    <div className="slide-content bg-background px-28 pt-24 text-foreground">
      <Kicker>Christmas 2026 · Movistar</Kicker>
      <h2 className="slide-title mt-4">
        Two campaigns, <span className="text-brand">one question</span>
      </h2>
      <div className="relative mt-12 grid grid-cols-2 gap-40">
        {roads.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: i === 0 ? -80 : 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.2, duration: 0.6 }}
            className="overflow-hidden rounded-[32px] bg-card shadow-xl ring-1 ring-border"
          >
            <div className="relative h-[400px]">
              <img src={r.img} alt={r.label} className="h-full w-full object-cover" />
              <span className={`slide-chrome absolute left-6 top-6 rounded-full ${r.color} px-5 py-2 font-bold text-navy`}>
                {r.label}
              </span>
            </div>
            <div className="p-10">
              <div className="slide-body-lg font-bold">{r.title}</div>
              <p className="slide-caption mt-3 text-muted-foreground">{r.copy}</p>
            </div>
          </motion.div>
        ))}
        <motion.div
          aria-hidden="true"
          className="absolute left-1/2 top-[200px] flex h-[140px] w-[140px] -translate-x-1/2 items-center justify-center rounded-full bg-brand text-[96px] font-extrabold text-primary-foreground shadow-2xl"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          ?
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: print ? 0 : 1.1, duration: 0.7 }}
        className="slide-body-lg mt-12 text-center font-semibold"
      >
        Which one generates the most <span className="text-brand">interest, conversation</span> and{" "}
        <span className="text-brand">recommendations</span>?
      </motion.p>
      <Logo tone="blue" />
    </div>
  );
}

/* 3 — Audience */
export function SceneAudience() {
  const print = usePrintMode();
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const nodes = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const col = i % 12;
        const row = Math.floor(i / 12);
        return {
          x: Math.round((60 + col * 144 + (rand(i + 40) - 0.5) * 64) * 10) / 10,
          y: Math.round((42 + row * 70 + (rand(i + 80) - 0.5) * 46) * 10) / 10,
          c: personas[i % 3]!.color,
        };
      }),
    [],
  );
  const links = useMemo(() => {
    const l: [number, number][] = [];
    for (let i = 0; i < 36; i++) {
      const col = i % 12;
      const row = Math.floor(i / 12);
      // every row is a continuous chain, so no dot is ever isolated
      if (col < 11) l.push([i, i + 1]);
      if (row < 2) {
        const down = i + 12;
        if (col % 3 === 0 || rand(i + 300) > 0.3) l.push([i, down]);
        if (col < 11 && rand(i + 400) > 0.4) l.push([i, down + 1]);
        if (col > 0 && rand(i + 500) > 0.55) l.push([i, down - 1]);
      }
      if (col < 10 && rand(i + 600) > 0.75) l.push([i, i + 2]);
    }
    return l;
  }, []);
  return (
    <div className="slide-content bg-background px-28 pt-20 text-foreground">
      <div className="flex items-end justify-between">
        <div>
          <Kicker>Synthetic audience</Kicker>
          <h2 className="slide-title mt-4">The audience</h2>
        </div>
        <p className="slide-body max-w-[720px] text-right text-muted-foreground">
          Thousands of agents with <b className="text-foreground">personality, memory and relationships</b>. Click a card to look inside.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-3 gap-12">
        {personas.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i }}
            onClick={() => setFlipped((f) => ({ ...f, [p.id]: !f[p.id] }))}
            className="relative h-[520px] text-left [perspective:2000px]"
          >
            <motion.div
              className="relative h-full w-full [transform-style:preserve-3d]"
              animate={{ rotateY: flipped[p.id] ? 180 : 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[32px] bg-card shadow-xl ring-1 ring-border [backface-visibility:hidden]">
                <img src={p.img} alt={p.name} className="min-h-0 w-full flex-1 object-cover" />
                <div className="px-9 pb-7 pt-5">
                  <div className="slide-subtitle !text-[42px] font-extrabold leading-none">{p.person}</div>
                  <div className="mt-2 text-[26px] font-bold leading-none" style={{ color: p.color }}>
                    {p.name}
                  </div>
                  {print && (
                    <ul className="slide-body mt-4 space-y-1">
                      {p.traits.map((t) => (
                        <li key={t}>· {t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {!print && <div
                className="absolute inset-0 flex flex-col justify-center rounded-[32px] bg-navy p-12 text-navy-foreground shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]"
              >
                <div className="mb-8">
                  <div className="slide-subtitle !text-[38px] font-extrabold leading-none">{p.person}</div>
                  <div className="mt-2 text-[24px] font-bold leading-none" style={{ color: p.color }}>
                    {p.name}
                  </div>
                </div>
                <ul className="slide-body-lg space-y-8">
                  {p.traits.map((t) => (
                    <li key={t} className="flex items-start gap-5">
                      <span className="mt-4 h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: p.color }} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>}
            </motion.div>
          </motion.button>
        ))}
      </div>
      <svg className="absolute bottom-4 left-28" width={1680} height={220}>
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a]!.x} y1={nodes[a]!.y} x2={nodes[b]!.x} y2={nodes[b]!.y} stroke="var(--brand)" strokeOpacity={0.35} strokeWidth={2} className="link-flow" />
        ))}
        {nodes.map((n, i) => (
          <motion.circle key={i} cx={n.x} cy={n.y} r={9} fill={n.c} animate={{ r: [8, 11, 8] }} transition={{ repeat: Infinity, duration: 2 + (i % 5) * 0.4 }} />
        ))}
      </svg>
      <Logo tone="blue" />
    </div>
  );
}
