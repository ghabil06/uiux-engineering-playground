/** Light UI — bright surfaces, soft borders, familiar blue actions. */
import React from "react";
import { useWorkspace, KPIS, ACTIVITY, PROJECT, type WsTask } from "./workspace";
import { cx } from "../lib/core";

const PILL: Record<string, string> = {
  todo: "bg-slate-100 text-slate-600", doing: "bg-sky-100 text-sky-800",
  done: "bg-emerald-100 text-emerald-800", blocked: "bg-rose-100 text-rose-800",
};
const LABEL: Record<string, string> = { todo: "To do", doing: "In progress", done: "Done", blocked: "Blocked" };

export default function LightUIDemo() {
  const w = useWorkspace();
  return (
    <div className="rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/70 to-white p-5 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-lg font-black text-white shadow-md shadow-sky-600/25">A</span>
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="li-name">Project name</label>
          <input id="li-name" value={w.name} onChange={(e) => w.setName(e.target.value)}
            className="w-full min-w-0 rounded-lg bg-transparent text-xl font-extrabold tracking-tight outline-none focus:bg-white focus:ring-2 focus:ring-sky-300" />
          <p className="text-xs text-slate-500">{PROJECT.client} · Due {PROJECT.due}</p>
        </div>
        <span className="flex -space-x-2" aria-label="4 team members">
          {PROJECT.members.map((m) => (
            <span key={m} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold text-slate-600">{m}</span>
          ))}
        </span>
        <button onClick={() => w.notify("info", "Share link copied (simulated).")}
          className="h-10 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm hover:border-sky-400 hover:text-sky-700">Share</button>
        <button onClick={w.addTask} disabled={w.loading}
          className="h-10 rounded-xl bg-sky-600 px-4 text-sm font-bold text-white shadow-md shadow-sky-600/25 hover:bg-sky-700 disabled:opacity-50">+ New task</button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{k.label}</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums">{k.value}</p>
            <p className={cx("text-xs font-semibold", k.tone === "up" ? "text-emerald-600" : k.tone === "warn" ? "text-amber-600" : k.tone === "bad" ? "text-rose-600" : "text-slate-400")}>{k.delta}</p>
          </div>
        ))}
      </div>

      <div role="tablist" aria-label="Workspace views" className="mt-5 flex gap-1 rounded-2xl bg-slate-100 p-1">
        {(["overview", "tasks", "activity"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={w.tab === t} onClick={() => w.setTab(t)}
            className={cx("flex-1 rounded-xl py-2 text-sm font-bold capitalize", w.tab === t ? "bg-white text-slate-900 shadow" : "text-slate-500 hover:text-slate-700")}>{t}</button>
        ))}
      </div>

      {w.tab === "overview" && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-baseline justify-between"><b>Progress</b><span className="text-3xl font-black tabular-nums">{w.pct}%</span></div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={w.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all" style={{ width: `${w.pct}%` }} />
            </div>
            <div className="mt-4 flex h-20 items-end gap-1.5" aria-hidden>
              {PROJECT.weekProgress.map((v, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-sky-100"><div className="w-full rounded-t-md bg-sky-500" style={{ height: `${v}%` }} /></div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">Weekly completion bars — same values as the Tasks tab counts.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <b>Needs attention</b>
            <ul className="mt-2 space-y-2">
              {w.tasks.filter((t) => t.status === "blocked" || t.priority === "high").slice(0, 3).map((t) => (
                <li key={t.id}>
                  <button onClick={() => w.setSelected(t)} className="flex w-full items-center gap-2 rounded-xl border border-slate-100 p-2.5 text-left text-sm hover:border-sky-300 hover:bg-sky-50/50">
                    <span className={cx("rounded-full px-2 py-0.5 text-[11px] font-bold", PILL[t.status])}>{LABEL[t.status]}</span>
                    <span className="min-w-0 flex-1 truncate font-semibold">{t.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {w.tab === "tasks" && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="li-q">Search tasks</label>
            <input id="li-q" value={w.query} onChange={(e) => w.setQuery(e.target.value)} placeholder="🔍 Search tasks…"
              className="h-10 min-w-0 flex-1 rounded-xl border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
            <div className="flex flex-wrap gap-1" role="group" aria-label="Status filter">
              {(["all", "todo", "doing", "done", "blocked"] as const).map((s) => (
                <button key={s} onClick={() => w.setStatus(s)} aria-pressed={w.status === s}
                  className={cx("h-10 rounded-xl px-3 text-xs font-bold capitalize", w.status === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                  {s === "all" ? "All" : LABEL[s]}
                </button>
              ))}
            </div>
          </div>
          {w.loading ? (
            <div className="space-y-2 py-4" aria-busy="true" aria-label="Loading tasks">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}
            </div>
          ) : w.errorSim ? (
            <div role="alert" className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
              <p className="font-extrabold text-rose-900">Couldn't load tasks (simulated 500).</p>
              <p className="mt-1 text-sm text-rose-700">Your filters were kept — nothing was lost.</p>
              <button onClick={w.retry} className="mt-3 h-10 rounded-xl bg-rose-600 px-5 text-sm font-bold text-white hover:bg-rose-700">Retry</button>
            </div>
          ) : w.visible.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-4xl">🗂️</p><p className="mt-2 font-extrabold">No tasks match</p>
              <button onClick={() => { w.setQuery(""); w.setStatus("all"); }} className="mt-2 text-sm font-bold text-sky-700 underline">Clear search & filters</button>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {w.visible.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <input type="checkbox" checked={t.status === "done"} onChange={() => w.toggleDone(t.id)}
                    aria-label={`Mark “${t.title}” ${t.status === "done" ? "not done" : "done"}`} className="h-5 w-5 shrink-0 accent-sky-600" />
                  <button onClick={() => w.setSelected(t)} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-slate-50">
                    <span className={cx("min-w-0 flex-1 truncate text-sm font-semibold", t.status === "done" && "text-slate-400 line-through")}>{t.title}</span>
                    <span className={cx("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold", PILL[t.status])}>{LABEL[t.status]}</span>
                  </button>
                  <span className="hidden shrink-0 text-xs text-slate-400 sm:block">{t.due}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {w.tab === "activity" && (
        <ul className="mt-4 space-y-2">
          {ACTIVITY.map((a, i) => (
            <li key={i} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-black text-sky-700">{a.who.split(" ").map((x) => x[0]).join("")}</span>
              <span><b>{a.who}</b> {a.what}<span className="block text-xs text-slate-400">{a.when}</span></span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <button onClick={w.refresh} disabled={w.loading} className="rounded-full bg-white px-3 py-1.5 font-bold shadow-sm ring-1 ring-slate-200 disabled:opacity-50 hover:ring-sky-300">{w.loading ? "Refreshing…" : "↻ Refresh"}</button>
        <button onClick={w.triggerError} className="rounded-full bg-white px-3 py-1.5 font-bold shadow-sm ring-1 ring-slate-200 hover:ring-rose-300">⚠ Simulate error</button>
        <button onClick={w.reset} className="rounded-full bg-white px-3 py-1.5 font-bold shadow-sm ring-1 ring-slate-200">↺ Reset</button>
      </div>
      {w.notice && (
        <p role="status" className={cx("mt-3 rounded-2xl border p-3 text-sm font-semibold", w.notice.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-sky-200 bg-sky-50 text-sky-900")}>
          {w.notice.kind === "success" ? "✓ " : "ℹ "}{w.notice.text}
        </p>
      )}
      {w.selected && <LightDialog task={w.selected} onClose={() => w.setSelected(null)} onToggle={() => w.toggleDone(w.selected!.id)} />}
    </div>
  );
}

function LightDialog({ task, onClose, onToggle }: { task: WsTask; onClose: () => void; onToggle: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <span className={cx("rounded-full px-2.5 py-1 text-xs font-bold", PILL[task.status])}>{LABEL[task.status]} · {task.priority} priority</span>
        <h3 className="mt-2 text-xl font-extrabold">{task.title}</h3>
        <p className="mt-1 text-sm text-slate-500">Owner {task.owner} · due {task.due}</p>
        <div className="mt-5 flex gap-2">
          <button onClick={onToggle} className="h-11 flex-1 rounded-xl bg-sky-600 text-sm font-bold text-white hover:bg-sky-700">{task.status === "done" ? "Reopen" : "Mark done"}</button>
          <button ref={closeRef} onClick={onClose} className="h-11 rounded-xl border border-slate-300 px-5 text-sm font-bold">Close</button>
        </div>
      </div>
    </div>
  );
}
