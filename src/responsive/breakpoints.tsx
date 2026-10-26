/** Breakpoint lab — slider-driven width, measured readout, real layout shifts. */
import React from "react";
import { Card } from "../components/ui";
import { PreviewShell } from "./preview";
import { cx } from "../lib/core";

const PRESETS = [320, 390, 768, 1024, 1440];

export function layoutFor(w: number): string {
  if (w < 480) return "single";
  if (w < 900) return "double";
  return "quad";
}

export default function BreakpointsDemo() {
  const [w, setW] = React.useState(768);
  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap gap-1.5 p-4">
        <b className="w-full text-sm">Presets <span className="font-normal text-slate-400">(content breaks here, not devices)</span></b>
        {PRESETS.map((p) => (
          <button key={p} onClick={() => setW(p)} aria-pressed={w === p}
            className={cx("h-9 rounded-xl px-3.5 font-mono text-[13px] font-bold", w === p ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10")}>
            {p}px
          </button>
        ))}
      </Card>
      <PreviewShell width={w} onWidth={setW} min={280} max={1100} label="Preview width">
        {(inner) => {
          const layout = layoutFor(inner);
          return (
            <div className="p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-xs font-black text-white">A</span>
                <b className="text-sm">Acme</b>
                {layout !== "single" ? (
                  <nav className="ml-2 flex gap-3 text-[13px] font-semibold text-slate-500" aria-label="Preview">
                    {["Dashboard", "Orders", "Reports"].map((l) => <span key={l}>{l}</span>)}
                  </nav>
                ) : (
                  <span className="ml-auto rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold dark:border-white/10">☰ Menu</span>
                )}
              </div>
              <p role="status" className="mt-2 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-900 dark:bg-violet-500/10 dark:text-violet-100">
                {inner}px → {layout === "single" ? "single column + hamburger" : layout === "double" ? "two columns + inline nav" : "four columns + full nav"}
              </p>
              <div className={cx("mt-2 grid gap-2", layout === "single" ? "grid-cols-1" : layout === "double" ? "grid-cols-2" : "grid-cols-4")}>
                {["Revenue", "Orders", "Churn", "NPS"].map((k, i) => (
                  <div key={k} className={cx("rounded-xl p-3", i === 0 && layout !== "single" ? "bg-violet-600 text-white" : "border border-slate-200 dark:border-white/10")}>
                    <p className="text-[10px] font-bold uppercase opacity-70">{k}</p>
                    <p className="text-xl font-black tabular-nums">{["$48k", "1.2k", "1.8%", "62"][i]}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </PreviewShell>
      <p className="text-xs text-slate-500">Breakpoints at 480/900px were chosen because <i>this content</i> breaks there — your project gets its own numbers by the same method.</p>
    </div>
  );
}
