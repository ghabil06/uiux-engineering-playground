/** Search & Filter — composed querying over 48 deterministic records, URL-synced. */
import React from "react";
import { RECORDS, queryRecords, patternDef, type RecCategory, type RecStatus, type SortKey } from "./data";
import { SearchInput, Chip, Pagination, PatternDoc } from "./primitives";
import { Badge, Card } from "../components/ui";
import { cx } from "../lib/core";

const CATS: RecCategory[] = ["Website", "Mobile", "API", "Internal"];
const STATUSES: RecStatus[] = ["active", "draft", "review", "archived"];
const SORTS: { key: SortKey; label: string }[] = [
  { key: "updated", label: "Recently updated" },
  { key: "name", label: "Name A–Z" },
  { key: "budget", label: "Budget" },
  { key: "owner", label: "Owner" },
];

function readHash(): { q: string; cats: RecCategory[]; statuses: RecStatus[]; sortKey: SortKey; sortDir: 1 | -1 } {
  try {
    const p = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const cats = (p.get("cats") || "").split(",").filter((c): c is RecCategory => (CATS as string[]).includes(c));
    const statuses = (p.get("st") || "").split(",").filter((s): s is RecStatus => (STATUSES as string[]).includes(s));
    const sk = (p.get("sort") || "updated") as SortKey;
    return {
      q: p.get("q") || "",
      cats, statuses,
      sortKey: SORTS.some((s) => s.key === sk) ? sk : "updated",
      sortDir: p.get("dir") === "asc" ? 1 : -1,
    };
  } catch {
    return { q: "", cats: [], statuses: [], sortKey: "updated", sortDir: -1 };
  }
}

export default function SearchFilterDemo() {
  const def = patternDef("search-and-filter");
  const init = React.useMemo(readHash, []);
  const [q, setQ] = React.useState(init.q);
  const [cats, setCats] = React.useState<RecCategory[]>(init.cats);
  const [statuses, setStatuses] = React.useState<RecStatus[]>(init.statuses);
  const [sortKey, setSortKey] = React.useState<SortKey>(init.sortKey);
  const [sortDir, setSortDir] = React.useState<1 | -1>(init.sortDir);
  const [page, setPage] = React.useState(1);

  // Shareable state: replaceState avoids hashchange scroll/resets.
  React.useEffect(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (cats.length) p.set("cats", cats.join(","));
    if (statuses.length) p.set("st", statuses.join(","));
    if (sortKey !== "updated") p.set("sort", sortKey);
    if (sortDir === 1) p.set("dir", "asc");
    const base = "#/patterns/search-and-filter";
    try { window.history.replaceState(null, "", p.toString() ? `${base}?${p}` : base); } catch { /* noop */ }
  }, [q, cats, statuses, sortKey, sortDir]);

  const toggle = <T,>(arr: T[], v: T, set: (a: T[]) => void, resetPage = true) => {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    if (resetPage) setPage(1);
  };

  const res = queryRecords(RECORDS, { q, cats, statuses, sortKey, sortDir, page, perPage: 6 });
  const clearAll = () => { setQ(""); setCats([]); setStatuses([]); setSortKey("updated"); setSortDir(-1); setPage(1); };

  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Results, filtered, sorted, paged, no-results; chips mirror active filters; URL reflects state."
        a11y={def.keyboard + " Result count announced via role=status on every change."} />
      <Card className="space-y-3 p-5">
        <div className="flex flex-wrap gap-2">
          <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} label="Search projects"
            placeholder="Search name, owner or ID… (try “billing”)" hint="Searches ID, name and owner at once." />
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            Sort
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} aria-label="Sort results by"
              className="h-10 rounded-xl border border-slate-300 bg-transparent px-2 dark:border-white/15">
              {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </label>
          <button onClick={() => setSortDir(sortDir === 1 ? -1 : 1)} aria-label={sortDir === 1 ? "Sort ascending, switch to descending" : "Sort descending, switch to ascending"}
            className="h-10 rounded-xl border border-slate-300 px-3 font-black dark:border-white/15">{sortDir === 1 ? "↑" : "↓"}</button>
        </div>
        <div className="flex flex-wrap gap-4">
          <fieldset>
            <legend className="text-[11px] font-black uppercase tracking-wider text-slate-400">Category</legend>
            <span className="mt-1 flex flex-wrap gap-1.5">
              {CATS.map((c) => (
                <button key={c} onClick={() => toggle(cats, c, setCats)} aria-pressed={cats.includes(c)}
                  className={cx("rounded-full px-3 py-1.5 text-xs font-bold", cats.includes(c) ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300")}>{c}</button>
              ))}
            </span>
          </fieldset>
          <fieldset>
            <legend className="text-[11px] font-black uppercase tracking-wider text-slate-400">Status</legend>
            <span className="mt-1 flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => toggle(statuses, s, setStatuses)} aria-pressed={statuses.includes(s)}
                  className={cx("rounded-full px-3 py-1.5 text-xs font-bold capitalize", statuses.includes(s) ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300")}>{s}</button>
              ))}
            </span>
          </fieldset>
        </div>
        {(cats.length > 0 || statuses.length > 0 || q.trim()) && (
          <div className="flex flex-wrap items-center gap-1.5" aria-label="Active filters">
            {q.trim() && <Chip label={`“${q.trim()}”`} onRemove={() => { setQ(""); setPage(1); }} />}
            {cats.map((c) => <Chip key={c} label={c} onRemove={() => toggle(cats, c, setCats)} />)}
            {statuses.map((s) => <Chip key={s} label={s} onRemove={() => toggle(statuses, s, setStatuses)} />)}
            <button onClick={clearAll} className="ml-1 text-xs font-bold text-violet-600 hover:underline">Clear all</button>
          </div>
        )}
      </Card>

      <Card className="p-5">
        {res.total === 0 ? (
          <div className="py-10 text-center">
            <p className="text-4xl">🔍</p>
            <p className="mt-2 font-extrabold">0 of 48 records match</p>
            <p className="mt-1 text-sm text-slate-500">Filters combine with AND — remove one to widen the net.</p>
            <button onClick={clearAll} className="mt-3 h-10 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white">Reset to defaults</button>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-slate-100 dark:divide-white/5">
              {res.rows.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-2 py-2.5 text-sm">
                  <b className="min-w-0 flex-1 truncate">{r.name}</b>
                  <Badge tone="sky">{r.category}</Badge>
                  <Badge tone={r.status === "active" ? "emerald" : r.status === "draft" ? "slate" : r.status === "review" ? "amber" : "rose"}>{r.status}</Badge>
                  <span className="w-full text-xs text-slate-400 sm:w-auto">{r.id} · {r.owner} · {r.updated}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-slate-100 pt-3 dark:border-white/10">
              <Pagination page={res.page} pages={res.pages} total={res.total} perPage={6} onPage={setPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
