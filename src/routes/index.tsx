import { useCallback, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Stage } from "@/components/deck/Stage";
import { SceneOpening, SceneCampaigns, SceneAudience } from "@/components/deck/ScenesIntro";
import { SceneMiroFish } from "@/components/deck/ScenesSim";
import { SceneResults, SceneSurprise, SceneWhatIf } from "@/components/deck/ScenesOutcome";
import { SceneNetworks } from "@/components/deck/SceneNetworks";
import { SceneThankYou } from "@/components/deck/SceneThankYou";

type SceneProps = { onNext?: () => void; showWinner?: boolean };
type SceneComponent = (props: SceneProps) => ReactElement;

const scenes: { title: string; C: SceneComponent }[] = [
  { title: "Premiere Swarm", C: SceneOpening },
  { title: "Two campaigns, one question", C: SceneCampaigns },
  { title: "The audience", C: SceneAudience },
  { title: "Launch experiment", C: SceneMiroFish },
  { title: "Which campaign wins?", C: SceneResults },
  { title: "It doesn't stop here", C: SceneSurprise },
  { title: "What-if scenario", C: SceneWhatIf },
  { title: "Endless network possibilities", C: SceneNetworks },
  { title: "Thank you", C: SceneThankYou },
];

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { slide?: number } => {
    const n = Number(s["slide"]);
    return Number.isFinite(n) && n >= 1 ? { slide: Math.min(Math.floor(n), scenes.length) } : {};
  },
  head: () => ({
    meta: [
      { title: "Premiere Swarm · Test your campaign in a synthetic world" },
      { name: "description", content: "Interactive demo: simulate how audience personas react to two Christmas campaigns, powered by MiroFish." },
      { property: "og:title", content: "Premiere Swarm · Synthetic audience simulator" },
      { property: "og:description", content: "Test two Christmas campaigns on a synthetic audience before launching them in the real world." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Deck,
});

function Deck() {
  const { slide = 1 } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const index = slide - 1;
  const go = useCallback(
    (i: number) => {
      const n = Math.max(0, Math.min(scenes.length - 1, i));
      navigate({ search: { slide: n + 1 }, replace: true });
    },
    [navigate],
  );

  useEffect(() => {
    const current = scenes[index];
    if (current) document.title = `${index + 1}/${scenes.length} · ${current.title}`;
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(index + 1);
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) go(index - 1);
      else if (e.key === "f") toggleFs();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  const touch = useRef<number | null>(null);
  const Scene = scenes[index]?.C;
  if (!Scene) return null;

  return (
    <div
      className="fixed inset-0 bg-navy"
      onTouchStart={(e) => (touch.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touch.current;
        const end = e.changedTouches[0]?.clientX;
        if (start == null || end == null) return;
        if (end - start < -60) go(index + 1);
        if (end - start > 60) go(index - 1);
      }}
    >
      <Stage>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45 }}
          >
            <Scene onNext={() => go(index + 1)} />
          </motion.div>
        </AnimatePresence>
      </Stage>

      <div className="absolute inset-x-0 top-0 h-1.5 bg-navy-foreground/10">
        <motion.div className="h-full bg-brand" animate={{ width: `${((index + 1) / scenes.length) * 100}%` }} />
      </div>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-navy/80 p-1.5 text-sm text-navy-foreground backdrop-blur">
        <button onClick={() => go(index - 1)} disabled={index === 0} className="h-9 w-9 rounded-full hover:bg-navy-foreground/10 disabled:opacity-30" aria-label="Previous scene">
          ←
        </button>
        <span className="min-w-12 text-center tabular-nums">
          {index + 1} / {scenes.length}
        </span>
        <button onClick={() => go(index + 1)} disabled={index === scenes.length - 1} className="h-9 w-9 rounded-full hover:bg-navy-foreground/10 disabled:opacity-30" aria-label="Next scene">
          →
        </button>
        <button
          onClick={() => window.open("/print", "_blank")}
          className="h-9 rounded-full px-3 hover:bg-navy-foreground/10"
          aria-label="Export as PDF"
        >
          Export PDF
        </button>
        <button onClick={toggleFs} className="h-9 rounded-full px-3 hover:bg-navy-foreground/10" aria-label="Fullscreen">
          ⛶
        </button>
      </div>
    </div>
  );
}

function toggleFs() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen();
}
