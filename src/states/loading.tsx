/** Loading states — skeleton, spinner, inline, full-panel, delayed simulation. */
import React from "react";
import { Card } from "../components/ui";
import { Skeleton } from "../components/foundation";
import { PatternDoc } from "../patterns/primitives";

export default function LoadingDemo() {
  const [panel, setPanel] = React.useState<"idle" | "loading" | "done">("idle");
  const [slow, setSlow] = React.useState(false);

  const load = (delayed: boolean) => {
    setPanel("loading");
    setSlow(false);
    const iv = window.setTimeout(() => setPanel("done"), delayed ? 2600 : 900);
    const slowTimer = delayed ? window.setTimeout(() => setSlow(true), 1200) : 0;
    return () => { window.clearTimeout(iv); if (slowTimer) window.clearTimeout(slowTimer); };
  };
  const [cleanup, setCleanup] = React.useState<(() => void) | null>(null);
  React.useEffect(() => () => cleanup?.(), [cleanup]);

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Five loading treatments, each announced and each resolving — never a perpetual spinner."
        useCases="Tables, panels, buttons, searches."
        states="Skeleton, spinner, inline, full-panel, delayed-with-reassurance."
        a11y="aria-busy regions + labelled progressbars; skeletons aria-hidden with text equivalents nearby." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-2 p-5">
          <b>Skeleton (content-shaped)</b>
          <div aria-busy="true" aria-label="Loading invoice list">
            <Skeleton lines={4} />
          </div>
          <p className="text-xs text-slate-500">Shape promises layout — no layout shift when content lands.</p>
        </Card>
        <Card className="space-y-2 p-5">
          <b>Spinner + inline button loading</b>
          <span className="flex items-center gap-2">
            <button className="flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white" disabled aria-busy="true">
              <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Saving…
            </button>
            <span role="status" className="text-sm text-slate-500">Button disabled + labelled while busy.</span>
          </span>
        </Card>
      </div>
      <Card className="space-y-3 p-5">
        <b>Full panel + delayed response</b>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCleanup(() => load(false))} className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-900">Load panel (fast)</button>
          <button onClick={() => setCleanup(() => load(true))} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Load panel (slow, 2.6s)</button>
          <button onClick={() => { cleanup?.(); setCleanup(null); setPanel("idle"); setSlow(false); }} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">↺ Reset</button>
        </div>
        {panel === "idle" && <p className="text-sm text-slate-500">Idle — pick a speed.</p>}
        {panel === "loading" && (
          <div aria-busy="true" aria-label="Loading panel">
            <div className="h-32 animate-pulse rounded-2xl bg-slate-200 dark:bg-white/10" />
            <p role="status" className="mt-2 text-sm font-semibold">{slow ? "Still working — thanks for waiting (reassurance after 1.2s)…" : "Loading…"}</p>
          </div>
        )}
        {panel === "done" && (
          <p role="status" className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">✓ Panel loaded. Slow loads earn reassurance; fast ones just resolve.</p>
        )}
      </Card>
    </div>
  );
}
