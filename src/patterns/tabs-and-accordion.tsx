/** Tabs & accordion — roving tabindex tabs, single- and multi-open accordions. */
import React from "react";
import { Card } from "../components/ui";
import { Tabs } from "../components/foundation";
import { PatternDoc } from "./primitives";
import { patternDef } from "./data";
import { ChevronDown } from "lucide-react";
import { cx } from "../lib/core";

const PANELS = [
  ["Overview", "Project health at a glance: 68% complete, velocity +18%, three items blocked. Tabs suit peer views of equal weight."],
  ["Tasks", "42 of 61 tasks done. The active tab is always visible; panels swap without page reloads or lost scroll."],
  ["Team", "8 members, 2 pending invites. Arrow keys move between tabs without activating until Enter — wait, no: this implementation activates on arrows (automatic activation), announced via aria-selected."],
];

const FAQS: [string, string][] = [
  ["When should I use tabs instead of pages?", "For 2–6 peer views where context must persist. Beyond that, use pages (deep-linkable) or an accordion (stacked scanning)."],
  ["Single-open or multi-open accordion?", "Single-open for wizards and FAQs where focus matters; multi-open for reference material users compare across panels."],
  ["Do accordions need keyboard support?", "They're plain buttons, so Tab + Enter suffice — but aria-expanded must always reflect reality, which this demo tests."],
];

export default function TabsAccordionDemo() {
  const def = patternDef("tabs-and-accordion");
  const [tab, setTab] = React.useState(0);
  const [single, setSingle] = React.useState(0);
  const [multi, setMulti] = React.useState<Set<number>>(new Set([0]));

  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Active tab + panel; accordion open/closed in both modes."
        a11y="Tabs: tablist/tab/tabpanel, aria-selected, arrow/Home/End keys. Accordions: button + aria-expanded + region." />
      <Card className="space-y-3 p-5">
        <b>Tabs <span className="font-normal text-slate-400">(automatic activation)</span></b>
        <Tabs tabs={PANELS.map((p) => p[0])} active={tab} onChange={setTab} label="Project views" />
        <div role="tabpanel" aria-label={`${PANELS[tab][0]} panel`} className="rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed dark:bg-white/5">
          {PANELS[tab][1]}
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <b>Accordion — single open</b>
          <div className="mt-2 space-y-2">
            {FAQS.map(([q, a], i) => (
              <div key={q} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                <button onClick={() => setSingle(single === i ? -1 : i)} aria-expanded={single === i} aria-controls={`s-p${i}`} id={`s-b${i}`}
                  className="flex w-full items-center justify-between gap-2 p-3.5 text-left text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/5">
                  {q}<ChevronDown size={16} aria-hidden className={cx("shrink-0 transition", single === i && "rotate-180")} />
                </button>
                {single === i && <p id={`s-p${i}`} role="region" aria-labelledby={`s-b${i}`} className="border-t border-slate-100 px-3.5 py-3 text-[13px] text-slate-600 dark:border-white/10 dark:text-slate-300">{a}</p>}
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <b>Accordion — multi open</b>
          <div className="mt-2 space-y-2">
            {FAQS.map(([q, a], i) => {
              const open = multi.has(i);
              return (
                <div key={q} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                  <button onClick={() => { const n = new Set(multi); open ? n.delete(i) : n.add(i); setMulti(n); }}
                    aria-expanded={open} aria-controls={`m-p${i}`} id={`m-b${i}`}
                    className="flex w-full items-center justify-between gap-2 p-3.5 text-left text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/5">
                    {q}<span aria-hidden className="text-lg font-black leading-none">{open ? "−" : "+"}</span>
                  </button>
                  {open && <p id={`m-p${i}`} role="region" aria-labelledby={`m-b${i}`} className="border-t border-slate-100 px-3.5 py-3 text-[13px] text-slate-600 dark:border-white/10 dark:text-slate-300">{a}</p>}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
