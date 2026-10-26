/** Tooltips — hover + focus, Esc dismissal, four placements, no essential-only content. */
import React from "react";
import { Card } from "../components/ui";
import { PatternDoc, Tooltip } from "./primitives";
import { patternDef } from "./data";

export default function TooltipsDemo() {
  const def = patternDef("tooltips");
  const [count, setCount] = React.useState(0);
  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Hidden, visible (hover or focus), Esc-dismissed; one placement per context."
        a11y={def.keyboard + " Trigger keeps its own accessible name; tooltip supplements via aria-describedby."} />
      <Card className="grid gap-6 p-8 sm:grid-cols-2">
        <div className="space-y-4">
          <b>Placements <span className="font-normal text-slate-400">(pick the side with room)</span></b>
          <div className="flex flex-wrap items-center gap-3">
            {(["top", "bottom", "left", "right"] as const).map((side) => (
              <Tooltip key={side} label={`${side} tooltip`} tip={`This tip prefers the ${side} — placement follows available viewport space.`} side={side}>
                <button className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold capitalize dark:border-white/15">{side}</button>
              </Tooltip>
            ))}
          </div>
          <p className="text-xs text-slate-500">Tab through the buttons: focus reveals each tip exactly like hover.</p>
        </div>
        <div className="space-y-4">
          <b>Rules in practice</b>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Tooltip label="Archive action" tip="Moves to archive for 30 days. Restorable — nothing is deleted today.">
                <button onClick={() => setCount(count + 1)} className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                  Archive project
                </button>
              </Tooltip>
              <span className="text-xs text-slate-500">Pressed {count}× — the tip explains the consequence, the label stays short.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="truncate font-semibold" aria-label="Quarterly revenue report, final version 3">
                Q3-revenue…nal-v3
              </span>
              <Tooltip label="Full filename" tip="Quarterly revenue report, final version 3. Truncated text always exposes its full form.">
                <button className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold dark:border-white/15" aria-label="Show full filename">ⓘ</button>
              </Tooltip>
            </li>
          </ul>
          <p className="rounded-2xl bg-amber-50 p-3 text-xs font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">
            Anti-pattern shown honestly: tooltips vanish on scroll and can't be copied — so the archive consequence
            also appears in the confirm step of the Undo demo, never <i>only</i> here.
          </p>
        </div>
      </Card>
    </div>
  );
}
