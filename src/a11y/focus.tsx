/** Focus management — order viewer, skip link, view-change focus, restoration, obscured check. */
import React from "react";
import { TOPICS } from "./data";
import { Card, Badge } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { cx } from "../lib/core";

const ORDER = ["Skip link", "Search field", "Nav: Queue", "Nav: Reports", "Main heading", "Primary action", "Footer link"];

export default function FocusDemo() {
  const t = TOPICS.find((x) => x.slug === "focus-management")!;
  const [step, setStep] = React.useState(0);
  const [restored, setRestored] = React.useState("Not tested yet.");
  const [obscured, setObscured] = React.useState(true);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const viewRef = React.useRef<HTMLDivElement>(null);

  const advance = () => {
    const next = (step + 1) % ORDER.length;
    setStep(next);
    document.getElementById(`fo-${next}`)?.focus();
  };

  const openAndReturn = () => {
    setRestored("Dialog open — focus moved inside. Close it to verify restoration.");
  };
  const [miniOpen, setMiniOpen] = React.useState(false);
  function MiniDialog({ onClose }: { onClose: () => void }) {
    const closeRef = React.useRef<HTMLButtonElement>(null);
    React.useEffect(() => {
      closeRef.current?.focus();
      const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", esc);
      return () => document.removeEventListener("keydown", esc);
    }, [onClose]);
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Mini dialog">
        <div className="absolute inset-0 bg-black/45" onClick={onClose} />
        <div className="relative w-full max-w-xs rounded-3xl bg-white p-5 dark:bg-slate-900">
          <h4 className="font-black">Mini dialog</h4>
          <p className="text-sm text-slate-500">Focus entered here on open; Esc closes.</p>
          <button ref={closeRef} onClick={onClose} className="mt-3 h-10 w-full rounded-xl bg-violet-600 text-sm font-bold text-white">Close (returns focus)</button>
        </div>
      </div>
    );
  }
  const closeMini = () => {
    setMiniOpen(false);
    triggerRef.current?.focus();
    setRestored("✓ Focus returned to “Open mini dialog” — restoration verified.");
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose={t.desc} useCases="SPAs, wizards, drawers, sticky layouts."
        states="Ordered walk, view-change focus, dialog restoration, obscured vs clear."
        a11y={"WCAG " + t.wcag.join(", ") + ". Focus order must match visual/logical order; nothing interactive hides."} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3 p-5">
          <b>Focus-order walkthrough</b>
          <ol className="space-y-1">
            {ORDER.map((label, i) => (
              <li key={label}>
                <button id={`fo-${i}`} onClick={() => setStep(i)}
                  aria-current={step === i ? "true" : undefined}
                  className={cx("flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm",
                    step === i ? "bg-violet-600 font-bold text-white" : "bg-slate-50 hover:bg-slate-100 dark:bg-white/5")}>
                  <span className="font-mono text-xs opacity-60">{i + 1}.</span> {label}
                  {step === i && <Badge tone="slate" className="!bg-white/20 !text-white">focused</Badge>}
                </button>
              </li>
            ))}
          </ol>
          <button onClick={advance} className="h-10 w-full rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
            Move focus to next in order →
          </button>
          <p className="text-xs text-slate-500">Order follows the visual layout top-to-bottom — the only order that ever makes sense.</p>
        </Card>
        <div className="space-y-4">
          <Card className="space-y-2 p-5">
            <b>View-change focus + restoration</b>
            <div ref={viewRef} tabIndex={-1} className="rounded-2xl bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-violet-400 dark:bg-white/5">
              Simulated “page” region. In production, route changes move focus to the new h1 (tabIndex=-1).
            </div>
            <span className="flex gap-2">
              <button onClick={() => { viewRef.current?.focus(); }} className="h-10 flex-1 rounded-xl border border-slate-300 text-sm font-bold dark:border-white/15">Simulate route change</button>
              <button ref={triggerRef} onClick={() => { setMiniOpen(true); setRestored("Dialog open — focus moved inside. Close it to verify restoration."); openAndReturn(); }}
                className="h-10 flex-1 rounded-xl bg-violet-600 text-sm font-bold text-white">Open mini dialog</button>
            </span>
            <p role="status" className="text-[13px] font-semibold">{restored}</p>
            {miniOpen && (
              <MiniDialog onClose={closeMini} />
            )}
          </Card>
          <Card className="space-y-2 p-5">
            <b>Obscured-focus check</b>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={obscured} onChange={(e) => setObscured(e.target.checked)} className="h-5 w-5 accent-violet-600" />
              Sticky bar overlaps content (the bug)
            </label>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
              <div className="space-y-2 p-3">
                {[1, 2, 3].map((i) => (
                  <button key={i} className="h-10 w-full rounded-xl bg-slate-100 text-sm font-bold dark:bg-white/10">Row action {i}</button>
                ))}
              </div>
              {obscured && (
                <div className="absolute inset-x-0 bottom-0 bg-slate-900/90 p-2 text-center text-xs font-bold text-white">
                  Sticky promo bar — Tab to “Row action 3” and it hides underneath. Fails 2.4.11.
                </div>
              )}
            </div>
            <p className="text-[13px] text-slate-500">{obscured ? "Bug present: focused controls slide under the bar." : "Fixed: padding reserves space; focus stays visible. This is the 2.4.11 difference."}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
