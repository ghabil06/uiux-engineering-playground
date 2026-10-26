/**
 * UX Metrics lab — editable sample data, live recalculation, SUS done right,
 * plus the educational findings register (CRUD, filter, resolve, CSV export).
 */
import React from "react";
import { SUS_ITEMS, susScore, SEED_FINDINGS, findingsToCSV, type Finding, type Severity, type FindingStatus } from "./data";
import { Card, Badge, Empty } from "../components/ui";
import { Dialog } from "../components/foundation";
import { cx } from "../lib/core";

const FKEY = "prism-findings-v1";

function loadFindings(): Finding[] {
  try {
    const raw = localStorage.getItem(FKEY);
    if (raw) { const arr = JSON.parse(raw) as Finding[]; if (Array.isArray(arr)) return arr; }
  } catch { /* private mode */ }
  return SEED_FINDINGS;
}

function Bars({ values, labels, format }: { values: number[]; labels: string[]; format: (v: number) => string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="space-y-1.5" role="img" aria-label={`Chart: ${labels.map((l, i) => `${l} ${format(values[i])}`).join(", ")}`}>
      {values.map((v, i) => (
        <div key={labels[i]} className="grid grid-cols-[110px_1fr_52px] items-center gap-2 text-xs">
          <span className="truncate font-bold">{labels[i]}</span>
          <span className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <span className="block h-full rounded-full bg-violet-600" style={{ width: `${(v / max) * 100}%` }} />
          </span>
          <b className="text-right tabular-nums">{format(v)}</b>
        </div>
      ))}
    </div>
  );
}

