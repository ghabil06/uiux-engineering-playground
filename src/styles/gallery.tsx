/**
 * Style Laboratory overview — searchable, filterable, sortable gallery.
 * Every card links to an independent route; comparison lives at #/styles/compare.
 */
import React from "react";
import { STYLE_DEFS, type StyleFamily } from "./defs";
import { Badge } from "../components/ui";
import { Search, RotateCcw, SearchX, GitCompareArrows } from "lucide-react";
import { cx } from "../lib/core";

const FAMILIES: ("All" | StyleFamily)[] = ["All", "Calm", "Expressive", "Systematic"];
type Sort = "recommended" | "az";

function Preview({ slug }: { slug: string }) {
  const base = "flex h-20 items-center justify-center gap-1.5 overflow-hidden rounded-xl";
  switch (slug) {
    case "minimalism": return <div className={cx(base, "bg-white")} aria-hidden><span className="h-1.5 w-16 bg-slate-900" /><span className="h-1.5 w-8 bg-slate-200" /></div>;
    case "light-ui": return <div className={cx(base, "gap-2 bg-sky-50")} aria-hidden><span className="h-10 w-10 rounded-lg bg-white shadow" /><span className="h-10 w-10 rounded-lg bg-white shadow" /><span className="h-10 w-10 rounded-lg bg-sky-500 shadow" /></div>;
    case "dark-ui": return <div className={cx(base, "bg-[#0b0b14]")} aria-hidden><span className="h-2 w-14 rounded-full bg-gradient-to-r from-violet-500 to-cyan-300" /><span className="h-6 w-6 rounded-full bg-cyan-300/30" /></div>;
    case "bento-grid": return <div className={cx(base, "gap-1 bg-slate-100 p-3")} aria-hidden><span className="h-full w-1/2 rounded-md bg-slate-900" /><span className="flex h-full w-1/2 flex-col gap-1"><span className="h-1/2 rounded-md bg-amber-300" /><span className="h-1/2 rounded-md bg-white" /></span></div>;
    case "glassmorphism": return <div className={cx(base, "bg-gradient-to-br from-fuchsia-500 to-cyan-500")} aria-hidden><span className="glass-panel h-10 w-20 rounded-xl" /></div>;
    case "neumorphism": return <div className={cx(base, "bg-[#e0e5ec]")} aria-hidden><span className="neu-light h-10 w-10 rounded-full" /><span className="neu-pressed h-10 w-16 rounded-full" /></div>;
    case "swiss-grid": return <div className={cx(base, "swiss-grid-bg bg-white")} aria-hidden><span className="border-l-4 border-black pl-2 text-xl font-black">07</span><span className="h-4 w-10 bg-red-600" /></div>;
    case "brutalism": return <div className={cx(base, "bg-[#fff4e5]")} aria-hidden><span className="brutal-card rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-black text-white">LOUD</span></div>;
    case "editorial": return <div className={cx(base, "bg-[#faf7f0]")} aria-hidden><span className="font-serif text-3xl font-black">Ag</span><span className="h-8 w-px bg-stone-400" /><span className="font-serif text-sm italic">story</span></div>;
    case "flat-design": return <div className={cx(base, "gap-2 bg-white")} aria-hidden><span className="h-10 w-10 rounded-lg bg-rose-500" /><span className="h-10 w-10 rounded-lg bg-amber-500" /><span className="h-10 w-10 rounded-lg bg-emerald-500" /></div>;
    case "material-inspired": return <div className={cx(base, "bg-[#efeaf7]")} aria-hidden><span className="h-10 w-16 rounded-xl bg-white" style={{ boxShadow: "0 4px 12px rgb(103 58 183 / .3)" }} /><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#673ab7] font-black text-white">+</span></div>;
    case "data-dense": return <div className={cx(base, "flex-col !gap-0.5 bg-slate-950 p-3")} aria-hidden>{[90, 70, 80].map((wdt, i) => <span key={i} className="h-1.5 rounded-full bg-emerald-400/70" style={{ width: `${wdt}%` }} />)}</div>;
    default: return null;
  }
}

