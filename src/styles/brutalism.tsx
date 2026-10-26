/** Brutalism — black borders, hard shadows, acid fills. Intentional, not random. */
import React from "react";
import { useWorkspace, KPIS, ACTIVITY, PROJECT, type WsTask } from "./workspace";
import { cx } from "../lib/core";

const LABEL: Record<string, string> = { todo: "TO-DO", doing: "DOING", done: "DONE", blocked: "BLOCKED!" };
const B = "border-[3px] border-[#111]";
const SH = { boxShadow: "6px 6px 0 #111" } as const;
const SH_SM = { boxShadow: "4px 4px 0 #111" } as const;

export default function BrutalDemo() {
  const w = useWorkspace();
  return (
    <div className="rounded-2xl bg-[#fff4e5] p-4 sm:p-6">
      <div className={cx(B, "rounded-xl bg-white p-5")} style={SH}>
        <span className="inline-block -rotate-2 bg-lime-300 px-2 py-0.5 text-xs font-black uppercase" style={{ border: "2px solid #111" }}>★ No boring SaaS</span>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <label className="sr-only" htmlFor="br-name">Project name</label>
            <input id="br-name" value={w.name} onChange={(e) => w.setName(e.target.value)}
              className="w-full min-w-0 rounded-lg bg-transparent text-2xl font-black uppercase outline-none focus:bg-yellow-100 sm:text-3xl" />
            <p className="mt-1 text-sm font-bold">{PROJECT.client} — DUE {PROJECT.due}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => w.notify("info", "Share link copied (simulated).")}
              className={cx(B, "h-12 rounded-lg bg-white px-4 text-sm font-black uppercase")} style={SH_SM}>Share</button>
            <button onClick={w.addTask} disabled={w.loading}
              className={cx(B, "h-12 rounded-lg bg-violet-500 px-4 text-sm font-black uppercase text-white disabled:opacity-50")} style={SH_SM}>+ New task</button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((k, i) => (
          <div key={k.label} className={cx(B, "rounded-xl p-4", i === 0 ? "bg-yellow-300" : i === 1 ? "bg-sky-300" : i === 2 ? "bg-red-400 text-white" : "bg-lime-300")} style={SH_SM}>
            <p className="text-[11px] font-black uppercase">{k.label}</p>
            <p className="text-3xl font-black tabular-nums">{k.value}</p>
            <p className="text-xs font-black">{k.delta}</p>
          </div>
        ))}
      </div>

      <div role="tablist" aria-label="Workspace views" className="mt-4 flex gap-2">
        {(["overview", "tasks", "activity"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={w.tab === t} onClick={() => w.setTab(t)}
            className={cx(B, "flex-1 rounded-lg py-2.5 text-sm font-black uppercase", w.tab === t ? "bg-[#111] text-white" : "bg-white")} style={SH_SM}>{t}</button>
        ))}
      </div>

      {w.tab === "overview" && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className={cx(B, "rounded-xl bg-white p-5")} style={SH_SM}>
            <div className="flex items-baseline justify-between"><b className="uppercase">Progress</b><span className="text-4xl font-black tabular-nums">{w.pct}%</span></div>
            <div className={cx(B, "mt-2 h-5 rounded-lg bg-white")} role="progressbar" aria-valuenow={w.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
              <div className="h-full rounded-md bg-lime-400 transition-all" style={{ width: `${w.pct}%` }} />
            </div>
            <div className="mt-4 flex h-20 items-end gap-1.5" aria-hidden>
              {PROJECT.weekProgress.map((v, i) => (
                <div key={i} className={cx(B, "flex-1 rounded-t", i % 2 ? "bg-violet-500" : "bg-yellow-300")} style={{ height: `${v}%` }} />
              ))}
            </div>
          </div>
          <div className={cx(B, "rounded-xl bg-[#111] p-5 text-white")} style={{ boxShadow: "6px 6px 0 #7c3aed" }}>
            <b className="uppercase">⚠ Up next</b>
            <ul className="mt-2 space-y-2">
              {w.tasks.filter((t) => t.status !== "done").slice(0, 3).map((t) => (
                <li key={t.id}>
                  <button onClick={() => w.setSelected(t)} className="w-full truncate rounded-lg border-[3px] border-white px-3 py-2 text-left text-sm font-black uppercase hover:bg-white hover:text-[#111]">{t.title}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {w.tab === "tasks" && (
        <div className={cx(B, "mt-4 rounded-xl bg-white p-4")} style={SH_SM}>
          <div className="flex flex-wrap gap-2">
            <label className="sr-only" htmlFor="br-q">Search tasks</label>
            <input id="br-q" value={w.query} onChange={(e) => w.setQuery(e.target.value)} placeholder="SEARCH…"
              className={cx(B, "h-12 min-w-0 flex-1 rounded-lg px-3 text-sm font-black uppercase outline-none placeholder:text-slate-400 focus:bg-yellow-100")} />
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Status filter">
              {(["all", "todo", "doing", "done", "blocked"] as const).map((s) => (
                <button key={s} onClick={() => w.setStatus(s)} aria-pressed={w.status === s}
                  className={cx(B, "h-12 rounded-lg px-3 text-xs font-black uppercase", w.status === s ? "bg-[#111] text-white" : "bg-white")}>
                  {s === "all" ? "All" : LABEL[s]}
                </button>
              ))}
            </div>
          </div>
          {w.loading ? (
            <div className="space-y-2.5 py-4" aria-busy="true" aria-label="Loading tasks">
              {[1, 2, 3].map((i) => <div key={i} className={cx(B, "h-14 animate-pulse rounded-lg bg-slate-100")} />)}
            </div>
          ) : w.errorSim ? (
            <div role="alert" className={cx(B, "mt-3 rounded-lg bg-red-400 p-6 text-center text-white")}>
              <p className="text-xl font-black uppercase">💥 Load failed (simulated)!</p>
              <button onClick={w.retry} className={cx(B, "mt-3 h-11 rounded-lg bg-white px-6 text-sm font-black uppercase")} >Retry!</button>
            </div>
          ) : w.visible.length === 0 ? (
            <div className="py-10 text-center"><p className="text-xl font-black uppercase">∅ Nothing found.</p>
              <button onClick={() => { w.setQuery(""); w.setStatus("all"); }} className="mt-2 text-sm font-black uppercase underline">Clear filters</button></div>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {w.visible.map((t) => (
                <li key={t.id} className={cx(B, "flex items-center gap-2.5 rounded-lg bg-[#fffdf5] p-2.5", t.status === "blocked" && "!bg-red-100")}>
                  <input type="checkbox" checked={t.status === "done"} onChange={() => w.toggleDone(t.id)}
                    aria-label={`Mark “${t.title}” ${t.status === "done" ? "not done" : "done"}`} className={cx(B, "h-7 w-7 shrink-0 appearance-none rounded-md bg-white checked:bg-lime-400")} />
                  <button onClick={() => w.setSelected(t)} className="min-w-0 flex-1 text-left">
                    <span className={cx("block truncate text-sm font-black uppercase", t.status === "done" && "text-slate-400 line-through")}>{t.title}</span>
                    <span className="text-xs font-black">{LABEL[t.status]} · {t.due}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {w.tab === "activity" && (
        <ul className="mt-4 space-y-2.5">
          {ACTIVITY.map((a, i) => (
            <li key={i} className={cx(B, "rounded-lg bg-white p-3 text-sm font-bold")} style={SH_SM}><b className="uppercase">{a.who}:</b> {a.what} <span className="text-xs">({a.when})</span></li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase">
        <button onClick={w.refresh} disabled={w.loading} className={cx(B, "rounded-lg bg-yellow-300 px-4 py-2.5 disabled:opacity-50")} style={SH_SM}>{w.loading ? "Working…" : "↻ Refresh"}</button>
        <button onClick={w.triggerError} className={cx(B, "rounded-lg bg-red-400 px-4 py-2.5 text-white")} style={SH_SM}>⚠ Break it</button>
        <button onClick={w.reset} className={cx(B, "rounded-lg bg-white px-4 py-2.5")} style={SH_SM}>↺ Reset</button>
      </div>
      {w.notice && <p role="status" className={cx(B, "mt-3 rounded-lg bg-lime-300 p-3 text-sm font-black")} style={SH_SM}>{w.notice.kind === "success" ? "✓ " : "ℹ "}{w.notice.text}</p>}
      {w.selected && <BrutalDialog task={w.selected} onClose={() => w.setSelected(null)} onToggle={() => w.toggleDone(w.selected!.id)} />}
    </div>
  );
}

function BrutalDialog({ task, onClose, onToggle }: { task: WsTask; onClose: () => void; onToggle: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#111]/70 p-4" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className={cx(B, "relative w-full max-w-md rounded-xl bg-yellow-300 p-6")} style={{ boxShadow: "10px 10px 0 #fff" }}>
        <p className="inline-block bg-[#111] px-2 py-1 text-xs font-black uppercase text-white">{LABEL[task.status]} · {task.priority}</p>
        <h3 className="mt-2 text-2xl font-black uppercase">{task.title}</h3>
        <p className="mt-1 text-sm font-black">OWNER {task.owner} · DUE {task.due}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={onToggle} className={cx(B, "h-12 flex-1 rounded-lg bg-violet-500 text-sm font-black uppercase text-white")}>{task.status === "done" ? "Reopen!" : "Ship it!"}</button>
          <button ref={closeRef} onClick={onClose} className={cx(B, "h-12 rounded-lg bg-white px-5 text-sm font-black uppercase")}>Close</button>
        </div>
      </div>
    </div>
  );
}
