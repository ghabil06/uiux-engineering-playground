/** Success states — inline, toast, workflow-complete, saved indicators. */
import React from "react";
import { Card } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { Check } from "lucide-react";

export default function SuccessDemo() {
  const [saved, setSaved] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [toasts, setToasts] = React.useState<string[]>([]);
  const [steps, setSteps] = React.useState(0);

  const toast = (m: string) => {
    setToasts((t) => [...t.slice(-2), m]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x !== m)), 3500);
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Confirm clearly, then get out of the way — success is a pit stop, not a parade."
        useCases="Saves, publishes, completed wizards, background jobs."
        states="Inline confirmation, auto-dismissing toast, workflow finale, dirty/saved indicator."
        a11y="Success announced politely (role=status); toasts never steal focus; icons pair with text." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3 p-5">
          <b>Inline success + saved indicator</b>
          <label className="block text-sm font-bold">Project name
            <input defaultValue="Atlas Website" onChange={() => { setDirty(true); setSaved(false); }}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 dark:border-white/15 dark:bg-transparent" /></label>
          <span className="flex items-center gap-2">
            <button onClick={() => { setDirty(false); setSaved(true); }} disabled={!dirty}
              className="h-11 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white disabled:opacity-40">Save (simulated)</button>
            <span role="status" className="text-[13px] font-semibold text-slate-500">
              {saved ? "✓ All changes saved" : dirty ? "● Unsaved changes" : "—"}
            </span>
          </span>
          <button onClick={() => toast("Export queued — we'll notify you here when it's ready (simulated).")}
            className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Fire toast success</button>
          <div aria-live="polite" className="space-y-1.5">
            {toasts.map((m) => (
              <p key={m} className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
                <Check size={15} aria-hidden /> {m}
              </p>
            ))}
          </div>
        </Card>
        <Card className="space-y-3 p-5">
          <b>Completed workflow</b>
          <ol className="space-y-1.5">
            {["Details entered", "Reviewed", "Published"].map((s, i) => (
              <li key={s} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-bold dark:bg-white/5">
                <span aria-hidden className={i < steps ? "text-emerald-600" : "text-slate-300"}>{i < steps ? "✓" : "○"}</span>
                {s}
                {i === steps && steps < 3 && (
                  <button onClick={() => setSteps(steps + 1)} className="ml-auto rounded-lg bg-slate-900 px-3 py-1 text-xs font-black text-white dark:bg-white dark:text-slate-900">
                    Complete step
                  </button>
                )}
              </li>
            ))}
          </ol>
          {steps >= 3 ? (
            <p role="status" className="rounded-2xl bg-emerald-50 p-4 text-center text-sm font-black text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
              🎉 Workflow complete — here's the one clear next action, not confetti.
              <span className="mt-2 block"><button onClick={() => setSteps(0)} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white">View published page →</button>
              <button onClick={() => setSteps(0)} className="ml-2 text-xs underline">or run again (reset)</button></span>
            </p>
          ) : (
            <button onClick={() => setSteps(0)} className="text-xs font-bold text-slate-400 underline">Reset workflow</button>
          )}
        </Card>
      </div>
    </div>
  );
}
