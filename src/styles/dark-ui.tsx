/** Dark UI — layered elevation, neon accents, never pure black. */
import React from "react";
import { useWorkspace, KPIS, ACTIVITY, PROJECT, type WsTask } from "./workspace";
import { cx } from "../lib/core";

const DOT: Record<string, string> = { todo: "bg-slate-400", doing: "bg-cyan-300", done: "bg-emerald-400", blocked: "bg-rose-400" };
const LABEL: Record<string, string> = { todo: "To do", doing: "In progress", done: "Done", blocked: "Blocked" };

export default function DarkUIDemo() {
  const w = useWorkspace();
  return (
    <div className="rounded-3xl bg-[#0b0b14] p-5 text-slate-100 ring-1 ring-white/10 sm:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 text-lg font-black text-white">A</span>
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="dk-name">Project name</label>
          <input id="dk-name" value={w.name} onChange={(e) => w.setName(e.target.value)}
            className="w-full min-w-0 rounded-lg bg-transparent text-xl font-extrabold tracking-tight outline-none focus:ring-2 focus:ring-cyan-300" />
          <p className="flex items-center gap-1.5 text-xs text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden /> Live · Due {PROJECT.due}</p>
        </div>
        <button onClick={() => w.notify("info", "Share link copied (simulated).")}
          className="h-10 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-bold hover:bg-white/10">Share</button>
        <button onClick={w.addTask} disabled={w.loading}
          className="h-10 rounded-xl bg-cyan-400 px-4 text-sm font-black text-[#06202a] hover:bg-cyan-300 disabled:opacity-40">+ New task</button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{k.label}</p>
            <p className="mt-1 text-2xl font-black tabular-nums">{k.value}</p>
            <p className={cx("text-xs font-bold", k.tone === "up" ? "text-emerald-300" : k.tone === "warn" ? "text-amber-300" : k.tone === "bad" ? "text-rose-300" : "text-slate-400")}>{k.delta}</p>
          </div>
        ))}
      </div>

      <div role="tablist" aria-label="Workspace views" className="mt-5 flex gap-1 rounded-2xl bg-white/5 p-1 ring-1 ring-white/10">
        {(["overview", "tasks", "activity"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={w.tab === t} onClick={() => w.setTab(t)}
            className={cx("flex-1 rounded-xl py-2 text-sm font-bold capitalize", w.tab === t ? "bg-cyan-400 text-[#06202a]" : "text-slate-400 hover:text-white")}>{t}</button>
        ))}
      </div>

      {w.tab === "overview" && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
            <div className="flex items-baseline justify-between"><b>Progress</b><span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-3xl font-black tabular-nums text-transparent">{w.pct}%</span></div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={w.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-300 transition-all" style={{ width: `${w.pct}%` }} />
            </div>
            <div className="mt-4 flex h-20 items-end gap-1.5" aria-hidden>
              {PROJECT.weekProgress.map((v, i) => (
                <div key={i} className="flex-1 rounded-t bg-white/10"><div className="w-full rounded-t bg-gradient-to-t from-violet-600 to-cyan-300" style={{ height: `${v}%` }} /></div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
            <b>Status legend <span className="font-normal text-slate-400">(dot + text, never color alone)</span></b>
            <ul className="mt-3 space-y-2 text-sm">
              {(Object.keys(LABEL) as (keyof typeof LABEL)[]).map((s) => (
                <li key={s} className="flex items-center gap-2"><span aria-hidden className={cx("h-2.5 w-2.5 rounded-full", DOT[s])} /><b>{LABEL[s]}</b>
                  <span className="ml-auto tabular-nums text-slate-400">{w.tasks.filter((t) => t.status === s).length}</span></li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {w.tab === "tasks" && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[.04] p-4">
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="dk-q">Search tasks</label>
            <input id="dk-q" value={w.query} onChange={(e) => w.setQuery(e.target.value)} placeholder="Search tasks…"
              className="h-10 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-3 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-300" />
            <div className="flex flex-wrap gap-1" role="group" aria-label="Status filter">
              {(["all", "todo", "doing", "done", "blocked"] as const).map((s) => (
                <button key={s} onClick={() => w.setStatus(s)} aria-pressed={w.status === s}
                  className={cx("h-10 rounded-xl px-3 text-xs font-bold capitalize", w.status === s ? "bg-white text-slate-900" : "bg-white/5 text-slate-400 hover:bg-white/10")}>
                  {s === "all" ? "All" : LABEL[s]}
                </button>
              ))}
            </div>
          </div>
          {w.loading ? (
            <div className="space-y-2 py-4" aria-busy="true" aria-label="Loading tasks">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-white/10" />)}
            </div>
          ) : w.errorSim ? (
            <div role="alert" className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-6 text-center">
              <p className="font-extrabold text-rose-200">Couldn't load tasks (simulated 500).</p>
              <button onClick={w.retry} className="mt-3 h-10 rounded-xl bg-rose-500 px-5 text-sm font-bold text-white">Retry</button>
            </div>
          ) : w.visible.length === 0 ? (
            <div className="py-10 text-center"><p className="font-extrabold">No tasks match</p>
              <button onClick={() => { w.setQuery(""); w.setStatus("all"); }} className="mt-2 text-sm font-bold text-cyan-300 underline">Clear search & filters</button></div>
          ) : (
            <ul className="mt-3 divide-y divide-white/5">
              {w.visible.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <input type="checkbox" checked={t.status === "done"} onChange={() => w.toggleDone(t.id)}
                    aria-label={`Mark “${t.title}” ${t.status === "done" ? "not done" : "done"}`} className="h-5 w-5 shrink-0 accent-cyan-300" />
                  <button onClick={() => w.setSelected(t)} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-white/5">
                    <span aria-hidden className={cx("h-2.5 w-2.5 shrink-0 rounded-full", DOT[t.status])} />
                    <span className={cx("min-w-0 flex-1 truncate text-sm font-semibold", t.status === "done" && "text-slate-500 line-through")}>{t.title}</span>
                    <span className="shrink-0 text-xs text-slate-400">{LABEL[t.status]}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {w.tab === "activity" && (
        <ul className="mt-4 space-y-2">
          {ACTIVITY.map((a, i) => (
            <li key={i} className="rounded-2xl border border-white/10 bg-white/[.04] p-3 text-sm">
              <b>{a.who}</b> <span className="text-slate-300">{a.what}</span><span className="block text-xs text-slate-500">{a.when}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <button onClick={w.refresh} disabled={w.loading} className="rounded-full bg-white/10 px-3 py-1.5 font-bold disabled:opacity-40 hover:bg-white/15">{w.loading ? "Refreshing…" : "↻ Refresh"}</button>
        <button onClick={w.triggerError} className="rounded-full bg-white/10 px-3 py-1.5 font-bold hover:bg-white/15">⚠ Simulate error</button>
        <button onClick={w.reset} className="rounded-full bg-white/10 px-3 py-1.5 font-bold hover:bg-white/15">↺ Reset</button>
      </div>
      {w.notice && (
        <p role="status" className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-semibold">
          {w.notice.kind === "success" ? "✓ " : "ℹ "}{w.notice.text}
        </p>
      )}
      {w.selected && <DarkDialog task={w.selected} onClose={() => w.setSelected(null)} onToggle={() => w.toggleDone(w.selected!.id)} />}
    </div>
  );
}

function DarkDialog({ task, onClose, onToggle }: { task: WsTask; onClose: () => void; onToggle: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#14141f] p-6 text-slate-100 shadow-2xl">
        <p className="flex items-center gap-2 text-xs font-bold text-slate-400"><span aria-hidden className={cx("h-2.5 w-2.5 rounded-full", DOT[task.status])} />{LABEL[task.status]} · {task.priority} priority</p>
        <h3 className="mt-2 text-xl font-extrabold">{task.title}</h3>
        <p className="mt-1 text-sm text-slate-400">Owner {task.owner} · due {task.due}</p>
        <div className="mt-5 flex gap-2">
          <button onClick={onToggle} className="h-11 flex-1 rounded-xl bg-cyan-400 text-sm font-black text-[#06202a]">{task.status === "done" ? "Reopen" : "Mark done"}</button>
          <button ref={closeRef} onClick={onClose} className="h-11 rounded-xl border border-white/15 px-5 text-sm font-bold">Close</button>
        </div>
      </div>
    </div>
  );
}
