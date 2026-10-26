/** Heuristic lab — poor vs improved, triggerable both ways, plus finding checklist. */
import React from "react";
import { HEURISTICS } from "./data";
import { Card, Badge } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { cx } from "../lib/core";

interface Note { heuristic: string; severity: number; text: string }

export default function HeuristicsLab() {
  const [sel, setSel] = React.useState(HEURISTICS[0].id);
  const [poorMsg, setPoorMsg] = React.useState("Idle — press the button to feel the failure.");
  const [goodState, setGoodState] = React.useState<"idle" | "loading" | "done">("idle");
  const [goodFail, setGoodFail] = React.useState(false);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [draft, setDraft] = React.useState({ severity: 3, text: "" });
  const h = HEURISTICS.find((x) => x.id === sel)!;

  const runGood = (fail: boolean) => {
    setGoodFail(fail);
    setGoodState("loading");
    window.setTimeout(() => setGoodState("done"), 900);
  };

  const addNote = () => {
    if (!draft.text.trim()) return;
    setNotes((n) => [{ heuristic: h.heuristic, severity: draft.severity, text: draft.text.trim() }, ...n]);
    setDraft({ severity: 3, text: "" });
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Inspect one heuristic at a time: trigger the poor version, then the improved version, and note what you find."
        useCases="Expert reviews before testing; triaging support tickets; design critiques."
        states="Idle, poor-outcome, loading, success, retryable error; checklist entries with severities."
        a11y="Both outcomes announced via live regions; checklist controls are native and labelled." />
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Choose heuristic">
        {HEURISTICS.map((x) => (
          <button key={x.id} onClick={() => { setSel(x.id); setGoodState("idle"); setPoorMsg("Idle — press the button to feel the failure."); }}
            aria-pressed={sel === x.id}
            className={cx("rounded-full px-3.5 py-1.5 text-[13px] font-bold", sel === x.id ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300")}>
            {x.heuristic}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-rose-200 p-5 dark:border-rose-400/20">
          <Badge tone="rose">✕ Poor — {h.heuristic}</Badge>
          <h3 className="mt-2 font-extrabold">{h.poorTitle}</h3>
          <p className="mt-1 text-sm text-slate-500">{h.poorDesc}</p>
          <button onClick={() => setPoorMsg("…nothing happened. Did it submit? Is it broken? This silence is the violation — now try the improved version.")}
            className="mt-3 h-11 rounded-xl bg-slate-200 px-5 text-sm font-bold text-slate-500">{h.poorCta}</button>
          <p role="status" className="mt-2 text-[13px] italic text-slate-500">{poorMsg}</p>
        </Card>
        <Card className="border-emerald-200 p-5 dark:border-emerald-400/20">
          <Badge tone="emerald">✓ Improved — {h.heuristic}</Badge>
          <h3 className="mt-2 font-extrabold">{h.goodTitle}</h3>
          <p className="mt-1 text-sm text-slate-500">{h.goodDesc}</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => runGood(false)} disabled={goodState === "loading"}
              className="h-11 flex-1 rounded-xl bg-emerald-600 text-sm font-bold text-white disabled:opacity-60">
              {goodState === "loading" && !goodFail ? "Working…" : goodState === "done" && !goodFail ? "✓ Saved!" : h.goodCta}
            </button>
            <button onClick={() => runGood(true)} disabled={goodState === "loading"} className="h-11 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">
              Force error
            </button>
          </div>
          <div aria-live="polite" className="mt-2 text-[13px]">
            {goodState === "loading" && <span className="font-semibold text-slate-500">Saving… (spinner + disabled, no double-submit)</span>}
            {goodState === "done" && !goodFail && <span className="font-bold text-emerald-600">✓ Saved — confirmed, not assumed.</span>}
            {goodState === "done" && goodFail && (
              <span className="font-semibold text-rose-700">✕ Couldn't save (simulated 500). <button onClick={() => runGood(false)} className="font-bold underline">Retry</button> — entries kept.</span>
            )}
          </div>
        </Card>
      </div>
      <Card className="bg-violet-50 p-4 text-sm dark:bg-violet-500/10"><b>Why this pair differs:</b> {h.explain}</Card>

      <Card className="space-y-3 p-5">
        <b>Heuristic checklist <span className="font-normal text-slate-400">(session-local — proves nothing by itself; it structures an expert review)</span></b>
        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-0 flex-1 text-xs font-bold">Observation for “{h.heuristic}”
            <input value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              placeholder="e.g. Save gives no feedback on slow connections" className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal dark:border-white/15 dark:bg-transparent" />
          </label>
          <label className="text-xs font-bold">Severity (1–5)
            <span className="mt-1 flex gap-1" role="radiogroup" aria-label="Severity">
              {[1, 2, 3, 4, 5].map((v) => (
                <button key={v} role="radio" aria-checked={draft.severity === v} aria-label={`Severity ${v}`} onClick={() => setDraft({ ...draft, severity: v })}
                  className={cx("h-9 w-9 rounded-lg text-xs font-black", draft.severity === v ? (v >= 4 ? "bg-rose-600 text-white" : "bg-violet-600 text-white") : "bg-slate-100 dark:bg-white/10")}>{v}</button>
              ))}
            </span></label>
          <button onClick={addNote} disabled={!draft.text.trim()} className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white disabled:opacity-40 dark:bg-white dark:text-slate-900">Log finding</button>
        </div>
        {notes.length === 0 ? (
          <p className="text-sm text-slate-500">No findings logged yet this session.</p>
        ) : (
          <ul className="space-y-1.5">
            {notes.map((n, i) => (
              <li key={i} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-white/5">
                <b className={cx("rounded-lg px-2 py-0.5 text-xs font-black text-white", n.severity >= 4 ? "bg-rose-600" : "bg-violet-600")}>S{n.severity}</b>
                <span className="min-w-0 flex-1"><b>{n.heuristic}:</b> {n.text}</span>
                <button onClick={() => setNotes(notes.filter((_, j) => j !== i))} aria-label={`Remove finding ${i + 1}`} className="rounded-lg p-1 text-slate-400 hover:text-rose-600">✕</button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
