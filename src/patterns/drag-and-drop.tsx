/** Drag & drop — HTML5 board with full keyboard parity and announcements. */
import React from "react";
import { PatternDoc } from "./primitives";
import { patternDef } from "./data";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { cx } from "../lib/core";

type Col = "todo" | "doing" | "done";
const COLS: { id: Col; label: string }[] = [
  { id: "todo", label: "To do" }, { id: "doing", label: "Doing" }, { id: "done", label: "Done" },
];
const START: { id: string; title: string; col: Col }[] = [
  { id: "c1", title: "Design hero variants", col: "todo" },
  { id: "c2", title: "Migrate pricing page", col: "todo" },
  { id: "c3", title: "Fix checkout focus trap", col: "doing" },
  { id: "c4", title: "Compress hero images", col: "done" },
];

export default function DndDemo() {
  const def = patternDef("drag-and-drop");
  const [cards, setCards] = React.useState(START);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<Col | null>(null);
  const [msg, setMsg] = React.useState("Board ready. Drag cards, or use the arrow buttons on any card.");

  const move = (id: string, to: Col) => {
    setCards((prev) => {
      const card = prev.find((c) => c.id === id);
      if (!card || card.col === to) return prev;
      const from = COLS.find((c) => c.id === card.col)!.label;
      setMsg(`“${card.title}” moved from ${from} to ${COLS.find((c) => c.id === to)!.label}.`);
      return prev.map((c) => (c.id === id ? { ...c, col: to } : c));
    });
  };

  const shift = (id: string, dir: 1 | -1) => {
    const card = cards.find((c) => c.id === id)!;
    const i = COLS.findIndex((c) => c.id === card.col);
    const next = COLS[i + dir];
    if (next) move(id, next.id);
    else setMsg(`“${card.title}” is already in the ${dir === 1 ? "last" : "first"} column.`);
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Idle, dragging with labelled drop target, dropped, empty column; keyboard path always available."
        a11y={def.keyboard + " No pointer-only interaction: arrows + Move-to both work with touch and keyboard."} />
      <p role="status" aria-live="polite" className="rounded-2xl bg-violet-50 p-3 text-sm font-semibold text-violet-900 dark:bg-violet-500/10 dark:text-violet-100">
        {msg}
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {COLS.map((col) => {
          const items = cards.filter((c) => c.col === col.id);
          const hot = over === col.id;
          return (
            <section key={col.id} aria-label={`${col.label} column, ${items.length} cards`}
              onDragOver={(e) => { e.preventDefault(); setOver(col.id); }}
              onDragLeave={() => setOver((o) => (o === col.id ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain") || dragId;
                setOver(null); setDragId(null);
                if (id) move(id, col.id);
              }}
              className={cx("min-h-[220px] rounded-3xl border-2 p-3 transition",
                hot ? "border-violet-500 border-dashed bg-violet-50 dark:bg-violet-500/10" : "border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/[.02]")}>
              <h3 className="flex items-center gap-2 px-1 text-sm font-black uppercase tracking-wider text-slate-500">
                {col.label}<span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] tabular-nums dark:bg-white/10">{items.length}</span>
              </h3>
              {hot && <p className="mt-1 rounded-xl bg-violet-600 px-2 py-1 text-center text-xs font-black text-white">Drop here — {col.label}</p>}
              <ul className="mt-2 space-y-2">
                {items.map((c) => (
                  <li key={c.id} draggable
                    onDragStart={(e) => { e.dataTransfer.setData("text/plain", c.id); setDragId(c.id); }}
                    onDragEnd={() => { setDragId(null); setOver(null); }}
                    aria-grabbed={dragId === c.id}
                    className={cx("rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5", dragId === c.id && "opacity-50 ring-2 ring-violet-400")}>
                    <span className="flex items-center gap-1.5">
                      <GripVertical size={14} aria-hidden className="cursor-grab text-slate-300" />
                      <b className="min-w-0 flex-1 truncate text-sm">{c.title}</b>
                    </span>
                    <span className="mt-2 flex items-center gap-1">
                      <button onClick={() => shift(c.id, -1)} aria-label={`Move “${c.title}” to previous column`}
                        className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-30 dark:border-white/10"><ChevronLeft size={14} /></button>
                      <button onClick={() => shift(c.id, 1)} aria-label={`Move “${c.title}” to next column`}
                        className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 disabled:opacity-30 dark:border-white/10"><ChevronRight size={14} /></button>
                      <label className="ml-auto flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        Move to
                        <select value={c.col} onChange={(e) => move(c.id, e.target.value as Col)} aria-label={`Move “${c.title}” to column`}
                          className="h-7 rounded-lg border border-slate-200 bg-transparent px-1 dark:border-white/10">
                          {COLS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                        </select>
                      </label>
                    </span>
                  </li>
                ))}
              </ul>
              {items.length === 0 && (
                <p className="mt-2 rounded-2xl border-2 border-dashed border-slate-300 p-4 text-center text-xs font-semibold text-slate-400 dark:border-white/15">
                  Empty — drag a card here or use a card's Move-to control.
                </p>
              )}
            </section>
          );
        })}
      </div>
      <button onClick={() => { setCards(START); setMsg("Board reset to the starting layout."); }}
        className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">↺ Reset board</button>
    </div>
  );
}
