/** Stale data — explicit timestamps, refresh, cached-vs-fresh distinction. */
import React from "react";
import { Card, Badge } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";

const CACHED_AT = "Oct 26, 2026 · 09:41 UTC (sample snapshot)";
const FRESH_AT = "Oct 26, 2026 · 09:47 UTC (refreshed demo data)";

export default function StaleDemo() {
  const [fresh, setFresh] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [live, setLive] = React.useState(true);

  const refresh = () => {
    if (!live) return;
    setLoading(true);
    window.setTimeout(() => { setLoading(false); setFresh(true); }, 900);
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Old data is fine — silently-old data is not. Timestamps plus refresh make staleness a first-class state."
        useCases="Cached dashboards, offline-first reads, failed background sync."
        states="Fresh, stale (labelled), refreshing, refresh-failed."
        a11y="Freshness is text, not color; refresh outcomes announced; stale badge has an accessible name." />
      <Card className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <b>Project health</b>
          {fresh
            ? <Badge tone="emerald">● Fresh</Badge>
            : <Badge tone="amber">● Stale snapshot</Badge>}
          <span className="ml-auto flex gap-2">
            <button onClick={refresh} disabled={loading || !live} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white disabled:opacity-40">
              {loading ? "Refreshing…" : "↻ Refresh now"}
            </button>
            <button onClick={() => setLive(!live)} aria-pressed={!live} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">
              {live ? "Simulate dead API" : "Restore API"}
            </button>
          </span>
        </div>
        <p className="font-mono text-xs text-slate-500">
          Last updated: <b>{fresh ? FRESH_AT : CACHED_AT}</b>
        </p>
        <div className="grid grid-cols-3 gap-2 text-center" aria-busy={loading}>
          {[["Active", fresh ? "1,302" : "1,284"], ["Churn", fresh ? "1.7%" : "1.8%"], ["NPS", fresh ? "63" : "62"]].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
              <p className="text-[11px] font-bold uppercase text-slate-400">{k}</p>
              <p className="text-xl font-black tabular-nums">{loading ? "…" : v}</p>
            </div>
          ))}
        </div>
        {!live ? (
          <p role="alert" className="rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-900 dark:bg-rose-500/10 dark:text-rose-100">
            Refresh failed — the demo API is “down” (your toggle). Showing the clearly-labelled {fresh ? "last fresh" : "cached sample"} data instead of nothing.
            <button onClick={() => setLive(true)} className="ml-2 font-bold underline">Restore API & retry</button>
          </p>
        ) : (
          <p role="status" className="text-[13px] text-slate-500">
            {loading ? "Contacting the demo API…" : fresh ? "✓ Showing refreshed demonstration data." : "Showing cached sample data — refresh for the latest demo snapshot."}
          </p>
        )}
      </Card>
    </div>
  );
}
