/**
 * Data-Dense UI — compact expert console with an explicit density control.
 * Density changes row padding + type size visibly (Compact / Comfortable / Spacious).
 */
import React from "react";
import { useWorkspace, KPIS, ACTIVITY, PROJECT, type WsTask, type TaskStatus } from "./workspace";
import { cx } from "../lib/core";

type Density = "compact" | "comfortable" | "spacious";
const ROW_PAD: Record<Density, string> = { compact: "py-1", comfortable: "py-2", spacious: "py-3.5" };
const ROW_TXT: Record<Density, string> = { compact: "text-[12px]", comfortable: "text-[13px]", spacious: "text-sm" };
const LABEL: Record<string, string> = { todo: "TODO", doing: "DOING", done: "DONE", blocked: "BLOCK" };
const DOT: Record<string, string> = { todo: "bg-slate-400", doing: "bg-sky-300", done: "bg-emerald-400", blocked: "bg-rose-400" };

export default function DataDenseDemo() {
  const w = useWorkspace();
  const [density, setDensity] = React.useState<Density>("compact");
  const [sortDir, setSortDir] = React.useState<1 | -1>(1);
  const rows = [...w.visible].sort((a, b) => a.due.localeCompare(b.due) * sortDir);

  return (
    <div data-density={density} className="rounded-2xl bg-slate-950 p-3 font-mono text-slate-200 sm:p-4">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2.5">
        <span aria-hidden className="h-2 w-2 rounded-full bg-emerald-400" />
        <label className="sr-only" htmlFor="dd-name">Project name</label>
        <input id="dd-name" value={w.name} onChange={(e) => w.setName(e.target.value)}
          className="min-w-0 flex-1 rounded bg-transparent font-sans text-sm font-extrabold uppercase tracking-wide outline-none focus:bg-white/10" />
        <div className="flex rounded-lg bg-white/10 p-0.5 font-sans" role="group" aria-label="Density">
          {(["compact", "comfortable", "spacious"] as const).map((d) => (
            <button key={d} onClick={() => setDensity(d)} aria-pressed={density === d}
              className={cx("rounded-md px-2.5 py-1 font-sans text-[11px] font-bold capitalize", density === d ? "bg-emerald-400 text-slate-950" : "text-slate-400 hover:text-white")}>
              {d === "compact" ? "Cmpt" : d === "comfortable" ? "Cmfrt" : "Spac"}
              <span className="sr-only"> {d} density</span>
            </button>
          ))}
        </div>
        <button onClick={w.addTask} disabled={w.loading} className="rounded-lg bg-emerald-400 px-3 py-1.5 font-sans text-xs font-black uppercase text-slate-950 disabled:opacity-40 hover:bg-emerald-300">+ New task</button>
      </div>

      {/* KPI strip */}
      <dl className="grid grid-cols-4 gap-px overflow-hidden rounded-xl bg-white/10 font-sans">
        {KPIS.map((k) => (
          <div key={k.label} className="bg-slate-950 px-2.5 py-2">
            <dt className="truncate text-[10px] font-bold uppercase text-slate-500">{k.label}</dt>
            <dd className="font-mono text-base font-bold tabular-nums sm:text-lg">{k.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <div role="tablist" aria-label="Workspace views" className="flex gap-1 font-sans">
          {(["overview", "tasks", "activity"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={w.tab === t} onClick={() => w.setTab(t)}
              className={cx("rounded-lg px-3 py-1.5 text-xs font-bold uppercase", w.tab === t ? "bg-white text-slate-950" : "bg-white/10 text-slate-400 hover:bg-white/15")}>{t}</button>
          ))}
        </div>
        <label className="sr-only" htmlFor="dd-q">Search tasks</label>
        <input id="dd-q" value={w.query} onChange={(e) => w.setQuery(e.target.value)} placeholder="filter…"
          className="h-8 min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-2.5 font-sans text-xs outline-none placeholder:text-slate-600 focus:border-emerald-400" />
        <select value={w.status} onChange={(e) => w.setStatus(e.target.value as TaskStatus | "all")} aria-label="Status filter"
          className="h-8 rounded-lg border border-white/15 bg-slate-900 px-2 font-sans text-xs font-bold">
          {(["all", "todo", "doing", "done", "blocked"] as const).map((s) => <option key={s} value={s}>{s === "all" ? "ALL" : LABEL[s]}</option>)}
        </select>
      </div>

      {w.tab === "overview" && (
        <div className="mt-2 grid gap-2 font-sans md:grid-cols-2">
          <div className="rounded-xl border border-white/10 p-3">
            <div className="flex justify-between text-xs"><b>PROGRESS</b><b className="font-mono tabular-nums">{w.pct}%</b></div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={w.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
              <div className="h-full bg-emerald-400" style={{ width: `${w.pct}%` }} />
            </div>
            <div className="mt-2 flex h-14 items-end gap-px" aria-hidden>
              {PROJECT.weekProgress.map((v, i) => <div key={i} className="flex-1 bg-emerald-400/70" style={{ height: `${v}%` }} />)}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 p-3 text-xs">
            <b>QUEUE</b>
            <ul className="mt-1 space-y-1">
              {w.tasks.filter((t) => t.status !== "done").slice(0, 4).map((t) => (
                <li key={t.id}><button onClick={() => w.setSelected(t)} className="flex w-full justify-between gap-2 truncate hover:text-white"><span className="truncate">{t.title}</span><span className="shrink-0 text-slate-500">{t.due}</span></button></li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {w.tab === "tasks" && (
        <div className="mt-2 overflow-x-auto rounded-xl border border-white/10">
          {w.loading ? (
            <div className="space-y-1 p-2" aria-busy="true" aria-label="Loading tasks">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-8 animate-pulse rounded bg-white/10" />)}
            </div>
          ) : w.errorSim ? (
            <div role="alert" className="p-6 text-center font-sans">
              <p className="font-bold text-rose-300">E_CONN · simulated fetch failure</p>
              <button onClick={w.retry} className="mt-2 rounded-lg bg-rose-500 px-4 py-1.5 font-sans text-xs font-black text-white">RETRY</button>
            </div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-center font-sans"><p className="font-bold">0 rows match filter</p>
              <button onClick={() => { w.setQuery(""); w.setStatus("all"); }} className="mt-1 text-xs font-bold text-emerald-300 underline">clear filter</button></div>
          ) : (
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/15 font-sans text-[10px] uppercase text-slate-500">
                  <th className="px-2 py-1.5 font-bold"><span className="sr-only">Done</span>✓</th>
                  <th className="px-2 py-1.5 font-bold">Task</th>
                  <th className="px-2 py-1.5 font-bold">St</th>
                  <th className="px-2 py-1.5 font-bold">Owner</th>
                  <th className="px-2 py-1.5 text-right font-bold">
                    <button onClick={() => setSortDir(sortDir === 1 ? -1 : 1)} aria-sort={sortDir === 1 ? "ascending" : "descending"} className="hover:text-white">
                      Due {sortDir === 1 ? "↑" : "↓"}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t) => (
                  <tr key={t.id} className={cx("border-b border-white/5 hover:bg-white/5", ROW_TXT[density])}>
                    <td className={cx("px-2", ROW_PAD[density])}>
                      <input type="checkbox" checked={t.status === "done"} onChange={() => w.toggleDone(t.id)}
                        aria-label={`Mark “${t.title}” ${t.status === "done" ? "not done" : "done"}`} className="h-4 w-4 accent-emerald-400" />
                    </td>
                    <td className={cx("max-w-0 px-2", ROW_PAD[density])}>
                      <button onClick={() => w.setSelected(t)} className={cx("block max-w-[280px] truncate text-left hover:text-white", t.status === "done" && "text-slate-600 line-through")}>{t.title}</button>
                    </td>
                    <td className={cx("whitespace-nowrap px-2", ROW_PAD[density])}>
                      <span aria-hidden className={cx("mr-1 inline-block h-2 w-2 rounded-full", DOT[t.status])} />
                      <span className="font-sans text-[10px] font-bold">{LABEL[t.status]}</span>
                    </td>
                    <td className={cx("whitespace-nowrap px-2 text-slate-400", ROW_PAD[density])}>{t.initials}</td>
                    <td className={cx("whitespace-nowrap px-2 text-right tabular-nums", ROW_PAD[density])}>{t.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {w.tab === "activity" && (
        <ul className="mt-2 space-y-1 font-sans text-xs">
          {ACTIVITY.map((a, i) => (
            <li key={i} className="flex gap-2 rounded-lg bg-white/5 px-2.5 py-1.5"><span className="shrink-0 text-slate-500">{String(i + 1).padStart(2, "0")}</span><span><b>{a.who}</b> {a.what} <span className="text-slate-500">· {a.when}</span></span></li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex flex-wrap gap-1.5 font-sans text-[11px] font-bold">
        <button onClick={w.refresh} disabled={w.loading} className="rounded-lg bg-white/10 px-2.5 py-1.5 disabled:opacity-40 hover:bg-white/15">{w.loading ? "SYNC…" : "↻ SYNC"}</button>
        <button onClick={w.triggerError} className="rounded-lg bg-white/10 px-2.5 py-1.5 hover:bg-white/15">⚠ ERR</button>
        <button onClick={w.reset} className="rounded-lg bg-white/10 px-2.5 py-1.5 hover:bg-white/15">↺ RST</button>
        <span className="ml-auto self-center font-mono text-[10px] text-slate-500">rows ≥32px hit area · density persists per session</span>
      </div>
      {w.notice && <p role="status" className="mt-2 rounded-lg bg-emerald-400/15 px-2.5 py-1.5 font-sans text-xs font-bold text-emerald-200">{w.notice.text}</p>}
      {w.selected && <DenseDialog task={w.selected} onClose={() => w.setSelected(null)} onToggle={() => w.toggleDone(w.selected!.id)} />}
    </div>
  );
}

function DenseDialog({ task, onClose, onToggle }: { task: WsTask; onClose: () => void; onToggle: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl border border-white/15 bg-slate-900 p-5 font-mono text-slate-200">
        <p className="font-sans text-[11px] font-bold uppercase text-slate-400">{LABEL[task.status]} · {task.priority} · {task.id}</p>
        <h3 className="mt-1 font-sans text-lg font-extrabold text-white">{task.title}</h3>
        <p className="mt-1 font-sans text-xs text-slate-400">owner {task.owner} · due {task.due}</p>
        <div className="mt-4 flex gap-2 font-sans text-xs font-black">
          <button onClick={onToggle} className="flex-1 rounded-lg bg-emerald-400 py-2.5 text-slate-950">{task.status === "done" ? "REOPEN" : "MARK DONE"}</button>
          <button ref={closeRef} onClick={onClose} className="rounded-lg border border-white/20 px-4 py-2.5">ESC / CLOSE</button>
        </div>
      </div>
    </div>
  );
}
