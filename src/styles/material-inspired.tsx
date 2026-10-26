/**
 * Material-Inspired — paper elevations, FAB, state layers, DP grid.
 * Educational homage; not an official implementation of any external system.
 */
import React from "react";
import { useWorkspace, KPIS, ACTIVITY, PROJECT, type WsTask } from "./workspace";
import { cx } from "../lib/core";

const LABEL: Record<string, string> = { todo: "To do", doing: "In progress", done: "Done", blocked: "Blocked" };
const REST = { boxShadow: "0 1px 3px rgb(0 0 0 / .2)" } as const;
const RAISED = { boxShadow: "0 4px 12px rgb(103 58 183 / .25)" } as const;
const MODAL = { boxShadow: "0 12px 32px rgb(0 0 0 / .3)" } as const;

export default function MaterialDemo() {
  const w = useWorkspace();
  return (
    <div className="relative rounded-3xl bg-[#efeaf7] p-4 pb-20 sm:p-6 sm:pb-24">
      <div className="rounded-2xl bg-[#673ab7] p-5 text-white" style={RAISED}>
        <p className="text-xs font-medium uppercase tracking-wider text-white/70">{PROJECT.client}</p>
        <label className="sr-only" htmlFor="mt-name">Project name</label>
        <input id="mt-name" value={w.name} onChange={(e) => w.setName(e.target.value)}
          className="w-full min-w-0 rounded-lg bg-transparent text-2xl font-medium outline-none focus:bg-white/10" />
        <p className="mt-1 text-sm text-white/80">Due {PROJECT.due} · {w.done}/{w.total} tasks</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/25" role="progressbar" aria-valuenow={w.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${w.pct}%` }} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl bg-white p-4" style={REST}>
            <p className="text-xs font-medium text-slate-500">{k.label}</p>
            <p className="text-2xl font-medium tabular-nums">{k.value}</p>
            <p className="text-xs font-medium text-[#673ab7]">{k.delta}</p>
          </div>
        ))}
      </div>

      <div role="tablist" aria-label="Workspace views" className="mt-3 flex gap-1 rounded-2xl bg-white p-1" style={REST}>
        {(["overview", "tasks", "activity"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={w.tab === t} onClick={() => w.setTab(t)}
            className={cx("relative flex-1 rounded-xl py-2.5 text-sm font-medium capitalize", w.tab === t ? "bg-[#ede7f6] font-bold text-[#4527a0]" : "text-slate-500 hover:bg-slate-100")}>
            {t}
            {w.tab === t && <span aria-hidden className="absolute inset-x-6 -bottom-0.5 h-1 rounded-full bg-[#673ab7]" />}
          </button>
        ))}
      </div>

      {w.tab === "overview" && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5" style={REST}>
            <b>Weekly throughput</b>
            <div className="mt-3 flex h-20 items-end gap-1.5" aria-hidden>
              {PROJECT.weekProgress.map((v, i) => (
                <div key={i} className="flex-1 rounded-t bg-[#d1c4e9]"><div className="w-full rounded-t bg-[#673ab7]" style={{ height: `${v}%` }} /></div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">Same counts as the Tasks tab.</p>
          </div>
          <div className="rounded-2xl bg-white p-5" style={REST}>
            <b>Assigned to you</b>
            <ul className="mt-2 space-y-1">
              {w.tasks.filter((t) => t.owner === "You" || t.status === "blocked").slice(0, 3).map((t) => (
                <li key={t.id} className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-[#f3eefc]">
                  <button onClick={() => w.setSelected(t)} className="min-w-0 flex-1 truncate text-left font-medium">{t.title}</button>
                  <span className="rounded-full bg-[#ede7f6] px-2 py-0.5 text-[11px] font-bold text-[#4527a0]">{LABEL[t.status]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {w.tab === "tasks" && (
        <div className="mt-3 rounded-2xl bg-white p-4" style={REST}>
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="mt-q">Search tasks</label>
            <input id="mt-q" value={w.query} onChange={(e) => w.setQuery(e.target.value)} placeholder="Search tasks"
              className="h-12 min-w-0 flex-1 rounded-t-xl border-b-2 border-slate-300 bg-slate-100 px-4 text-sm outline-none placeholder:text-slate-500 focus:border-[#673ab7] focus:bg-[#f5f1fc]" />
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Status filter">
              {(["all", "todo", "doing", "done", "blocked"] as const).map((s) => (
                <button key={s} onClick={() => w.setStatus(s)} aria-pressed={w.status === s}
                  className={cx("h-9 rounded-full px-3.5 text-[13px] font-medium", w.status === s ? "bg-[#673ab7] font-bold text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                  {s === "all" ? "All" : LABEL[s]}
                </button>
              ))}
            </div>
          </div>
          {w.loading ? (
            <div className="space-y-2 py-4" aria-busy="true" aria-label="Loading tasks">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />)}
            </div>
          ) : w.errorSim ? (
            <div role="alert" className="mt-3 rounded-2xl bg-[#fce4ec] p-6 text-center">
              <p className="font-bold text-[#880e4f]">Couldn't load tasks (simulated error).</p>
              <button onClick={w.retry} className="mt-3 h-10 rounded-full bg-[#c2185b] px-6 text-sm font-bold text-white">Retry</button>
            </div>
          ) : w.visible.length === 0 ? (
            <div className="py-10 text-center"><p className="font-medium">No matching tasks</p>
              <button onClick={() => { w.setQuery(""); w.setStatus("all"); }} className="mt-1 text-sm font-bold text-[#673ab7]">Clear filters</button></div>
          ) : (
            <ul className="mt-2 divide-y divide-slate-100">
              {w.visible.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-[#f7f3fd]">
                  <input type="checkbox" checked={t.status === "done"} onChange={() => w.toggleDone(t.id)}
                    aria-label={`Mark “${t.title}” ${t.status === "done" ? "not done" : "done"}`} className="h-5 w-5 shrink-0 accent-[#673ab7]" />
                  <button onClick={() => w.setSelected(t)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                    <span className={cx("min-w-0 flex-1 truncate text-sm font-medium", t.status === "done" && "text-slate-400 line-through")}>{t.title}</span>
                    <span className="hidden shrink-0 text-xs text-slate-400 sm:block">{t.due}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {w.tab === "activity" && (
        <ul className="mt-3 space-y-2">
          {ACTIVITY.map((a, i) => (
            <li key={i} className="flex gap-3 rounded-2xl bg-white p-3.5 text-sm" style={REST}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#673ab7] text-xs font-bold text-white">{a.who.split(" ").map((x) => x[0]).join("")}</span>
              <span><b>{a.who}</b> {a.what}<span className="block text-xs text-slate-500">{a.when}</span></span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={w.refresh} disabled={w.loading} className="h-10 rounded-full bg-white px-4 text-sm font-bold text-[#4527a0] disabled:opacity-50" style={REST}>{w.loading ? "Refreshing…" : "↻ Refresh"}</button>
        <button onClick={w.triggerError} className="h-10 rounded-full bg-white px-4 text-sm font-bold text-[#4527a0]" style={REST}>⚠ Simulate error</button>
        <button onClick={w.reset} className="h-10 rounded-full bg-white px-4 text-sm font-bold text-[#4527a0]" style={REST}>↺ Reset</button>
      </div>
      {w.notice && <p role="status" className="mt-3 rounded-2xl bg-slate-900 p-3.5 text-sm font-medium text-white">{w.notice.kind === "success" ? "✓ " : "ℹ "}{w.notice.text}</p>}

      <button onClick={w.addTask} aria-label="Create new task"
        className="absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#673ab7] text-3xl font-light text-white transition hover:bg-[#5e35b1] active:scale-95" style={MODAL}>+</button>
      {w.selected && <MtDialog task={w.selected} onClose={() => w.setSelected(null)} onToggle={() => w.toggleDone(w.selected!.id)} />}
    </div>
  );
}

function MtDialog({ task, onClose, onToggle }: { task: WsTask; onClose: () => void; onToggle: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white" style={MODAL}>
        <div className="bg-[#673ab7] px-6 py-4 text-white">
          <p className="text-xs font-medium uppercase tracking-wider text-white/75">{LABEL[task.status]} · {task.priority} priority</p>
          <h3 className="mt-1 text-xl font-medium">{task.title}</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500">Owner {task.owner} · due {task.due}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button ref={closeRef} onClick={onClose} className="h-10 rounded-full px-5 text-sm font-bold text-[#673ab7] hover:bg-[#f3eefc]">Close</button>
            <button onClick={onToggle} className="h-10 rounded-full bg-[#673ab7] px-5 text-sm font-bold text-white hover:bg-[#5e35b1]">{task.status === "done" ? "Reopen" : "Mark done"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
