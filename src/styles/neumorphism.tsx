/**
 * Neumorphism — soft extrusion from one slab.
 * Deliberately exceeds the "pure" low-contrast recipe: 3:1+ controls,
 * text labels on every state. The trade-off is documented, not hidden.
 */
import React from "react";
import { useWorkspace, KPIS, ACTIVITY, PROJECT, type WsTask } from "./workspace";
import { cx } from "../lib/core";

const LABEL: Record<string, string> = { todo: "To do", doing: "Doing", done: "Done", blocked: "Blocked" };

const RAISED = "bg-[#e0e5ec] rounded-2xl";
const raisedShadow = { boxShadow: "7px 7px 14px #b8bec9, -7px -7px 14px #ffffff" } as const;
const sunkShadow = { boxShadow: "inset 5px 5px 10px #b8bec9, inset -5px -5px 10px #ffffff" } as const;

export default function NeoDemo() {
  const w = useWorkspace();
  return (
    <div className="rounded-3xl bg-[#e0e5ec] p-5 text-slate-700 sm:p-7">
      <div className={cx(RAISED, "flex flex-wrap items-center gap-3 p-4")} style={raisedShadow}>
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="ne-name">Project name</label>
          <input id="ne-name" value={w.name} onChange={(e) => w.setName(e.target.value)}
            className="w-full min-w-0 rounded-xl bg-transparent px-2 py-1 text-xl font-extrabold outline-none focus:ring-2 focus:ring-slate-500" />
          <p className="px-2 text-xs font-semibold text-slate-500">{PROJECT.client} · Due {PROJECT.due}</p>
        </div>
        <button onClick={() => w.notify("info", "Share link copied (simulated).")}
          className={cx(RAISED, "h-11 px-4 text-sm font-bold")} style={raisedShadow}>Share</button>
        <button onClick={w.addTask} disabled={w.loading}
          className={cx(RAISED, "h-11 bg-slate-700 px-4 text-sm font-bold !text-white disabled:opacity-50")} style={raisedShadow}>+ New task</button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className={cx(RAISED, "p-4")} style={raisedShadow}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{k.label}</p>
            <p className="text-2xl font-black tabular-nums text-slate-800">{k.value}</p>
            <p className="text-xs font-bold text-slate-500">{k.delta}</p>
          </div>
        ))}
      </div>

      <div role="tablist" aria-label="Workspace views" className={cx(RAISED, "mt-4 flex gap-2 p-2")} style={sunkShadow}>
        {(["overview", "tasks", "activity"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={w.tab === t} onClick={() => w.setTab(t)}
            className={cx(RAISED, "flex-1 py-2.5 text-sm font-bold capitalize", w.tab === t ? "font-black text-slate-900" : "text-slate-500")}
            style={w.tab === t ? sunkShadow : raisedShadow}>{t}</button>
        ))}
      </div>

      {w.tab === "overview" && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className={cx(RAISED, "p-5")} style={raisedShadow}>
            <div className="flex items-baseline justify-between"><b>Progress</b><span className="text-3xl font-black tabular-nums text-slate-800">{w.pct}%</span></div>
            <div className="mt-3 h-4 rounded-full" style={sunkShadow} role="progressbar" aria-valuenow={w.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
              <div className="h-full rounded-full bg-slate-600 transition-all" style={{ width: `${w.pct}%` }} />
            </div>
            <div className="mt-4 flex h-16 items-end gap-1.5" aria-hidden>
              {PROJECT.weekProgress.map((v, i) => (
                <div key={i} className="flex-1 rounded-t-md bg-slate-300" style={{ height: `${v}%` }}><div className="h-full w-full rounded-t-md bg-slate-500" style={{ width: "100%" }} /></div>
              ))}
            </div>
          </div>
          <div className={cx(RAISED, "p-5")} style={raisedShadow}>
            <b>Up next</b>
            <ul className="mt-2 space-y-2">
              {w.tasks.filter((t) => t.status !== "done").slice(0, 3).map((t) => (
                <li key={t.id}>
                  <button onClick={() => w.setSelected(t)} className={cx(RAISED, "w-full truncate px-4 py-2.5 text-left text-sm font-bold")} style={raisedShadow}>{t.title}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {w.tab === "tasks" && (
        <div className={cx(RAISED, "mt-4 p-4")} style={raisedShadow}>
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="ne-q">Search tasks</label>
            <input id="ne-q" value={w.query} onChange={(e) => w.setQuery(e.target.value)} placeholder="Search tasks…"
              className="h-11 min-w-0 flex-1 rounded-xl bg-[#e0e5ec] px-4 text-sm font-semibold outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-500" style={sunkShadow} />
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Status filter">
              {(["all", "todo", "doing", "done", "blocked"] as const).map((s) => (
                <button key={s} onClick={() => w.setStatus(s)} aria-pressed={w.status === s}
                  className={cx(RAISED, "h-11 px-3 text-xs font-black capitalize", w.status !== s && "text-slate-500")}
                  style={w.status === s ? sunkShadow : raisedShadow}>
                  {s === "all" ? "All" : LABEL[s]}
                </button>
              ))}
            </div>
          </div>
          {w.loading ? (
            <div className="space-y-2.5 py-4" aria-busy="true" aria-label="Loading tasks">
              {[1, 2, 3].map((i) => <div key={i} className={cx(RAISED, "h-14 animate-pulse")} style={raisedShadow} />)}
            </div>
          ) : w.errorSim ? (
            <div role="alert" className={cx(RAISED, "mt-3 border-2 border-rose-400 p-6 text-center")} style={raisedShadow}>
              <p className="font-black text-rose-700">Couldn't load tasks (simulated 500).</p>
              <button onClick={w.retry} className="mt-3 h-11 rounded-2xl bg-rose-600 px-5 text-sm font-bold text-white">Retry</button>
            </div>
          ) : w.visible.length === 0 ? (
            <div className="py-8 text-center"><p className="font-black">No tasks match</p>
              <button onClick={() => { w.setQuery(""); w.setStatus("all"); }} className="mt-1 text-sm font-bold underline">Clear filters</button></div>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {w.visible.map((t) => (
                <li key={t.id} className={cx(RAISED, "flex items-center gap-2.5 p-2.5")} style={t.status === "done" ? sunkShadow : raisedShadow}>
                  <input type="checkbox" checked={t.status === "done"} onChange={() => w.toggleDone(t.id)}
                    aria-label={`Mark “${t.title}” ${t.status === "done" ? "not done" : "done"}`} className="ml-1 h-6 w-6 shrink-0 accent-slate-600" />
                  <button onClick={() => w.setSelected(t)} className="min-w-0 flex-1 text-left">
                    <span className={cx("block truncate text-sm font-bold", t.status === "done" && "text-slate-400 line-through")}>{t.title}</span>
                    <span className="text-xs font-semibold text-slate-500">{LABEL[t.status]} · {t.due}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {w.tab === "activity" && (
        <div className="mt-4 space-y-2.5">
          {ACTIVITY.map((a, i) => (
            <p key={i} className={cx(RAISED, "p-3.5 text-sm")} style={raisedShadow}><b>{a.who}</b> {a.what} <span className="block text-xs text-slate-500">{a.when}</span></p>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">
        <button onClick={w.refresh} disabled={w.loading} className={cx(RAISED, "px-4 py-2.5 disabled:opacity-50")} style={raisedShadow}>{w.loading ? "Refreshing…" : "↻ Refresh"}</button>
        <button onClick={w.triggerError} className={cx(RAISED, "px-4 py-2.5")} style={raisedShadow}>⚠ Error</button>
        <button onClick={w.reset} className={cx(RAISED, "px-4 py-2.5")} style={raisedShadow}>↺ Reset</button>
      </div>
      {w.notice && <p role="status" className={cx(RAISED, "mt-3 p-3.5 text-sm font-bold")} style={sunkShadow}>{w.notice.kind === "success" ? "✓ " : "ℹ "}{w.notice.text}</p>}
      <p className="mt-3 text-[11px] font-semibold text-slate-500">Access notes: raised = interactive, sunken = active/selected, always paired with text labels — never shadow alone.</p>
      {w.selected && <NeoDialog task={w.selected} onClose={() => w.setSelected(null)} onToggle={() => w.toggleDone(w.selected!.id)} />}
    </div>
  );
}

function NeoDialog({ task, onClose, onToggle }: { task: WsTask; onClose: () => void; onToggle: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#e0e5ec]/80 p-4" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className={cx(RAISED, "relative w-full max-w-md p-6")} style={{ ...raisedShadow, borderRadius: 24 }}>
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">{LABEL[task.status]} · {task.priority}</p>
        <h3 className="mt-1 text-2xl font-black text-slate-800">{task.title}</h3>
        <p className="mt-1 text-sm font-semibold text-slate-500">Owner {task.owner} · due {task.due}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={onToggle} className={cx(RAISED, "h-12 flex-1 bg-slate-700 text-sm font-black !text-white")} style={raisedShadow}>{task.status === "done" ? "Reopen" : "Mark done"}</button>
          <button ref={closeRef} onClick={onClose} className={cx(RAISED, "h-12 px-5 text-sm font-black")} style={raisedShadow}>Close</button>
        </div>
      </div>
    </div>
  );
}
