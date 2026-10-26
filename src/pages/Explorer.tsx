import React from "react";
import { DEMOS, CATEGORIES, STYLE_FILTERS, filterDemos, type Difficulty, timeAgo, cx } from "../lib/core";
import { getRecent, iconFor } from "../components/shell";
import { Search, ArrowUpRight, RotateCcw, Loader2, SearchX, Flame } from "lucide-react";
import { Badge } from "../components/ui";

function diffTone(d: Difficulty) {
  return d === "Beginner" ? "emerald" : d === "Intermediate" ? "amber" : "rose";
}

export default function Explorer() {
  const params = new URLSearchParams((window.location.hash.split("?")[1] || ""));
  const [q, setQ] = React.useState(params.get("q") || "");
  const [cat, setCat] = React.useState("All");
  const [diff, setDiff] = React.useState<string>("All");
  const [style, setStyle] = React.useState<string>("All");
  const [loading, setLoading] = React.useState(false);
  const recent = getRecent();

  // fake brief loading shimmer on filter change to demo loading state honestly
  const applyFilter = (fn: () => void) => { setLoading(true); setTimeout(() => { fn(); setLoading(false); }, 220); };

  // Single source of truth lives in lib/core.ts so search/filter behavior is unit-testable.
  const list = filterDemos(DEMOS, { q, category: cat, difficulty: diff, style });
  const resetAll = () => { setQ(""); setCat("All"); setDiff("All"); setStyle("All"); };

  return (
    <div className="space-y-8">
      {/* hero */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white sm:p-12">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-600/40 blur-[90px]" />
          <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-cyan-500/30 blur-[100px]" />
          <div className="absolute inset-0 dot-grid opacity-20" style={{ backgroundImage: "radial-gradient(circle, #ffffff22 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        </div>
        <div className="relative max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="violet" className="border border-white/20 bg-white/10 !text-white">63 live demos · 0 mock buttons</Badge>
            <Badge tone="sky" className="border border-white/20 bg-white/10 !text-white">WCAG 2.2 AA target</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
            The UI/UX Engineering <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">Playground</span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-300">
            Discover, compare and <em className="text-white not-italic font-bold">operate</em> real product interfaces — dashboards with working tables,
            carts with real math, drift monitors with triage, and 12 genuinely different visual styles.
          </p>
          <div className="relative mt-6 max-w-lg">
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search demos, skills, patterns…"
              className="h-12 w-full rounded-2xl border border-white/15 bg-white/10 pl-11 pr-4 text-[15px] text-white backdrop-blur placeholder:text-slate-400 focus:border-cyan-300 focus:bg-white/15 outline-none" aria-label="Search demo catalogue" />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["cart", "drift", "palette", "checkout", "contrast"].map((s) => (
              <button key={s} onClick={() => setQ(s)} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/15">Try “{s}”</button>
            ))}
          </div>
        </div>
        <div className="relative mt-8 grid grid-cols-3 gap-3 sm:max-w-md">
          {[["63", "functional demos"], ["20", "UX lab demos"], ["17", "patterns"]].map(([n, l]) => (
            <div key={l} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
              <p className="text-2xl font-black">{n}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* recent */}
      {recent.length > 0 && (
        <section aria-label="Recently visited">
          <h2 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400"><Flame size={15} className="text-orange-500" /> Recently visited</h2>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {recent.map((r) => {
              const d = DEMOS.find((x) => x.route === r.route);
              if (!d) return null;
              return (
                <a key={r.route + r.ts} href={r.route} className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold hover:border-violet-300 dark:border-white/10 dark:bg-white/5">
                  <span style={{ color: d.accent }}>{iconFor(d.icon)}</span> {d.name}
                  <span className="font-medium text-slate-400">{timeAgo(r.ts)}</span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* filters */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => applyFilter(() => setCat(c))} aria-pressed={cat === c}
              className={cx("rounded-full px-3.5 py-1.5 text-[13px] font-bold transition", cat === c ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300")}>{c}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">Difficulty:</span>
          {["All", "Beginner", "Intermediate", "Advanced"].map((d) => (
            <button key={d} onClick={() => applyFilter(() => setDiff(d))} aria-pressed={diff === d}
              className={cx("rounded-full px-3 py-1 font-bold", diff === d ? "bg-violet-600 text-white" : "bg-slate-200/60 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300")}>{d}</button>
          ))}
          <span className="ml-2 font-bold text-slate-400">{list.length} result{list.length !== 1 && "s"}</span>
          {(q || cat !== "All" || diff !== "All" || style !== "All") && (
            <button onClick={resetAll} className="ml-auto inline-flex items-center gap-1 font-bold text-violet-600 hover:underline"><RotateCcw size={12} /> Reset filters</button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-400">Visual style:</span>
          {["All", ...STYLE_FILTERS].map((s) => (
            <button key={s} onClick={() => applyFilter(() => setStyle(s))} aria-pressed={style === s}
              className={cx("rounded-full px-3 py-1 font-bold", style === s ? "bg-rose-600 text-white" : "bg-slate-200/60 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300")}>{s}</button>
          ))}
        </div>
      </section>

      {/* grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading demos">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-white/10" />
              <div className="mt-4 h-4 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
              <div className="mt-2 h-3 w-full rounded bg-slate-100 dark:bg-white/5" />
              <div className="mt-4 flex gap-2"><div className="h-6 w-16 rounded-full bg-slate-100 dark:bg-white/5" /><div className="h-6 w-16 rounded-full bg-slate-100 dark:bg-white/5" /></div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-white/5">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/10"><SearchX size={24} className="text-slate-400" /></span>
          <h3 className="mt-4 text-lg font-extrabold">No demos match “{q}”</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">Try a skill (“table”, “cart”, “drift”), a category, or clear filters. Empty states should always offer a way forward — like this button:</p>
          <button onClick={resetAll} className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700">Clear search & filters</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((d) => (
            <a key={d.id} href={d.route}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-600/10 dark:border-white/10 dark:bg-white/[.04] dark:hover:shadow-black">
              <span className="absolute inset-x-0 top-0 h-1" style={{ background: d.accent }} />
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl text-white" style={{ background: d.accent }}>{iconFor(d.icon)}</span>
                <ArrowUpRight size={18} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500" />
              </div>
              <h3 className="mt-3 font-extrabold tracking-tight">{d.name}</h3>
              <p className="mt-1 text-[13px] font-medium text-violet-700 dark:text-cyan-300">{d.teaches}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">Interact: {d.interactions.join(" · ")}</p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Badge tone="slate">{d.category}</Badge>
                <Badge tone={diffTone(d.difficulty) as never}>{d.difficulty}</Badge>
                <Badge tone="pink">{d.styles[0]}{d.styles.length > 1 ? ` +${d.styles.length - 1}` : ""}</Badge>
                <Badge tone="emerald">● functional</Badge>
                <span className="ml-auto text-[11px] font-semibold text-slate-400">~{d.estimatedMins} min</span>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-extrabold text-slate-900 group-hover:text-violet-700 dark:text-white dark:group-hover:text-cyan-300">
                Open demo <span aria-hidden className="transition group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </div>
      )}

      {/* principles strip */}
      <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[.03] md:grid-cols-3">
        {[
          ["01 · Real behavior", "Tables sort. Carts total. Alerts triage. If a control doesn't work, it isn't shown as working."],
          ["02 · Honest simulation", "Every fake backend is labeled. No invented auth, payments or calibrated probabilities."],
          ["03 · Accessible by default", "Keyboard paths, focus rings, live regions and contrast math ship with each lab."],
        ].map(([t, d]) => (
          <div key={t}>
            <p className="text-xs font-black uppercase tracking-widest text-violet-600 dark:text-cyan-300">{t}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{d}</p>
          </div>
        ))}
      </section>

      <div className="flex items-center gap-2 text-xs text-slate-400">
        {loading && <Loader2 size={14} className="animate-spin" />}
        Catalogue updates instantly · shareable via URL hash · theme & recents persist locally.
      </div>
    </div>
  );
}
