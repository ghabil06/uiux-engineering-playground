/** Minimalism — whitespace, one accent, hairline dividers, no decoration. */
import React from "react";
import { useWorkspace, KPIS, ACTIVITY, PROJECT, type WsTask } from "./workspace";
import { cx } from "../lib/core";

const STATUS: Record<string, string> = {
  todo: "To do", doing: "Doing", done: "Done", blocked: "Blocked",
};

export default function MinimalismDemo() {
  const w = useWorkspace();
  return (
    <div className="bg-white text-slate-900">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{PROJECT.client}</p>
          <label className="sr-only" htmlFor="min-name">Project name</label>
          <input id="min-name" value={w.name} onChange={(e) => w.setName(e.target.value)}
            className="mt-1 w-full max-w-md bg-transparent text-3xl font-medium tracking-tight outline-none focus:border-b-2 focus:border-slate-900" />
          <p className="mt-1 text-sm text-slate-500">Due {PROJECT.due} · {w.done} of {w.total} tasks complete</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => w.notify("info", "Share link copied (simulated).")}
            className="h-11 rounded-full border border-slate-300 px-5 text-sm font-semibold hover:border-slate-900">Share</button>
          <button onClick={w.addTask} disabled={w.loading}
            className="h-11 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40">New task</button>
        </div>
      </div>

      {/* KPIs — typographic, no cards */}
      <dl className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label}>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">{k.label}</dt>
            <dd className="mt-1 text-3xl font-medium tabular-nums">{k.value}</dd>
            <dd className="text-xs text-slate-500">{k.delta}</dd>
          </div>
        ))}
      </dl>

      <Tabs w={w} />

      {w.tab === "overview" && (
        <div className="grid gap-10 py-8 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Progress</h3>
            <p className="mt-2 text-6xl font-light tabular-nums">{w.pct}<span className="text-2xl text-slate-400">%</span></p>
            <div className="mt-4 h-1 bg-slate-100" role="progressbar" aria-valuenow={w.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
              <div className="h-full bg-slate-900 transition-all" style={{ width: `${w.pct}%` }} />
            </div>
            <div className="mt-6 flex h-20 items-end gap-2" aria-hidden>
              {PROJECT.weekProgress.map((v, i) => (
                <div key={i} className="flex-1 bg-slate-200" style={{ height: `${v}%` }}>
                  <div className="h-full w-full bg-slate-900/70" style={{ height: `${Math.min(100, v + 20)}%` }} />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">Weekly completion, last 8 weeks (text equivalent in Tasks tab).</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Up next</h3>
            <ul className="mt-3 divide-y divide-slate-100">
              {w.tasks.filter((t) => t.status !== "done").slice(0, 4).map((t) => (
                <li key={t.id}><TaskButton task={t} onOpen={() => w.setSelected(t)} minimal /></li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {w.tab === "tasks" && <TaskList w={w} />}
      {w.tab === "activity" && (
        <ul className="divide-y divide-slate-100 py-4">
          {ACTIVITY.map((a, i) => (
            <li key={i} className="py-3 text-sm"><b>{a.who}</b> <span className="text-slate-600">{a.what}</span> <span className="block text-xs text-slate-400">{a.when}</span></li>
          ))}
        </ul>
      )}

      <StatesBar w={w} />
      {w.notice && (
        <p role="status" className={cx("mt-4 border-l-2 py-2 pl-3 text-sm", w.notice.kind === "success" ? "border-emerald-600" : "border-slate-400")}>
          {w.notice.text}
        </p>
      )}
      {w.selected && <TaskDialog task={w.selected} onClose={() => w.setSelected(null)} onToggle={() => { w.toggleDone(w.selected!.id); }} />}
    </div>
  );
}

export function Tabs({ w }: { w: ReturnType<typeof useWorkspace> }) {
  return (
    <div role="tablist" aria-label="Workspace views" className="flex gap-6 border-b border-slate-200">
      {(["overview", "tasks", "activity"] as const).map((t) => (
        <button key={t} role="tab" aria-selected={w.tab === t} onClick={() => w.setTab(t)}
          className={cx("relative py-3 text-sm font-semibold capitalize", w.tab === t ? "text-slate-900" : "text-slate-400 hover:text-slate-600")}>
          {t}
          {w.tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-slate-900" aria-hidden />}
        </button>
      ))}
    </div>
  );
}

export function TaskButton({ task, onOpen, minimal }: { task: WsTask; onOpen: () => void; minimal?: boolean }) {
  return (
    <button onClick={onOpen} className={cx("flex w-full items-center gap-3 py-3 text-left", !minimal && "rounded-xl px-2 hover:bg-slate-50")}>
      <span aria-hidden className={cx("h-2 w-2 shrink-0 rounded-full", task.status === "done" ? "bg-emerald-600" : task.status === "blocked" ? "bg-rose-600" : task.status === "doing" ? "bg-slate-900" : "bg-slate-300")} />
      <span className="min-w-0 flex-1"><span className={cx("block truncate text-sm font-medium", task.status === "done" && "text-slate-400 line-through")}>{task.title}</span>
        <span className="text-xs text-slate-400">{STATUS[task.status]} · {task.owner} · due {task.due}</span></span>
    </button>
  );
}

export function TaskList({ w }: { w: ReturnType<typeof useWorkspace> }) {
  return (
    <div className="py-6">
      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="min-q">Search tasks</label>
        <input id="min-q" value={w.query} onChange={(e) => w.setQuery(e.target.value)} placeholder="Search tasks…"
          className="h-11 min-w-0 flex-1 rounded-full border border-slate-300 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-900" />
        <div className="flex gap-1" role="group" aria-label="Status filter">
          {(["all", "todo", "doing", "done", "blocked"] as const).map((s) => (
            <button key={s} onClick={() => w.setStatus(s)} aria-pressed={w.status === s}
              className={cx("h-11 rounded-full px-3 text-xs font-semibold capitalize", w.status === s ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100")}>
              {s === "all" ? "All" : STATUS[s]}
            </button>
          ))}
        </div>
      </div>
      {w.loading ? (
        <div className="space-y-3 py-6" aria-busy="true" aria-label="Loading tasks">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse bg-slate-100" />)}
        </div>
      ) : w.errorSim ? (
        <div role="alert" className="mt-6 border border-rose-300 p-6 text-center">
          <p className="font-semibold">Couldn't load tasks (simulated 500).</p>
          <button onClick={w.retry} className="mt-3 h-10 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white">Retry</button>
        </div>
      ) : w.visible.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-medium">No tasks match.</p>
          <p className="mt-1 text-sm text-slate-500">Try a different search or status.</p>
          <button onClick={() => { w.setQuery(""); w.setStatus("all"); }} className="mt-3 text-sm font-semibold underline">Clear filters</button>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {w.visible.map((t) => (
            <li key={t.id} className="flex items-center gap-3">
              <input type="checkbox" checked={t.status === "done"} onChange={() => w.toggleDone(t.id)}
                aria-label={`Mark “${t.title}” ${t.status === "done" ? "not done" : "done"}`} className="h-5 w-5 shrink-0 accent-slate-900" />
              <span className="min-w-0 flex-1"><TaskButton task={t} onOpen={() => w.setSelected(t)} minimal /></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function StatesBar({ w }: { w: ReturnType<typeof useWorkspace> }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2 border-t border-slate-200 pt-4 text-xs">
      <button onClick={w.refresh} disabled={w.loading} className="rounded-full border border-slate-300 px-3 py-1.5 font-semibold disabled:opacity-40">
        {w.loading ? "Refreshing…" : "↻ Refresh (loading demo)"}
      </button>
      <button onClick={w.triggerError} className="rounded-full border border-slate-300 px-3 py-1.5 font-semibold">⚠ Simulate error</button>
      <button onClick={w.reset} className="rounded-full border border-slate-300 px-3 py-1.5 font-semibold">↺ Reset demo</button>
      <span className="ml-auto self-center text-slate-400">States: loading · empty · error · success (via task toggle)</span>
    </div>
  );
}

export function TaskDialog({ task, onClose, onToggle }: { task: WsTask; onClose: () => void; onToggle: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md border border-slate-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{STATUS[task.status]} · {task.priority} priority</p>
        <h3 className="mt-2 text-2xl font-medium tracking-tight">{task.title}</h3>
        <p className="mt-2 text-sm text-slate-500">Owner {task.owner} · due {task.due}</p>
        <div className="mt-6 flex gap-2">
          <button onClick={onToggle} className="h-11 flex-1 rounded-full bg-slate-900 text-sm font-semibold text-white">
            {task.status === "done" ? "Reopen task" : "Mark done"}
          </button>
          <button ref={closeRef} onClick={onClose} className="h-11 rounded-full border border-slate-300 px-5 text-sm font-semibold">Close</button>
        </div>
      </div>
    </div>
  );
}
