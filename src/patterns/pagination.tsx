/** Pagination — boundaries, sizes, counts, and clamping after filters. */
import React from "react";
import { RECORDS, queryRecords, patternDef, type RecStatus } from "./data";
import { Pagination, PatternDoc } from "./primitives";
import { Badge, Card } from "../components/ui";

export default function PaginationDemo() {
  const def = patternDef("pagination");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(8);
  const [status, setStatus] = React.useState<"all" | RecStatus>("all");

  const res = queryRecords(RECORDS, { statuses: status === "all" ? [] : [status], page, perPage, sortKey: "name", sortDir: 1 });
  // Clamp: if a filter shrinks the set below the current page, land on the last page.
  React.useEffect(() => { if (page !== res.page) setPage(res.page); }, [page, res.page]);

  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="First/middle/last page, boundary disables, empty-after-filter with reset, clamped page."
        a11y={def.keyboard + " Page changes move focus to the results heading."} />
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            Status filter (watch the page clamp)
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}
              className="h-10 rounded-xl border border-slate-300 bg-transparent px-2 dark:border-white/15">
              {(["all", "active", "draft", "review", "archived"] as const).map((s) => <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>)}
            </select>
          </label>
          <button onClick={() => { setPage(12); }} className="h-10 rounded-xl border border-slate-300 px-3 text-xs font-bold dark:border-white/15">
            Jump to page 12 (tests clamping)
          </button>
        </div>
        <h3 tabIndex={-1} id="pg-results" className="mt-4 font-extrabold outline-none">
          Results <span className="font-normal text-slate-400">— page {res.page} of {res.pages}</span>
        </h3>
        {res.total === 0 ? (
          <div className="py-8 text-center">
            <p className="font-extrabold">No records with this status</p>
            <button onClick={() => setStatus("all")} className="mt-2 text-sm font-bold text-violet-600 underline">Show all statuses</button>
          </div>
        ) : (
          <ul className="mt-2 divide-y divide-slate-100 dark:divide-white/5">
            {res.rows.map((r, i) => (
              <li key={r.id} className="flex items-center gap-3 py-2 text-sm">
                <span className="w-10 shrink-0 tabular-nums text-slate-400">{(res.page - 1) * perPage + i + 1}.</span>
                <b className="min-w-0 flex-1 truncate">{r.name}</b>
                <Badge tone="slate">{r.status}</Badge>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 border-t border-slate-100 pt-3 dark:border-white/10">
          <Pagination page={res.page} pages={res.pages} total={res.total} perPage={perPage}
            onPage={(p) => { setPage(p); document.getElementById("pg-results")?.focus(); }}
            onPerPage={(n) => { setPerPage(n); setPage(1); }} />
        </div>
      </Card>
    </div>
  );
}
