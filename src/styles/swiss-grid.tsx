/** Swiss / Grid — visible 12-col grid, black rules, signal red. */
import React from "react";
import { useWorkspace, KPIS, ACTIVITY, PROJECT, type WsTask } from "./workspace";
import { cx } from "../lib/core";

const LABEL: Record<string, string> = { todo: "TO DO", doing: "DOING", done: "DONE", blocked: "BLOCKED" };

export default function SwissDemo() {
  const w = useWorkspace();
  return (
    <div className="swiss-grid-bg bg-white p-5 text-slate-950 sm:p-8">
      <div className="grid grid-cols-12 gap-4">
        <p className="col-span-2 text-5xl font-black text-red-600 sm:col-span-1">07</p>
        <div className="col-span-10 border-l-4 border-slate-950 pl-4 sm:col-span-11">
          <label className="sr-only" htmlFor="sw-name">Project name</label>
          <input id="sw-name" value={w.name} onChange={(e) => w.setName(e.target.value)}
            className="w-full min-w-0 rounded-none bg-transparent text-2xl font-black uppercase leading-none outline-none focus:bg-red-50 sm:text-4xl" />
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">{PROJECT.client} — Due {PROJECT.due}</p>
        </div>

        <div className="col-span-6 flex flex-wrap gap-2 sm:col-span-8">
          <button onClick={w.addTask} disabled={w.loading} className="h-12 rounded-none bg-red-600 px-6 text-sm font-black uppercase tracking-wider text-white hover:bg-red-700 disabled:opacity-40">+ New task</button>
          <button onClick={() => w.notify("info", "Share link copied (simulated).")} className="h-12 rounded-none border-[3px] border-slate-950 px-6 text-sm font-black uppercase tracking-wider hover:bg-slate-950 hover:text-white">Share</button>
        </div>
        <p className="col-span-6 self-center text-right text-4xl font-black tabular-nums sm:col-span-4">{w.pct}<span className="text-lg">%</span></p>

        <div className="col-span-12 border-t-[3px] border-slate-950 pt-2">
          <div className="h-2 bg-slate-200" role="progressbar" aria-valuenow={w.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
            <div className="h-full bg-red-600 transition-all" style={{ width: `${w.pct}%` }} />
          </div>
        </div>

        {KPIS.map((k) => (
          <div key={k.label} className="col-span-6 border-t-2 border-slate-950 pt-2 lg:col-span-3">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{k.label}</p>
            <p className="text-3xl font-black tabular-nums">{k.value}</p>
            <p className="text-xs font-bold">{k.delta}</p>
          </div>
        ))}

        <div className="col-span-12 border-y-[3px] border-slate-950 py-2" role="tablist" aria-label="Workspace views">
          <div className="grid grid-cols-3 gap-2">
            {(["overview", "tasks", "activity"] as const).map((t, i) => (
              <button key={t} role="tab" aria-selected={w.tab === t} onClick={() => w.setTab(t)}
                className={cx("flex items-center gap-2 py-2 text-sm font-black uppercase tracking-wider", w.tab === t ? "text-red-600" : "text-slate-400 hover:text-slate-950")}>
                <span aria-hidden>0{i + 1}</span> {t}
              </button>
            ))}
          </div>
        </div>

        {w.tab === "overview" && (
          <>
            <div className="col-span-12 md:col-span-7">
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">Weekly output</h3>
              <div className="mt-2 flex h-24 items-end gap-1" aria-hidden>
                {PROJECT.weekProgress.map((v, i) => (
                  <div key={i} className={cx("flex-1", i === PROJECT.weekProgress.length - 1 ? "bg-red-600" : "bg-slate-950")} style={{ height: `${v}%` }} />
                ))}
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500">Completion %, last 8 weeks. Current week in red.</p>
            </div>
            <div className="col-span-12 md:col-span-5">
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">Up next</h3>
              <ul className="mt-2 divide-y-2 divide-slate-950 border-y-2 border-slate-950">
                {w.tasks.filter((t) => t.status !== "done").slice(0, 3).map((t) => (
                  <li key={t.id}>
                    <button onClick={() => w.setSelected(t)} className="flex w-full items-center gap-2 py-2 text-left text-sm font-bold hover:bg-red-50">
                      <span className="truncate">{t.title}</span><span className="ml-auto shrink-0 text-xs text-slate-500">{t.due}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {w.tab === "tasks" && (
          <div className="col-span-12">
            <div className="grid gap-2 md:grid-cols-12">
              <label className="sr-only" htmlFor="sw-q">Search tasks</label>
              <input id="sw-q" value={w.query} onChange={(e) => w.setQuery(e.target.value)} placeholder="SEARCH TASKS…"
                className="h-12 rounded-none border-[3px] border-slate-950 px-3 text-sm font-bold uppercase outline-none placeholder:text-slate-400 focus:bg-red-50 md:col-span-5" />
              <div className="flex flex-wrap gap-1 md:col-span-7" role="group" aria-label="Status filter">
                {(["all", "todo", "doing", "done", "blocked"] as const).map((s) => (
                  <button key={s} onClick={() => w.setStatus(s)} aria-pressed={w.status === s}
                    className={cx("h-12 flex-1 rounded-none px-2 text-xs font-black uppercase", w.status === s ? "bg-slate-950 text-white" : "border-[3px] border-slate-950 hover:bg-slate-100")}>
                    {s === "all" ? "All" : LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
            {w.loading ? (
              <div className="space-y-2 py-4" aria-busy="true" aria-label="Loading tasks">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse bg-slate-200" />)}
              </div>
            ) : w.errorSim ? (
              <div role="alert" className="mt-3 border-[3px] border-red-600 p-6 text-center">
                <p className="font-black uppercase">Load failed (simulated 500).</p>
                <button onClick={w.retry} className="mt-3 h-11 bg-red-600 px-6 text-sm font-black uppercase text-white">Retry</button>
              </div>
            ) : w.visible.length === 0 ? (
              <div className="py-10 text-center"><p className="text-xl font-black uppercase">No results.</p>
                <button onClick={() => { w.setQuery(""); w.setStatus("all"); }} className="mt-2 text-sm font-black uppercase underline">Clear filters</button></div>
            ) : (
              <ul className="mt-3 divide-y-2 divide-slate-950 border-y-[3px] border-slate-950">
                {w.visible.map((t) => (
                  <li key={t.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2">
                    <input type="checkbox" checked={t.status === "done"} onChange={() => w.toggleDone(t.id)}
                      aria-label={`Mark “${t.title}” ${t.status === "done" ? "not done" : "done"}`} className="h-6 w-6 accent-red-600" />
                    <button onClick={() => w.setSelected(t)} className="min-w-0 text-left">
                      <span className={cx("block truncate text-sm font-black uppercase", t.status === "done" && "text-slate-400 line-through")}>{t.title}</span>
                      <span className="text-xs font-bold text-slate-500">{LABEL[t.status]} — {t.owner} — {t.due}</span>
                    </button>
                    {t.status === "blocked" && <span className="bg-red-600 px-2 py-1 text-[11px] font-black uppercase text-white">Blocked</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {w.tab === "activity" && (
          <ul className="col-span-12 divide-y-2 divide-slate-950 border-y-[3px] border-slate-950">
            {ACTIVITY.map((a, i) => (
              <li key={i} className="grid grid-cols-[auto_1fr] gap-3 py-2 text-sm"><b>0{i + 1}</b><span><b className="uppercase">{a.who}</b> {a.what} <span className="text-xs text-slate-500">— {a.when}</span></span></li>
            ))}
          </ul>
        )}

        <div className="col-span-12 flex flex-wrap gap-2 border-t-[3px] border-slate-950 pt-3 text-xs font-black uppercase">
          <button onClick={w.refresh} disabled={w.loading} className="border-[3px] border-slate-950 px-3 py-1.5 disabled:opacity-40 hover:bg-slate-950 hover:text-white">{w.loading ? "Working…" : "↻ Refresh"}</button>
          <button onClick={w.triggerError} className="border-[3px] border-slate-950 px-3 py-1.5 hover:bg-red-600 hover:text-white">⚠ Error</button>
          <button onClick={w.reset} className="border-[3px] border-slate-950 px-3 py-1.5 hover:bg-slate-950 hover:text-white">↺ Reset</button>
        </div>
      </div>
      {w.notice && <p role="status" className="mt-3 border-l-4 border-red-600 bg-red-50 p-3 text-sm font-bold">{w.notice.text}</p>}
      {w.selected && <SwissDialog task={w.selected} onClose={() => w.setSelected(null)} onToggle={() => w.toggleDone(w.selected!.id)} />}
    </div>
  );
}

function SwissDialog({ task, onClose, onToggle }: { task: WsTask; onClose: () => void; onToggle: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-white/80 p-4" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md border-[4px] border-slate-950 bg-white p-6">
        <p className="bg-red-600 px-2 py-1 text-xs font-black uppercase tracking-widest text-white" style={{ display: "inline-block" }}>{LABEL[task.status]} · {task.priority}</p>
        <h3 className="mt-3 text-3xl font-black uppercase leading-none">{task.title}</h3>
        <p className="mt-2 text-sm font-bold">OWNER {task.owner} — DUE {task.due}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={onToggle} className="h-12 flex-1 bg-slate-950 text-sm font-black uppercase text-white">{task.status === "done" ? "Reopen" : "Mark done"}</button>
          <button ref={closeRef} onClick={onClose} className="h-12 border-[3px] border-slate-950 px-5 text-sm font-black uppercase">Close</button>
        </div>
      </div>
    </div>
  );
}
