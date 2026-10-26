/** Editorial — serif display, drop caps, pull quotes, ruled sections. */
import React from "react";
import { useWorkspace, KPIS, ACTIVITY, PROJECT, type WsTask } from "./workspace";
import { cx } from "../lib/core";

const LABEL: Record<string, string> = { todo: "To do", doing: "In progress", done: "Done", blocked: "Blocked" };

export default function EditorialDemo() {
  const w = useWorkspace();
  return (
    <div className="rounded-2xl bg-[#faf7f0] p-6 text-stone-900 sm:p-10" style={{ border: "1px solid #e7e0d2" }}>
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.35em] text-stone-500">The Craft — Project Journal · No. 42</p>
      <label className="sr-only" htmlFor="ed-name">Project name</label>
      <input id="ed-name" value={w.name} onChange={(e) => w.setName(e.target.value)}
        className="mx-auto mt-3 block w-full max-w-2xl rounded bg-transparent text-center font-serif text-3xl font-black outline-none focus:bg-white sm:text-5xl" />
      <p className="mt-2 text-center font-serif text-lg italic text-stone-600">“Design is the silent ambassador of intent.” — {PROJECT.client}, due {PROJECT.due}</p>

      <div className="mx-auto mt-5 flex max-w-xl flex-wrap justify-center gap-2">
        <button onClick={w.addTask} disabled={w.loading}
          className="h-11 rounded-full bg-stone-900 px-6 font-serif text-sm font-bold text-[#faf7f0] hover:bg-stone-700 disabled:opacity-50">+ New task</button>
        <button onClick={() => w.notify("info", "Share link copied (simulated).")}
          className="h-11 rounded-full border border-stone-400 px-6 font-serif text-sm font-bold hover:bg-white">Share</button>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-px bg-stone-300 md:grid-cols-4" style={{ borderTop: "3px double #44403c", borderBottom: "3px double #44403c" }}>
        {KPIS.map((k) => (
          <div key={k.label} className="bg-[#faf7f0] p-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">{k.label}</p>
            <p className="font-serif text-3xl font-black tabular-nums">{k.value}</p>
            <p className="font-serif text-sm italic text-stone-600">{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-6 flex max-w-xl justify-center gap-6 border-b border-stone-300" role="tablist" aria-label="Workspace views">
        {(["overview", "tasks", "activity"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={w.tab === t} onClick={() => w.setTab(t)}
            className={cx("pb-2 font-serif text-lg capitalize", w.tab === t ? "font-black" : "italic text-stone-400 hover:text-stone-700")}
            style={w.tab === t ? { borderBottom: "3px solid #1c1917" } : undefined}>{t}</button>
        ))}
      </div>

      <div className="mx-auto max-w-xl">
        {w.tab === "overview" && (
          <div className="py-6">
            <p className="editorial-dropcap font-serif text-[17px] leading-relaxed text-stone-800">
              Great interfaces are edited, not decorated. At {w.pct} percent complete, the {w.name} team
              has shipped {w.done} of {w.total} tasks — the remaining work clusters around review and launch.
            </p>
            <div className="my-5 border-y border-stone-300 py-3 text-center font-serif text-xl italic">“{w.pct}% complete — {w.total - w.done} stories left to tell.”</div>
            <div className="h-2 bg-stone-200" role="progressbar" aria-valuenow={w.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
              <div className="h-full bg-stone-900 transition-all" style={{ width: `${w.pct}%` }} />
            </div>
            <div className="mt-4 flex h-20 items-end gap-1" aria-hidden>
              {PROJECT.weekProgress.map((v, i) => <div key={i} className="flex-1 bg-stone-300" style={{ height: `${v}%` }}><div className="h-full w-full bg-stone-700" style={{ height: "55%" }} /></div>)}
            </div>
          </div>
        )}

        {w.tab === "tasks" && (
          <div className="py-6">
            <label className="sr-only" htmlFor="ed-q">Search the ledger</label>
            <input id="ed-q" value={w.query} onChange={(e) => w.setQuery(e.target.value)} placeholder="Search the ledger…"
              className="h-11 w-full rounded-none border-b-2 border-stone-900 bg-transparent px-1 font-serif text-lg italic outline-none placeholder:text-stone-400" />
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Status filter">
              {(["all", "todo", "doing", "done", "blocked"] as const).map((s) => (
                <button key={s} onClick={() => w.setStatus(s)} aria-pressed={w.status === s}
                  className={cx("rounded-full border px-3 py-1.5 font-serif text-sm", w.status === s ? "border-stone-900 bg-stone-900 font-bold text-[#faf7f0]" : "border-stone-300 italic")}>
                  {s === "all" ? "All" : LABEL[s]}
                </button>
              ))}
            </div>
            {w.loading ? (
              <div className="space-y-3 py-6" aria-busy="true" aria-label="Loading tasks">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse bg-stone-200" />)}
              </div>
            ) : w.errorSim ? (
              <div role="alert" className="mt-4 border border-red-800 bg-red-50 p-6 text-center font-serif">
                <p className="text-xl font-black">The presses stopped (simulated error).</p>
                <button onClick={w.retry} className="mt-3 h-10 bg-stone-900 px-5 font-serif text-sm font-bold text-[#faf7f0]">Reprint (retry)</button>
              </div>
            ) : w.visible.length === 0 ? (
              <div className="py-10 text-center font-serif"><p className="text-xl italic">This page is blank.</p>
                <button onClick={() => { w.setQuery(""); w.setStatus("all"); }} className="mt-2 text-sm font-bold underline">Clear filters</button></div>
            ) : (
              <ul className="mt-2 divide-y divide-stone-200">
                {w.visible.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 py-2.5">
                    <input type="checkbox" checked={t.status === "done"} onChange={() => w.toggleDone(t.id)}
                      aria-label={`Mark “${t.title}” ${t.status === "done" ? "not done" : "done"}`} className="h-5 w-5 shrink-0 accent-stone-900" />
                    <button onClick={() => w.setSelected(t)} className="min-w-0 flex-1 text-left">
                      <span className={cx("block truncate font-serif text-lg", t.status === "done" ? "text-stone-400 line-through" : "font-bold")}>{t.title}</span>
                      <span className="font-serif text-sm italic text-stone-500">{LABEL[t.status]} · {t.owner} · {t.due}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {w.tab === "activity" && (
          <ul className="space-y-4 py-6">
            {ACTIVITY.map((a, i) => (
              <li key={i} className="border-l-2 border-stone-900 pl-4 font-serif"><b>{a.who}</b> {a.what}<span className="block text-sm italic text-stone-500">{a.when}</span></li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap justify-center gap-2 border-t border-stone-300 pt-4 font-serif text-sm">
          <button onClick={w.refresh} disabled={w.loading} className="underline disabled:opacity-40">{w.loading ? "Setting type…" : "↻ Refresh edition"}</button>
          <span aria-hidden>·</span>
          <button onClick={w.triggerError} className="underline">⚠ Simulate misprint</button>
          <span aria-hidden>·</span>
          <button onClick={w.reset} className="underline">↺ Reset</button>
        </div>
        {w.notice && <p role="status" className="mt-3 border border-stone-300 bg-white p-3 text-center font-serif text-sm italic">{w.notice.text}</p>}
      </div>
      {w.selected && <EdDialog task={w.selected} onClose={() => w.setSelected(null)} onToggle={() => w.toggleDone(w.selected!.id)} />}
    </div>
  );
}

function EdDialog({ task, onClose, onToggle }: { task: WsTask; onClose: () => void; onToggle: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-900/50 p-4" role="dialog" aria-modal="true" aria-label={task.title}>
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md border border-stone-300 bg-[#faf7f0] p-8 text-stone-900">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.3em] text-stone-500">{LABEL[task.status]} · {task.priority}</p>
        <h3 className="mt-2 text-center font-serif text-3xl font-black">{task.title}</h3>
        <p className="mt-1 text-center font-serif italic text-stone-600">By {task.owner} · {task.due}</p>
        <div className="mt-5 flex gap-2">
          <button onClick={onToggle} className="h-11 flex-1 bg-stone-900 font-serif text-sm font-bold text-[#faf7f0]">{task.status === "done" ? "Reopen" : "Mark done"}</button>
          <button ref={closeRef} onClick={onClose} className="h-11 border border-stone-400 px-5 font-serif text-sm font-bold">Close</button>
        </div>
      </div>
    </div>
  );
}
