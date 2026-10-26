/** Partial failure — independent sections, one fails, retry targets only it. */
import React from "react";
import { Card } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { Check, X, RotateCcw } from "lucide-react";
import { cx } from "../lib/core";

interface Section { id: string; title: string; body: string; status: "ok" | "failed" | "loading" }

const FRESH: Section[] = [
  { id: "a", title: "Usage chart", body: "1,284 active projects this week.", status: "ok" },
  { id: "b", title: "Billing summary", body: "$48.2k MRR · 12 invoices due.", status: "ok" },
  { id: "c", title: "Team activity", body: "Simulated fetch — scripted to fail first.", status: "ok" },
];

export default function PartialDemo() {
  const [sections, setSections] = React.useState<Section[]>(FRESH);
  const [attempts, setAttempts] = React.useState(0);

  const breakIt = () => {
    setAttempts(0);
    setSections(FRESH.map((s) => (s.id === "c" ? { ...s, status: "failed" as const } : s)));
  };

  const retryOne = () => {
    setSections((p) => p.map((s) => (s.id === "c" ? { ...s, status: "loading" as const } : s)));
    window.setTimeout(() => {
      setAttempts((a) => a + 1);
      setSections((p) => p.map((s) => (s.id === "c" ? { ...s, status: "ok" as const, body: "Rin approved 3 invoices · Priya exported Q3." } : s)));
    }, 900);
  };

  const failed = sections.filter((s) => s.status === "failed").length;

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Bulkheads, not dominoes: sections fail independently and recover independently."
        useCases="Dashboards, multi-widget pages, federated data."
        states="All-healthy, one-failed (others live), retrying-one, recovered."
        a11y="Failure announced per-section (role=alert scoped to the panel); healthy sections never re-announce." />
      <div className="flex flex-wrap gap-2">
        <button onClick={breakIt} className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white">⚠ Break section C (simulated)</button>
        <button onClick={() => setSections(FRESH)} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">↺ Reset all</button>
        <span role="status" className="self-center text-sm text-slate-500">{failed === 0 ? "✓ 3/3 sections healthy." : `⚠ ${failed}/3 sections failed — the rest are live.`}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.id} className={cx("p-4", s.status === "failed" && "border-rose-300 dark:border-rose-400/30")}>
            <b className="text-sm">{s.title}</b>
            {s.status === "ok" && <p className="mt-1 flex items-center gap-1.5 text-[13px]"><Check size={14} aria-hidden className="text-emerald-600" />{s.body}</p>}
            {s.status === "loading" && <p className="mt-1 text-[13px]" aria-busy="true">Retrying…</p>}
            {s.status === "failed" && (
              <div role="alert" className="mt-1 text-[13px]">
                <p className="flex items-center gap-1.5 font-bold text-rose-600"><X size={14} aria-hidden /> Team feed unreachable (simulated 503).</p>
                <button onClick={retryOne} className="mt-2 flex h-9 items-center gap-1.5 rounded-xl bg-rose-600 px-3 text-xs font-black text-white">
                  <RotateCcw size={12} aria-hidden /> Retry this section only
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
      {attempts > 0 && <p className="text-xs text-slate-500">Section-C retries so far: {attempts}. Sections A and B were never touched.</p>}
    </div>
  );
}
