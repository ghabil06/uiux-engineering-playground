/** Information Architecture overview — principles + click-depth explorer. */
import React from "react";
import { SITEMAP, flattenSitemap } from "./data";
import { Card } from "../components/ui";
import { cx } from "../lib/core";

const RULES: [string, string][] = [
  ["One job per page", "If a page needs 'and' in its title, it is two pages."],
  ["7±2 is about scent, not count", "More links are fine if every label predicts its destination."],
  ["Depth costs clicks", "Every level down loses ~50% of seekers — budget depth deliberately."],
  ["Labels are UI", "Test labels with tree tests, not opinions."],
  ["Growth needs a gardener", "Audit quarterly or the IA rots into an org chart."],
];

export default function IAOverview() {
  const flat = flattenSitemap(SITEMAP);
  const [path, setPath] = React.useState<string[]>(["Home"]);
  const [clicks, setClicks] = React.useState(0);
  const deepest = Math.max(...flat.map((f) => f.depth));

  const kidsOf = (trail: string[]) => {
    let node: typeof SITEMAP | undefined = SITEMAP;
    for (const label of trail.slice(1)) node = node?.kids?.find((k) => k.label === label);
    return node?.kids ?? [];
  };
  const kids = kidsOf(path);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["Sitemap explorer", "Browse the full hierarchy, depth and page purposes.", "#/information-architecture/sitemaps", "Depth 0–" + deepest + " · " + flat.length + " pages"],
          ["Card sorting", "Group 8 cards, name groups, reset — then compare with the IA.", "#/information-architecture/card-sorting", "8 cards · open sort"],
        ].map(([t, d, href, meta]) => (
          <Card key={href} className="p-5">
            <b>{t}</b><p className="mt-1 text-sm text-slate-500">{d}</p>
            <p className="mt-1 font-mono text-[11px] text-slate-400">{meta}</p>
            <a href={href} className="mt-3 inline-block rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white">Open →</a>
          </Card>
        ))}
      </div>
      <Card className="space-y-2 p-5">
        <b>Try it: how deep is “Billing”? <span className="font-normal text-slate-400">(clicks counted — depth is a budget)</span></b>
        <p className="text-sm text-slate-500">Trail: <b>{path.join(" → ")}</b> · clicks: <b className="tabular-nums">{clicks}</b></p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Navigate the demo sitemap">
          {path.length > 1 && <button onClick={() => { setPath(path.slice(0, -1)); setClicks(clicks + 1); }} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-white/10">← Up</button>}
          {kids.map((k) => (
            <button key={k.id} onClick={() => { setPath([...path, k.label]); setClicks(clicks + 1); }}
              className={cx("rounded-xl px-3 py-2 text-sm font-bold", k.label === "Billing" ? "bg-emerald-600 text-white" : "bg-violet-100 text-violet-900 dark:bg-violet-500/15 dark:text-violet-100")}>
              {k.label}
            </button>
          ))}
          {kids.length === 0 && <span className="text-sm text-slate-500">Leaf page — go up to keep exploring.</span>}
        </div>
        {path[path.length - 1] === "Billing" && (
          <p role="status" className="rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
            ✓ Found Billing in {clicks} clicks (optimal: 2 via Home → Account → Billing). Every extra level halves your seekers.
          </p>
        )}
        <button onClick={() => { setPath(["Home"]); setClicks(0); }} className="text-xs font-bold text-violet-600 underline">Reset walk</button>
      </Card>
      <Card className="p-5">
        <b>IA rules of thumb</b>
        <ul className="mt-2 space-y-1.5 text-sm">{RULES.map(([t, d]) => <li key={t}>· <b>{t}:</b> <span className="text-slate-500">{d}</span></li>)}</ul>
      </Card>
    </div>
  );
}
