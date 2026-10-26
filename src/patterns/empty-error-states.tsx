/** Empty & error states — six recoverable dead ends, each with a testable outcome. */
import React from "react";
import { Card } from "../components/ui";
import { ErrorState } from "../components/foundation";
import { PatternDoc, Progress } from "./primitives";
import { patternDef } from "./data";
import { Lock, WifiOff } from "lucide-react";

export default function EmptyErrorDemo() {
  const def = patternDef("empty-error-states");
  const [items, setItems] = React.useState<string[]>([]);
  const [filter, setFilter] = React.useState("zzz-no-match");
  const [access, setAccess] = React.useState<"denied" | "granted">("denied");
  const [attempt, setAttempt] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const [offline, setOffline] = React.useState(false);
  const [queue, setQueue] = React.useState(0);
  const [partial, setPartial] = React.useState<{ name: string; ok: boolean | null }[]>([
    { name: "Invite Amara", ok: null }, { name: "Invite Jonas", ok: null },
    { name: "Invite Rin", ok: null }, { name: "Invite Priya", ok: null },
  ]);

  const load = () => {
    const n = attempt + 1;
    setAttempt(n);
    if (n === 1) return; // first attempt deterministically fails
    setLoaded(true);
  };

  const runBulk = () => {
    // Deterministic partial failure: item 3 always fails first pass.
    setPartial((p) => p.map((it, i) => ({ ...it, ok: i === 2 ? false : true })));
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="No data, no results, denied, failed-then-retried, offline-queued, partial."
        a11y={def.keyboard} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <b>1 · No data yet</b>
          {items.length === 0 ? (
            <div className="mt-2 rounded-2xl border border-dashed border-slate-300 p-6 text-center dark:border-white/15">
              <p className="text-3xl">📁</p>
              <p className="mt-1 font-extrabold">No API keys yet</p>
              <p className="text-sm text-slate-500">Create one to start syncing (local demo).</p>
              <button onClick={() => setItems(["sk-live-…4242"])} className="mt-3 h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">Create key</button>
            </div>
          ) : (
            <p role="status" className="mt-2 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
              ✓ Key created: <code>{items[0]}</code> <button onClick={() => setItems([])} className="ml-2 underline">Revoke (reset)</button>
            </p>
          )}
        </Card>
        <Card className="p-5">
          <b>2 · No search results</b>
          <div className="mt-2 flex gap-2">
            <label className="sr-only" htmlFor="ee-q">Search demo</label>
            <input id="ee-q" value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 min-w-0 flex-1 rounded-xl border border-slate-300 px-3 text-sm dark:border-white/15 dark:bg-transparent" />
            <button onClick={() => setFilter("")} className="h-10 rounded-xl border border-slate-300 px-3 text-sm font-bold dark:border-white/15">Clear</button>
          </div>
          {filter ? (
            <p role="status" className="mt-2 text-sm text-slate-500">0 results for “{filter}”. <button onClick={() => setFilter("")} className="font-bold text-violet-600 underline">Clear the search</button> to see everything.</p>
          ) : (
            <p role="status" className="mt-2 text-sm font-bold text-emerald-600">✓ Showing all 48 demo records.</p>
          )}
        </Card>
        <Card className="p-5">
          <b>3 · Permission denied</b>
          {access === "denied" ? (
            <div className="mt-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm dark:border-rose-400/20 dark:bg-rose-500/10">
              <p className="flex items-center gap-2 font-extrabold"><Lock size={15} /> Billing is restricted to workspace admins.</p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">You can request access — an admin approves it (simulated instantly here).</p>
              <button onClick={() => setAccess("granted")} className="mt-3 h-10 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white">Request access</button>
            </div>
          ) : (
            <p role="status" className="mt-2 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
              ✓ Access granted — billing settings unlocked. <button onClick={() => setAccess("denied")} className="ml-1 underline">Revoke (reset)</button>
            </p>
          )}
        </Card>
        <Card className="p-5">
          <b>4 · Recoverable failure (fails once, then succeeds)</b>
          {!loaded ? (
            <div className="mt-2">
              <ErrorState title={attempt === 0 ? "Couldn't load usage" : `Attempt ${attempt} failed`} desc="Simulated 500. The next retry is scripted to succeed — real UIs should say when retry is pointless." onRetry={load} />
              {attempt > 0 && <p className="mt-1 text-xs text-slate-500">Attempts so far: {attempt}</p>}
            </div>
          ) : (
            <p role="status" className="mt-2 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
              ✓ Usage loaded after {attempt} attempts. <button onClick={() => { setLoaded(false); setAttempt(0); }} className="ml-1 underline">Replay (reset)</button>
            </p>
          )}
        </Card>
        <Card className="p-5">
          <b>5 · Offline simulation</b>
          <div className="mt-2 flex items-center gap-2">
            <button onClick={() => setOffline(!offline)} aria-pressed={offline}
              className={offline ? "h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white" : "h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15"}>
              {offline ? "⛔ Offline (simulated)" : "🌐 Online"}
            </button>
            <button onClick={() => (offline ? setQueue(queue + 1) : setQueue(0))} disabled={!offline && queue === 0}
              className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white disabled:opacity-40">
              {offline ? `Queue sync (${queue} queued)` : queue > 0 ? "Flush queue" : "Queue sync"}
            </button>
          </div>
          {offline ? (
            <p role="alert" className="mt-2 flex items-center gap-2 rounded-2xl bg-slate-900 p-3 text-sm font-bold text-white"><WifiOff size={15} /> You're offline (simulated — real connectivity untouched). Writes queue locally.</p>
          ) : queue > 0 ? (
            <p role="status" className="mt-2 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
              ✓ Reconnected — {queue} queued write{queue === 1 ? "" : "s"} synced. <button onClick={() => setQueue(0)} className="underline">Clear</button>
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-500">Toggle offline, queue a sync, then reconnect to flush.</p>
          )}
        </Card>
        <Card className="p-5">
          <b>6 · Partial failure</b>
          <ul className="mt-2 space-y-1.5 text-sm">
            {partial.map((it, i) => (
              <li key={it.name} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-white/5">
                <span className="min-w-0 flex-1 truncate font-semibold">{it.name}</span>
                {it.ok === null && <span className="text-xs text-slate-400">pending</span>}
                {it.ok === true && <span className="text-xs font-bold text-emerald-600">✓ sent</span>}
                {it.ok === false && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-rose-600">✕ failed</span>
                    <button onClick={() => setPartial((p) => p.map((x, j) => (j === i ? { ...x, ok: true } : x)))}
                      className="rounded-lg bg-rose-600 px-2 py-1 text-[11px] font-black text-white">Retry item</button>
                  </span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex gap-2">
            <button onClick={runBulk} className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-900">Send all invites</button>
            <button onClick={() => setPartial((p) => p.map((x) => ({ ...x, ok: null })))} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Reset</button>
          </div>
          <p role="status" className="mt-2 text-xs text-slate-500">
            {partial.every((x) => x.ok) ? "✓ 4/4 sent." : partial.some((x) => x.ok === false) ? "3/4 sent — retry only the failed item." : "Not run yet."}
          </p>
          {partial.some((x) => x.ok !== null) && !partial.every((x) => x.ok) && <span className="mt-2 block"><Progress value={partial.filter((x) => x.ok).length} max={4} label="Bulk invite progress" /></span>}
        </Card>
      </div>
    </div>
  );
}
