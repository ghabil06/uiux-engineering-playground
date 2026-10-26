/** Empty states — first-use, no-results, no-filter-match, cleared collection. */
import React from "react";
import { Card, Empty } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";

const STARTER = ["Atlas Website", "Mobile Onboarding", "Billing API"];

export default function EmptyDemo() {
  const [projects, setProjects] = React.useState<string[]>(STARTER);
  const [q, setQ] = React.useState("zzz");
  const [filter, setFilter] = React.useState("all");

  const shown = projects.filter((p) => (!q || p.toLowerCase().includes(q.toLowerCase())) && (filter === "all" || p.toLowerCase().includes(filter)));

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Four empty flavors, each with a next action — empty is a teaching moment, not a dead end."
        useCases="First-run, search, filters, destructive clears."
        states="Pristine empty, no-results, no-filter-match, cleared-by-user."
        a11y="Empty messages are text (not images of text); actions are real buttons; counts announced." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <b>1 · First use (pristine)</b>
          <Empty title="No projects yet" desc="Create your first project to see analytics, tasks and reports here."
            action={<button onClick={() => setProjects([...STARTER])} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">+ New project (demo)</button>} />
        </Card>
        <Card className="space-y-2 p-5">
          <b>2–4 · Searchable collection (live)</b>
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="em-q">Search projects</label>
            <input id="em-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “billing”, then “zzz”"
              className="h-10 min-w-0 flex-1 rounded-xl border border-slate-300 px-3 text-sm dark:border-white/15 dark:bg-transparent" />
            <div className="flex gap-1" role="group" aria-label="Quick filter">
              {(["all", "mobile", "billing"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
                  className={filter === f ? "h-10 rounded-xl bg-slate-900 px-3 text-xs font-bold text-white dark:bg-white dark:text-slate-900" : "h-10 rounded-xl bg-slate-100 px-3 text-xs font-bold dark:bg-white/10"}>{f}</button>
              ))}
            </div>
            <button onClick={() => setProjects([])} className="h-10 rounded-xl border border-rose-300 px-3 text-xs font-bold text-rose-600">Clear all (demo)</button>
          </div>
          <p role="status" className="text-xs text-slate-500">{shown.length} of {projects.length} shown</p>
          {projects.length === 0 ? (
            <Empty title="Collection cleared" desc="You removed everything (local demo). Restore the starters or create new."
              action={<button onClick={() => { setProjects([...STARTER]); setQ(""); setFilter("all"); }} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">↺ Restore starters</button>} />
          ) : shown.length === 0 ? (
            <Empty title={q ? `No results for “${q}”` : "No projects match this filter"}
              desc="Search and filter combine — loosen one to widen the net."
              action={<button onClick={() => { setQ(""); setFilter("all"); }} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">Clear search & filters</button>} />
          ) : (
            <ul className="space-y-1.5">
              {shown.map((p) => <li key={p} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold dark:bg-white/5">{p}</li>)}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
