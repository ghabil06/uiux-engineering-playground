/** Usability-testing lab — sample task prototype + observation log + honest metrics. */
import React from "react";
import { SAMPLE_OBS, calcMetrics, type Observation } from "./data";
import { Card, Badge } from "../components/ui";

const PROJECTS = ["PRJ-1042 Checkout revamp", "PRJ-1037 Onboarding emails", "PRJ-1051 Billing export"];

export default function UsabilityTesting() {
  const [obs, setObs] = React.useState<Observation[]>(SAMPLE_OBS);
  const [proto, setProto] = React.useState({ found: "", status: "todo" });
  const [f, setF] = React.useState({ completed: true, help: false, errors: "0", seconds: "", notes: "" });
  const [seq, setSeq] = React.useState(100);
  const m = calcMetrics(obs);
  const pct = (v: number | null) => (v === null ? "—" : `${v}%`);

  const foundOk = proto.found === "PRJ-1042 Checkout revamp";
  const taskDone = foundOk && proto.status === "review";

  const add = () => {
    const errors = Math.max(0, parseInt(f.errors || "0", 10) || 0);
    const seconds = f.seconds.trim() === "" ? null : Math.max(0, Number(f.seconds));
    setObs((p) => [...p, {
      id: seq, task: "Locate PRJ-1042 and set status to review",
      completed: f.completed, help: f.help, errors,
      seconds: Number.isFinite(seconds) ? seconds : null, notes: f.notes.trim() || "—",
    }]);
    setSeq(seq + 1);
    setF({ completed: true, help: false, errors: "0", seconds: "", notes: "" });
  };

  const input = "h-10 rounded-xl border border-slate-300 px-3 text-sm dark:border-white/15 dark:bg-transparent";

  return (
    <div className="space-y-4">
      <Card className="space-y-2 p-5">
        <b>Study: can users locate a project and change its status?</b>
        <dl className="grid gap-2 text-[13px] sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-white/5"><dt className="font-bold">Objective</dt><dd>Validate the new row-menu status control before release.</dd></div>
          <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-white/5"><dt className="font-bold">Task + success criteria</dt><dd>“Set PRJ-1042 to <i>review</i>.” Done = status reads <i>review</i>, unassisted ideally.</dd></div>
        </dl>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3 p-5">
          <b>Try the task yourself <span className="font-normal text-slate-400">(the prototype under test)</span></b>
          <label className="block text-xs font-bold">1 · Find the project
            <select value={proto.found} onChange={(e) => setProto({ ...proto, found: e.target.value })} className={input + " mt-1 w-full"}>
              <option value="">Choose a project…</option>
              {PROJECTS.map((p) => <option key={p}>{p}</option>)}
            </select></label>
          <label className="block text-xs font-bold">2 · Set its status
            <select value={proto.status} onChange={(e) => setProto({ ...proto, status: e.target.value })} className={input + " mt-1 w-full"}>
              {(["todo", "doing", "review", "done"] as const).map((s) => <option key={s} value={s}>{s}</option>)}
            </select></label>
          <p role="status" className={taskDone ? "rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100" : "rounded-2xl bg-slate-100 p-3 text-sm text-slate-500 dark:bg-white/5"}>
            {taskDone ? "✓ Task complete — now log it as an observation on the right." : foundOk ? "Found it — now set the status to “review”." : "Locate PRJ-1042 first."}
          </p>
        </Card>

        <Card className="space-y-2.5 p-5">
          <b>Log an observation</b>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <label className="flex items-center gap-2"><input type="checkbox" checked={f.completed} onChange={(e) => setF({ ...f, completed: e.target.checked })} className="h-5 w-5 accent-emerald-600" /> Completed</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={f.help} onChange={(e) => setF({ ...f, help: e.target.checked })} className="h-5 w-5 accent-amber-500" /> Needed help</label>
            <label>Errors (count)<input value={f.errors} onChange={(e) => setF({ ...f, errors: e.target.value })} inputMode="numeric" className={input + " mt-1 w-full"} /></label>
            <label>Time in seconds (blank = missing)<input value={f.seconds} onChange={(e) => setF({ ...f, seconds: e.target.value })} inputMode="decimal" placeholder="e.g. 134" className={input + " mt-1 w-full"} /></label>
          </div>
          <label className="block text-xs font-bold">Notes<textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={2} placeholder="What happened, in the participant's words where possible…" className={input + " mt-1 h-auto w-full py-2"} /></label>
          <button onClick={add} className="h-10 w-full rounded-xl bg-violet-600 text-sm font-bold text-white">Add observation (stored locally)</button>
        </Card>
      </div>

      <Card className="p-5">
        <b>Metrics <span className="font-normal text-slate-400">(denominators shown; n={m.n} — directional, never significant)</span></b>
        <div className="mt-2 grid grid-cols-2 gap-2 text-center sm:grid-cols-5">
          {[["Completion", m.completionRate === null ? "—" : `${m.completionRate}%`], ["Avg errors", m.avgErrors === null ? "—" : String(m.avgErrors)], ["Help rate", pct(m.helpRate)], ["Median time", m.medianSeconds === null ? "withheld" : `${m.medianSeconds}s`], ["n", String(m.n)]].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
              <p className="text-[11px] font-bold uppercase text-slate-400">{k}</p>
              <p className="text-xl font-black tabular-nums">{v}</p>
            </div>
          ))}
        </div>
        <p role="status" className="mt-2 text-xs text-slate-500">{m.caveat}</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[13px]">
            <thead><tr className="text-[11px] uppercase text-slate-400"><th className="py-1 pr-2">#</th><th className="py-1 pr-2">Done</th><th className="py-1 pr-2">Help</th><th className="py-1 pr-2">Err</th><th className="py-1 pr-2">Time</th><th className="py-1 pr-2">Notes</th><th /></tr></thead>
            <tbody>
              {obs.map((o) => (
                <tr key={o.id} className="border-t border-slate-100 dark:border-white/5">
                  <td className="py-1.5 pr-2 font-mono">{o.id}{o.sample && <Badge tone="slate" className="ml-1">sample</Badge>}</td>
                  <td className="py-1.5 pr-2 font-bold">{o.completed ? "✓" : "✕"}</td>
                  <td className="py-1.5 pr-2">{o.help ? "yes" : "—"}</td>
                  <td className="py-1.5 pr-2 tabular-nums">{o.errors}</td>
                  <td className="py-1.5 pr-2 tabular-nums">{o.seconds === null ? <i className="text-slate-400">missing</i> : `${o.seconds}s`}</td>
                  <td className="max-w-[220px] truncate py-1.5 pr-2 text-slate-500" title={o.notes}>{o.notes}</td>
                  <td>{!o.sample && <button onClick={() => setObs(obs.filter((x) => x.id !== o.id))} aria-label={`Remove observation ${o.id}`} className="rounded-lg p-1 text-slate-400 hover:text-rose-600">✕</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => setObs(SAMPLE_OBS)} className="mt-2 text-xs font-bold text-violet-600 underline">↺ Reset to the 3 labeled sample rows</button>
      </Card>
    </div>
  );
}
