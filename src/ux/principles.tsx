/** UX Principles overview — 15 principles + methodology workflow selector. */
import React from "react";
import { PRINCIPLES, METHODOLOGIES } from "./data";
import { Badge, Card } from "../components/ui";
import { Search } from "lucide-react";

const CHALLENGES: { label: string; method: string; why: string }[] = [
  { label: "Activation is flat, nobody knows why", method: "dt", why: "Ambiguous human problem → empathize first, prototype before committing." },
  { label: "Checkout redesign, execs disagree", method: "dd", why: "Needs visible divergence then convergence — decision trail included." },
  { label: "Ship onboarding improvements weekly", method: "lean", why: "Hypothesis → experiment → evidence loop fits a fast cadence." },
  { label: "Users churn to a competitor", method: "jtbd", why: "Find the progress they hire products for — then beat the struggle." },
  { label: "New compliance review every release", method: "ucd", why: "Embed evaluate-against-requirements as a loop, not a gate." },
];

export default function PrinciplesOverview() {
  const [q, setQ] = React.useState("");
  const [challenge, setChallenge] = React.useState(0);
  const method = METHODOLOGIES.find((m) => m.id === CHALLENGES[challenge].method)!;
  const list = PRINCIPLES.filter((p) =>
    (p.name + " " + p.explain + " " + p.why + " " + p.contexts + " " + p.tradeoff).toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="relative max-w-sm">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter principles — “error”, “memory”…"
          aria-label="Filter principles" className="h-10 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm dark:border-white/15 dark:bg-white/5" />
      </div>
      {list.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="font-extrabold">No principles match “{q}”.</p>
          <button onClick={() => setQ("")} className="mt-2 text-sm font-bold text-violet-600 underline">Clear filter</button>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((p, i) => (
            <details key={p.id} className="group rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[.03]">
              <summary className="cursor-pointer list-none p-5">
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-[11px] font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">{String(i + 1).padStart(2, "0")}</span>
                  <b>{p.name}</b>
                </span>
                <span className="mt-1 block text-[13px] text-slate-500">{p.explain}</span>
              </summary>
              <div className="space-y-2.5 border-t border-slate-100 px-5 py-4 text-[13px] leading-relaxed dark:border-white/10">
                <p><b>Why it matters:</b> {p.why}</p>
                <p className="rounded-xl bg-rose-50 p-2.5 dark:bg-rose-500/10"><b>✕ Poor:</b> {p.poor}</p>
                <p className="rounded-xl bg-emerald-50 p-2.5 dark:bg-emerald-500/10"><b>✓ Improved:</b> {p.improved}</p>
                <p><b>Checklist:</b> {p.checklist.join(" · ")}</p>
                <p><b>Contexts:</b> {p.contexts}</p>
                <p><b>Trade-off:</b> {p.tradeoff}</p>
              </div>
            </details>
          ))}
        </div>
      )}
      <p className="rounded-2xl bg-slate-100 p-3 text-[13px] text-slate-600 dark:bg-white/5 dark:text-slate-300">
        Heuristics are <b>guidelines, not laws</b> — context, users and task risk decide how strictly each applies. The interactive labs below let you feel the difference.
      </p>

      <Card className="space-y-3 p-5">
        <b>Workflow selector — which process fits your challenge?</b>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Product challenge">
          {CHALLENGES.map((c, i) => (
            <button key={c.label} onClick={() => setChallenge(i)} aria-pressed={challenge === i}
              className={i === challenge ? "rounded-full bg-slate-900 px-3.5 py-1.5 text-[13px] font-bold text-white dark:bg-white dark:text-slate-900" : "rounded-full bg-slate-100 px-3.5 py-1.5 text-[13px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300"}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl bg-violet-50 p-4 dark:bg-violet-500/10">
          <p className="flex flex-wrap items-center gap-2 font-extrabold">{method.name} <Badge tone="violet">recommended</Badge></p>
          <p className="mt-1 text-sm">{method.purpose} <b>Why:</b> {CHALLENGES[challenge].why}</p>
          <ol className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {method.stages.map((s) => (
              <li key={s.name} className="rounded-xl bg-white p-2.5 text-xs dark:bg-white/5">
                <b>{s.name}</b><span className="block text-slate-500">{s.activities}</span><span className="block text-slate-400">→ {s.artifacts}</span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-xs text-slate-500"><b>Misuse:</b> {method.misuse} <b>Useful:</b> {method.useful} Approaches combine — never rigid checklists.</p>
        </div>
      </Card>
    </div>
  );
}
