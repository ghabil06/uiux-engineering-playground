/** Interactive data table — sort, search, paginate, page-scoped selection, bulk actions. */
import React from "react";
import { RECORDS, queryRecords, patternDef, type Rec, type RecStatus, type SortKey } from "./data";
import { SearchInput, Pagination, PatternDoc } from "./primitives";
import { Badge, Card, useToasts } from "../components/ui";
import { Dropdown } from "../components/foundation";
import { X } from "lucide-react";
import { cx } from "../lib/core";

const COLS: { key: SortKey; label: string; num?: boolean }[] = [
  { key: "name", label: "Project" },
  { key: "owner", label: "Owner" },
  { key: "status", label: "Status" },
  { key: "updated", label: "Updated" },
  { key: "budget", label: "Budget", num: true },
];

export default function DataTableDemo() {
  const def = patternDef("data-table");
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"all" | RecStatus>("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("updated");
  const [sortDir, setSortDir] = React.useState<1 | -1>(-1);
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(8);
  const [sel, setSel] = React.useState<Set<string>>(new Set());
  const [detail, setDetail] = React.useState<Rec | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [archived, setArchived] = React.useState<Set<string>>(new Set());
  const { push, Toast } = useToasts();
  const headBox = React.useRef<HTMLInputElement>(null);

  const live = RECORDS.filter((r) => !archived.has(r.id));
  const res = queryRecords(live, {
    q, statuses: status === "all" ? [] : [status],
    sortKey, sortDir, page, perPage,
  });

  const pageIds = res.rows.map((r) => r.id);
  const allPage = pageIds.length > 0 && pageIds.every((id) => sel.has(id));
  const somePage = pageIds.some((id) => sel.has(id));
  React.useEffect(() => {
    if (headBox.current) headBox.current.indeterminate = !allPage && somePage;
  });

  const flipSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === 1 ? -1 : 1);
    else { setSortKey(k); setSortDir(k === "name" || k === "owner" ? 1 : -1); }
  };

  const togglePage = (on: boolean) => {
    const next = new Set(sel);
    pageIds.forEach((id) => (on ? next.add(id) : next.delete(id)));
    setSel(next);
  };

  const bulkArchive = () => {
    setArchived(new Set([...archived, ...sel]));
    push(`Archived ${sel.size} project${sel.size === 1 ? "" : "s"}`, "Local demo state — use Reset to restore.", "#f59e0b");
    setSel(new Set());
  };

  const refresh = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      push("Table refreshed", `${res.total} rows from local demo data.`, "#10b981");
    }, 700);
  };

  return (
    <div className="space-y-4">
      {Toast}
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Sorted, filtered, paged, loading, empty, single/multi-selected, bulk-acted, archived."
        a11y={def.keyboard + " Header checkbox uses indeterminate for partial page selection; selection is page-scoped by design."} />
      <Card className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} label="Search table" placeholder="Search ID, name, owner…" />
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            Status
            <select value={status} onChange={(e) => { setStatus(e.target.value as typeof status); setPage(1); }}
              className="h-10 rounded-xl border border-slate-300 bg-transparent px-2 dark:border-white/15">
              {(["all", "active", "draft", "review", "archived"] as const).map((s) => <option key={s} value={s}>{s === "all" ? "All" : s}</option>)}
            </select>
          </label>
          <button onClick={refresh} className="h-10 rounded-xl border border-slate-300 px-3 text-sm font-bold dark:border-white/15">↻ Refresh</button>
          <button onClick={() => { setQ(""); setStatus("all"); setPage(1); setSel(new Set()); setArchived(new Set()); }}
            className="h-10 rounded-xl border border-slate-300 px-3 text-sm font-bold dark:border-white/15">↺ Reset demo</button>
        </div>
        {sel.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white" role="status">
            {sel.size} selected (across pages)
            <button onClick={bulkArchive} className="rounded-lg bg-white px-3 py-1.5 text-xs font-black text-violet-700">Archive</button>
            <button onClick={() => setSel(new Set())} className="ml-auto underline">Clear selection</button>
          </div>
        )}
        <p className="text-xs text-slate-500">Selection rule: the header checkbox selects <b>this page only</b> — never the whole result set. Bulk actions apply to everything selected across pages.</p>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-[13px]">
            <caption className="sr-only">Projects — sortable, selectable, paginated client-side demo</caption>
            <thead>
              <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-white/5">
                <th className="w-10 p-3">
                  <input ref={headBox} type="checkbox" checked={allPage} onChange={(e) => togglePage(e.target.checked)}
                    aria-label={allPage ? "Deselect all rows on this page" : "Select all rows on this page"} className="h-4 w-4 accent-violet-600" />
                </th>
                {COLS.map((c) => (
                  <th key={c.key} aria-sort={sortKey === c.key ? (sortDir === 1 ? "ascending" : "descending") : "none"}>
                    <button onClick={() => flipSort(c.key)} aria-label={`Sort by ${c.label}`}
                      className={cx("flex w-full items-center gap-1 p-3 font-bold hover:text-slate-900 dark:hover:text-white", c.num && "justify-end")}>
                      {c.label}<span aria-hidden>{sortKey === c.key ? (sortDir === 1 ? "↑" : "↓") : "↕"}</span>
                    </button>
                  </th>
                ))}
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: perPage }).map((_, i) => (
                  <tr key={i} className="border-t border-slate-100 dark:border-white/5" aria-hidden>
                    <td colSpan={7} className="px-3 py-1"><span className="block h-8 animate-pulse rounded-lg bg-slate-100 dark:bg-white/5" /></td>
                  </tr>
                ))
              ) : (
                res.rows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100 hover:bg-violet-50/40 dark:border-white/5 dark:hover:bg-white/5">
                    <td className="p-3">
                      <input type="checkbox" checked={sel.has(r.id)}
                        onChange={() => { const n = new Set(sel); sel.has(r.id) ? n.delete(r.id) : n.add(r.id); setSel(n); }}
                        aria-label={`Select ${r.name}`} className="h-4 w-4 accent-violet-600" />
                    </td>
                    <td className="p-3"><b>{r.name}</b><span className="block text-xs text-slate-400">{r.id}</span></td>
                    <td className="p-3">{r.owner}</td>
                    <td className="p-3"><Badge tone={r.status === "active" ? "emerald" : r.status === "draft" ? "slate" : r.status === "review" ? "amber" : "rose"}>{r.status}</Badge></td>
                    <td className="p-3 tabular-nums">{r.updated}</td>
                    <td className="p-3 text-right tabular-nums">${r.budget.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <Dropdown label="Row actions" items={[
                        { label: `View ${r.id}`, onSelect: () => setDetail(r) },
                        { label: "Archive row", danger: true, onSelect: () => { setArchived(new Set([...archived, r.id])); push("Row archived", `${r.id} hidden locally.`, "#f59e0b"); } },
                      ]} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && res.rows.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-extrabold">No rows match these filters</p>
            <button onClick={() => { setQ(""); setStatus("all"); setPage(1); }} className="mt-2 text-sm font-bold text-violet-600 underline">Clear search & filters</button>
          </div>
        )}
        <div className="border-t border-slate-100 p-4 dark:border-white/10">
          <Pagination page={res.page} pages={res.pages} total={res.total} perPage={perPage}
            onPage={setPage} onPerPage={(n) => { setPerPage(n); setPage(1); }} />
        </div>
      </Card>

      {detail && (
        <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal="true" aria-label={`${detail.name} details`}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetail(null)} />
          <div className="relative w-full max-w-sm overflow-y-auto bg-white p-6 shadow-2xl dark:bg-slate-950">
            <button onClick={() => setDetail(null)} aria-label="Close details" className="absolute right-4 top-4 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/10"><X size={18} /></button>
            <p className="font-mono text-xs text-slate-400">{detail.id}</p>
            <h3 className="mt-1 text-xl font-black">{detail.name}</h3>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {[["Owner", detail.owner], ["Category", detail.category], ["Status", detail.status], ["Updated", detail.updated], ["Budget", `$${detail.budget.toLocaleString()}`]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-slate-50 p-2.5 dark:bg-white/5"><dt className="text-[10px] font-bold uppercase text-slate-400">{k}</dt><dd className="font-bold">{v}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