export default function StylesGallery() {
  const [q, setQ] = React.useState("");
  const [family, setFamily] = React.useState<(typeof FAMILIES)[number]>("All");
  const [sort, setSort] = React.useState<Sort>("recommended");

  const list = STYLE_DEFS
    .filter((d) => (family === "All" || d.family === family))
    .filter((d) => {
      const hit = (d.name + " " + d.tagline + " " + d.desc + " " + d.traits.join(" ")).toLowerCase();
      return hit.includes(q.trim().toLowerCase());
    })
    .sort((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : a.order - b.order));

  const reset = () => { setQ(""); setFamily("All"); setSort("recommended"); };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search styles — “glass”, “grid”, “dense”…"
            aria-label="Search styles" className="h-10 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm dark:border-white/15 dark:bg-white/5" />
        </div>
        <div className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Family filter">
          {FAMILIES.map((f) => (
            <button key={f} onClick={() => setFamily(f)} aria-pressed={family === f}
              className={cx("rounded-full px-3.5 py-1.5 text-[13px] font-bold", family === f ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>{f}</button>
          ))}
        </div>
        <div className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Sort order">
          {(["recommended", "az"] as const).map((s) => (
            <button key={s} onClick={() => setSort(s)} aria-pressed={sort === s}
              className={cx("rounded-full px-3.5 py-1.5 text-[13px] font-bold", sort === s ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>
              {s === "az" ? "A–Z" : "Recommended"}
            </button>
          ))}
        </div>
        <a href="#/styles/compare" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white hover:bg-violet-700">
          <GitCompareArrows size={15} /> Compare styles
        </a>
      </div>

      <p className="text-xs font-bold text-slate-400" role="status">
        {list.length} of {STYLE_DEFS.length} styles
        {list.length === 0 ? " — nothing matches" : ""}
      </p>

      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-white/5">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/10"><SearchX size={24} className="text-slate-400" /></span>
          <h3 className="mt-4 text-lg font-extrabold">No styles match “{q}”{family !== "All" ? ` in ${family}` : ""}</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">Try “grid”, “dark” or “dense” — or reset everything:</p>
          <button onClick={reset} className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700">Reset search & filters</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((d, i) => (
            <article key={d.slug} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[.04]">
              <div className="p-3 pb-0"><Preview slug={d.slug} /></div>
              <div className="flex flex-1 flex-col p-5 pt-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-black text-white" style={{ background: d.accent }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-extrabold tracking-tight">{d.name}</h3>
                </div>
                <p className="mt-1 text-[13px] font-bold" style={{ color: d.accent }}>{d.tagline}</p>
                <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{d.desc}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <Badge tone="slate">{d.family}</Badge>
                  <Badge tone={d.difficulty === "Beginner" ? "emerald" : d.difficulty === "Intermediate" ? "amber" : "rose"}>{d.difficulty}</Badge>
                  {d.traits.slice(0, 2).map((t) => <span key={t} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{t}</span>)}
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400"><b className="text-slate-700 dark:text-slate-200">Best for:</b> {d.useCases}</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-700 dark:text-amber-200"><b>Risk:</b> {d.risks}</p>
                <a href={`#/styles/${d.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-[13px] font-extrabold text-slate-900 group-hover:text-violet-700 dark:text-white dark:group-hover:text-cyan-300"
                  aria-label={`Explore the ${d.name} style demo`}>
                  Explore style <span aria-hidden className="transition group-hover:translate-x-1">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {(q || family !== "All" || sort !== "recommended") && list.length > 0 && (
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-violet-600 hover:underline">
          <RotateCcw size={13} /> Reset search & filters
        </button>
      )}
    </div>
  );
}
