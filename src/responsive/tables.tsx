/** Responsive tables — scroller, priority columns, cards. One dataset, semantics kept. */
import React from "react";
import { RECORDS } from "../patterns/data";
import { Badge } from "../components/ui";
import { PreviewShell } from "./preview";
import { cx } from "../lib/core";

type Mode = "scroll" | "priority" | "cards";
const amaraRecord = RECORDS.find((r) => r.owner === "Amara K.");
const ROWS = amaraRecord ? [amaraRecord, ...RECORDS.filter((r) => r.id !== amaraRecord.id).slice(0, 5)] : RECORDS.slice(0, 6);

export default function RespTablesDemo() {
  const [w, setW] = React.useState(560);
  const [mode, setMode] = React.useState<Mode>("scroll");

  return (
    <div className="space-y-3">
      <div className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Table strategy">
        {(["scroll", "priority", "cards"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m}
            className={cx("flex-1 rounded-full py-2 text-[13px] font-bold capitalize", mode === m ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>
            {m === "scroll" ? "Scroll region" : m === "priority" ? "Priority columns" : "Card list"}
          </button>
        ))}
      </div>
      <PreviewShell width={w} onWidth={setW} min={280} max={1000} label="Table preview">
        {() => (
          <div className="p-3">
            {mode === "scroll" && (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10" tabIndex={0} role="region" aria-label="Projects table, scroll horizontally">
                <table className="w-full min-w-[560px] text-left text-[13px]">
                  <caption className="sr-only">Projects with owner, status, updated and budget</caption>
                  <thead><tr className="bg-slate-50 text-[11px] uppercase text-slate-500 dark:bg-white/5">
                    <th scope="col" className="p-2.5">Project</th><th scope="col" className="p-2.5">Owner</th><th scope="col" className="p-2.5">Status</th><th scope="col" className="p-2.5">Updated</th><th scope="col" className="p-2.5 text-right">Budget</th>
                  </tr></thead>
                  <tbody>
                    {ROWS.map((r) => (
                      <tr key={r.id} className="border-t border-slate-100 dark:border-white/5">
                        <th scope="row" className="p-2.5 font-bold">{r.name}</th>
                        <td className="p-2.5">{r.owner}</td>
                        <td className="p-2.5"><Badge tone="slate">{r.status}</Badge></td>
                        <td className="p-2.5 tabular-nums">{r.updated}</td>
                        <td className="p-2.5 text-right tabular-nums">${r.budget.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {mode === "priority" && (
              <table className="w-full text-left text-[13px]">
                <caption className="sr-only">Projects, essential columns only</caption>
                <thead><tr className="text-[11px] uppercase text-slate-400"><th scope="col" className="py-2">Project</th><th scope="col" className="py-2">Status</th><th scope="col" className="py-2 text-right">Budget</th></tr></thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100 dark:border-white/5">
                      <th scope="row" className="py-2 pr-2 font-bold">{r.name}<span className="block text-[11px] font-normal text-slate-400">{r.owner} · {r.updated}</span></th>
                      <td className="py-2"><Badge tone="slate">{r.status}</Badge></td>
                      <td className="py-2 text-right tabular-nums">${r.budget.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {mode === "cards" && (
              <ul className="space-y-2">
                {ROWS.map((r) => (
                  <li key={r.id} className="rounded-xl border border-slate-200 p-3 text-[13px] dark:border-white/10">
                    <b className="block">{r.name}</b>
                    <span className="mt-1 flex flex-wrap items-center gap-2 text-slate-500">
                      <Badge tone="slate">{r.status}</Badge> {r.owner} · {r.updated} · <b className="tabular-nums text-slate-800 dark:text-slate-100">${r.budget.toLocaleString()}</b>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[11px] text-slate-400">Nothing discarded: priority mode folds owner/date into the row; cards keep every field. Headers persist in all three.</p>
          </div>
        )}
      </PreviewShell>
    </div>
  );
}
