/** Glassmorphism — frosted panels over vivid color, with an opacity fallback. */
import React from "react";
import { useWorkspace, KPIS, ACTIVITY, PROJECT, type WsTask } from "./workspace";
import { cx } from "../lib/core";

const LABEL: Record<string, string> = { todo: "To do", doing: "Doing", done: "Done", blocked: "Blocked" };

export default function GlassDemo() {
  const w = useWorkspace();
  const [solid, setSolid] = React.useState(false);
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-cyan-500 p-5 sm:p-7">
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-cyan-300/30 blur-3xl" />

      <div className={cx("relative rounded-3xl p-5 text-white sm:p-6", solid ? "bg-slate-900/90" : "glass-panel")}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor="gl-name">Project name</label>
            <input id="gl-name" value={w.name} onChange={(e) => w.setName(e.target.value)}
              className="w-full min-w-0 rounded-lg bg-transparent text-xl font-black tracking-tight outline-none placeholder:text-white/60 focus:ring-2 focus:ring-white/70" />
            <p className="text-xs text-white/75">{PROJECT.client} · Due {PROJECT.due}</p>
          </div>
          <button role="switch" aria-checked={solid} aria-label="High-contrast solid panels"
            onClick={() => { setSolid(!solid); w.notify("info", solid ? "Glass translucency on." : "Solid fallback on — full contrast."); }}
            className={cx("h-8 w-14 shrink-0 rounded-full p-1", solid ? "bg-white" : "bg-white/30")}>
            <span className={cx("block h-6 w-6 rounded-full bg-white shadow transition-transform", solid ? "translate-x-6 !bg-slate-900" : "")} />
          </button>
          <button onClick={w.addTask} disabled={w.loading}
            className="h-10 shrink-0 rounded-xl bg-white/90 px-4 text-sm font-black text-violet-900 hover:bg-white disabled:opacity-50">+ New task</button>
        </div>
        <p className="mt-1 text-[11px] text-white/70">Toggle for the opaque fallback — translucency must never be the only treatment.</p>

        <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {KPIS.map((k) => (
            <div key={k.label} className={cx("rounded-2xl p-3.5", solid ? "bg-white/10" : "bg-white/10 backdrop-blur-md")}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">{k.label}</p>
              <p className="text-2xl font-black tabular-nums">{k.value}</p>
              <p className="text-xs font-semibold text-white/80">{k.delta}</p>
            </div>
          ))}
        </div>

        <div role="tablist" aria-label="Workspace views" className="mt-4 flex gap-1 rounded-2xl bg-black/20 p-1">
          {(["overview", "tasks", "activity"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={w.tab === t} onClick={() => w.setTab(t)}
              className={cx("flex-1 rounded-xl py-2 text-sm font-bold capitalize", w.tab === t ? "bg-white text-violet-900" : "text-white/80 hover:bg-white/10")}>{t}</button>
          ))}
        </div>

        {w.tab === "overview" && (
          <div className="mt-3 grid gap-2.5 md:grid-cols-2">
            <div className={cx("rounded-2xl p-4", solid ? "bg-white/10" : "bg-white/10 backdrop-blur-md")}>
              <div className="flex items-baseline justify-between"><b>Progress</b><span className="text-3xl font-black tabular-nums">{w.pct}%</span></div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/25" role="progressbar" aria-valuenow={w.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
                <div className="h-full rounded-full bg-white" style={{ width: `${w.pct}%` }} />
              </div>
              <div className="mt-3 flex h-16 items-end gap-1" aria-hidden>
                {PROJECT.weekProgress.map((v, i) => <div key={i} className="flex-1 rounded-t bg-white/80" style={{ height: `${v}%` }} />)}
              </div>
            </div>
            <div className={cx("rounded-2xl p-4", solid ? "bg-white/10" : "bg-white/10 backdrop-blur-md")}>
              <b>Up next</b>
              <ul className="mt-2 space-y-1.5">
                {w.tasks.filter((t) => t.status !== "done").slice(0, 3).map((t) => (
                  <li key={t.id}>
                    <button onClick={() => w.setSelected(t)} className="w-full truncate rounded-xl bg-black/20 px-3 py-2 text-left text-sm font-semibold hover:bg-black/30">{t.title}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {w.tab === "tasks" && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              <label className="sr-only" htmlFor="gl-q">Search tasks</label>
              <input id="gl-q" value={w.query} onChange={(e) => w.setQuery(e.target.value)} placeholder="Search tasks…"
                className="h-10 min-w-0 flex-1 rounded-xl border border-white/30 bg-white/15 px-3 text-sm font-semibold outline-none placeholder:text-white/60 focus:border-white" />
              <div className="flex flex-wrap gap-1" role="group" aria-label="Status filter">
                {(["all", "todo", "doing", "done", "blocked"] as const).map((s) => (
                  <button key={s} onClick={() => w.setStatus(s)} aria-pressed={w.status === s}
                    className={cx("h-10 rounded-xl px-3 text-xs font-bold capitalize", w.status === s ? "bg-white text-violet-900" : "bg-white/15 text-white hover:bg-white/25")}>
                    {s === "all" ? "All" : LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
            {w.loading ? (
              <div className="space-y-2 py-4" aria-busy="true" aria-label="Loading tasks">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-white/20" />)}
              </div>
            ) : w.errorSim ? (
              <div role="alert" className="mt-3 rounded-2xl bg-slate-900/85 p-6 text-center">
                <p className="font-black">Couldn't load tasks (simulated 500).</p>
                <button onClick={w.retry} className="mt-3 h-10 rounded-xl bg-white px-5 text-sm font-black text-violet-900">Retry</button>
              </div>
            ) : w.visible.length === 0 ? (
              <div className="py-8 text-center"><p className="font-black">No tasks match</p>
                <button onClick={() => { w.setQuery(""); w.setStatus("all"); }} className="mt-1 text-sm font-bold underline">Clear filters</button></div>
            ) : (
              <ul className="mt-2 divide-y divide-white/15">
                {w.visible.map((t) => (
                  <li key={t.id} className="flex items-center gap-2.5 py-2">
                    <input type="checkbox" checked={t.status === "done"} onChange={() => w.toggleDone(t.id)}
                      aria-label={`Mark “${t.title}” ${t.status === "done" ? "not done" : "done"}`} className="h-5 w-5 shrink-0 accent-white" />
                    <button onClick={() => w.setSelected(t)} className="min-w-0 flex-1 truncate rounded-lg px-1 py-1 text-left text-sm font-semibold hover:bg-white/10">
                      <span className={cx(t.status === "done" && "line-through opacity-60")}>{t.title}</span>
                      <span className="ml-2 text-xs text-white/70">{LABEL[t.status]}</span>
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
              <li key={i} className="rounded-2xl bg-black/20 p-3 text-sm"><b>{a.who}</b> {a.what}<span className="block text-xs text-white/65">{a.when}</span></li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
          <button onClick={w.refresh} disabled={w.loading} className="rounded-full bg-white/20 px-3 py-1.5 disabled:opacity-50 hover:bg-white/30">{w.loading ? "Refreshing…" : "↻ Refresh"}</button>
          <button onClick={w.triggerError} className="rounded-full bg-white/20 px-3 py-1.5 hover:bg-white/30">⚠ Error</button>
          <button onClick={w.reset} className="rounded-full bg-white/20 px-3 py-1.5 hover:bg-white/30">↺ Reset</button>
        </div>
        {w.notice && <p role="status" className="mt-3 rounded-2xl bg-slate-900/80 p-3 text-sm font-semibold">{w.notice.kind === "success" ? "✓ " : "ℹ "}{w.notice.text}</p>}
      </div>
      {w.selected && <GlassDialog task={w.selected} solid={solid} onClose={() => w.setSelected(null)} onToggle={() => w.toggleDone(w.selected!.id)} />}
    </div>
  );
}

function GlassDialog({ task, solid, onClose, onToggle }: { task: WsTask; solid: boolean; onClose: () => void; onToggle: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-gradient-to-br from-fuchsia-600/80 via-violet-700/80 to-cyan-600/80 p-4" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className={cx("relative w-full max-w-md rounded-3xl p-6 text-white", solid ? "bg-slate-900/95" : "glass-panel")}>
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">{LABEL[task.status]} · {task.priority}</p>
        <h3 className="mt-1 text-2xl font-black">{task.title}</h3>
        <p className="mt-1 text-sm text-white/80">Owner {task.owner} · due {task.due}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={onToggle} className="h-11 flex-1 rounded-xl bg-white text-sm font-black text-violet-900">{task.status === "done" ? "Reopen" : "Mark done"}</button>
          <button ref={closeRef} onClick={onClose} className="h-11 rounded-xl border border-white/40 px-5 text-sm font-bold">Close</button>
        </div>
      </div>
    </div>
  );
}
