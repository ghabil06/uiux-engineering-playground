/** UX Research overview — 13 methods, explorer + method selector tool. */
import React from "react";
import { METHODS, recommendMethods, type Evidence } from "./data";
import { Badge, Card } from "../components/ui";
import { Search } from "lucide-react";
import { cx } from "../lib/core";

const GOALS = ["Understand needs", "Evaluate usability", "Fix findability", "Compare designs", "Measure at scale"];
const TIMES = ["Hours", "Days", "Weeks"];
const EVID: ("Any" | Evidence | "Mixed")[] = ["Any", "Qualitative", "Quantitative", "Mixed"];

export default function ResearchOverview() {
  const [q, setQ] = React.useState("");
  const [goal, setGoal] = React.useState(GOALS[1]);
  const [time, setTime] = React.useState(TIMES[1]);
  const [ev, setEv] = React.useState<(typeof EVID)[number]>("Any");
  const ranked = recommendMethods({ goal, time, evidence: ev });
  const top = ranked.slice(0, 3);
  const list = METHODS.filter((m) => (m.name + " " + m.objective + " " + m.output).toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="space-y-5">
      <Card className="space-y-3 p-5">
        <b>Method selector — answer three questions, get a reasoned shortlist</b>
        <div className="grid gap-2 sm:grid-cols-3">
          <label className="text-xs font-bold">Research goal
            <select value={goal} onChange={(e) => setGoal(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-300 bg-transparent px-2 dark:border-white/15">
              {GOALS.map((g) => <option key={g}>{g}</option>)}
            </select></label>
          <label className="text-xs font-bold">Time available
            <select value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-300 bg-transparent px-2 dark:border-white/15">
              {TIMES.map((g) => <option key={g}>{g}</option>)}
            </select></label>
          <label className="text-xs font-bold">Evidence wanted
            <select value={ev} onChange={(e) => setEv(e.target.value as typeof ev)} className="mt-1 h-10 w-full rounded-xl border border-slate-300 bg-transparent px-2 dark:border-white/15">
              {EVID.map((g) => <option key={g}>{g}</option>)}
            </select></label>
        </div>
        <ol className="grid gap-2 md:grid-cols-3" aria-live="polite" aria-label="Recommended methods">
          {top.map(({ method: m, score, reasons }, i) => (
            <li key={m.id} className={cx("rounded-2xl border p-3.5", i === 0 ? "border-violet-400 ring-2 ring-violet-100 dark:ring-violet-500/20" : "border-slate-200 dark:border-white/10")}>
              <p className="flex items-center gap-2 font-extrabold">{i === 0 && <Badge tone="violet">Top pick</Badge>}{m.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-slate-400">score {score} · cost {"€".repeat(m.cost)} · {m.time} · {m.evidence}</p>
              <ul className="mt-1.5 space-y-1 text-[13px] text-slate-600 dark:text-slate-300">{reasons.map((r, j) => <li key={j}>· {r}</li>)}</ul>
            </li>
          ))}
        </ol>
        <p className="text-xs text-slate-500">No method is universally best — change the goal or budget and watch the ranking move.</p>
      </Card>

      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter 13 methods…" aria-label="Filter research methods"
          className="h-10 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm dark:border-white/15 dark:bg-white/5" />
      </div>
      {list.length === 0 ? (
        <Card className="p-8 text-center"><p className="font-extrabold">No methods match “{q}”.</p>
          <button onClick={() => setQ("")} className="mt-2 text-sm font-bold text-violet-600 underline">Clear filter</button></Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((m) => (
            <details key={m.id} className="rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[.03]">
              <summary className="cursor-pointer list-none p-5">
                <span className="flex flex-wrap items-center gap-2">
                  <b>{m.name}</b><Badge tone="slate">{m.evidence}</Badge>
                  <span className="font-mono text-[11px] text-slate-400">{"€".repeat(m.cost)} · {m.time}</span>
                </span>
                <span className="mt-1 block text-[13px] text-slate-500">{m.objective}</span>
              </summary>
              <dl className="space-y-1.5 border-t border-slate-100 px-5 py-4 text-[13px] dark:border-white/10">
                {[["Ask", m.questions], ["Sources", m.sources], ["Strengths", m.strengths], ["Limits", m.limits]].map(([k, v]) => (
                  <div key={k}><dt className="font-bold text-violet-700 dark:text-cyan-300">{k}</dt><dd className="text-slate-600 dark:text-slate-300">{v}</dd></div>
                ))}
                <div className="rounded-xl bg-amber-50 p-2.5 dark:bg-amber-500/10"><dt className="font-bold">⚠ Biases & mistakes</dt><dd>{m.bias}</dd></div>
                <div><dt className="font-bold">Example output</dt><dd>{m.output}</dd></div>
                <div className="text-rose-700 dark:text-rose-300"><dt className="font-bold">Don't use alone when…</dt><dd>{m.notAlone}</dd></div>
              </dl>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
