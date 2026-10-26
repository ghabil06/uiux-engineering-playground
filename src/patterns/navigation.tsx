/** Navigation patterns — sidebar, topbar, breadcrumbs, nested groups, mobile drawer. */
import React from "react";
import { Breadcrumb } from "../components/foundation";
import { PatternDoc } from "./primitives";
import { patternDef } from "./data";
import { Menu, X, ChevronDown } from "lucide-react";
import { cx } from "../lib/core";

type Section = "overview" | "analytics" | "audience" | "members" | "invites" | "settings";
const LABELS: Record<Section, string> = {
  overview: "Overview", analytics: "Analytics", audience: "Audience",
  members: "Team members", invites: "Pending invites", settings: "Settings",
};

export default function NavigationDemo() {
  const def = patternDef("navigation");
  const [section, setSection] = React.useState<Section>("overview");
  const [teamOpen, setTeamOpen] = React.useState(true);
  const [drawer, setDrawer] = React.useState(false);

  const go = (s: Section) => { setSection(s); setDrawer(false); };
  const crumbs = section === "members" || section === "invites"
    ? [{ label: "Acme" }, { label: "Team" }, { label: LABELS[section] }]
    : [{ label: "Acme" }, { label: LABELS[section] }];

  const links = (mobile: boolean) => (
    <nav aria-label={mobile ? "Mobile" : "Primary"}>
      <ul className="space-y-0.5">
        {(["overview", "analytics", "audience"] as Section[]).map((s) => (
          <li key={s}>
            <a href={`#/patterns/navigation`} onClick={(e) => { e.preventDefault(); go(s); }}
              aria-current={section === s ? "page" : undefined}
              className={cx("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold",
                section === s ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5")}>
              <span aria-hidden>{s === "overview" ? "▦" : s === "analytics" ? "◫" : "◍"}</span>{LABELS[s]}
            </a>
          </li>
        ))}
        <li>
          <button onClick={() => setTeamOpen(!teamOpen)} aria-expanded={teamOpen} aria-controls="team-sub"
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">
            <span aria-hidden>⛉</span>Team
            <ChevronDown size={15} aria-hidden className={cx("ml-auto transition", teamOpen && "rotate-180")} />
          </button>
          {teamOpen && (
            <ul id="team-sub" className="ml-4 space-y-0.5 border-l-2 border-slate-200 pl-2 dark:border-white/10">
              {(["members", "invites"] as Section[]).map((s) => (
                <li key={s}>
                  <a href="#/patterns/navigation" onClick={(e) => { e.preventDefault(); go(s); }}
                    aria-current={section === s ? "page" : undefined}
                    className={cx("block rounded-lg px-3 py-2 text-[13px] font-semibold",
                      section === s ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5")}>
                    {LABELS[s]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
        <li>
          <a href="#/patterns/navigation" onClick={(e) => { e.preventDefault(); go("settings"); }}
            aria-current={section === "settings" ? "page" : undefined}
            className={cx("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold",
              section === "settings" ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5")}>
            <span aria-hidden>⚙</span>{LABELS.settings}
          </a>
        </li>
      </ul>
    </nav>
  );

  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Collapsed/expanded groups, active route, drawer open/closed, current-page announcement."
        a11y={def.keyboard + " Semantic links for destinations, buttons for toggles; drawer traps nothing but closes on Esc."} />
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[.03]">
        {/* topbar */}
        <div className="flex h-14 items-center gap-3 border-b border-slate-200 px-4 dark:border-white/10">
          <button className="rounded-lg p-2 hover:bg-slate-100 md:hidden dark:hover:bg-white/10" onClick={() => setDrawer(true)}
            aria-label="Open navigation menu" aria-expanded={drawer}>
            <Menu size={19} />
          </button>
          <b>Acme console <span className="font-normal text-slate-400">(demo frame)</span></b>
          <span className="ml-auto hidden rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 sm:block dark:bg-emerald-500/15 dark:text-emerald-200">● Live demo</span>
        </div>
        <div className="flex">
          <aside className="hidden w-60 shrink-0 border-r border-slate-200 p-3 md:block dark:border-white/10">{links(false)}</aside>
          <div className="min-w-0 flex-1 p-5">
            <Breadcrumb trail={crumbs} />
            <h3 className="mt-2 text-xl font-black">{LABELS[section]}</h3>
            <p className="mt-1 text-sm text-slate-500">
              This is the <b>{LABELS[section]}</b> section of the demo frame. The sidebar highlights it,
              the breadcrumb names it, and the URL stays shareable.
            </p>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-white/5">
              <b>Real destinations in this playground:</b>
              <span className="mt-2 flex flex-wrap gap-1.5">
                {[["Dashboard", "#/product/dashboard"], ["Style gallery", "#/styles"], ["Testing Lab", "#/testing"]].map(([l, h]) => (
                  <a key={h} href={h} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold ring-1 ring-slate-200 hover:ring-violet-400 dark:bg-transparent dark:ring-white/15">{l} →</a>
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
      {drawer && (
        <div className="fixed inset-0 z-[70] md:hidden" role="dialog" aria-modal="true" aria-label="Site navigation">
          <div className="absolute inset-0 bg-black/45" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-white p-4 shadow-2xl dark:bg-slate-950">
            <div className="mb-3 flex items-center justify-between">
              <b>Acme console</b>
              <button onClick={() => setDrawer(false)} aria-label="Close navigation menu" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-white/10"><X size={18} /></button>
            </div>
            {links(true)}
          </div>
        </div>
      )}
    </div>
  );
}
