/** WCAG checklist — POUR-organized, progress from real selections, notes, reset. */
import React from "react";
import { CHECKLIST, type Pour, type CheckResult } from "./data";
import { Card, Badge } from "../components/ui";
import { cx } from "../lib/core";

const POURS: Pour[] = ["Perceivable", "Operable", "Understandable", "Robust"];
const RESULT_LABEL: Record<CheckResult, string> = { unchecked: "Not checked", pass: "Pass", fail: "Fail", na: "N/A" };

export default function ChecklistDemo() {
  const [results, setResults] = React.useState<Record<string, CheckResult>>({});
  const [notes, setNotes] = React.useState<Record<string, string>>({});
  const [pour, setPour] = React.useState<"All" | Pour>("All");

  const set = (id: string, r: CheckResult) => setResults((p) => ({ ...p, [id]: r }));
  const list = CHECKLIST.filter((c) => pour === "All" || c.pour === pour);
  const done = CHECKLIST.filter((c) => (results[c.id] ?? "unchecked") !== "unchecked").length;
  const passes = CHECKLIST.filter((c) => results[c.id] === "pass").length;
  const fails = CHECKLIST.filter((c) => results[c.id] === "fail").length;
  const pct = Math.round((done / CHECKLIST.length) * 100);

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-40 flex-1">
            <div className="flex justify-between text-xs font-bold"><span>Completion {done}/{CHECKLIST.length}</span><span className="tabular-nums">{pct}%</span></div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Checklist completion">
              <div className="h-full bg-violet-600 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <Badge tone="emerald">{passes} pass</Badge>
          <Badge tone="rose">{fails} fail</Badge>
          <div className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Principle filter">
            {(["All", ...POURS] as const).map((p) => (
              <button key={p} onClick={() => setPour(p)} aria-pressed={pour === p}
                className={cx("rounded-full px-3 py-1.5 text-xs font-bold", pour === p ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>{p}</button>
            ))}
          </div>
          <button onClick={() => { setResults({}); setNotes({}); }} className="h-9 rounded-xl border border-slate-300 px-3 text-xs font-bold dark:border-white/15">↺ Reset all</button>
        </div>
        <p className="mt-2 text-xs text-slate-500">An evaluation aid — completing it records diligence, not conformance. Fails should become findings in the register.</p>
      </Card>
      <div className="space-y-2">
        {list.map((c) => {
          const r = results[c.id] ?? "unchecked";
          return (
            <Card key={c.id} className={cx("p-4", r === "fail" && "border-rose-300 dark:border-rose-400/30", r === "pass" && "border-emerald-200 dark:border-emerald-400/20")}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="slate">{c.pour}</Badge>
                <b className="min-w-0 flex-1 text-sm">{c.title}</b>
              </div>
              <p className="mt-1 font-mono text-[11px] text-slate-400">{c.sc}</p>
              <p className="mt-1 text-[13px] text-slate-600 dark:text-slate-300"><b>Verify:</b> {c.how}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="flex gap-1" role="radiogroup" aria-label={`Result for ${c.title}`}>
                  {(["unchecked", "pass", "fail", "na"] as const).map((v) => (
                    <button key={v} role="radio" aria-checked={r === v} onClick={() => set(c.id, v)}
                      className={cx("rounded-lg px-3 py-1.5 text-xs font-bold",
                        r === v ? (v === "pass" ? "bg-emerald-600 text-white" : v === "fail" ? "bg-rose-600 text-white" : v === "na" ? "bg-slate-500 text-white" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900") : "bg-slate-100 hover:bg-slate-200 dark:bg-white/10")}>
                      {RESULT_LABEL[v]}
                    </button>
                  ))}
                </span>
                <label className="sr-only" htmlFor={`note-${c.id}`}>Notes for {c.title}</label>
                <input id={`note-${c.id}`} value={notes[c.id] ?? ""} onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })}
                  placeholder="Evidence / notes (optional)…" className="h-9 min-w-0 flex-1 rounded-lg border border-slate-300 px-2.5 text-xs dark:border-white/15 dark:bg-transparent" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
