/** Semantic HTML — div-soup vs native elements, with inspectable markup. */
import React from "react";
import { TOPICS } from "./data";
import { Card, Badge } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { cx } from "../lib/core";

const SOUP = `<div class="title">Invoices</div>\n<div class="nav">\n  <div class="link" onclick="go()">Queue</div>\n  <div className="link" onclick="go()">Reports</div>\n</div>\n<div class="heading">Overdue</div>\n<div>☐ Remind me</div>`;

const SEMANTIC = `<main>\n  <h1>Invoices</h1>\n  <nav aria-label="Invoices">\n    <ul>\n      <li><a href="/queue" aria-current="page">Queue</a></li>\n      <li><a href="/reports">Reports</a></li>\n    </ul>\n  </nav>\n  <h2>Overdue</h2>\n  <label><input type="checkbox" /> Remind me</label>\n</main>`;

export default function SemanticDemo() {
  const t = TOPICS.find((x) => x.slug === "semantic-html")!;
  const [tab, setTab] = React.useState<"poor" | "good">("poor");
  const [remind, setRemind] = React.useState(false);
  const [soupCount, setSoupCount] = React.useState(0);

  return (
    <div className="space-y-4">
      <PatternDoc purpose={t.desc} useCases="Every page, email and widget you ship."
        states="Div-soup (mouse-only, silent) vs semantic (keyboard + announced)."
        a11y={`WCAG ${t.wcag.join(", ")}. Native elements first; ARIA only to fill genuine gaps.`} />
      <div className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Choose version">
        {(["poor", "good"] as const).map((v) => (
          <button key={v} onClick={() => setTab(v)} aria-pressed={tab === v}
            className={cx("flex-1 rounded-full py-2 text-sm font-bold", tab === v ? (v === "poor" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white") : "text-slate-500")}>
            {v === "poor" ? "✕ Div soup" : "✓ Semantic"}
          </button>
        ))}
      </div>
      {tab === "poor" ? (
        <Card className="space-y-3 border-rose-200 p-5 dark:border-rose-400/20">
          <Badge tone="rose">✕ What assistive tech hears: almost nothing</Badge>
          <div className="text-2xl font-bold">Invoices</div>
          <div className="flex gap-4 text-sky-700 underline">
            <div onClick={() => setSoupCount(soupCount + 1)} className="cursor-pointer">Queue</div>
            <div onClick={() => setSoupCount(soupCount + 1)} className="cursor-pointer">Reports</div>
          </div>
          <div className="text-lg font-bold">Overdue</div>
          <div onClick={() => setRemind(!remind)} className="cursor-pointer select-none">
            {remind ? "☑" : "☐"} Remind me
          </div>
          <p className="text-xs text-slate-500">Try keyboard: nothing here is focusable. A screen reader announces plain text with no roles. Clicks: {soupCount} (mouse-only).</p>
          <pre className="code-block overflow-x-auto rounded-2xl bg-slate-950 p-4 text-slate-200" aria-label="Poor markup source">{SOUP}</pre>
        </Card>
      ) : (
        <main className="space-y-3 rounded-3xl border border-emerald-200 bg-white p-5 dark:border-emerald-400/20 dark:bg-white/[.03]">
          <Badge tone="emerald">✓ Landmarks, headings, links, real controls</Badge>
          <h2 className="text-2xl font-black">Invoices</h2>
          <nav aria-label="Invoices demo">
            <ul className="flex gap-4">
              <li><a href="#/accessibility/semantic-html" onClick={(e) => e.preventDefault()} aria-current="page" className="font-bold text-sky-700 underline">Queue</a></li>
              <li><a href="#/accessibility/semantic-html" onClick={(e) => e.preventDefault()} className="text-sky-700 underline">Reports</a></li>
            </ul>
          </nav>
          <h3 className="text-lg font-bold">Overdue</h3>
          <p><label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={remind} onChange={(e) => setRemind(e.target.checked)} className="h-5 w-5 accent-emerald-600" /> Remind me
          </label></p>
          <p className="text-xs text-slate-500">Tab reaches the links and checkbox; headings outline the page; the label toggles its control.</p>
          <pre className="code-block overflow-x-auto rounded-2xl bg-slate-950 p-4 text-slate-200" aria-label="Good markup source">{SEMANTIC}</pre>
        </main>
      )}
      <Card className="p-4 text-[13px]">
        <b>Verification checklist:</b> {t.checklist.join(" · ")}
      </Card>
    </div>
  );
}
