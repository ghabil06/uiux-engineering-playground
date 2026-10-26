/** Keyboard navigation — live focus inspector, skip link, traps, activation. */
import React from "react";
import { TOPICS } from "./data";
import { Card } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { cx } from "../lib/core";

function describe(el: Element | null): string {
  if (!el || el === document.body) return "body (focus is nowhere useful)";
  const role = el.getAttribute("role") || el.tagName.toLowerCase();
  const name = (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 42) || "(unnamed!)";
  return `${role} — “${name}”`;
}

export default function KeyboardDemo() {
  const t = TOPICS.find((x) => x.slug === "keyboard-navigation")!;
  const [focusDesc, setFocusDesc] = React.useState("body (press Tab to begin)");
  const [log, setLog] = React.useState<string[]>([]);
  const [count, setCount] = React.useState(0);
  const [trapOn, setTrapOn] = React.useState(false);

  React.useEffect(() => {
    const fn = () => {
      const d = describe(document.activeElement);
      setFocusDesc(d);
      setLog((l) => [`Tab → ${d}`, ...l].slice(0, 6));
    };
    document.addEventListener("focusin", fn);
    return () => document.removeEventListener("focusin", fn);
  }, []);

  return (
    <div className="space-y-4">
      <PatternDoc purpose={t.desc} useCases="Testing any flow without a mouse; motor-impairment support; power use."
        states="Focus tracked live below; trap demo contains Tab until released."
        a11y={"WCAG " + t.wcag.join(", ") + ". No positive tabindex; no key handlers that hijack typing."} />
      <Card className="border-violet-200 p-5 dark:border-violet-400/20">
        <b>🔎 Focus inspector <span className="font-normal text-slate-400">(live — Tab around this page)</span></b>
        <p role="status" className="mt-2 rounded-2xl bg-slate-900 p-3 font-mono text-sm text-emerald-300">focused: {focusDesc}</p>
        <ol className="mt-2 space-y-1 text-xs text-slate-500" aria-label="Recent focus history">
          {log.map((l, i) => <li key={i} className="font-mono">· {l}</li>)}
        </ol>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3 p-5">
          <b>Activation lab</b>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCount(count + 1)} className="h-11 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">
              Native button ({count})
            </button>
            <div onClick={() => setCount(count + 1)} className="flex h-11 cursor-pointer items-center rounded-xl bg-slate-200 px-4 text-sm font-bold text-slate-600">
              Div “button” (mouse-only)
            </div>
          </div>
          <p className="text-[13px] text-slate-500">Both respond to clicks — only the native button answers Enter/Space. Count: <b className="tabular-nums">{count}</b>. This is why elements matter more than styling.</p>
          <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("kb-target")?.focus(); }}
            className="text-sm font-bold text-violet-600 underline">Skip to the test area ↓</a>
          <div id="kb-target" tabIndex={-1} className="rounded-2xl bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 dark:bg-white/5">
            Skip-link landing zone (focusable via the skip link above, not via Tab — exactly like production skip links).
          </div>
        </Card>
        <Card className="space-y-3 p-5">
          <b>Trap demo (educational)</b>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={trapOn} onChange={(e) => setTrapOn(e.target.checked)} className="h-5 w-5 accent-rose-600" />
            Enable an intentional keyboard trap
          </label>
          {trapOn ? (
            <div className="rounded-2xl border-2 border-dashed border-rose-400 p-3"
              onKeyDown={(e) => {
                if (e.key !== "Tab") return;
                const box = e.currentTarget as HTMLElement;
                const items = Array.from(box.querySelectorAll("button")) as HTMLElement[];
                const first = items[0]; const last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
              }}>
              <p className="text-xs font-bold text-rose-600">⚠ TRAPPED: Tab cycles between these two buttons. Disable the checkbox above to escape — real traps offer no such exit, which is why they fail 2.1.2.</p>
              <span className="mt-2 flex gap-2">
                <button className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-900">Caged one</button>
                <button className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-900">Caged two</button>
              </span>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Trap off. Enable it, Tab in, and feel why 2.1.2 exists — then turn it off to continue testing the page.</p>
          )}
          <p className={cx("text-[13px]", trapOn ? "font-bold text-rose-600" : "text-slate-500")}>
            {trapOn ? "Trap ACTIVE — the rest of this page is unreachable by keyboard right now." : "No traps active."}
          </p>
        </Card>
      </div>
    </div>
  );
}
