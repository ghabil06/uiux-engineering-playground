/** Journey mapping — editable stages, confidence, add/remove, JSON export, local persistence. */
import React from "react";
import { DEFAULT_STAGES, type JourneyStage } from "./data";
import { Card } from "../components/ui";
import { cx } from "../lib/core";

const KEY = "prism-journey-v1";
const CONF: JourneyStage["confidence"][] = ["Low", "Medium", "High"];

function load(): JourneyStage[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const arr = JSON.parse(raw) as JourneyStage[];
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch { /* fall through to defaults */ }
  return DEFAULT_STAGES;
}

export default function JourneyDemo() {
  const [stages, setStages] = React.useState<JourneyStage[]>(load);
  const [sel, setSel] = React.useState(0);
  const [savedTick, setSavedTick] = React.useState(0);
  const cur = stages[Math.min(sel, stages.length - 1)];

  React.useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(stages)); setSavedTick(Date.now()); } catch { /* private mode */ }
  }, [stages]);
  void savedTick;

  const patch = (patch: Partial<JourneyStage>) =>
    setStages((p) => p.map((s, i) => (i === Math.min(sel, p.length - 1) ? { ...s, ...patch } : s)));

  const addStage = () => {
    const n = stages.length + 1;
    setStages([...stages, { id: `s-${Date.now()}`, name: `Stage ${n}`, goal: "", actions: "", touchpoints: "", concerns: "", friction: "", opportunities: "", confidence: "Low" }]);
    setSel(stages.length);
  };
  const removeStage = () => {
    if (stages.length <= 1) return;
    setStages(stages.filter((_, i) => i !== sel));
    setSel(Math.max(0, sel - 1));
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), stages }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "journey-map.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  };

  const field = "mt-1 block h-10 w-full rounded-xl border border-slate-300 px-3 text-sm dark:border-white/15 dark:bg-transparent";
  const area = "mt-1 block min-h-[64px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-[13px] text-sky-900 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-100">
        Changes save to <b>this browser's localStorage</b> automatically and survive reload here — nothing is sent anywhere.
        Export JSON to take the map elsewhere.
      </div>
      {/* stage rail */}
      <ol aria-label="Journey stages" className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {stages.map((s, i) => (
          <li key={s.id} className="shrink-0">
            <button onClick={() => setSel(i)} aria-current={i === Math.min(sel, stages.length - 1) ? "step" : undefined}
              className={cx("w-32 rounded-2xl border p-2.5 text-left", i === Math.min(sel, stages.length - 1) ? "border-violet-500 ring-2 ring-violet-100 dark:ring-violet-500/20" : "border-slate-200 dark:border-white/10")}>
              <span className="block text-[10px] font-black uppercase text-slate-400">Stage {i + 1}</span>
              <b className="block truncate text-sm">{s.name || "Untitled"}</b>
              <span className={cx("mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-black",
                s.confidence === "High" ? "bg-emerald-100 text-emerald-800" : s.confidence === "Medium" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600")}>
                {s.confidence} evidence
              </span>
            </button>
          </li>
        ))}
      </ol>

      {cur && (
        <Card className="space-y-3 p-5" key={cur.id}>
          <div className="flex flex-wrap items-center gap-2">
            <label className="min-w-0 flex-1 text-xs font-bold">Stage name
              <input value={cur.name} onChange={(e) => patch({ name: e.target.value })} className={field} /></label>
            <label className="text-xs font-bold">Evidence confidence
              <span className="mt-1 flex gap-1" role="radiogroup" aria-label="Evidence confidence">
                {CONF.map((c) => (
                  <button key={c} role="radio" aria-checked={cur.confidence === c} onClick={() => patch({ confidence: c })}
                    className={cx("rounded-full px-3 py-1.5 text-xs font-bold", cur.confidence === c ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10")}>{c}</button>
                ))}
              </span></label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-bold">User goal<textarea value={cur.goal} onChange={(e) => patch({ goal: e.target.value })} className={area} /></label>
            <label className="text-xs font-bold">Actions<textarea value={cur.actions} onChange={(e) => patch({ actions: e.target.value })} className={area} /></label>
            <label className="text-xs font-bold">Touchpoints<textarea value={cur.touchpoints} onChange={(e) => patch({ touchpoints: e.target.value })} className={area} /></label>
            <label className="text-xs font-bold">Questions / concerns<textarea value={cur.concerns} onChange={(e) => patch({ concerns: e.target.value })} className={area} /></label>
            <label className="text-xs font-bold">Friction points<textarea value={cur.friction} onChange={(e) => patch({ friction: e.target.value })} className={area} /></label>
            <label className="text-xs font-bold">Opportunities<textarea value={cur.opportunities} onChange={(e) => patch({ opportunities: e.target.value })} className={area} /></label>
          </div>
          <p className="text-xs text-slate-500">Low-confidence cells are research prompts, not facts — each should name its next study.</p>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={addStage} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">+ Add stage</button>
        <button onClick={removeStage} disabled={stages.length <= 1} className="h-10 rounded-xl border border-rose-300 px-4 text-sm font-bold text-rose-600 disabled:opacity-40">Remove this stage</button>
        <button onClick={exportJSON} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">⬇ Export JSON</button>
        <button onClick={() => { setStages(DEFAULT_STAGES); setSel(0); }} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">↺ Reset example</button>
      </div>
    </div>
  );
}
