/**
 * Interface-states overview — gallery, transition explorer (explicit machine),
 * and the component/state coverage matrix.
 */
import React from "react";
import { STATE_DEFS, MATRIX, PERMITTED, transition, type ReqState, type ReqEvent } from "./data";
import { Card, Badge } from "../components/ui";
import { Search, SearchX, RotateCcw } from "lucide-react";
import { cx } from "../lib/core";

function stateLabel(s: ReqState): string {
  switch (s.status) {
    case "idle": return "Idle";
    case "loading": return "Loading…";
    case "success": return `Success (${s.at})`;
    case "error": return `Error: ${s.message}`;
    case "retrying": return `Retrying (attempt ${s.attempt})…`;
  }
}

function Explorer() {
  const [comp, setComp] = React.useState<"Save button" | "Invoice panel" | "Sync job">("Save button");
  const [state, setState] = React.useState<ReqState>({ status: "idle" });
  const [rejected, setRejected] = React.useState<string | null>(null);
  const [log, setLog] = React.useState<string[]>([]);

  const fire = (e: ReqEvent) => {
    const { next, ok } = transition(state, e);
    if (!ok) {
      setRejected(`Rejected: “${e.type}” is not permitted from ${state.status} (permitted: ${PERMITTED[state.status].join(", ") || "none"}).`);
      return;
    }
    setRejected(null);
    setState(next);
    setLog((l) => [`${state.status} --${e.type}--> ${next.status}`, ...l].slice(0, 6));
  };

  const reset = () => {
    setState({ status: "idle" });
    setRejected(null);
    setLog([]);
  };

  return (
    <Card className="space-y-3 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <b>Transition explorer</b>
        <span className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Component">
          {(["Save button", "Invoice panel", "Sync job"] as const).map((c) => (
            <button key={c} onClick={() => { setComp(c); reset(); }} aria-pressed={comp === c}
              className={cx("rounded-full px-3.5 py-1.5 text-[13px] font-bold", comp === c ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>{c}</button>
          ))}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
        <span aria-hidden className="text-3xl">{state.status === "success" ? "✓" : state.status === "error" ? "✕" : state.status === "idle" ? "○" : "◌"}</span>
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">{comp}</p>
          <p role="status" className="font-extrabold">{stateLabel(state)}</p>
        </div>
        <span className="ml-auto flex flex-wrap gap-1.5" role="group" aria-label="Fire transition">
          {(["start", "resolve", "fail", "retry", "reset"] as const).map((ev) => {
            const allowed = PERMITTED[state.status].includes(ev);
            return (
              <button key={ev}
                onClick={() => fire(ev === "fail" ? { type: "fail", message: "Simulated 500" } : { type: ev } as ReqEvent)}
                aria-disabled={!allowed} title={allowed ? `Fire ${ev}` : `Invalid from ${state.status} — click to see it rejected safely`}
                className={cx("h-9 rounded-xl px-3 text-xs font-black", allowed ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-400 dark:bg-white/10")}>
                {ev}
              </button>
            );
          })}
        </span>
      </div>
      {rejected && <p role="alert" className="rounded-2xl bg-amber-50 p-3 text-sm font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">{rejected}</p>}
      {log.length > 0 && (
        <ol className="space-y-1 font-mono text-xs text-slate-500" aria-label="Transition history">
          {log.map((l, i) => <li key={i}>· {l}</li>)}
        </ol>
      )}
      <p className="text-xs text-slate-500">One discriminated union — <code>idle | loading | success | error | retrying</code> — so loading-AND-success is unrepresentable. Invalid transitions are rejected with an explanation, never applied.</p>
    </Card>
  );
}

export default function StatesOverview() {
  const [q, setQ] = React.useState("");
  const list = STATE_DEFS.filter((d) => (d.name + " " + d.tagline + " " + d.desc).toLowerCase().includes(q.trim().toLowerCase()));
  const reset = () => setQ("");

  return (
    <div className="space-y-5">
      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search states — “offline”, “retry”…" aria-label="Search interface states"
          className="h-10 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm dark:border-white/15 dark:bg-white/5" />
      </div>
      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-white/10 dark:bg-white/5">
          <SearchX size={24} className="text-slate-400" />
          <p className="mt-3 font-extrabold">No states match “{q}”.</p>
          <button onClick={reset} className="mt-3 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white">Clear search</button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((d) => (
            <a key={d.slug} href={`#/interface-states/${d.slug}`}
              className="group rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[.04]">
              <span className="flex items-center gap-2">
                <Badge tone="slate">{d.difficulty}</Badge>
                <h3 className="font-extrabold">{d.name}</h3>
              </span>
              <p className="mt-1 text-[13px] font-bold text-violet-700 dark:text-cyan-300">{d.tagline}</p>
              <p className="mt-1 text-[13px] text-slate-500">{d.desc}</p>
            </a>
          ))}
        </div>
      )}
      {(q) && list.length > 0 && (
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-violet-600 hover:underline"><RotateCcw size={13} /> Clear search</button>
      )}
      <Explorer />
      <Card className="overflow-hidden">
        <div className="p-4 pb-2"><b>State coverage matrix <span className="font-normal text-slate-400">(not every state applies everywhere)</span></b></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead><tr className="bg-slate-50 text-[11px] uppercase text-slate-500 dark:bg-white/5">
              <th scope="col" className="p-3">Component</th><th scope="col" className="p-3">Applicable states</th><th scope="col" className="p-3">Demo</th><th scope="col" className="p-3">Note</th>
            </tr></thead>
            <tbody>
              {MATRIX.map((r) => (
                <tr key={r.component} className="border-t border-slate-100 dark:border-white/5">
                  <th scope="row" className="p-3 font-extrabold">{r.component}</th>
                  <td className="p-3"><span className="flex flex-wrap gap-1">{r.states.map((s) => <span key={s} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold dark:bg-white/10">{s}</span>)}</span></td>
                  <td className="p-3">{r.demo ? <a href={r.demo} className="font-bold text-violet-600 hover:underline">Open →</a> : <span className="text-slate-400">—</span>}</td>
                  <td className="p-3 text-slate-500">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
