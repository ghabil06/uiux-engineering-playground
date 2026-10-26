/** Progress & feedback — determinate, indeterminate, steps; all timer-honest. */
import React from "react";
import { Card } from "../components/ui";
import { PatternDoc, Progress, StepProgress } from "./primitives";
import { patternDef } from "./data";

export default function ProgressDemo() {
  const def = patternDef("progress-and-feedback");
  const [job, setJob] = React.useState<number | null>(null);
  const [jobDone, setJobDone] = React.useState(false);
  const [spin, setSpin] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [msg, setMsg] = React.useState("Idle. Start a demo below — every bar is driven by a real timer.");
  const iv = React.useRef<number | null>(null);

  React.useEffect(() => () => { if (iv.current) window.clearInterval(iv.current); }, []);
  const stop = () => { if (iv.current) window.clearInterval(iv.current); iv.current = null; };

  const startJob = () => {
    stop(); setJob(0); setJobDone(false); setMsg("Export running… 0%");
    iv.current = window.setInterval(() => {
      setJob((p) => {
        if (p === null) return p;
        const n = p + 9;
        if (n >= 100) { stop(); setJobDone(true); setMsg("Export complete — 48 rows ready (simulated)."); return 100; }
        setMsg(`Export running… ${n}%`);
        return n;
      });
    }, 250);
  };
  const cancelJob = () => { stop(); setJob(null); setJobDone(false); setMsg("Export cancelled at user request. Partial file discarded (simulated)."); };

  const refresh = () => {
    setSpin(true); setMsg("Refreshing… (indeterminate: unknown duration)");
    window.setTimeout(() => { setSpin(false); setMsg("Refresh complete."); }, 1600);
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Idle, running, cancelled, complete, failed-safe; indeterminate only when duration is truly unknown."
        a11y="Determinate bars carry value/max/now; indeterminate bars are labelled regions, never fake percentages." />
      <p role="status" className="rounded-2xl bg-slate-100 p-3 text-sm font-semibold dark:bg-white/5">{msg}</p>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-3 p-5">
          <b>Determinate job</b>
          {job === null && !jobDone && <p className="text-sm text-slate-500">Not started. Progress will reflect actual timer ticks.</p>}
          {(job !== null || jobDone) && <Progress value={jobDone ? 100 : job ?? 0} label="Export progress" tone={jobDone ? "bg-emerald-500" : "bg-violet-600"} />}
          <div className="flex gap-2">
            <button onClick={startJob} disabled={job !== null && !jobDone} className="h-10 flex-1 rounded-xl bg-violet-600 text-sm font-bold text-white disabled:opacity-40">Start export</button>
            <button onClick={cancelJob} disabled={job === null} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold disabled:opacity-40 dark:border-white/15">Cancel</button>
          </div>
        </Card>
        <Card className="space-y-3 p-5">
          <b>Indeterminate refresh</b>
          {spin ? <Progress value={null} label="Refreshing workspace" /> : <p className="text-sm text-slate-500">Idle. Duration unknown → no fake percentage.</p>}
          <button onClick={refresh} disabled={spin} className="h-10 w-full rounded-xl border border-slate-300 text-sm font-bold disabled:opacity-40 dark:border-white/15">
            {spin ? "Refreshing…" : "↻ Refresh now"}
          </button>
        </Card>
        <Card className="space-y-3 p-5">
          <b>Step progress</b>
          <StepProgress steps={["Upload", "Map fields", "Import"]} current={Math.min(step, 2)} label="Import steps" />
          <p className="text-sm text-slate-500">
            {step >= 3 ? "✓ All three steps complete." : `On step ${step + 1} of 3: ${["Upload", "Map fields", "Import"][step]}.`}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold disabled:opacity-40 dark:border-white/15">Back</button>
            <button onClick={() => setStep(Math.min(3, step + 1))} disabled={step >= 3} className="h-10 flex-1 rounded-xl bg-slate-900 text-sm font-bold text-white disabled:opacity-40 dark:bg-white dark:text-slate-900">
              {step >= 3 ? "Done" : "Complete step"}
            </button>
          </div>
          {step >= 3 && <button onClick={() => setStep(0)} className="text-xs font-bold text-violet-600 underline">Run the steps again (retry path)</button>}
        </Card>
      </div>
    </div>
  );
}
