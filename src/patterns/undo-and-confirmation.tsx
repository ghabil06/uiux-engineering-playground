/** Undo & confirmation — safe defaults, named items, timed undo, honest locality. */
import React from "react";
import { Card } from "../components/ui";
import { Dialog } from "../components/foundation";
import { PatternDoc, Progress } from "./primitives";
import { patternDef } from "./data";
import { Undo2, Trash2 } from "lucide-react";

interface Item { id: string; name: string }

export default function UndoDemo() {
  const def = patternDef("undo-and-confirmation");
  const [items, setItems] = React.useState<Item[]>([
    { id: "p1", name: "Atlas Website" }, { id: "p2", name: "Mobile Onboarding" },
    { id: "p3", name: "Billing API" }, { id: "p4", name: "Help Center" },
  ]);
  const [confirm, setConfirm] = React.useState<Item | null>(null);
  const [undo, setUndo] = React.useState<{ item: Item; left: number } | null>(null);
  const [log, setLog] = React.useState<string[]>([]);
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);
  const say = (m: string) => setLog((l) => [`${new Date().toLocaleTimeString()} — ${m}`, ...l].slice(0, 5));

  const startUndo = (item: Item) => {
    if (timer.current) window.clearInterval(timer.current);
    setUndo({ item, left: 8 });
    timer.current = window.setInterval(() => {
      setUndo((u) => {
        if (!u) return u;
        if (u.left <= 1) {
          if (timer.current) window.clearInterval(timer.current);
          say(`“${u.item.name}” permanently removed from this demo (it was only ever local state).`);
          return null;
        }
        return { ...u, left: u.left - 1 };
      });
    }, 1000);
  };

  const archive = (item: Item) => {
    setItems((p) => p.filter((i) => i.id !== item.id));
    say(`“${item.name}” archived — reversible for 8 seconds.`);
    startUndo(item);
  };

  const destroy = (item: Item) => {
    setItems((p) => p.filter((i) => i.id !== item.id));
    setConfirm(null);
    say(`“${item.name}” deleted after explicit confirmation (simulated — no backend exists).`);
  };

  const undoIt = () => {
    if (!undo) return;
    if (timer.current) window.clearInterval(timer.current);
    setItems((p) => [...p, undo.item]);
    say(`Undo: “${undo.item.name}” restored.`);
    setUndo(null);
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Idle, confirming (named item, safe default), undo window with countdown, committed, cancelled."
        a11y="Destructive dialog focuses Cancel first; undo is a labelled button with a visible countdown, announced politely." />
      <Card className="p-5">
        <b>Projects <span className="font-normal text-slate-400">({items.length} — local demo state only)</span></b>
        {items.length === 0 ? (
          <p className="mt-2 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-white/15">
            All projects removed. <button onClick={() => { setItems([{ id: "p1", name: "Atlas Website" }, { id: "p2", name: "Mobile Onboarding" }, { id: "p3", name: "Billing API" }, { id: "p4", name: "Help Center" }]); say("Demo list restored."); }} className="font-bold text-violet-600 underline">Restore demo list</button>
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-2 rounded-2xl border border-slate-200 p-3 dark:border-white/10">
                <b className="min-w-0 flex-1 truncate text-sm">{it.name}</b>
                <button onClick={() => archive(it)} aria-label={`Archive ${it.name} (reversible)`}
                  className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-300 px-3 text-xs font-bold dark:border-white/15">
                  <Undo2 size={13} /> Archive
                </button>
                <button onClick={() => setConfirm(it)} aria-label={`Delete ${it.name} permanently`}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-rose-600 px-3 text-xs font-black text-white">
                  <Trash2 size={13} /> Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        {undo && (
          <div role="status" className="mt-3 rounded-2xl bg-slate-900 p-3.5 text-white">
            <span className="flex items-center gap-2 text-sm">
              <Undo2 size={15} /> “{undo.item.name}” archived.
              <button onClick={undoIt} className="ml-auto rounded-lg bg-white px-3 py-1.5 text-xs font-black text-slate-900">Undo ({undo.left}s)</button>
            </span>
            <span className="mt-2 block"><Progress value={undo.left} max={8} label={`Undo window for ${undo.item.name}`} tone="bg-white" /></span>
          </div>
        )}
      </Card>
      <Card className="p-4">
        <b className="text-sm">Outcome log</b>
        {log.length === 0
          ? <p className="mt-1 text-sm text-slate-500">Archive something (undoable) or Delete something (confirmed first).</p>
          : <ul className="mt-2 space-y-1 text-[13px] text-slate-600 dark:text-slate-300">{log.map((l, i) => <li key={i}>· {l}</li>)}</ul>}
      </Card>
      {confirm && (
        <Dialog title={`Delete “${confirm.name}”?`} desc="This is the destructive path: no undo, so we confirm with the item named and the safe choice focused." danger onClose={() => { setConfirm(null); say(`Delete of “${confirm.name}” cancelled.`); }}>
          <p className="rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-900 dark:bg-rose-500/10 dark:text-rose-100">
            61 tasks and 8 members would go with it — in a real app. Here it only edits this list.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button autoFocus onClick={() => { setConfirm(null); say(`Delete of “${confirm.name}” cancelled.`); }}
              className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Cancel (safe default)</button>
            <button onClick={() => destroy(confirm)} className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white">Yes, delete it</button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
