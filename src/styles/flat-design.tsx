/** Flat Design — solid blocks, no shadows, icons + text (never color alone). */
import React from "react";
import { useWorkspace, KPIS, ACTIVITY, PROJECT, type WsTask } from "./workspace";
import { cx } from "../lib/core";

const BLOCK: Record<string, string> = { todo: "bg-slate-500", doing: "bg-sky-500", done: "bg-emerald-500", blocked: "bg-rose-500" };
const ICON: Record<string, string> = { todo: "○", doing: "◐", done: "●", blocked: "▲" };
const LABEL: Record<string, string> = { todo: "To do", doing: "Doing", done: "Done", blocked: "Blocked" };
const KPI_BG = ["bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-emerald-500"];

export default function FlatDemo() {
  const w = useWorkspace();
  return (
    <div className="rounded-2xl bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-900 p-4 text-white">
        <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-xl font-black text-slate-900">A</span>
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="fl-name">Project name</label>
          <input id="fl-name" value={w.name} onChange={(e) => w.setName(e.target.value)}
            className="w-full min-w-0 rounded-lg bg-transparent text-xl font-extrabold outline-none focus:bg-white/10" />
          <p className="text-xs font-semibold text-slate-300">{PROJECT.client} · Due {PROJECT.due}</p>
        </div>
        <button onClick={() => w.notify("info", "Share link copied (simulated).")}
          className="h-11 rounded-xl bg-white/15 px-4 text-sm font-bold hover:bg-white/25">Share</button>
        <button onClick={w.addTask} disabled={w.loading}
          className="h-11 rounded-xl bg-amber-400 px-4 text-sm font-black text-slate-900 hover:bg-amber-300 disabled:opacity-50">+ New task</button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPIS.map((k, i) => (
          <div key={k.label} className={cx("rounded-2xl p-4 text-white", KPI_BG[i])}>
            <p className="text-[11px] font-bold uppercase tracking-wider opacity-90">{k.label}</p>
            <p className="text-2xl font-black tabular-nums">{k.value}</p>
            <p className="text-xs font-bold opacity-90">▸ {k.delta}</p>
          </div>
        ))}
      </div>

      <div role="tablist" aria-label="Workspace views" className="mt-3 grid grid-cols-3 gap-2">
        {(["overview", "tasks", "activity"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={w.tab === t} onClick={() => w.setTab(t)}
            className={cx("rounded-xl py-2.5 text-sm font-black capitalize", w.tab === t ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>{t}</button>
        ))}
      </div>

      {w.tab === "overview" && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-100 p-5">
            <div className="flex items-baseline justify-between"><b>Progress</b><span className="text-3xl font-black tabular-nums">{w.pct}%</span></div>
            <div className="mt-2 h-4 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={w.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${w.pct}%` }} />
            </div>
            <div className="mt-4 flex h-16 items-end gap-1" aria-hidden>
              {PROJECT.weekProgress.map((v, i) => <div key={i} className={cx("flex-1 rounded-t", i % 3 === 0 ? "bg-rose-500" : i % 3 === 1 ? "bg-amber-500" : "bg-emerald-500")} style={{ height: `${v}%` }} />)}
            </div>
          </div>
          <div className="rounded-2xl bg-sky-500 p-5 text-white">
            <b>■ Up next</b>
            <ul className="mt-2 space-y-2">
              {w.tasks.filter((t) => t.status !== "done").slice(0, 3).map((t) => (
                <li key={t.id}>
                  <button onClick={() => w.setSelected(t)} className="w-full truncate rounded-xl bg-white px-3 py-2 text-left text-sm font-bold text-slate-900 hover:bg-sky-50">{ICON[t.status]} {t.title}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {w.tab === "tasks" && (
        <div className="mt-3 rounded-2xl bg-slate-100 p-4">
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="fl-q">Search tasks</label>
            <input id="fl-q" value={w.query} onChange={(e) => w.setQuery(e.target.value)} placeholder="Search…"
              className="h-11 min-w-0 flex-1 rounded-xl border-2 border-transparent bg-white px-3 text-sm font-semibold outline-none placeholder:text-slate-400 focus:border-slate-900" />
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Status filter">
              {(["all", "todo", "doing", "done", "blocked"] as const).map((s) => (
                <button key={s} onClick={() => w.setStatus(s)} aria-pressed={w.status === s}
                  className={cx("h-11 rounded-xl px-3 text-xs font-black", w.status === s ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-200")}>
                  {s === "all" ? "✳ All" : `${ICON[s]} ${LABEL[s]}`}
                </button>
              ))}
            </div>
          </div>
          {w.loading ? (
            <div className="space-y-2 py-4" aria-busy="true" aria-label="Loading tasks">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white" />)}
            </div>
          ) : w.errorSim ? (
            <div role="alert" className="mt-3 rounded-2xl bg-rose-500 p-6 text-center text-white">
              <p className="text-lg font-black">▲ Load failed (simulated).</p>
              <button onClick={w.retry} className="mt-3 h-11 rounded-xl bg-white px-6 text-sm font-black text-slate-900">Retry</button>
            </div>
          ) : w.visible.length === 0 ? (
            <div className="rounded-xl bg-white py-10 text-center"><p className="text-4xl">○</p><p className="mt-1 font-black">Nothing here</p>
              <button onClick={() => { w.setQuery(""); w.setStatus("all"); }} className="mt-1 text-sm font-bold text-sky-700 underline">Clear filters</button></div>
          ) : (
            <ul className="mt-3 space-y-2">
              {w.visible.map((t) => (
                <li key={t.id} className="flex items-center gap-2.5 rounded-xl bg-white p-2.5">
                  <span aria-hidden className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg font-black text-white", BLOCK[t.status])}>{ICON[t.status]}</span>
                  <input type="checkbox" checked={t.status === "done"} onChange={() => w.toggleDone(t.id)}
                    aria-label={`Mark “${t.title}” ${t.status === "done" ? "not done" : "done"}`} className="h-6 w-6 shrink-0 accent-slate-900" />
                  <button onClick={() => w.setSelected(t)} className="min-w-0 flex-1 text-left">
                    <span className={cx("block truncate text-sm font-bold", t.status === "done" && "text-slate-400 line-through")}>{t.title}</span>
                    <span className="text-xs font-semibold text-slate-500">{ICON[t.status]} {LABEL[t.status]} · {t.due}</span>
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
            <li key={i} className="rounded-xl bg-slate-100 p-3 text-sm"><b>■ {a.who}</b> {a.what} <span className="text-xs text-slate-500">· {a.when}</span></li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={w.refresh} disabled={w.loading} className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-black text-white disabled:opacity-50">{w.loading ? "Loading…" : "↻ Refresh"}</button>
        <button onClick={w.triggerError} className="h-11 rounded-xl bg-rose-500 px-4 text-sm font-black text-white">⚠ Error</button>
        <button onClick={w.reset} className="h-11 rounded-xl bg-slate-200 px-4 text-sm font-black text-slate-700">↺ Reset</button>
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-500">Flat affordances: every status pairs an icon + label; links are underlined.</p>
      {w.notice && <p role="status" className="mt-2 rounded-xl bg-emerald-500 p-3 text-sm font-bold text-white">{w.notice.kind === "success" ? "● " : "■ "}{w.notice.text}</p>}
      {w.selected && <FlatDialog task={w.selected} onClose={() => w.setSelected(null)} onToggle={() => w.toggleDone(w.selected!.id)} />}
    </div>
  );
}

function FlatDialog({ task, onClose, onToggle }: { task: WsTask; onClose: () => void; onToggle: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 p-4" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
        <span className={cx("rounded-lg px-2.5 py-1 text-xs font-black text-white", BLOCK[task.status])}>{ICON[task.status]} {LABEL[task.status]} · {task.priority}</span>
        <h3 className="mt-2 text-xl font-black">{task.title}</h3>
        <p className="mt-1 text-sm font-semibold text-slate-500">Owner {task.owner} · due {task.due}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={onToggle} className="h-11 flex-1 rounded-xl bg-slate-900 text-sm font-black text-white">{task.status === "done" ? "Reopen" : "Mark done"}</button>
          <button ref={closeRef} onClick={onClose} className="h-11 rounded-xl bg-slate-200 px-5 text-sm font-black">Close</button>
        </div>
      </div>
    </div>
  );
}