export default function MetricsLab() {
  // — Task success (editable attempts) —
  const [tasks, setTasks] = React.useState([
    { name: "Find invoice", ok: 9, n: 10 }, { name: "Bulk approve", ok: 6, n: 10 }, { name: "Export audit", ok: 8, n: 9 },
  ]);
  // — Time on task (seconds, editable) —
  const [times, setTimes] = React.useState<number[]>([96, 134, 88, 214, 121]);
  // — Satisfaction 1–5 —
  const [sat, setSat] = React.useState<number[]>([4, 5, 4, 3, 5, 4]);
  // — Funnel —
  const [funnel, setFunnel] = React.useState([
    { name: "Visited pricing", n: 1000 }, { name: "Started trial", n: 220 }, { name: "Invited team", n: 96 }, { name: "Paid", n: 41 },
  ]);
  // — SUS —
  const [sus, setSus] = React.useState<(number | null)[]>(Array(10).fill(null));
  const score = susScore(sus);

  const successRate = tasks.reduce((a, t) => a + t.ok, 0) / Math.max(1, tasks.reduce((a, t) => a + t.n, 0));
  const sorted = [...times].sort((a, b) => a - b);
  const median = sorted.length % 2 ? sorted[Math.floor(sorted.length / 2)] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  const abandon = funnel.length > 1 ? 1 - funnel[funnel.length - 1].n / funnel[0].n : 0;
  const avgSat = sat.reduce((a, b) => a + b, 0) / Math.max(1, sat.length);

  const num = "h-9 w-20 rounded-lg border border-slate-300 px-2 text-sm tabular-nums dark:border-white/15 dark:bg-transparent";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-[13px] text-sky-900 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-100">
        All data below is <b>editable sample data</b> (n ≤ 10). Small samples are directional, never significant —
        every widget states its n and caveats. No industry benchmarks are cited because none were measured here.
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-2 p-5">
          <b>Task success rate <span className="font-mono text-[11px] font-normal text-slate-400">Σok / Σn = {(successRate * 100).toFixed(1)}%</span></b>
          {tasks.map((t, i) => (
            <div key={t.name} className="flex items-center gap-2 text-sm">
              <span className="w-28 truncate font-semibold">{t.name}</span>
              <label className="text-xs">ok <input type="number" min={0} max={t.n} value={t.ok} aria-label={`${t.name} successes`}
                onChange={(e) => setTasks(tasks.map((x, j) => (j === i ? { ...x, ok: Math.max(0, Math.min(x.n, Number(e.target.value) || 0)) } : x)))} className={num} /></label>
              <label className="text-xs">n <input type="number" min={1} value={t.n} aria-label={`${t.name} attempts`}
                onChange={(e) => setTasks(tasks.map((x, j) => (j === i ? { ...x, n: Math.max(1, Number(e.target.value) || 1), ok: Math.min(x.ok, Math.max(1, Number(e.target.value) || 1)) } : x)))} className={num} /></label>
              <b className="ml-auto tabular-nums">{((t.ok / t.n) * 100).toFixed(0)}%</b>
            </div>
          ))}
          <Bars values={tasks.map((t) => (t.ok / t.n) * 100)} labels={tasks.map((t) => t.name)} format={(v) => `${v.toFixed(0)}%`} />
        </Card>
        <Card className="space-y-2 p-5">
          <b>Time on task + abandonment</b>
          <label className="block text-xs font-bold">Times in seconds (comma-separated)
            <input value={times.join(", ")} onChange={(e) => {
              const v = e.target.value.split(",").map((x) => Number(x.trim())).filter((x) => Number.isFinite(x) && x > 0);
              if (v.length) setTimes(v);
            }} aria-label="Task times in seconds" className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm tabular-nums dark:border-white/15 dark:bg-transparent" /></label>
          <p className="text-sm">Median <b className="tabular-nums">{median.toFixed(0)}s</b> (n={times.length}) — medians resist the 214s outlier; means don't.</p>
          <div className="space-y-1.5">
            {funnel.map((f, i) => (
              <div key={f.name} className="flex items-center gap-2 text-sm">
                <span className="w-28 truncate font-semibold">{f.name}</span>
                <label className="sr-only" htmlFor={`fn-${i}`}>{f.name} count</label>
                <input id={`fn-${i}`} type="number" min={0} value={f.n} onChange={(e) => setFunnel(funnel.map((x, j) => (j === i ? { ...x, n: Math.max(0, Number(e.target.value) || 0) } : x)))} className={num} />
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <span className="block h-full rounded-full bg-cyan-500" style={{ width: `${(f.n / Math.max(1, funnel[0].n)) * 100}%` }} />
                </span>
                <b className="w-12 text-right tabular-nums">{((f.n / Math.max(1, funnel[0].n)) * 100).toFixed(0)}%</b>
              </div>
            ))}
          </div>
          <p className="text-sm">Abandonment (start → paid): <b className="tabular-nums">{(abandon * 100).toFixed(1)}%</b> — computed, not benchmarked.</p>
        </Card>
        <Card className="space-y-2 p-5">
          <b>Satisfaction (1–5) + error rate</b>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Satisfaction ratings">
            {sat.map((s, i) => (
              <span key={i} className="flex items-center gap-0.5 rounded-xl bg-slate-100 px-2 py-1.5 dark:bg-white/10">
                <button onClick={() => setSat(sat.filter((_, j) => j !== i))} aria-label={`Remove rating ${s}`} className="rounded p-0.5 text-slate-400 hover:text-rose-600">✕</button>
                <span className="font-black tabular-nums" aria-label={`Rating ${s} of 5`}>{"★".repeat(s)}<span className="opacity-30">{"★".repeat(5 - s)}</span></span>
              </span>
            ))}
            <span className="flex gap-1">
              {[1, 2, 3, 4, 5].map((v) => (
                <button key={v} onClick={() => setSat([...sat, v])} aria-label={`Add rating ${v}`} className="h-9 w-9 rounded-xl border border-slate-300 text-sm font-black dark:border-white/15">+{v}</button>
              ))}
            </span>
          </div>
          <p className="text-sm">Mean <b className="tabular-nums">{avgSat.toFixed(2)}</b> (n={sat.length}) — report the distribution, not just the mean.</p>
          <Bars values={[1, 2, 3, 4, 5].map((s) => sat.filter((x) => x === s).length)} labels={["1★", "2★", "3★", "4★", "5★"]} format={(v) => String(v)} />
        </Card>
        <Card className="space-y-2 p-5">
          <b>System Usability Scale <span className="font-normal text-slate-400">(standard 10-item scoring)</span></b>
          <ol className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
            {SUS_ITEMS.map((item, i) => (
              <li key={i} className="rounded-xl bg-slate-50 p-2 text-[13px] dark:bg-white/5">
                <span className="block">{i + 1}. {item}</span>
                <span className="mt-1 flex gap-1" role="radiogroup" aria-label={`SUS item ${i + 1}`}>
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button key={v} role="radio" aria-checked={sus[i] === v} aria-label={`${v}`} onClick={() => setSus(sus.map((x, j) => (j === i ? v : x)))}
                      className={cx("h-8 w-8 rounded-lg text-xs font-black", sus[i] === v ? "bg-violet-600 text-white" : "bg-white ring-1 ring-slate-200 dark:bg-transparent dark:ring-white/15")}>{v}</button>
                  ))}
                </span>
              </li>
            ))}
          </ol>
          <div role="status" className="rounded-2xl bg-slate-900 p-3 text-sm text-white">
            {score === null
              ? `Answer all 10 items (1 = strongly disagree … 5 = strongly agree) — ${sus.filter((x) => x !== null).length}/10 so far. A SUS score is invalid with missing items.`
              : <>SUS score: <b className="text-2xl tabular-nums">{score.toFixed(0)}</b> / 100 <span className="text-white/70">— computed as Σ(odd−1, 5−even) × 2.5. A number, not a verdict: triangulate with task metrics.</span></>}
          </div>
          <button onClick={() => setSus(Array(10).fill(null))} className="text-xs font-bold text-violet-600 underline">↺ Clear SUS answers</button>
        </Card>
      </div>
      <FindingsRegister />
    </div>
  );
}

