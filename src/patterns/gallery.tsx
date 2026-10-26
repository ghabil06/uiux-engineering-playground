/**
 * Pattern Laboratory overview — searchable catalogue with category,
 * complexity and sort controls. Every card links to a working route.
 */
import React from "react";
import { PATTERNS, type PatternCategory, type Complexity } from "./data";
import { Badge } from "../components/ui";
import { Tooltip } from "./primitives";
import { Search, SearchX, RotateCcw } from "lucide-react";
import { cx } from "../lib/core";

const CATS: ("All" | PatternCategory)[] = ["All", "Navigation", "Data", "Forms", "Overlays", "Feedback", "Input"];
const LEVELS: ("All" | Complexity)[] = ["All", "Foundational", "Intermediate", "Advanced"];
type Sort = "recommended" | "az";

const levelTone = (c: Complexity): "emerald" | "amber" | "rose" =>
  c === "Foundational" ? "emerald" : c === "Intermediate" ? "amber" : "rose";

export default function PatternsGallery() {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<(typeof CATS)[number]>("All");
  const [level, setLevel] = React.useState<(typeof LEVELS)[number]>("All");
  const [sort, setSort] = React.useState<Sort>("recommended");

  const list = PATTERNS
    .filter((p) => cat === "All" || p.category === cat)
    .filter((p) => level === "All" || p.complexity === level)
    .filter((p) => (p.name + " " + p.tagline + " " + p.desc + " " + p.useCases).toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : a.order - b.order));

  const reset = () => { setQ(""); setCat("All"); setLevel("All"); setSort("recommended"); };
  const dirty = q || cat !== "All" || level !== "All" || sort !== "recommended";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patterns — “dialog”, “undo”…"
            aria-label="Search patterns" className="h-10 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm dark:border-white/15 dark:bg-white/5" />
        </div>
        <div className="flex flex-wrap gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Category filter">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
              className={cx("rounded-full px-3 py-1.5 text-xs font-bold", cat === c ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>{c}</button>
          ))}
        </div>
        <div className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Complexity filter">
          {LEVELS.map((l) => (
            <button key={l} onClick={() => setLevel(l)} aria-pressed={level === l}
              className={cx("rounded-full px-3 py-1.5 text-xs font-bold", level === l ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>{l}</button>
          ))}
        </div>
        <div className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Sort order">
          {(["recommended", "az"] as const).map((s) => (
            <button key={s} onClick={() => setSort(s)} aria-pressed={sort === s}
              className={cx("rounded-full px-3 py-1.5 text-xs font-bold", sort === s ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>
              {s === "az" ? "A–Z" : "Recommended"}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs font-bold text-slate-400" role="status">{list.length} of {PATTERNS.length} patterns</p>

      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-white/5">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/10"><SearchX size={24} className="text-slate-400" /></span>
          <h3 className="mt-4 text-lg font-extrabold">No patterns match{cat !== "All" ? ` in ${cat}` : ""}{q ? ` for “${q}”` : ""}</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">Try “table”, “dialog” or “undo” — or start over:</p>
          <button onClick={reset} className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700">Clear search & filters</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => (
            <article key={p.slug} className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[.04]">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-xs font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">
                  {String(p.order).padStart(2, "0")}
                </span>
                <h3 className="font-extrabold tracking-tight">{p.name}</h3>
                <Tooltip label={`Keyboard: ${p.name}`} tip={p.keyboard} side={i % 3 === 2 ? "left" : "top"}>
                  <button aria-label={`Keyboard help for ${p.name}`} className="ml-auto rounded-lg px-1.5 py-0.5 text-xs font-black text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10">⌨</button>
                </Tooltip>
              </div>
              <p className="mt-1 text-[13px] font-bold text-violet-700 dark:text-cyan-300">{p.tagline}</p>
              <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{p.desc}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Badge tone="slate">{p.category}</Badge>
                <Badge tone={levelTone(p.complexity)}>{p.complexity}</Badge>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400"><b>Use:</b> {p.useCases}</p>
              <a href={`#/patterns/${p.slug}`} aria-label={`Open the ${p.name} demo`}
                className="mt-4 inline-flex items-center gap-1 text-[13px] font-extrabold text-slate-900 group-hover:text-violet-700 dark:text-white dark:group-hover:text-cyan-300">
                Open demo <span aria-hidden className="transition group-hover:translate-x-1">→</span>
              </a>
            </article>
          ))}
        </div>
      )}
      {dirty && list.length > 0 && (
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-violet-600 hover:underline">
          <RotateCcw size={13} /> Clear search & filters
        </button>
      )}
    </div>
  );
}
