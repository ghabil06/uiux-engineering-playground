/** Card-sorting exercise — drag or button-move cards, manage groups, reset. */
import React from "react";
import { SORT_CARDS, DEFAULT_GROUPS, type SortGroup } from "./data";
import { GripVertical } from "lucide-react";

const labelOf = (id: string) => SORT_CARDS.find((c) => c.label && c.id === id)?.label ?? id;

export default function CardSortDemo() {
  const [groups, setGroups] = React.useState<SortGroup[]>(DEFAULT_GROUPS);
  const [ungrouped, setUngrouped] = React.useState<string[]>([]);
  const [drag, setDrag] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState("8 cards sorted into 3 starter groups. Rearrange freely — nothing here is statistically valid with n=1.");
  const [gid, setGid] = React.useState(10);

  const locate = (card: string): string | null => {
    if (ungrouped.includes(card)) return null;
    return groups.find((g) => g.cards.includes(card))?.id ?? null;
  };
  const take = (card: string) => {
    setUngrouped((u) => u.filter((c) => c !== card));
    setGroups((gs) => gs.map((g) => ({ ...g, cards: g.cards.filter((c) => c !== card) })));
  };
  const move = (card: string, to: string | null) => {
    const from = locate(card);
    take(card);
    if (to === null) setUngrouped((u) => [...u, card]);
    else setGroups((gs) => gs.map((g) => (g.id === to ? { ...g, cards: [...g.cards, card] } : g)));
    const fromName = from === null ? "ungrouped" : groups.find((g) => g.id === from)?.name;
    const toName = to === null ? "ungrouped" : groups.find((g) => g.id === to)?.name;
    setMsg(`“${labelOf(card)}” moved from ${fromName} to ${toName}.`);
  };

  const addGroup = () => {
    const id = `g${gid}`;
    setGid(gid + 1);
    setGroups([...groups, { id, name: `New group ${groups.length + 1}`, cards: [] }]);
  };

  const dropProps = (gid2: string | null) => ({
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain") || drag;
      setDrag(null);
      if (id) move(id, gid2);
    },
  });

  const cardEl = (id: string) => (
    <li key={id} draggable
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", id); setDrag(id); }}
      onDragEnd={() => setDrag(null)}
      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 text-[13px] font-semibold shadow-sm dark:border-white/10 dark:bg-white/5">
      <GripVertical size={13} aria-hidden className="cursor-grab text-slate-300" />
      <span className="min-w-0 flex-1 truncate">{labelOf(id)}</span>
      <label className="sr-only" htmlFor={`mv-${id}`}>Move {labelOf(id)} to</label>
      <select id={`mv-${id}`} value={locate(id) ?? "ungrouped"} onChange={(e) => move(id, e.target.value === "ungrouped" ? null : e.target.value)}
        className="h-7 max-w-[110px] rounded-lg border border-slate-200 bg-transparent text-[11px] font-bold dark:border-white/10">
        <option value="ungrouped">Ungrouped</option>
        {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>
    </li>
  );

  return (
    <div className="space-y-3">
      <p role="status" className="rounded-2xl bg-violet-50 p-3 text-sm font-semibold text-violet-900 dark:bg-violet-500/10 dark:text-violet-100">{msg}</p>
      <div className="grid gap-3 md:grid-cols-3">
        {groups.map((g) => (
          <section key={g.id} aria-label={`Group ${g.name}, ${g.cards.length} cards`} {...dropProps(g.id)}
            className="min-h-[180px] rounded-3xl border border-slate-200 bg-slate-50/60 p-3 dark:border-white/10 dark:bg-white/[.02]">
            <label className="sr-only" htmlFor={`gn-${g.id}`}>Rename group</label>
            <input id={`gn-${g.id}`} value={g.name} onChange={(e) => setGroups(groups.map((x) => (x.id === g.id ? { ...x, name: e.target.value } : x)))}
              className="w-full rounded-lg bg-transparent px-1 text-sm font-black outline-none focus:bg-white dark:focus:bg-white/5" />
            <ul className="mt-2 space-y-1.5">{g.cards.map(cardEl)}</ul>
            {g.cards.length === 0 && <p className="mt-2 rounded-xl border border-dashed border-slate-300 p-3 text-center text-xs text-slate-400">Empty — drop cards here.</p>}
            <button onClick={() => { setUngrouped([...ungrouped, ...g.cards]); setGroups(groups.filter((x) => x.id !== g.id)); setMsg(`Group “${g.name}” removed; its cards went to Ungrouped.`); }}
              disabled={groups.length <= 1} className="mt-2 text-[11px] font-bold text-rose-600 underline disabled:opacity-40">Remove group</button>
          </section>
        ))}
      </div>
      <section aria-label={`Ungrouped, ${ungrouped.length} cards`} {...dropProps(null)}
        className="rounded-3xl border-2 border-dashed border-slate-300 p-3 dark:border-white/15">
        <b className="text-sm">Ungrouped ({ungrouped.length})</b>
        {ungrouped.length === 0
          ? <p className="mt-1 text-xs text-slate-400">Everything is grouped. Drag cards back here to ungroup them.</p>
          : <ul className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">{ungrouped.map(cardEl)}</ul>}
      </section>
      <div className="flex flex-wrap gap-2">
        <button onClick={addGroup} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">+ New group</button>
        <button onClick={() => { setGroups(DEFAULT_GROUPS); setUngrouped([]); setMsg("Reset to the starter sort."); }} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">↺ Reset exercise</button>
      </div>
      <p className="text-xs text-slate-500">Open sort: users group + name freely. Analysis (similarity matrix) needs 15–30 participants — run it in the Research lab's spirit, not from this single session.</p>
    </div>
  );
}
