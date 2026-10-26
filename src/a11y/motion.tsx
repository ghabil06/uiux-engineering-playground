/** Motion — OS preference respected, scoped lab override for comparison. */
import React from "react";
import { TOPICS } from "./data";
import { Card, Badge } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { cx } from "../lib/core";

function usePrefersReduced(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  return reduced;
}

export default function MotionDemo() {
  const t = TOPICS.find((x) => x.slug === "motion")!;
  const osReduced = usePrefersReduced();
  const [override, setOverride] = React.useState<"os" | "full" | "reduced">("os");
  const [open, setOpen] = React.useState(false);
  const [spin, setSpin] = React.useState(false);
  const [pct, setPct] = React.useState(0);

  // Effective motion ONLY inside this demo's preview box — never app-wide.
  const reduced = override === "reduced" || (override === "os" && osReduced);
  const anim = (cls: string) => (reduced ? "" : cls);

  const runBar = () => {
    setPct(0);
    const iv = window.setInterval(() => {
      setPct((p) => {
        if (p >= 100) { window.clearInterval(iv); setSpin(false); return 100; }
        return p + 20;
      });
    }, reduced ? 60 : 300);
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose={t.desc} useCases="Loaders, expanders, page transitions — anywhere motion tempts."
        states="Full motion, OS-reduced, forced-reduced override; content identical in all three."
        a11y={"WCAG " + t.wcag.join(", ") + ". The override below affects this preview only — the app never overrides the OS setting globally."} />
      <Card className="flex flex-wrap items-center gap-3 p-4">
        <b className="text-sm">Motion in this preview:</b>
        <span className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Motion mode for this preview">
          {(["os", "full", "reduced"] as const).map((m) => (
            <button key={m} onClick={() => setOverride(m)} aria-pressed={override === m}
              className={cx("rounded-full px-3.5 py-1.5 text-[13px] font-bold", override === m ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>
              {m === "os" ? `OS setting (${osReduced ? "reduced" : "full"})` : m === "full" ? "Force full" : "Force reduced"}
            </button>
          ))}
        </span>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-3 p-5">
          <b>Short transition</b>
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mo-panel"
            className="h-11 w-full rounded-xl bg-violet-600 text-sm font-bold text-white">Toggle panel</button>
          <div id="mo-panel" className={cx("overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5", !reduced && "transition-all duration-300")}
            style={{ maxHeight: open ? 120 : 0, opacity: open ? 1 : 0 }}>
            <p className="p-3 text-sm">Panel content. Reduced mode: appears instantly, same content, same focus order.</p>
          </div>
          {!reduced && <p className="text-xs text-slate-500">300ms ease — under the 500ms guideline for UI feedback.</p>}
        </Card>
        <Card className="space-y-3 p-5">
          <b>Loading + progress</b>
          <button onClick={() => { setSpin(true); runBar(); }} disabled={spin}
            className="h-11 w-full rounded-xl border border-slate-300 text-sm font-bold disabled:opacity-40 dark:border-white/15">
            {spin ? "Working…" : "Run simulated job"}
          </button>
          {spin && !reduced ? (
            <div className="flex items-center gap-2" role="status">
              <span aria-hidden className="h-5 w-5 animate-spin rounded-full border-2 border-violet-300 border-t-violet-600" />
              <span className="text-sm">Spinning (decorative — the bar carries meaning).</span>
            </div>
          ) : spin ? (
            <p role="status" className="text-sm font-semibold">Working… {pct}% (no spinner in reduced mode)</p>
          ) : null}
          <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Simulated job"
            className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <div className={cx("h-full bg-violet-600", !reduced && "transition-all duration-200")} style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs tabular-nums text-slate-500" aria-hidden>{pct}% — identical information with or without animation.</p>
        </Card>
        <Card className="space-y-3 p-5">
          <b>What we refuse to do</b>
          <ul className="space-y-1.5 text-[13px] text-slate-600 dark:text-slate-300">
            <li>· No parallax, no autoplay video, no flashing above 3/s.</li>
            <li>· Essential state never lives <i>inside</i> motion (the % text above proves it).</li>
            <li>· <Badge tone={reduced ? "emerald" : "slate"}>{reduced ? "Reduced active" : "Full active"}</Badge> in this box right now.</li>
          </ul>
          <div aria-hidden className={cx("flex h-16 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 text-2xl", anim("animate-floaty"))}>◈</div>
          <p className="text-xs text-slate-500">{reduced ? "Float animation disabled by your setting." : "Decorative float — pure garnish, safe to kill."}</p>
        </Card>
      </div>
    </div>
  );
}
