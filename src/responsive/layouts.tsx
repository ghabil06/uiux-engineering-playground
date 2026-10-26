/** Fluid, grid and flex — problem, technique, failure mode each. */
import React from "react";
import { Card } from "../components/ui";

const DEMOS: { title: string; problem: string; technique: string; fail: string; body: React.ReactNode }[] = [
  {
    title: "Fluid spacing & type", problem: "Fixed px gutters feel cramped on phones, lost on ultrawide.",
    technique: "clamp() + container max-width; padding scales with viewport.",
    fail: "Pure vw type with no min/max → unreadable extremes. Always clamp.",
    body: (
      <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 p-[clamp(12px,4vw,40px)] text-white">
        <p style={{ fontSize: "clamp(20px, 4vw, 40px)" }} className="font-black tracking-tight">Padding and type breathe with width</p>
        <p className="mt-1 text-sm opacity-85">Padding: clamp(12px, 4vw, 40px). Never smaller, never absurd.</p>
      </div>
    ),
  },
  {
    title: "CSS grid dashboard", problem: "Twelve fixed columns overflow small screens; media-query rewrites rot.",
    technique: "auto-fit + minmax: columns appear as space allows, no breakpoints needed.",
    fail: "minmax min too large (e.g. 320px cards) → single column forever on phones. Keep mins ~140–180px.",
    body: (
      <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {["MRR", "Churn", "NPS", "Active", "Trials", "Tickets"].map((k) => (
          <div key={k} className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
            <p className="text-[10px] font-bold uppercase text-slate-400">{k}</p>
            <p className="text-lg font-black tabular-nums">--</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Flexbox wrapping toolbar", problem: "Rigid toolbars clip actions or force horizontal page scroll.",
    technique: "flex-wrap with sensible flex-basis; overflow belongs to containers, never the page.",
    fail: "flex-nowrap + whitespace-nowrap on dynamic labels → clipped actions on small screens.",
    body: (
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
        {["Filters", "Sort: newest", "Bulk actions", "Export CSV", "Columns", "Density"].map((a) => (
          <button key={a} className="h-9 rounded-xl bg-white px-3 text-[13px] font-bold ring-1 ring-slate-200 dark:bg-transparent dark:ring-white/15">{a}</button>
        ))}
      </div>
    ),
  },
];

export default function LayoutsDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {DEMOS.map((d) => (
        <Card key={d.title} className="space-y-2 p-5">
          <b>{d.title}</b>
          {d.body}
          <p className="text-[13px]"><b className="text-violet-700 dark:text-cyan-300">Problem:</b> <span className="text-slate-500">{d.problem}</span></p>
          <p className="text-[13px]"><b className="text-emerald-700 dark:text-emerald-300">Technique:</b> <span className="text-slate-500">{d.technique}</span></p>
          <p className="text-[13px]"><b className="text-amber-700 dark:text-amber-300">Failure mode:</b> <span className="text-slate-500">{d.fail}</span></p>
        </Card>
      ))}
    </div>
  );
}