function FindingsRegister() {
  const [rows, setRows] = React.useState<Finding[]>(loadFindings);
  const [fStatus, setFStatus] = React.useState<"All" | FindingStatus>("All");
  const [fSev, setFSev] = React.useState<"All" | Severity>("All");
  const [sortDesc, setSortDesc] = React.useState(true);
  const [editing, setEditing] = React.useState<Finding | null>(null);
  const [confirmDel, setConfirmDel] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState({ title: "", where: "", problem: "" });

  React.useEffect(() => {
    try { localStorage.setItem(FKEY, JSON.stringify(rows)); } catch { /* private mode */ }
  }, [rows]);

  const sevRank: Record<Severity, number> = { Critical: 0, Major: 1, Minor: 2 };
  const visible = rows
    .filter((r) => fStatus === "All" || r.status === fStatus)
    .filter((r) => fSev === "All" || r.severity === fSev)
    .sort((a, b) => sortDesc ? sevRank[a.severity] - sevRank[b.severity] : sevRank[b.severity] - sevRank[a.severity]);

  const create = () => {
    if (draft.title.trim().length < 4) return;
    setRows([{ id: `f-${Date.now().toString(36)}`, title: draft.title.trim(), where: draft.where.trim() || "Unspecified", problem: draft.problem.trim() || "—", evidence: "Logged in the UX lab (session).", severity: "Minor", impact: "—", proposal: "—", status: "Open" }, ...rows]);
    setDraft({ title: "", where: "", problem: "" });
  };

  const saveEdit = () => {
    if (!editing || editing.title.trim().length < 4) return;
    setRows(rows.map((r) => (r.id === editing.id ? editing : r)));
    setEditing(null);
  };

  const exportCSV = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([findingsToCSV(visible)], { type: "text/csv" }));
    a.download = "ux-findings.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  };

  const input = "h-10 rounded-xl border border-slate-300 px-3 text-sm dark:border-white/15 dark:bg-transparent";

  return (
    <Card className="space-y-3 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <b>Findings register <span className="font-normal text-slate-400">(educational — not a production tracker; persists in this browser)</span></b>
        <span className="ml-auto flex gap-1.5 text-xs">
          <select value={fStatus} onChange={(e) => setFStatus(e.target.value as typeof fStatus)} aria-label="Filter by status" className={input + " h-9"}>
            {(["All", "Open", "In Progress", "Resolved"] as const).map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={fSev} onChange={(e) => setFSev(e.target.value as typeof fSev)} aria-label="Filter by severity" className={input + " h-9"}>
            {(["All", "Critical", "Major", "Minor"] as const).map((s) => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => setSortDesc(!sortDesc)} aria-label="Toggle severity sort direction" className="h-9 rounded-xl border border-slate-300 px-3 font-black dark:border-white/15">{sortDesc ? "Sev ↓" : "Sev ↑"}</button>
          <button onClick={exportCSV} className="h-9 rounded-xl border border-slate-300 px-3 font-bold dark:border-white/15">⬇ CSV</button>
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="nf-title">Finding title</label>
        <input id="nf-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="New finding title (4+ chars)…" className={input + " min-w-0 flex-1"} />
        <label className="sr-only" htmlFor="nf-where">Affected route or component</label>
        <input id="nf-where" value={draft.where} onChange={(e) => setDraft({ ...draft, where: e.target.value })} placeholder="Where?" className={input + " w-40"} />
        <button onClick={create} disabled={draft.title.trim().length < 4} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white disabled:opacity-40">+ Log finding</button>
      </div>
      {visible.length === 0 ? (
        <Empty title="No findings match" desc="Loosen the filters — or log the first finding above." />
      ) : (
        <ul className="space-y-2">
          {visible.map((f) => (
            <li key={f.id} className="rounded-2xl border border-slate-200 p-3 text-sm dark:border-white/10">
              <span className="flex flex-wrap items-center gap-1.5">
                <Badge tone={f.severity === "Critical" ? "rose" : f.severity === "Major" ? "amber" : "slate"}>{f.severity}</Badge>
                <Badge tone={f.status === "Resolved" ? "emerald" : f.status === "In Progress" ? "sky" : "violet"}>{f.status}</Badge>
                <b className="min-w-0 flex-1">{f.title}</b>
              </span>
              <span className="mt-1 block text-[13px] text-slate-500">{f.where} — {f.problem}</span>
              <span className="mt-2 flex flex-wrap gap-1.5">
                <button onClick={() => setRows(rows.map((r) => (r.id === f.id ? { ...r, status: r.status === "Resolved" ? "Open" : "Resolved" } : r)))}
                  className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold dark:bg-white/10">
                  {f.status === "Resolved" ? "↺ Reopen" : "✓ Resolve"}
                </button>
                <button onClick={() => setEditing(f)} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold dark:bg-white/10">Edit</button>
                <button onClick={() => setConfirmDel(f.id)} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-rose-600 dark:bg-white/10">Delete…</button>
              </span>
              {confirmDel === f.id && (
                <span className="mt-2 flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-[13px] font-semibold dark:bg-rose-500/10">
                  Delete “{f.title}” permanently?
                  <button onClick={() => { setRows(rows.filter((r) => r.id !== f.id)); setConfirmDel(null); }} className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-black text-white">Yes, delete</button>
                  <button onClick={() => setConfirmDel(null)} className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold dark:border-white/15">Keep</button>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {editing && (
        <Dialog title="Edit finding" onClose={() => setEditing(null)}>
          <div className="space-y-2.5">
            <label className="block text-xs font-bold">Title<input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={input + " mt-1 w-full"} /></label>
            <label className="block text-xs font-bold">Problem<textarea value={editing.problem} onChange={(e) => setEditing({ ...editing, problem: e.target.value })} rows={2} className={input + " mt-1 h-auto w-full py-2"} /></label>
            <span className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold">Severity
                <select value={editing.severity} onChange={(e) => setEditing({ ...editing, severity: e.target.value as Severity })} className={input + " mt-1 w-full"}>
                  {(["Critical", "Major", "Minor"] as const).map((s) => <option key={s}>{s}</option>)}
                </select></label>
              <label className="text-xs font-bold">Status
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as FindingStatus })} className={input + " mt-1 w-full"}>
                  {(["Open", "In Progress", "Resolved"] as const).map((s) => <option key={s}>{s}</option>)}
                </select></label>
            </span>
            <span className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="h-10 rounded-xl px-4 text-sm font-bold text-slate-500">Cancel</button>
              <button onClick={saveEdit} disabled={editing.title.trim().length < 4} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white disabled:opacity-40">Save</button>
            </span>
          </div>
        </Dialog>
      )}
    </Card>
  );
}
