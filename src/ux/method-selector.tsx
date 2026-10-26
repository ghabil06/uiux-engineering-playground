/** Method selector — goal/time/evidence PLUS risk and maturity for a reasoned plan. */
import React from "react";
import { recommendMethods } from "./data";
import { Card, Badge } from "../components/ui";
import { cx } from "../lib/core";

const GOALS = ["Understand needs", "Evaluate usability", "Fix findability", "Compare designs", "Measure at scale"];

export default function MethodSelector() {
  const [goal, setGoal] = React.useState(GOALS[1]);
  const [time, setTime] = React.useState("Days");
  const [ev, setEv] = React.useState("Mixed");
  const [risk, setRisk] = React.useState<"Low" | "High">("High");
  const [mature, setMature] = React.useState(false);

  const ranked = recommendMethods({ goal, time, evidence: ev }).map((r) => {
    let extra = 0;
    const notes = [...r.reasons];
    if (risk === "High" && ["mod-test", "contextual", "a11y-eval", "ab"].includes(r.method.id)) {
      extra += 1; notes.push("High decision risk → favor direct observation over self-report.");
    }
    if (!mature && r.method.cost === 1) { extra += 1; notes.push("Low research maturity → start cheap and visible."); }
    return { ...r, score: r.score + extra, reasons: notes };
  }).sort((a, b) => b.score - a.score);

  const sel = "mt-1 h-10 w-full rounded-xl border border-slate-300 bg-transparent px-2 dark:border-white/15";

  return (
    <div className="space-y-4">
      <Card className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-bold">Research goal
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className={sel}>{GOALS.map((g) => <option key={g}>{g}</option>)}</select></label>
        <label className="text-xs font-bold">Time available
          <select value={time} onChange={(e) => setTime(e.target.value)} className={sel}>{["Hours", "Days", "Weeks"].map((g) => <option key={g}>{g}</option>)}</select></label>
        <label className="text-xs font-bold">Evidence wanted
          <select value={ev} onChange={(e) => setEv(e.target.value)} className={sel}>{["Any", "Qualitative", "Quantitative", "Mixed"].map((g) => <option key={g}>{g}</option>)}</select></label>
        <span className="text-xs font-bold">Decision risk
          <span className="mt-1 flex gap-1" role="group" aria-label="Decision risk">
            {(["Low", "High"] as const).map((r) => (
              <button key={r} onClick={() => setRisk(r)} aria-pressed={risk === r}
                className={cx("h-10 flex-1 rounded-xl text-sm font-bold", risk === r ? (r === "High" ? "bg-rose-600 text-white" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900") : "bg-slate-100 dark:bg-white/10")}>{r}</button>
            ))}
          </span></span>
      </Card>
      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={mature} onChange={(e) => setMature(e.target.checked)} className="h-5 w-5 accent-violet-600" />
        Our team already runs research regularly (mature practice)
      </label>
      <ol aria-live="polite" aria-label="Ranked methods" className="grid gap-3 md:grid-cols-2">
        {ranked.slice(0, 6).map(({ method: m, score, reasons }, i) => (
          <li key={m.id} className={cx("rounded-3xl border p-4", i === 0 ? "border-violet-400 ring-2 ring-violet-100 dark:ring-violet-500/20" : "border-slate-200 dark:border-white/10")}>
            <p className="flex flex-wrap items-center gap-2 font-extrabold">
              <span className="text-slate-400">#{i + 1}</span>{m.name}
              {i === 0 && <Badge tone="violet">Run this first</Badge>}
              <span className="ml-auto font-mono text-[11px] text-slate-400">score {score}</span>
            </p>
            <p className="mt-0.5 text-[13px] text-slate-500">{m.objective} · {"€".repeat(m.cost)} · {m.time} · {m.evidence}</p>
            <ul className="mt-1.5 space-y-1 text-[13px] text-slate-600 dark:text-slate-300">{reasons.map((r, j) => <li key={j}>· {r}</li>)}</ul>
            <p className="mt-1.5 text-xs text-rose-700 dark:text-rose-300"><b>Watch out:</b> {m.bias}</p>
            <a href="#/ux-research" className="mt-1.5 inline-block text-xs font-bold text-violet-600 hover:underline">Full method profile →</a>
          </li>
        ))}
      </ol>
      <p className="text-xs text-slate-500">Scoring is transparent and editable in spirit: goal fit ×3, budget fit ×2, evidence ±1, risk/maturity ±1. No universal winner exists by design.</p>
    </div>
  );
}
