/** Accessible names & announcements — computation order, live regions, honest limits. */
import React from "react";
import { TOPICS } from "./data";
import { Card, Badge } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { cx } from "../lib/core";

function computedName(kind: string): string {
  switch (kind) {
    case "aria": return "“Close dialog” — aria-label wins over everything.";
    case "label": return "“Email address” — associated <label> (or labelledby).";
    case "content": return "“Read more” — text content, last resort (often too vague).";
    case "title": return "“info” — title attribute, weakest, frequently ignored.";
    case "none": return "(silence — “button” with no name. This is the bug.)";
    default: return "";
  }
}

export default function ScreenReadersDemo() {
  const t = TOPICS.find((x) => x.slug === "screen-readers")!;
  const [kind, setKind] = React.useState("aria");
  const [polite, setPolite] = React.useState("Nothing announced yet.");
  const [assertive, setAssertive] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const announce = (msg: string, urgent = false) => {
    if (urgent) {
      setAssertive(msg);
    } else setPolite(msg);
  };

  const startJob = () => {
    setProgress(0);
    const iv = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          window.clearInterval(iv);
          announce("Export complete — 100 percent.");
          return 100;
        }
        return p + 25;
      });
    }, 400);
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose={t.desc} useCases="Icon buttons, async updates, errors, custom widgets."
        states="Name sources compared; polite vs assertive announcements; expanded/collapsed exposure."
        a11y={"WCAG " + t.wcag.join(", ") + ". Simulation panels below are explanatory — real AT output varies by software, version and settings."} />
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
        Honest limits: these panels <b>describe</b> what assistive tech hears — they do not reproduce
        VoiceOver/NVDA/JAWS output, which depends on software, version, verbosity and navigation mode.
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3 p-5">
          <b>Accessible-name computation <span className="font-normal text-slate-400">(first match wins)</span></b>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Name source">
            {[["aria", "aria-label"], ["label", "<label>"], ["content", "content"], ["title", "title=?"], ["none", "nothing"]].map(([k, l]) => (
              <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k}
                className={cx("rounded-full px-3 py-1.5 font-mono text-xs font-bold", kind === k ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10")}>{l}</button>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
            {kind === "aria" && <button aria-label="Close dialog" className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">✕</button>}
            {kind === "label" && <label className="flex items-center gap-2 text-sm font-bold">Email address<input placeholder="you@co.com" className="h-10 rounded-xl border border-slate-300 px-3 font-normal dark:border-white/15 dark:bg-transparent" /></label>}
            {kind === "content" && <button className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-900">Read more</button>}
            {kind === "title" && <button title="info" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 font-black dark:border-white/15">i</button>}
            {kind === "none" && <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">✕</button>}
            <p className="font-mono text-[13px]" role="status">AT hears: {computedName(kind)}</p>
          </div>
          <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="sr-more"
            className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">
            {expanded ? "Hide details" : "Show details"}
          </button>
          {expanded && <p id="sr-more" className="text-sm text-slate-500">Expanded state exposed programmatically — AT announces “expanded” without seeing the chevron rotate.</p>}
        </Card>
        <Card className="space-y-3 p-5">
          <b>Live regions — polite vs assertive</b>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => announce("Saved just now — polite, waits its turn.")} className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white">Announce polite</button>
            <button onClick={() => announce("Payment failed — assertive, interrupts.", true)} className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white">Announce assertive</button>
            <button onClick={startJob}
              className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Start 0→100 job</button>
          </div>
          <div className="rounded-2xl bg-slate-900 p-3 font-mono text-[13px] text-slate-200">
            <p>polite: <span className="text-emerald-300">{polite}</span></p>
            <p>assertive: <span className="text-rose-300">{assertive ?? "—"}</span></p>
          </div>
          <div aria-live="polite" className="sr-only">{polite}</div>
          {assertive && <div role="alert" className="sr-only">{assertive}</div>}
          <div>
            <p className="flex justify-between text-xs font-bold"><span>Export progress</span><Badge tone="slate">{progress}%</Badge></p>
            <div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Export progress"
              className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
              <div className="h-full bg-violet-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <p className="text-xs text-slate-500">Real live regions are included (sr-only) so AT users get the same announcements; the visible panel mirrors them for sighted testers.</p>
        </Card>
      </div>
    </div>
  );
}
