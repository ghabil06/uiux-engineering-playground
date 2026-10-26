/** Command palette — global shortcut with guarded scope, real commands. */
import React from "react";
import { Card, Badge } from "../components/ui";
import { Dialog } from "../components/foundation";
import { PatternDoc } from "./primitives";
import { patternDef } from "./data";
import { Search, Command as CmdIcon } from "lucide-react";
import { cx } from "../lib/core";

interface Cmd { label: string; kind: string; run: () => string }

export default function PaletteDemo({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  const def = patternDef("command-palette");
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [hi, setHi] = React.useState(0);
  const [help, setHelp] = React.useState(false);
  const [log, setLog] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const exec = (label: string) => setLog((l) => [`${new Date().toLocaleTimeString()} — ran “${label}”`, ...l].slice(0, 5));

  const CMDS: Cmd[] = [
    { label: "Go to Enterprise Dashboard", kind: "navigate", run: () => { window.location.hash = "#/product/dashboard"; return "Navigated to the dashboard."; } },
    { label: "Go to Data Table pattern", kind: "navigate", run: () => { window.location.hash = "#/patterns/data-table"; return "Navigated to the data table."; } },
    { label: "Go to Style Gallery", kind: "navigate", run: () => { window.location.hash = "#/styles"; return "Navigated to the style gallery."; } },
    { label: "Open pattern catalogue", kind: "navigate", run: () => { window.location.hash = "#/patterns"; return "Opened the pattern catalogue."; } },
    { label: dark ? "Switch to light theme" : "Switch to dark theme", kind: "action", run: () => { setDark(!dark); return `Theme → ${!dark ? "dark" : "light"}.`; } },
    { label: "Clear search demo filters", kind: "action", run: () => { window.location.hash = "#/patterns/search-and-filter"; return "Opened search with default filters."; } },
    { label: "Show application help", kind: "help", run: () => { setHelp(true); return "Help opened."; } },
  ];

  // Single global listener; ignores typing contexts (inputs, textareas, selects, editable).
  React.useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        if (typing) return;
        e.preventDefault();
        setOpen(true); setQ(""); setHi(0);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  React.useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 30); }, [open ]);

  const hits = CMDS.filter((c) => c.label.toLowerCase().includes(q.trim().toLowerCase()));
  const run = (c: Cmd) => {
    setOpen(false);
    exec(c.label);
    const note = c.run();
    setLog((l) => [`${new Date().toLocaleTimeString()} — ${note}`, ...l].slice(0, 5));
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Closed, open with results, filtered, empty; executed commands logged below."
        a11y="Shortcut never fires while typing; listbox semantics with aria-activedescendant; visible ⌘K hint in the UI." />
      <Card className="flex flex-wrap items-center gap-3 p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"><CmdIcon size={20} /></span>
        <p className="text-sm text-slate-500">Press <kbd className="rounded border border-slate-300 px-1.5 py-0.5 font-mono text-xs font-bold dark:border-white/15">Ctrl/⌘ K</kbd> anywhere outside a text field — or:</p>
        <button onClick={() => { setOpen(true); setQ(""); setHi(0); }} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">Open palette</button>
      </Card>
      <Card className="p-4">
        <b className="text-sm">Executed commands</b>
        {log.length === 0
          ? <p className="mt-1 text-sm text-slate-500">Nothing run yet. Try “Switch to … theme” to see a real effect.</p>
          : <ul className="mt-2 space-y-1 text-[13px] text-slate-600 dark:text-slate-300">{log.map((l, i) => <li key={i}>· {l}</li>)}</ul>}
      </Card>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
          <div className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-100 px-4 dark:border-white/10">
              <Search size={16} aria-hidden className="text-slate-400" />
              <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setHi(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setHi(Math.min(hi + 1, hits.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setHi(Math.max(hi - 1, 0)); }
                  if (e.key === "Enter" && hits[hi]) run(hits[hi]);
                  if (e.key === "Escape") setOpen(false);
                }}
                placeholder="Type a command…" aria-label="Command search" role="combobox" aria-expanded="true"
                aria-controls="pp-list" aria-activedescendant={hits.length ? `pp-${hi}` : undefined}
                className="h-12 w-full bg-transparent text-[15px] outline-none" />
              <kbd className="rounded border px-1.5 font-mono text-[11px] text-slate-400">esc</kbd>
            </div>
            <ul id="pp-list" role="listbox" aria-label={`${hits.length} commands`} className="max-h-64 overflow-y-auto p-2">
              {hits.map((c, i) => (
                <li key={c.label} id={`pp-${i}`} role="option" aria-selected={hi === i}>
                  <button onMouseEnter={() => setHi(i)} onClick={() => run(c)}
                    className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm", hi === i ? "bg-violet-600 text-white" : "hover:bg-slate-100 dark:hover:bg-white/5")}>
                    <b>{c.label}</b><Badge tone="slate" className={hi === i ? "!bg-white/20 !text-white" : ""}>{c.kind}</Badge>
                    <span aria-hidden className="ml-auto text-xs opacity-60">↵</span>
                  </button>
                </li>
              ))}
              {hits.length === 0 && (
                <li className="p-6 text-center text-sm text-slate-500">
                  No commands for “{q}”. <button className="font-bold text-violet-600" onClick={() => setQ("")}>Clear search</button> or press Esc.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
      {help && (
        <Dialog title="Keyboard shortcuts" desc="The full set — there are only three." onClose={() => setHelp(false)}>
          <ul className="space-y-2 text-sm">
            {[["Ctrl/⌘ + K", "Open the palette (not while typing)"], ["↑ / ↓ + Enter", "Move and run"], ["Esc", "Close"]].map(([k, d]) => (
              <li key={k} className="flex items-center gap-2"><kbd className="rounded border border-slate-300 px-2 py-0.5 font-mono text-xs font-bold dark:border-white/15">{k}</kbd>{d}</li>
            ))}
          </ul>
        </Dialog>
      )}
    </div>
  );
}
