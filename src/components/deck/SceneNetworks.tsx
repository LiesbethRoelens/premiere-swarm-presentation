import { motion, useReducedMotion } from "framer-motion";
import { Leaf, ShieldCheck, TrendingUp } from "lucide-react";
import { Kicker, Logo } from "./ui";
import { usePrintMode } from "./print";

const themes = [
  { title: "Green Networking", Icon: Leaf },
  { title: "Network Resilience", Icon: ShieldCheck },
  { title: "Future Traffic Scenarios", Icon: TrendingUp },
] as const;

function CoordinatingAgents() {
  const agents = [
    { x: 155, y: 80, name: "Energy agent", action: "Propose shutdown", color: "var(--persona-digital)" },
    { x: 645, y: 80, name: "Traffic agent", action: "Redistribute load", color: "var(--brand)" },
    { x: 155, y: 425, name: "QoS agent", action: "Check service limits", color: "var(--persona-family)" },
    { x: 645, y: 425, name: "Coordinator", action: "Evaluate trade-offs", color: "var(--brand)" },
  ];
  return (
    <svg viewBox="0 0 800 510" className="h-full w-full" role="img" aria-label="Research concept: energy, traffic and QoS agents exchange proposals with a coordinator around a shared network model">
      <path d="M155 80H645V425H155Z" fill="none" stroke="var(--border)" strokeWidth="3" />
      <path className="network-agent-flow" d="M155 80H645V425H155Z" fill="none" stroke="var(--brand-glow)" strokeWidth="3" />
      {agents.map(({ x, y, name }) => <path key={name} d={`M${x} ${y}L400 252`} fill="none" stroke="var(--brand)" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="6 9" />)}
      <rect x="265" y="157" width="270" height="186" rx="24" fill="var(--navy)" />
      <g stroke="var(--brand-glow)" strokeWidth="2.5" fill="var(--navy)">
        <path d="M322 215L373 185L435 210L477 187 M322 215L360 252L435 210L477 252 M373 185L360 252L477 252" fill="none" />
        {[[322,215],[373,185],[435,210],[477,187],[360,252],[477,252]].map(([x,y], i) => <circle key={i} cx={x} cy={y} r="7" />)}
      </g>
      <text x="400" y="299" textAnchor="middle" fill="var(--navy-foreground)" fontSize="23" fontWeight="700">Shared network model</text>
      {agents.map(({ x, y, name, action, color }) => (
        <g key={name}>
          <rect x={x - 126} y={y - 48} width="252" height="96" rx="20" fill="var(--card)" stroke={color} strokeWidth="2" />
          <circle cx={x - 100} cy={y - 12} r="6" fill={color} />
          <text x={x - 82} y={y - 4} fill="var(--foreground)" fontSize="24" fontWeight="800">{name}</text>
          <text x={x} y={y + 25} textAnchor="middle" fill="var(--muted-foreground)" fontSize="21">{action}</text>
        </g>
      ))}
    </svg>
  );
}

export function SceneNetworks() {
  const print = usePrintMode();
  const reduced = useReducedMotion();
  return (
    <div className="slide-content bg-brand-wash flex flex-col px-24 pb-12 pt-14 text-foreground">
      <Kicker>Beyond Premiere Swarm · Research vision</Kicker>
      <h2 className="network-headline mt-4">Local Intelligence.<br /><span className="text-brand">Shared network goals.</span></h2>

      <div className="mt-8 min-h-0 flex-1">
        <div className="grid h-full grid-cols-[1.1fr_1fr] items-center gap-16">
          <section className="h-full min-w-0">
            <CoordinatingAgents />
          </section>
          <div className="flex flex-col justify-center gap-10">
            {themes.map(({ title, Icon }, i) => (
              <motion.section
                key={title}
                initial={print || reduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.16, duration: 0.45 }}
                className="flex items-center gap-7 border-b border-brand/15 pb-8 last:border-b-0 last:pb-0"
              >
                <span className="network-chip shrink-0"><Icon size={40} strokeWidth={1.7} /></span>
                <h3 className="network-topic min-w-0">{title}</h3>
              </motion.section>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={print || reduced ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.55 }}
        className="mt-10"
      >
        <motion.div
          className="network-rule"
          style={{ transformOrigin: "left center" }}
          initial={print || reduced ? { scaleX: 1 } : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.9, ease: "easeOut" }}
        />
        <p className="network-closing mt-8 font-extrabold text-brand">
          Endless network possibilities
          <span className="network-ellipsis" aria-hidden="true">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </motion.div>

      <Logo tone="blue" />
    </div>
  );
}
