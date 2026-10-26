/** Accessibility overview — searchable gallery with category/difficulty filters. */
import React from "react";
import { TOPICS, type Pour } from "./data";
import { Badge } from "../components/ui";
import { Search, SearchX, RotateCcw } from "lucide-react";
import { cx } from "../lib/core";

const POURS: ("All" | Pour)[] = ["All", "Perceivable", "Operable", "Understandable", "Robust"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;

export default function A11yOverview() {
  const [q, setQ] = React.useState("");
  const [pour, setPour] = React.useState<(typeof POURS)[number]>("All");
  const [level, setLevel] = React.useState<(typeof LEVELS)[number]>("All");

  const list = TOPICS
    .filter((t) => pour === "All" || t.pour === pour)
    .filter((t) => level === "All" || t.difficulty === level)
    .filter((t) => (t.name + " " + t.tagline + " " + t.desc).toLowerCase().includes(q.trim().toLowerCase()));
  const reset = () => { setQ(""); setPour("All"); setLevel("All"); };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-[13px] text-sky-900 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-100">
        <b>How to read this lab:</b> automated checks catch roughly a third of barriers; every topic pairs a
        working demo with <b>manual verification steps</b>. A passing scan is never claimed as conformance here.
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search topics — “focus”, “contrast”…" aria-label="Search accessibility topics"
            className="h-10 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm dark:border-white/15 dark:bg-white/5" />
        </div>
        <div className="flex flex-wrap gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="POUR category filter">
          {POURS.map((p) => (
            <button key={p} onClick={() => setPour(p)} aria-pressed={pour === p}
              className={cx("rounded-full px-3 py-1.5 text-xs font-bold", pour === p ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>{p}</button>
          ))}
        </div>
        <div className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Difficulty filter">
          {LEVELS.map((l) => (
            <button key={l} onClick={() => setLevel(l)} aria-pressed={level === l}
              className={cx("rounded-full px-3 py-1.5 text-xs font-bold", level === l ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>{l}</button>
          ))}
        </div>
      </div>
      <p role="status" className="text-xs font-bold text-slate-400">{list.length} of {TOPICS.length} topics</p>
      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-white/5">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/10"><SearchX size={24} className="text-slate-400" /></span>
          <h3 className="mt-4 text-lg font-extrabold">No topics match{list.length === 0 && q ? ` “${q}”` : ""}</h3>
          <button onClick={reset} className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white">Reset search & filters</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((t) => (
            <article key={t.slug} className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[.04]">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone="slate">{t.pour}</Badge>
                <Badge tone={t.difficulty === "Beginner" ? "emerald" : t.difficulty === "Intermediate" ? "amber" : "rose"}>{t.difficulty}</Badge>
              </div>
              <h3 className="mt-2 font-extrabold">{t.name}</h3>
              <p className="text-[13px] font-bold text-violet-700 dark:text-cyan-300">{t.tagline}</p>
              <p className="mt-1 line-clamp-2 text-[13px] text-slate-500">{t.desc}</p>
              <p className="mt-2 font-mono text-[11px] text-slate-400">{t.wcag.join(" · ")}</p>
              <a href={`#/accessibility/${t.slug}`} aria-label={`Open the ${t.name} demo`}
                className="mt-3 inline-flex items-center gap-1 text-[13px] font-extrabold group-hover:text-violet-700 dark:group-hover:text-cyan-300">
                Open demo <span aria-hidden className="transition group-hover:translate-x-1">→</span>
              </a>
            </article>
          ))}
        </div>
      )}
      {(q || pour !== "All" || level !== "All") && list.length > 0 && (
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-violet-600 hover:underline"><RotateCcw size={13} /> Reset search & filters</button>
      )}
    </div>
  );
}
