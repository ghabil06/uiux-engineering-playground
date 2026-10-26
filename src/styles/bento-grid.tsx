/** Bento Grid — hero tile + contrasting supporters, reflowing on mobile. */
import React from "react";
import { useWorkspace, KPIS, ACTIVITY, PROJECT, type WsTask } from "./workspace";
import { cx } from "../lib/core";

const LABEL: Record<string, string> = { todo: "To do", doing: "Doing", done: "Done", blocked: "Blocked" };

export default function BentoDemo() {
  const w = useWorkspace();
  return (
    <div className="rounded-3xl bg-slate-100 p-3 sm:p-4">
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {/* hero tile */}
        <div className="col-span-2 row-span-2 flex flex-col rounded-3xl bg-slate-900 p-6 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{PROJECT.client}</p>
          <label className="sr-only" htmlFor="bn-name">Project name</label>
          <input id="bn-name" value={w.name} onChange={(e) => w.setName(e.target.value)}
            className="mt-1 w-full min-w-0 rounded-lg bg-transparent text-2xl font-black tracking-tight outline-none focus:ring-2 focus:ring-cyan-300 sm:text-3xl" />
          <p className="mt-2 text-6xl font-black tabular-nums sm:text-7xl">{w.pct}<span className="text-2xl text-slate-400">%</span></p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuenow={w.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" style={{ width: `${w.pct}%` }} />
          </div>
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            <button onClick={w.addTask} disabled={w.loading} className="h-11 flex-1 rounded-2xl bg-white px-4 text-sm font-black text-slate-900 disabled:opacity-50">+ New task</button>
            <button onClick={() => w.notify("info", "Share link copied (simulated).")} className="h-11 rounded-2xl bg-white/10 px-4 text-sm font-bold backdrop-blur hover:bg-white/20">Share</button>
          </div>
        </div>
        {/* supporter tiles */}
        {KPIS.map((k, i) => (
          <div key={k.label} className={cx("rounded-3xl p-4", i === 0 ? "bg-amber-300 text-slate-900" : i === 1 ? "bg-white" : i === 2 ? "bg-rose-500 text-white" : "bg-emerald-400 text-emerald-950")}>
            <p className="text-[11px] font-black uppercase tracking-wider opacity-70">{k.label}</p>
            <p className="text-2xl font-black tabular-nums">{k.value}</p>
            <p className="text-xs font-semibold opacity-80">{k.delta}</p>
          </div>
        ))}
        {/* tabs tile */}
        <div className="col-span-2 rounded-3xl bg-white p-2 lg:col-span-4">
          <div role="tablist" aria-label="Workspace views" className="flex gap-1">
            {(["overview", "tasks", "activity"] as const).map((t) => (
              <button key={t} role="tab" aria-selected={w.tab === t} onClick={() => w.setTab(t)}
                className={cx("flex-1 rounded-2xl py-2.5 text-sm font-black capitalize", w.tab === t ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100")}>{t}</button>
            ))}
          </div>
        </div>

        {w.tab === "overview" && (
          <>
            <div className="col-span-2 rounded-3xl bg-white p-5">
              <b>Weekly momentum</b>
              <div className="mt-3 flex h-24 items-end gap-1.5" aria-hidden>
                {PROJECT.weekProgress.map((v, i) => (
                  <div key={i} className={cx("flex-1 rounded-t-lg", i % 2 ? "bg-violet-500" : "bg-slate-900")} style={{ height: `${v}%` }} />
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">Completion %, last 8 weeks. Counts match the Tasks tab.</p>
            </div>
            <div className="col-span-2 rounded-3xl bg-gradient-to-r from-violet-600 to-cyan-500 p-5 text-white lg:col-span-2">
              <b>Up next</b>
              <ul className="mt-2 space-y-1.5">
                {w.tasks.filter((t) => t.status !== "done").slice(0, 3).map((t) => (
                  <li key={t.id}>
                    <button onClick={() => w.setSelected(t)} className="flex w-full items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-left text-sm font-semibold backdrop-blur hover:bg-white/25">
                      <span className="truncate">{t.title}</span><span className="ml-auto shrink-0 text-xs opacity-80">{t.due}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {w.tab === "tasks" && (
          <div className="col-span-2 rounded-3xl bg-white p-4 lg:col-span-4">
            <div className="flex flex-wrap gap-2">
              <label className="sr-only" htmlFor="bn-q">Search tasks</label>
              <input id="bn-q" value={w.query} onChange={(e) => w.setQuery(e.target.value)} placeholder="Search tasks…"
                className="h-11 min-w-0 flex-1 rounded-2xl bg-slate-100 px-4 text-sm font-semibold outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900" />
              <div className="flex flex-wrap gap-1" role="group" aria-label="Status filter">
                {(["all", "todo", "doing", "done", "blocked"] as const).map((s) => (
                  <button key={s} onClick={() => w.setStatus(s)} aria-pressed={w.status === s}
                    className={cx("h-11 rounded-2xl px-3 text-xs font-black capitalize", w.status === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500")}>
                    {s === "all" ? "All" : LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
            {w.loading ? (
              <div className="grid gap-2 py-4 sm:grid-cols-2" aria-busy="true" aria-label="Loading tasks">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100" />)}
              </div>
            ) : w.errorSim ? (
              <div role="alert" className="mt-3 rounded-2xl bg-rose-500 p-6 text-center text-white">
                <p className="font-black">Couldn't load tasks (simulated 500).</p>
                <button onClick={w.retry} className="mt-3 h-10 rounded-2xl bg-white px-5 text-sm font-black text-slate-900">Retry</button>
              </div>
            ) : w.visible.length === 0 ? (
              <div className="py-10 text-center"><p className="font-black">No tasks match</p>
                <button onClick={() => { w.setQuery(""); w.setStatus("all"); }} className="mt-2 text-sm font-bold underline">Clear filters</button></div>
            ) : (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {w.visible.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 rounded-2xl bg-slate-50 p-2.5">
                    <input type="checkbox" checked={t.status === "done"} onChange={() => w.toggleDone(t.id)}
                      aria-label={`Mark “${t.title}” ${t.status === "done" ? "not done" : "done"}`} className="h-6 w-6 shrink-0 accent-slate-900" />
                    <button onClick={() => w.setSelected(t)} className="min-w-0 flex-1 text-left">
                      <span className={cx("block truncate text-sm font-bold", t.status === "done" && "text-slate-400 line-through")}>{t.title}</span>
                      <span className="text-xs text-slate-500">{LABEL[t.status]} · {t.due}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {w.tab === "activity" && (
          <div className="col-span-2 space-y-2 lg:col-span-4">
            {ACTIVITY.map((a, i) => (
              <p key={i} className="rounded-2xl bg-white p-3 text-sm"><b>{a.who}</b> {a.what} <span className="text-xs text-slate-400">· {a.when}</span></p>
            ))}
          </div>
        )}

        {/* states tile */}
        <div className="col-span-2 flex flex-wrap items-center gap-2 rounded-3xl bg-slate-900 p-4 text-white lg:col-span-4">
          <button onClick={w.refresh} disabled={w.loading} className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold disabled:opacity-40 hover:bg-white/20">{w.loading ? "Refreshing…" : "↻ Refresh"}</button>
          <button onClick={w.triggerError} className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/20">⚠ Error</button>
          <button onClick={w.reset} className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/20">↺ Reset</button>
          {w.notice && <p role="status" className="w-full text-xs text-slate-300">{w.notice.kind === "success" ? "✓ " : "ℹ "}{w.notice.text}</p>}
        </div>
      </div>
      {w.selected && <BentoDialog task={w.selected} onClose={() => w.setSelected(null)} onToggle={() => w.toggleDone(w.selected!.id)} />}
    </div>
  );
}

function BentoDialog({ task, onClose, onToggle }: { task: WsTask; onClose: () => void; onToggle: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-3xl border-4 border-slate-900 bg-amber-300 p-6 text-slate-900 shadow-[8px_8px_0_#0f172a]">
        <p className="text-xs font-black uppercase tracking-widest">{LABEL[task.status]} · {task.priority}</p>
        <h3 className="mt-1 text-2xl font-black">{task.title}</h3>
        <p className="mt-1 text-sm font-semibold">Owner {task.owner} · due {task.due}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={onToggle} className="h-11 flex-1 rounded-2xl bg-slate-900 text-sm font-black text-white">{task.status === "done" ? "Reopen" : "Mark done"}</button>
          <button ref={closeRef} onClick={onClose} className="h-11 rounded-2xl bg-white px-5 text-sm font-black">Close</button>
        </div>
      </div>
    </div>
  );
}
