/** Feedback & affordances — every control answers; poor vs improved pairs. */
import React from "react";
import { Card, Badge } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { cx } from "../lib/core";

function LikeButton({ improved }: { improved: boolean }) {
  const [liked, setLiked] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const click = () => {
    if (!improved) {
      // poor: 2s of nothing, then a jump — the classic broken loop
      window.setTimeout(() => setLiked(!liked), 2000);
      return;
    }
    setPending(true);
    window.setTimeout(() => { setPending(false); setLiked(!liked); }, 350);
  };
  return (
    <span className="flex items-center gap-2">
      <button onClick={click} aria-pressed={liked} aria-label={improved ? "Like this proposal" : "Like (unresponsive demo)"}
        className={cx("flex h-11 min-w-[88px] items-center justify-center gap-1.5 rounded-xl text-sm font-bold transition",
          improved
            ? liked ? "bg-rose-600 text-white" : "bg-slate-100 hover:bg-rose-100 dark:bg-white/10"
            : "bg-slate-100 text-slate-500 dark:bg-white/10")}>
        <span aria-hidden className={cx("text-lg", pending && "animate-pulse")}>{liked ? "♥" : "♡"}</span>
        {pending ? "…" : liked ? 129 : 128}
      </button>
      <span className="text-xs text-slate-500">{improved ? (pending ? "Syncing…" : liked ? "Liked — reconciles on failure" : "Responds in <100ms") : "Press it. Count the seconds of silence."}</span>
    </span>
  );
}

export default function FeedbackDemo() {
  const [help, setHelp] = React.useState(false);
  const [sel, setSel] = React.useState<string[]>([]);
  return (
    <div className="space-y-4">
      <PatternDoc purpose="Buttons answer, inputs guide, states speak. Trigger each pair and compare what your finger learns."
        useCases="Toggles, likes, saves, selects — any direct manipulation."
        states="Idle, hover, focus, active/pending, selected, disabled — plus consistent vs chaotic styling."
        a11y="Every state change announced or visually unambiguous; focus always visible; disabled paired with explanations." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-rose-200 p-5 dark:border-rose-400/20">
          <Badge tone="rose">✕ Poor feedback</Badge>
          <div className="mt-3 space-y-4">
            <LikeButton improved={false} />
            <div>
              <p className="text-sm font-bold">Mystery box <span className="font-normal text-slate-400">(no label, no hint)</span></p>
              <input placeholder="" aria-label="Unlabelled demo input" className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm dark:border-white/15 dark:bg-transparent" />
            </div>
            <div className="flex gap-2">
              <button className="h-11 rounded-xl bg-slate-200 px-4 text-sm font-bold text-slate-500">Save</button>
              <button className="h-11 rounded-xl bg-slate-200 px-4 text-sm font-bold text-slate-500">Submit</button>
              <button className="h-11 rounded-xl bg-slate-200 px-4 text-sm font-bold text-slate-500">OK</button>
            </div>
            <p className="text-xs text-slate-500">Three identical grey buttons, three different verbs. Hover does nothing. Focus is anyone's guess.</p>
          </div>
        </Card>
        <Card className="border-emerald-200 p-5 dark:border-emerald-400/20">
          <Badge tone="emerald">✓ Improved feedback</Badge>
          <div className="mt-3 space-y-4">
            <LikeButton improved />
            <div>
              <label htmlFor="fb-code" className="text-sm font-bold">Team invite code
                <button type="button" onClick={() => setHelp(!help)} aria-expanded={help} className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black dark:bg-white/10">?</button>
              </label>
              {help && <p className="mt-1 rounded-xl bg-sky-50 p-2 text-xs dark:bg-sky-500/10">Find it in Settings → Team. Codes look like ATLAS-XXXX.</p>}
              <input id="fb-code" placeholder="ATLAS-XXXX" className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-white/15 dark:bg-transparent" />
            </div>
            <div className="flex gap-2" role="group" aria-label="Notification taste">
              {["Email", "Slack", "None"].map((o) => (
                <button key={o} onClick={() => setSel(sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o])} aria-pressed={sel.includes(o)}
                  className={cx("h-11 flex-1 rounded-xl text-sm font-bold transition active:scale-95", sel.includes(o) ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border border-slate-300 hover:border-slate-500 dark:border-white/15")}>
                  {sel.includes(o) ? "✓ " : ""}{o}
                </button>
              ))}
            </div>
            <button disabled aria-disabled="true" title="Disabled until a plan is chosen — pick one in the wizard"
              className="h-11 w-full cursor-not-allowed rounded-xl bg-slate-100 text-sm font-bold text-slate-400 dark:bg-white/5">
              Continue (disabled — choose a plan first)
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
