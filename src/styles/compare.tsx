/**
 * Style comparison — pick 2+ styles, see the SAME workspace rendered in each
 * treatment side by side (stacked with a switcher on small screens).
 */
import React from "react";
import { STYLE_DEFS, styleDef } from "./defs";
import MinimalismDemo from "./minimalism";
import LightUIDemo from "./light-ui";
import DarkUIDemo from "./dark-ui";
import BentoDemo from "./bento-grid";
import GlassDemo from "./glassmorphism";
import NeoDemo from "./neumorphism";
import SwissDemo from "./swiss-grid";
import BrutalDemo from "./brutalism";
import EditorialDemo from "./editorial";
import FlatDemo from "./flat-design";
import MaterialDemo from "./material-inspired";
import DenseDemo from "./data-dense";
import { Card, Badge, Empty } from "../components/ui";
import { X, Plus, ArrowUpRight } from "lucide-react";
import { cx } from "../lib/core";

const RENDERERS: Record<string, React.ComponentType> = {
  minimalism: MinimalismDemo,
  "light-ui": LightUIDemo,
  "dark-ui": DarkUIDemo,
  "bento-grid": BentoDemo,
  glassmorphism: GlassDemo,
  neumorphism: NeoDemo,
  "swiss-grid": SwissDemo,
  brutalism: BrutalDemo,
  editorial: EditorialDemo,
  "flat-design": FlatDemo,
  "material-inspired": MaterialDemo,
  "data-dense": DenseDemo,
};

const CRITERIA: { key: "typography" | "surfaces" | "spacing" | "borders" | "elevation" | "color"; label: string }[] = [
  { key: "typography", label: "Typography" },
  { key: "surfaces", label: "Surfaces" },
  { key: "spacing", label: "Spacing" },
  { key: "borders", label: "Borders" },
  { key: "elevation", label: "Elevation" },
  { key: "color", label: "Color" },
];

