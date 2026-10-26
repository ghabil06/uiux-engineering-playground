/** Responsive overview — concepts plus a live mobile-first demo. */
import React from "react";
import { Card } from "../components/ui";

const CONCEPTS: [string, string, string][] = [
  ["Mobile-first", "Base styles target small screens; min-width queries add, never undo.", "Write CSS without media queries first, then enhance."],
  ["Fluid + clamp()", "Sizes interpolate between bounds instead of jumping at breakpoints.", "clamp(1rem, 2vw + 0.5rem, 1.5rem) for display type."],
  ["Content-driven breakpoints", "Break where the design breaks — not at device names.", "Resize until it looks wrong; that pixel value is your breakpoint."],
  ["Container constraints", "max-width + auto margins keep line lengths readable on ultrawide.", "max-w-7xl mx-auto with fluid padding."],
];

export default function ResponsiveOverview() {
  const [cols, setCols] = React.useState(1);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {CONCEPTS.map(([t, d, how]) => (
          <Card key={t} className="p-4">
            <b>{t}</b>
            <p className="mt-1 text-sm text-slate-500">{d}</p>
            <p className="mt-1.5 font-mono text-[11px] text-violet-700 dark:text-cyan-300">{how}</p>
          </Card>
        ))}
      </div>
      <Card className="space-y-3 p-5">
        <b>Mobile-first in one control <span className="font-normal text-slate-400">(same cards, 1 → 2 → 4 columns)</span></b>
        <div className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Column count">
          {[1, 2, 4].map((n) => (
            <button key={n} onClick={() => setCols(n)} aria-pressed={cols === n}
              className={cols === n ? "flex-1 rounded-full bg-white py-1.5 text-[13px] font-bold shadow dark:bg-slate-800" : "flex-1 rounded-full py-1.5 text-[13px] font-bold text-slate-500"}>
              {n} col{n === 1 ? " (mobile)" : n === 2 ? "s (tablet)" : "s (desktop)"}
            </button>
          ))}
        </div>
        <div className={cols === 1 ? "grid gap-2" : cols === 2 ? "grid gap-2 sm:grid-cols-2" : "grid gap-2 sm:grid-cols-2 lg:grid-cols-4"} aria-live="polite">
          {["Inbox zero plan", "Snoozed threads", "Drafts", "Archive"].map((t) => (
            <div key={t} className="rounded-2xl bg-slate-100 p-4 text-sm font-bold dark:bg-white/5">{t}</div>
          ))}
        </div>
        <p className="text-xs text-slate-500">Resize the browser too — these columns also respond to the real viewport (sm:/lg:), not just the buttons.</p>
      </Card>
    </div>
  );
}
