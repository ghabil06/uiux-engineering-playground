/** Consistency — chaotic vs systematic control styling, scored. */
import React from "react";
import { Card } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";

export default function ConsistencyDemo() {
  const [chaosScore, setChaosScore] = React.useState(0);
  const [chaosMsg, setChaosMsg] = React.useState("Three 'confirm' buttons. Only one proceeds — guess which. (Scores your confusion, kindly.)");
  const [sysStep, setSysStep] = React.useState(0);

  const chaosClick = (i: number) => {
    if (i === 1) {
      setChaosScore(chaosScore + 1);
      setChaosMsg(`Correct — “Submit” proceeds. Took you ${chaosScore + 1} tr${chaosScore + 1 === 1 ? "y" : "ies"}. Inconsistent labels tax every new user exactly like this.`);
    } else {
      setChaosMsg("Nope — that one cancels / goes back / does nothing. See the problem?");
    }
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Feel inconsistency as measured confusion: identical styling with different verbs, then one verb done right."
        useCases="Design-system adoption, multi-team flows, platform conventions."
        states="Guessing, corrected, systematic flow with uniform primary/secondary/tertiary."
        a11y="Consistent naming is an accessibility feature — screen-reader users navigate by control names." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-rose-200 p-5 dark:border-rose-400/20">
          <b>✕ Chaotic: same style, three verbs</b>
          <div className="mt-3 flex flex-wrap gap-2">
            {["OK", "Submit", "Done"].map((v, i) => (
              <button key={v} onClick={() => chaosClick(i)} className="h-11 rounded-xl bg-slate-200 px-5 text-sm font-bold text-slate-600">{v}</button>
            ))}
          </div>
          <p role="status" className="mt-2 text-[13px] text-slate-500">{chaosMsg}</p>
        </Card>
        <Card className="border-emerald-200 p-5 dark:border-emerald-400/20">
          <b>✓ Systematic: one language, three ranks</b>
          <div className="mt-3 space-y-2">
            <button onClick={() => setSysStep(Math.min(3, sysStep + 1))} disabled={sysStep >= 3}
              className="h-11 w-full rounded-xl bg-violet-600 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-40">
              {sysStep >= 3 ? "✓ Published" : "Publish changes"}
            </button>
            <div className="flex gap-2">
              <button onClick={() => setSysStep(Math.max(0, sysStep - 1))} className="h-10 flex-1 rounded-xl border border-slate-300 text-sm font-bold dark:border-white/15">← Back</button>
              <button onClick={() => setSysStep(0)} className="h-10 rounded-xl px-4 text-sm font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
            </div>
            <p role="status" className="text-[13px] text-slate-500">
              {sysStep === 0 && "Primary always advances, secondary always retreats, tertiary always exits. Step 1 of 3."}
              {sysStep === 1 && "Same ranks, step 2 of 3 — zero re-learning."}
              {sysStep === 2 && "Same ranks, step 3 of 3."}
              {sysStep >= 3 && "Done — and every future flow will speak the same three ranks."}
            </p>
          </div>
        </Card>
      </div>
      <Card className="p-4 text-[13px]">
        <b>Convention checklist:</b> one verb per action · primary/secondary/tertiary ranks never swap meaning ·
        destructive always rose + left of nothing · platform patterns (⌘K, Esc, undo) respected.
      </Card>
    </div>
  );
}
