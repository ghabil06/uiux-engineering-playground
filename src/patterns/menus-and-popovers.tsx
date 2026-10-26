/** Menus & popovers — foundation Dropdown plus a custom-anchored popover. */
import React from "react";
import { Card } from "../components/ui";
import { Dropdown } from "../components/foundation";
import { PatternDoc, Tooltip } from "./primitives";
import { patternDef } from "./data";

export default function MenusDemo() {
  const def = patternDef("menus-and-popovers");
  const [sort, setSort] = React.useState("Recently updated");
  const [role, setRole] = React.useState("Editor");
  const [pop, setPop] = React.useState(false);
  const [picked, setPicked] = React.useState<string[]>([]);
  const popRoot = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!pop) return;
    const outside = (e: MouseEvent) => { if (!popRoot.current?.contains(e.target as Node)) setPop(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setPop(false); };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", esc); };
  }, [pop ]);

  const note = (m: string) => setPicked((p) => [`${new Date().toLocaleTimeString()} — ${m}`, ...p].slice(0, 4));

  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Closed, open, item-highlighted, selected; popover pinned within viewport via right-alignment."
        a11y={def.keyboard + " Menus use menu/menuitem roles; the popover is a labelled region, not a modal."} />
      <Card className="flex flex-wrap items-center gap-3 p-5">
        <Dropdown label={`Sort: ${sort}`} items={["Recently updated", "Name A–Z", "Budget ↓", "Owner"].map((o) => ({
          label: o, onSelect: () => { setSort(o); note(`Sort changed to “${o}”`); },
        }))} />
        <Dropdown label={`Role: ${role}`} items={["Viewer", "Editor", "Admin"].map((o) => ({
          label: o, onSelect: () => { setRole(o); note(`Role changed to ${o} (demo only)`); },
        }))} />
        <Dropdown label="Danger zone" items={[
          { label: "Rename project", onSelect: () => note("Rename chosen") },
          { label: "Archive project", danger: true, onSelect: () => note("Archive chosen (simulated)") },
        ]} />
        <div ref={popRoot} className="relative inline-block">
          <button onClick={() => setPop(!pop)} aria-expanded={pop} aria-controls="info-pop"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 font-black dark:border-white/15" aria-label="About sorting">
            ⓘ
          </button>
          {pop && (
            <div id="info-pop" role="region" aria-label="About sorting"
              className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-2xl dark:border-white/10 dark:bg-slate-900">
              <b>How sorting works here</b>
              <p className="mt-1 text-slate-500">Sort applies after search + filters, before pagination. Direction persists per column.</p>
              <button onClick={() => setPop(false)} className="mt-2 text-xs font-bold text-violet-600">Close (or Esc / outside click)</button>
            </div>
          )}
        </div>
        <Tooltip label="More help" tip="Tooltips describe consequences, not just labels — and never hold essential-only info.">
          <button className="h-10 rounded-xl border border-slate-300 px-3 text-sm font-bold dark:border-white/15">Hover or focus me</button>
        </Tooltip>
      </Card>
      <Card className="p-4">
        <b className="text-sm">Current state</b>
        <p className="mt-1 text-sm text-slate-500">Sort: <b>{sort}</b> · Role: <b>{role}</b> · Menus close after selection, on Esc, or on outside click.</p>
        {picked.length > 0 && <ul className="mt-2 space-y-1 text-[13px] text-slate-600 dark:text-slate-300">{picked.map((m, i) => <li key={i}>· {m}</li>)}</ul>}
      </Card>
    </div>
  );
}