export default function StylesCompare() {
  const [picked, setPicked] = React.useState<string[]>(["minimalism", "brutalism"]);
  const [focus, setFocus] = React.useState(0);
  const toggle = (slug: string) =>
    setPicked((p) => {
      const next = p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug].slice(0, 4);
      setFocus(0);
      return next;
    });

  React.useEffect(() => {
    if (focus >= picked.length) setFocus(0);
  }, [picked, focus]);

  return (
    <div className="space-y-5">
      {/* picker */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <b className="text-sm">Compare up to 4 styles</b>
          <span className="text-xs text-slate-400">{picked.length} selected — same workspace data in each</span>
          {picked.length > 0 && (
            <button onClick={() => setPicked([])} className="ml-auto text-xs font-bold text-rose-600 hover:underline">Clear all</button>
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6" role="group" aria-label="Choose styles to compare">
          {STYLE_DEFS.map((d) => {
            const on = picked.includes(d.slug);
            return (
              <button key={d.slug} onClick={() => toggle(d.slug)} aria-pressed={on}
                className={cx("flex items-center gap-2 rounded-xl border p-2 text-left text-xs font-bold", on ? "border-violet-500 bg-violet-50 ring-2 ring-violet-200 dark:bg-violet-500/10" : "border-slate-200 dark:border-white/10")}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-black text-white" style={{ background: d.accent }}>
                  {on ? "✓" : d.name[0]}
                </span>
                <span className="truncate">{d.name}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {picked.length === 0 ? (
        <Empty title="Nothing to compare yet"
          desc="Pick two or more styles above — for example Minimalism vs Brutalism — and the same project workspace will render in each treatment."
          action={<a href="#/styles" className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white">Browse the gallery first</a>} />
      ) : picked.length === 1 ? (
        <Card className="p-8 text-center">
          <p className="font-extrabold">{styleDef(picked[0]).name} is lonely.</p>
          <p className="mt-1 text-sm text-slate-500">Select at least one more style above to start comparing.</p>
        </Card>
      ) : (
        <>
          {/* criteria matrix */}
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <th className="p-3 text-[11px] uppercase tracking-wider text-slate-400">Criterion</th>
                  {picked.map((s) => {
                    const d = styleDef(s);
                    return (
                      <th key={s} className="p-3">
                        <span className="flex items-center gap-2">
                          {d.name}
                          <button onClick={() => toggle(s)} aria-label={`Remove ${d.name} from comparison`}
                            className="rounded-md p-1 hover:bg-slate-100 dark:hover:bg-white/10"><X size={13} /></button>
                        </span>
                      </th>
                    );
                  })}
                  {picked.length < 4 && (
                    <th className="p-3">
                      <span className="relative inline-block">
                        <Plus size={14} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
                        <select aria-label="Add a style to the comparison" value="" onChange={(e) => e.target.value && toggle(e.target.value)}
                          className="h-8 appearance-none rounded-lg border border-dashed border-slate-300 pl-7 pr-2 text-xs font-bold dark:border-white/15 dark:bg-transparent">
                          <option value="">Add…</option>
                          {STYLE_DEFS.filter((d) => !picked.includes(d.slug)).map((d) => (
                            <option key={d.slug} value={d.slug}>{d.name}</option>
                          ))}
                        </select>
                      </span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {CRITERIA.map((c) => (
                  <tr key={c.key} className="border-b border-slate-100 align-top last:border-0 dark:border-white/5">
                    <th scope="row" className="p-3 text-[11px] font-black uppercase tracking-wider text-slate-400">{c.label}</th>
                    {picked.map((s) => (
                      <td key={s} className="p-3 leading-relaxed text-slate-600 dark:text-slate-300">{styleDef(s)[c.key]}</td>
                    ))}
                    {picked.length < 4 && <td />}
                  </tr>
                ))}
                <tr className="align-top">
                  <th scope="row" className="p-3 text-[11px] font-black uppercase tracking-wider text-slate-400">A11y note</th>
                  {picked.map((s) => (
                    <td key={s} className="p-3"><Badge tone="emerald">♿ {styleDef(s).a11y}</Badge></td>
                  ))}
                  {picked.length < 4 && <td />}
                </tr>
              </tbody>
            </table>
          </Card>

          {/* mobile switcher */}
          <div className="lg:hidden">
            <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 no-scrollbar dark:border-white/10 dark:bg-white/[.03]" role="tablist" aria-label="Switch compared style">
              {picked.map((s, i) => (
                <button key={s} role="tab" aria-selected={focus === i} onClick={() => setFocus(i)}
                  className={cx("shrink-0 rounded-xl px-4 py-2 text-[13px] font-bold", focus === i ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500")}>
                  {styleDef(s).name}
                </button>
              ))}
            </div>
            <div className="mt-3" role="tabpanel" aria-label={`${styleDef(picked[focus]).name} preview`}>
              {React.createElement(RENDERERS[picked[focus]])}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <button disabled={focus === 0} onClick={() => setFocus(focus - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold disabled:opacity-40 dark:border-white/10">← Prev</button>
              <span className="font-bold text-slate-400">{focus + 1} / {picked.length} — stacked mode on small screens</span>
              <button disabled={focus === picked.length - 1} onClick={() => setFocus(focus + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold disabled:opacity-40 dark:border-white/10">Next →</button>
            </div>
          </div>

          {/* desktop side-by-side */}
          <div className={cx("hidden gap-4 lg:grid", picked.length === 2 ? "lg:grid-cols-2" : "xl:grid-cols-2 2xl:grid-cols-2")}>
            {picked.map((s) => (
              <section key={s} aria-label={`${styleDef(s).name} live preview`} className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white/50 p-3 dark:border-white/10 dark:bg-white/[.02]">
                <div className="mb-2 flex items-center gap-2 px-1">
                  <b className="text-sm">{styleDef(s).name}</b>
                  <span className="text-xs text-slate-400">· {styleDef(s).tagline}</span>
                  <a href={`#/styles/${s}`} className="ml-auto inline-flex items-center gap-0.5 text-xs font-bold text-violet-600 hover:underline">
                    Full demo <ArrowUpRight size={12} />
                  </a>
                </div>
                {React.createElement(RENDERERS[s])}
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
