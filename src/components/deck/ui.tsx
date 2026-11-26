import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("slide-kicker text-brand", className)}>{children}</div>;
}

export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="slide-chrome inline-flex items-center gap-2 rounded-full border-2 border-dashed border-persona-skeptic px-5 py-2 text-persona-skeptic">
      {children}
    </span>
  );
}

// Telefónica "T" mark: five dots, redrawn from the uploaded logo so it stays crisp at any size.
const DOTS: [number, number][] = [
  [7, 7],
  [22.7, 7],
  [38.4, 7],
  [22.7, 22.7],
  [22.7, 38.4],
];

export function Mark({ label, className, style }: { label?: string; className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 45.4 45.4"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("h-full w-full", className)}
      style={style}
    >
      {DOTS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={7} fill="currentColor" />
      ))}
    </svg>
  );
}

export function Logo({ tone = "blue", className }: { tone?: "blue" | "white"; className?: string }) {
  return (
    <Mark
      label="Telefónica"
      className={cn("absolute bottom-8 right-10 h-[64px] w-[64px]", className)}
      style={{ color: tone === "white" ? "var(--navy-foreground)" : "var(--brand)" }}
    />
  );
}
