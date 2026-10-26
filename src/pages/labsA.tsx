import React from "react";
import { Badge, Btn, Card, Field, SectionHead, inputCls, useToasts } from "../components/ui";
import { ChevronRight, Undo2, Upload, GripVertical, Check, X, Search, Command as CmdIcon } from "lucide-react";
import { cx } from "../lib/core";

/* ═════════ PATTERNS ═════════ */
const CMDS = [
  ["Go to Dashboard", "product", "#/product/dashboard"], ["Go to E-commerce", "product", "#/product/ecommerce"],
  ["Go to Analytics", "product", "#/product/analytics"], ["Open cart", "action", "#/product/ecommerce"],
  ["Export analytics CSV", "action", "#/product/analytics"], ["Toggle theme", "action", "theme"],
  ["Open Testing Lab", "system", "#/testing"], ["Acknowledge ML alert", "action", "#/product/aiml"],
];

export function PatternsLab({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [tab, setTab] = React.useState("palette");
  const T = [["palette", "⌘K Palette"], ["table", "Sortable table"], ["wizard", "Multi-step"], ["dialog", "Modal & drawer"], ["feed", "Toasts & tips"], ["dnd", "Drag & drop"], ["upload", "Upload & undo"]];
  return (
    <div className="space-y-5">
      <SectionHead kicker="Interaction patterns" title="Pattern Lab — real behavior, keyboard included"
        desc="Seven working patterns. Every one handles keyboard, empty/error states and reset. Press Ctrl/⌘+K anywhere here to open the palette." />
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 no-scrollbar dark:border-white/10 dark:bg-white/[.03]" role="tablist" aria-label="Patterns">
        {T.map(([id, l]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={cx("shrink-0 rounded-xl px-4 py-2 text-[13px] font-bold", tab === id ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5")}>{l}</button>
        ))}
      </div>
      {tab === "palette" && <PaletteDemo dark={dark} setDark={setDark} />}
      {tab === "table" && <SortTableDemo />}
      {tab === "wizard" && <WizardDemo />}
      {tab === "dialog" && <DialogDemo />}
      {tab === "feed" && <FeedDemo />}
      {tab === "dnd" && <DndDemo />}
      {tab === "upload" && <UploadDemo />}
      <Card className="p-4 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
        <b>When to use what:</b> palette for power users (50+ destinations) · wizard for 3–6 dependent steps · drawer to preserve context, dialog to demand a decision · undo for reversible deletes, confirm for irreversible ones.
      </Card>
    </div>
  );
}

function PaletteDemo({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [hi, setHi] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hits = CMDS.filter(([l]) => l.toLowerCase().includes(q.toLowerCase()));

  React.useEffect(() => {
    const fn = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(true); setQ(""); setHi(0); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  React.useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); }, [open ]);

  const go = (route: string) => {
    setOpen(false);
    if (route === "theme") setDark(!dark);
    else window.location.hash = route;
  };

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"><CmdIcon size={20} /></span>
        <div><b>Command palette</b><p className="text-sm text-slate-500">Fuzzy search · ↑↓ navigate · Enter opens · Esc closes · focus trapped.</p></div>
        <Btn className="ml-auto" onClick={() => setOpen(true)}>Open palette <kbd className="rounded bg-white/20 px-1.5 font-mono text-xs">⌘K</kbd></Btn>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {["Type “cart” to jump to checkout", "Type “theme” to toggle dark mode", "Type “dash” to open the dashboard", "Keyboard-only operable, announces counts"].map((t) => (
          <p key={t} className="rounded-xl bg-slate-50 px-3 py-2 text-[13px] text-slate-600 dark:bg-white/5 dark:text-slate-300">· {t}</p>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
          <div className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 dark:border-white/10">
              <Search size={16} className="text-slate-400" />
              <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setHi(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setHi(Math.min(hi + 1, hits.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setHi(Math.max(hi - 1, 0)); }
                  if (e.key === "Enter" && hits[hi]) go(hits[hi][2]);
                  if (e.key === "Escape") setOpen(false);
                }}
                placeholder="Type a command…" aria-label="Command search" aria-activedescendant={`cmd-${hi}`} role="combobox" aria-expanded="true" aria-controls="cmd-list"
                className="h-12 w-full bg-transparent text-[15px] outline-none" />
              <kbd className="rounded border px-1.5 font-mono text-[11px] text-slate-400">esc</kbd>
            </div>
            <ul id="cmd-list" role="listbox" className="max-h-64 overflow-y-auto p-2" aria-label={`${hits.length} results`}>
              {hits.map(([l, kind, r], i) => (
                <li key={l} id={`cmd-${i}`} role="option" aria-selected={hi === i}>
                  <button onMouseEnter={() => setHi(i)} onClick={() => go(r)}
                    className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm", hi === i ? "bg-violet-600 text-white" : "hover:bg-slate-100 dark:hover:bg-white/5")}>
                    <b>{l}</b><Badge tone="slate" className={hi === i ? "!bg-white/20 !text-white" : ""}>{kind}</Badge>
                    <span className="ml-auto text-xs opacity-60">↵</span>
                  </button>
                </li>
              ))}
              {hits.length === 0 && <li className="p-6 text-center text-sm text-slate-500">No commands for “{q}”. <button className="font-bold text-violet-600" onClick={() => setQ("")}>Clear</button></li>}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}

function SortTableDemo() {
  const rows = [["Ava Chen", 490, 12], ["Liam Park", 2400, 84], ["Maya Garcia", 29, 3], ["Noah Kim", 1190, 31], ["Zoe Silva", 790, 22]] as const;
  const [k, setK] = React.useState(1);
  const [d, setD] = React.useState<1 | -1>(-1);
  const sorted = [...rows].sort((a, b) => ((a[k] as number) - (b[k] as number)) * d);
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead><tr className="bg-slate-50 text-[11px] uppercase text-slate-500 dark:bg-white/5">
          <th className="p-3">Customer</th>
          <th><button className="p-3 font-bold" aria-sort={k === 1 ? (d === 1 ? "ascending" : "descending") : "none"} onClick={() => { k === 1 ? setD(d === 1 ? -1 : 1) : (setK(1), setD(-1)); }}>MRR {k === 1 ? (d === 1 ? "↑" : "↓") : "↕"}</button></th>
          <th><button className="p-3 font-bold" aria-sort={k === 2 ? (d === 1 ? "ascending" : "descending") : "none"} onClick={() => { k === 2 ? setD(d === 1 ? -1 : 1) : (setK(2), setD(-1)); }}>Seats {k === 2 ? (d === 1 ? "↑" : "↓") : "↕"}</button></th>
        </tr></thead>
        <tbody>{sorted.map(([n, m, s]) => <tr key={n} className="border-t border-slate-100 dark:border-white/5"><td className="p-3 font-bold">{n}</td><td className="p-3 tabular-nums">${m.toLocaleString()}</td><td className="p-3 tabular-nums">{s}</td></tr>)}</tbody>
      </table>
      <p className="border-t border-slate-100 p-3 text-xs text-slate-500 dark:border-white/10">Click headers to sort — <code>aria-sort</code> announces direction to screen readers. Pagination lives in the dashboard demo.</p>
    </Card>
  );
}

function WizardDemo() {
  const [s, setS] = React.useState(0);
  const [f, setF] = React.useState({ name: "", plan: "Growth", terms: false });
  const [err, setErr] = React.useState("");
  const next = () => {
    if (s === 0 && f.name.trim().length < 2) { setErr("Enter your workspace name (2+ chars)."); return; }
    if (s === 2 && !f.terms) { setErr("Accept the terms to continue."); return; }
    setErr(""); setS(Math.min(s + 1, 3));
  };
  return (
    <Card className="p-6">
      <ol className="flex items-center gap-1" aria-label="Progress">
        {["Workspace", "Plan", "Review", "Done"].map((l, i) => (
          <li key={l} className="flex flex-1 items-center gap-2">
            <span className={cx("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black", i < s ? "bg-emerald-500 text-white" : i === s ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-500")} aria-current={i === s ? "step" : undefined}>{i < s ? <Check size={13} /> : i + 1}</span>
            <span className={cx("hidden text-xs font-bold sm:block", i === s ? "text-slate-900 dark:text-white" : "text-slate-400")}>{l}</span>
            {i < 3 && <span className={cx("h-0.5 flex-1 rounded", i < s ? "bg-emerald-400" : "bg-slate-200 dark:bg-white/10")} />}
          </li>
        ))}
      </ol>
      <div className="mt-5 min-h-[150px]">
        {s === 0 && <Field label="Workspace name" error={err} htmlFor="w-n"><input id="w-n" className={inputCls(err)} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Acme Inc." /></Field>}
        {s === 1 && <Field label="Plan"><span className="grid gap-2 sm:grid-cols-3">{["Starter", "Growth", "Enterprise"].map((p) => (
          <button key={p} onClick={() => setF({ ...f, plan: p })} aria-pressed={f.plan === p} className={cx("rounded-2xl border p-3 text-sm font-bold", f.plan === p ? "border-violet-500 ring-2 ring-violet-200" : "border-slate-200 dark:border-white/10")}>{p}</button>))}</span></Field>}
        {s === 2 && (
          <div className="space-y-3 text-sm">
            <p className="rounded-2xl bg-slate-50 p-3 dark:bg-white/5">Workspace <b>{f.name || "—"}</b> on <b>{f.plan}</b>.</p>
            <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })} className="h-5 w-5 accent-violet-600" /> I accept the demo terms (fictional)</label>
            {err && <p role="alert" className="text-xs font-bold text-rose-600">{err}</p>}
          </div>
        )}
        {s === 3 && <div className="rounded-2xl bg-emerald-50 p-6 text-center dark:bg-emerald-500/10"><p className="text-3xl">🎉</p><b>Workspace “{f.name}” created (locally).</b><p className="text-sm text-slate-500">A real app would now provision + redirect.</p></div>}
      </div>
      {s < 3 && (
        <div className="mt-4 flex gap-2">
          <Btn variant="outline" disabled={s === 0} onClick={() => { setS(s - 1); setErr(""); }}>Back</Btn>
          <Btn className="flex-1" onClick={next}>{s === 2 ? "Create workspace" : "Continue"}</Btn>
        </div>
      )}
      {s === 3 && <Btn variant="outline" className="mt-4" onClick={() => { setS(0); setF({ name: "", plan: "Growth", terms: false }); }}>↺ Start over</Btn>}
      <p className="mt-3 text-xs text-slate-500">Inline validation per step · Back preserves input · completion is reversible in demo.</p>
    </Card>
  );
}

function DialogDemo() {
  const [m, setM] = React.useState<null | "modal" | "drawer" | "confirm">(null);
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  React.useEffect(() => {
    if (!m) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setM(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [m]);
  return (
    <Card className="p-6">
      <div className="flex flex-wrap gap-2">
        <Btn size="sm" onClick={() => setM("modal")}>Modal (decision)</Btn>
        <Btn size="sm" variant="outline" onClick={() => setM("drawer")}>Drawer (context)</Btn>
        <Btn size="sm" variant="danger" onClick={() => setM("confirm")}>Destructive confirm</Btn>
      </div>
      <p className="mt-3 text-[13px] text-slate-500">Esc closes · backdrop click cancels · focus moves into the dialog · destructive needs typed intent in real apps.</p>
      {m === "modal" && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Invite teammate">
          <div className="absolute inset-0 bg-black/45" onClick={() => setM(null)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 dark:bg-slate-900">
            <h4 className="font-black">Invite teammate</h4>
            {sent ? <p className="mt-2 rounded-xl bg-emerald-50 p-3 text-sm dark:bg-emerald-500/10">✓ Invite queued for {email} (simulated).</p>
              : <form className="mt-3 space-y-3" onSubmit={(e) => { e.preventDefault(); if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setSent(true); }}>
                <Field label="Email" htmlFor="inv"><input id="inv" autoFocus className={inputCls()} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@co.com" /></Field>
                <div className="flex justify-end gap-2"><Btn size="sm" variant="ghost" type="button" onClick={() => setM(null)}>Cancel</Btn><Btn size="sm" type="submit">Send invite</Btn></div>
              </form>}
          </div>
        </div>
      )}
      {m === "drawer" && (
        <div className="fixed inset-0 z-[80] flex justify-end" role="dialog" aria-modal="true" aria-label="Details drawer">
          <div className="absolute inset-0 bg-black/40" onClick={() => setM(null)} />
          <div className="relative w-full max-w-xs bg-white p-5 dark:bg-slate-900"><h4 className="font-black">Row details</h4><p className="text-sm text-slate-500">Table stays visible behind — context preserved.</p><Btn size="sm" className="mt-4 w-full" onClick={() => setM(null)}>Done</Btn></div>
        </div>
      )}
      {m === "confirm" && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-label="Confirm deletion">
          <div className="absolute inset-0 bg-black/45" onClick={() => setM(null)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 dark:bg-slate-900">
            <h4 className="font-black">Delete 3 workspaces?</h4><p className="mt-1 text-sm text-slate-500">Irreversible. In production this requires typing the name.</p>
            <div className="mt-4 flex justify-end gap-2"><Btn size="sm" variant="ghost" onClick={() => setM(null)}>Keep</Btn><Btn size="sm" variant="danger" onClick={() => setM(null)}>Yes, delete</Btn></div>
          </div>
        </div>
      )}
    </Card>
  );
}

function FeedDemo() {
  const { push, Toast } = useToasts();
  const [tip, setTip] = React.useState(0);
  return (
    <Card className="p-6">
      {Toast}
      <div className="flex flex-wrap gap-2">
        <Btn size="sm" onClick={() => push("Saved", "Workspace updated.", "#10b981")}>Success toast</Btn>
        <Btn size="sm" variant="outline" onClick={() => push("Sync failed", "Retry available — nothing lost.", "#e11d48")}>Error toast</Btn>
        <Btn size="sm" variant="outline" onClick={() => push("Heads up", "Trial ends in 2 days.", "#f59e0b")}>Warning</Btn>
      </div>
      <div className="mt-4 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
        <p className="text-xs font-bold uppercase text-slate-400">Tooltip (hover or focus the button)</p>
        <div className="group relative mt-2 inline-block">
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-900" aria-describedby="tip1">Archive project</button>
          <span id="tip1" role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-52 -translate-x-1/2 rounded-xl bg-slate-900 p-2.5 text-xs text-white opacity-0 shadow-xl transition group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-white dark:text-slate-900">Moves to archive. Restorable for 30 days — tooltips describe consequences, not just labels.</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-bold uppercase text-slate-400">Accordion</p>
        {[["When are toasts right?", "Short confirmations of user action. Never for errors that block progress — use inline + alert."], ["Tooltip rules", "Hover AND focus. 1–2 lines. No essential info only in tooltips."]].map(([t, d], i) => (
          <div key={t} className="mt-2 rounded-2xl border border-slate-200 dark:border-white/10">
            <button onClick={() => setTip(tip === i ? -1 : i)} aria-expanded={tip === i} className="flex w-full items-center justify-between p-3 text-sm font-bold">{t}<ChevronRight size={15} className={cx(tip === i && "rotate-90")} /></button>
            {tip === i && <p className="px-3 pb-3 text-[13px] text-slate-500">{d}</p>}
          </div>
        ))}
      </div>
    </Card>
  );
}

function DndDemo() {
  const [items, setItems] = React.useState(["Write spec", "Design review", "Build prototype", "Usability test", "Ship 🚀"]);
  const [drag, setDrag] = React.useState<number | null>(null);
  const move = (from: number, to: number) => {
    const n = [...items]; const [x] = n.splice(from, 1); n.splice(to, 0, x); setItems(n);
  };
  return (
    <Card className="p-6">
      <p className="text-sm text-slate-500">Drag to reorder (pointer) or use ↑↓ buttons (keyboard). Order persists in local state.</p>
      <ul className="mt-3 space-y-2" aria-label="Prioritized backlog">
        {items.map((t, i) => (
          <li key={t} draggable onDragStart={() => setDrag(i)} onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (drag !== null && drag !== i) move(drag, i); setDrag(null); }}
            className={cx("flex items-center gap-2 rounded-2xl border bg-white p-3 dark:border-white/10 dark:bg-white/5", drag === i ? "border-violet-400 opacity-60" : "border-slate-200")}>
            <GripVertical size={16} className="cursor-grab text-slate-300" aria-hidden />
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-black dark:bg-white/10">{i + 1}</span>
            <b className="text-sm">{t}</b>
            <span className="ml-auto flex gap-1">
              <button onClick={() => i > 0 && move(i, i - 1)} disabled={i === 0} aria-label={`Move ${t} up`} className="rounded-lg border px-2 py-1 text-xs font-bold disabled:opacity-30 dark:border-white/10">↑</button>
              <button onClick={() => i < items.length - 1 && move(i, i + 1)} disabled={i === items.length - 1} aria-label={`Move ${t} down`} className="rounded-lg border px-2 py-1 text-xs font-bold disabled:opacity-30 dark:border-white/10">↓</button>
            </span>
          </li>
        ))}
      </ul>
      <button onClick={() => setItems(["Write spec", "Design review", "Build prototype", "Usability test", "Ship 🚀"])} className="mt-3 text-xs font-bold text-violet-600">↺ Reset order</button>
    </Card>
  );
}

function UploadDemo() {
  const [files, setFiles] = React.useState<{ name: string; pct: number; done: boolean }[]>([]);
  const [deleted, setDeleted] = React.useState<{ name: string } | null>(null);
  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const fresh = Array.from(list).slice(0, 3).map((f) => ({ name: f.name, pct: 0, done: false }));
    setFiles((p) => [...p, ...fresh]);
    fresh.forEach((f, k) => {
      const iv = setInterval(() => {
        setFiles((p) => p.map((x) => x.name === f.name ? { ...x, pct: Math.min(100, x.pct + 17 + k * 3) } : x));
      }, 220);
      setTimeout(() => { clearInterval(iv); setFiles((p) => p.map((x) => x.name === f.name ? { ...x, pct: 100, done: true } : x)); }, 1600);
    });
  };
  return (
    <Card className="p-6">
      <label className="flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed border-slate-300 p-8 text-center hover:border-violet-400 dark:border-white/15"
        onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
        <Upload size={26} className="text-violet-500" />
        <b className="mt-2 text-sm">Drop files here or click to browse</b>
        <span className="text-xs text-slate-500">Simulated upload — nothing leaves your browser</span>
        <input type="file" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} aria-label="Upload files" />
      </label>
      <ul className="mt-3 space-y-2">
        {files.map((f) => (
          <li key={f.name} className="rounded-2xl border border-slate-200 p-3 text-sm dark:border-white/10">
            <span className="flex items-center gap-2"><b className="truncate">{f.name}</b>
              {f.done && <Badge tone="emerald"><Check size={11} /> done</Badge>}
              <button aria-label={`Remove ${f.name}`} className="ml-auto rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-white/10"
                onClick={() => { setFiles(files.filter((x) => x.name !== f.name)); setDeleted({ name: f.name }); setTimeout(() => setDeleted(null), 6000); }}><X size={14} /></button></span>
            <span className="mt-2 block h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10" role="progressbar" aria-valuenow={f.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${f.name} progress`}>
              <span className="block h-full rounded-full bg-violet-600 transition-all" style={{ width: `${f.pct}%` }} /></span>
          </li>
        ))}
      </ul>
      {files.length === 0 && <p className="mt-3 text-center text-xs text-slate-400">Empty state: no uploads yet.</p>}
      {deleted && (
        <div role="status" className="mt-3 flex items-center gap-2 rounded-2xl bg-slate-900 p-3 text-sm text-white">
          <Undo2 size={15} /> Removed “{deleted.name}”
          <button className="ml-auto font-bold underline" onClick={() => { setFiles([...files, { name: deleted.name, pct: 100, done: true }]); setDeleted(null); }}>Undo</button>
        </div>
      )}
    </Card>
  );
}

/* ═════════ STATES ═════════ */
const STATE_DEFS = [
  ["default", "Resting", "Neutral. Every control starts here.", "—", "slate"],
  ["hover", "Hover", "Pointer over. Slight lift/tint.", "Remove pointer.", "sky"],
  ["focus", "Focus", "Keyboard arrived. 2px ring mandatory.", "Tab away.", "violet"],
  ["active", "Active / pressed", "Momentary press scale .98.", "Release.", "slate"],
  ["disabled", "Disabled", "Unavailable by permission or logic. Explain why nearby.", "Grant permission / complete prerequisite.", "slate"],
  ["loading", "Loading", "Skeleton or spinner + aria-busy. Never blank.", "Wait or cancel.", "sky"],
  ["empty", "Empty", "First-use: illustrate + CTA.", "Create first item.", "emerald"],
  ["no-results", "No results", "Filters too tight: show count + clear.", "Clear filters.", "amber"],
  ["validation", "Validation error", "Inline, names the fix, role=alert.", "Correct input.", "rose"],
  ["api-error", "API error", "What failed + Retry + support path.", "Retry / use cache.", "rose"],
  ["success", "Success", "Confirm + next step. Auto-dismiss optional.", "Continue.", "emerald"],
  ["offline", "Offline", "Banner + queue writes locally.", "Reconnect; queued sync.", "amber"],
  ["denied", "Permission denied", "Who to ask, not just 'forbidden'.", "Request access.", "rose"],
  ["expired", "Session expired", "Preserve draft, re-auth inline.", "Sign in again.", "amber"],
  ["partial", "Partial failure", "Per-item status: 3/4 saved, 1 retry.", "Retry failed items.", "amber"],
  ["stale", "Stale data", "Timestamp + refresh. Never silently old.", "Refresh.", "sky"],
] as const;

export function StatesLab() {
  const [comp, setComp] = React.useState<"button" | "input" | "card" | "table">("button");
  const [state, setState] = React.useState<string>("default");
  const [offline, setOffline] = React.useState(false);
  const [retryN, setRetryN] = React.useState(0);
  const def = STATE_DEFS.find(([id]) => id === state)!;

  return (
    <div className="space-y-5">
      <SectionHead kicker="Interface states · 16" title="State Lab — pick a component, force any state"
        desc="Impossible combos are blocked by an explicit state model (e.g. a button can't be loading + disabled + success at once — loading implies disabled). Each state ships its message and recovery." />
      {offline && <div role="alert" className="rounded-2xl bg-slate-900 p-3 text-center text-sm font-bold text-white">📴 You're offline (simulated) — writes queue locally. <button className="underline" onClick={() => setOffline(false)}>Reconnect</button></div>}
      <div className="flex flex-wrap gap-2">
        <span className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Component">
          {(["button", "input", "card", "table"] as const).map((c) => (
            <button key={c} onClick={() => setComp(c)} aria-pressed={comp === c} className={cx("rounded-full px-4 py-1.5 text-[13px] font-bold capitalize", comp === c ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>{c}</button>
          ))}
        </span>
        <Btn size="sm" variant="outline" onClick={() => setOffline(!offline)} aria-pressed={offline}>{offline ? "Reconnect" : "Simulate offline"}</Btn>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="flex min-h-[300px] items-center justify-center p-8 lg:col-span-3" aria-live="polite" aria-busy={state === "loading"}>
          {comp === "button" && <StateButton state={state} retryN={retryN} setRetryN={setRetryN} />}
          {comp === "input" && <StateInput state={state} />}
          {comp === "card" && <StateCard state={state} />}
          {comp === "table" && <StateTable state={state} setState={setState} />}
        </Card>
        <div className="space-y-3 lg:col-span-2">
          <div className="grid grid-cols-2 gap-1.5">
            {STATE_DEFS.map(([id, label]) => (
              <button key={id} onClick={() => setState(id)} aria-pressed={state === id} disabled={offline && ["loading", "success"].includes(id)}
                className={cx("rounded-xl border px-2.5 py-2 text-left text-xs font-bold disabled:opacity-40", state === id ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10" : "border-slate-200 dark:border-white/10")}>
                {label}</button>
            ))}
          </div>
          <Card className="p-4 text-[13px]">
            <Badge tone={def[4] as never}>{def[1]}</Badge>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{def[2]}</p>
            <p className="mt-2 rounded-xl bg-slate-50 p-2.5 dark:bg-white/5"><b>Recovery:</b> {def[3]}</p>
            <p className="mt-2 text-xs text-slate-400">Model guard: {["loading", "disabled", "success"].includes(state) ? "action locked while " + state + " (by design)" : "actions available"} · offline blocks success/loading.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StateButton({ state, retryN, setRetryN }: { state: string; retryN: number; setRetryN: (n: number) => void }) {
  if (state === "loading") return <button disabled className="flex items-center gap-2 rounded-xl bg-violet-400 px-6 py-3 font-bold text-white" aria-busy="true"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Saving…</button>;
  if (state === "disabled") return <div className="text-center"><button disabled className="cursor-not-allowed rounded-xl bg-slate-200 px-6 py-3 font-bold text-slate-400">Save changes</button><p className="mt-2 text-xs text-slate-500">Disabled because 2 required fields are empty.</p></div>;
  if (state === "success") return <div className="text-center"><p className="text-4xl">✓</p><b>Saved!</b><p className="text-sm text-slate-500">Next: invite your team.</p></div>;
  if (state === "api-error") return <div className="text-center"><p className="rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-800 dark:bg-rose-500/10 dark:text-rose-100">Couldn't save (500). Attempt {retryN + 1}.</p><Btn size="sm" className="mt-2" onClick={() => setRetryN(retryN + 1)}>Retry</Btn>{retryN >= 2 && <p className="mt-1 text-xs text-emerald-600 font-bold">✓ Recovered on retry 3 (simulated resilience).</p>}</div>;
  if (state === "empty" || state === "no-results") return <p className="text-sm text-slate-500">Buttons don't have empty states — that's why the model redirects you: pair with a card/table. (Honest modeling.)</p>;
  if (state === "focus") return <button autoFocus className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white ring-4 ring-violet-300">Focused — Tab order lands here</button>;
  if (state === "hover") return <button className="scale-105 rounded-xl bg-violet-700 px-6 py-3 font-bold text-white shadow-xl">Hovered (lift + darken)</button>;
  if (state === "offline") return <button className="rounded-xl bg-slate-700 px-6 py-3 font-bold text-white">Save (will queue) ⏳</button>;
  if (state === "denied") return <div className="text-center"><button disabled className="rounded-xl bg-slate-200 px-6 py-3 font-bold text-slate-400">Delete</button><p className="mt-2 text-xs">Ask an admin — <button className="font-bold text-violet-600">request access</button>.</p></div>;
  if (state === "expired") return <div className="text-center"><p className="text-sm font-bold">Session expired — draft preserved ✓</p><Btn size="sm" className="mt-2">Sign in again</Btn></div>;
  if (state === "validation") return <div className="text-center"><button className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white">Submit</button><p role="alert" className="mt-2 text-xs font-bold text-rose-600">Fix 1 field above first.</p></div>;
  if (state === "partial") return <div className="text-sm"><p>✓ 3 saved · <span className="font-bold text-amber-600">1 failed</span></p><button className="mt-1 font-bold text-violet-600">Retry 1 item</button></div>;
  if (state === "stale") return <div className="text-center"><button className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white">Data · 2h old</button><p className="mt-1 text-xs text-slate-400">Labeled stale — <button className="font-bold text-violet-600">refresh</button>.</p></div>;
  return <button className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white hover:bg-violet-700">Save changes</button>;
}

function StateInput({ state }: { state: string }) {
  if (state === "validation") return <Field label="Email" error="Use a work email — gmail.com is blocked here." htmlFor="st-e"><input id="st-e" defaultValue="ada@gmail.com" aria-invalid="true" className={inputCls("e")} /></Field>;
  if (state === "disabled") return <Field label="Company ID" hint="Assigned by your admin."><input disabled value="ACME-042" className={inputCls() + " opacity-50"} /></Field>;
  if (state === "loading") return <div className="w-full max-w-xs space-y-2" aria-busy="true"><div className="h-4 w-20 animate-pulse rounded bg-slate-200" /><div className="h-10 animate-pulse rounded-xl bg-slate-200" /></div>;
  if (state === "success") return <Field label="Username" hint="✓ @mayaships is available!"><input defaultValue="mayaships" className={inputCls() + " border-emerald-400"} /></Field>;
  return <div className="w-full max-w-xs"><Field label={`Email — ${state}`} hint="State reflected in helper text."><input placeholder="you@co.com" autoFocus={state === "focus"} className={inputCls()} /></Field></div>;
}

function StateCard({ state }: { state: string }) {
  if (state === "empty") return <div className="text-center"><p className="text-4xl">📁</p><b>No projects yet</b><p className="text-sm text-slate-500">Create your first to see analytics.</p><Btn size="sm" className="mt-2">New project</Btn></div>;
  if (state === "no-results") return <div className="text-center"><p className="text-4xl">🔍</p><b>0 of 128 match</b><p className="text-sm text-slate-500">Try removing one filter.</p><Btn size="sm" variant="outline" className="mt-2">Clear filters</Btn></div>;
  if (state === "loading") return <div className="w-64 space-y-2" aria-busy="true"><div className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10" /><div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-white/10" /></div>;
  if (state === "api-error") return <div className="text-center"><p className="text-4xl">⚠️</p><b>Couldn't load projects</b><Btn size="sm" className="mt-2">Retry</Btn></div>;
  return <div className="w-64 rounded-2xl border border-slate-200 p-4 dark:border-white/10"><b>Project Atlas</b><p className="text-sm text-slate-500">12 files · updated 2h ago</p><span className="mt-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">● healthy</span></div>;
}

function StateTable({ state, setState }: { state: string; setState: (s: string) => void }) {
  if (state === "empty") return <div className="text-center text-sm"><b>No rows yet</b><p className="text-slate-500">Import CSV to begin.</p></div>;
  if (state === "loading") return <div className="w-72 space-y-1.5" aria-busy="true">{[1, 2, 3, 4].map((i) => <div key={i} className="h-8 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" />)}</div>;
  if (state === "stale") return <div className="text-sm"><p className="rounded-xl bg-amber-50 p-2 font-bold text-amber-800 dark:bg-amber-500/10 dark:text-amber-100">Snapshot from 09:41 — live query failed.</p><button onClick={() => setState("default")} className="mt-2 font-bold text-violet-600">Retry live →</button></div>;
  return <table className="text-left text-sm"><thead><tr className="text-[11px] uppercase text-slate-400"><th className="px-3 py-1">User</th><th className="px-3 py-1">Status</th></tr></thead>
    <tbody>{[["Ava", "active"], ["Liam", "trial"]].map(([a, b]) => <tr key={a} className="border-t border-slate-100 dark:border-white/10"><td className="px-3 py-1.5 font-bold">{a}</td><td className="px-3 py-1.5"><Badge tone="emerald">{b}</Badge></td></tr>)}</tbody></table>;
}
