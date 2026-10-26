/** Accessible forms — poor vs improved, placeholders exposed, errors announced. */
import React from "react";
import { TOPICS } from "./data";
import { Card, Badge } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { cx } from "../lib/core";

export default function A11yFormsDemo() {
  const t = TOPICS.find((x) => x.slug === "forms")!;
  const [poor, setPoor] = React.useState("");
  const [poorMsg, setPoorMsg] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const err = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showErr = touched && err;

  return (
    <div className="space-y-4">
      <PatternDoc purpose={t.desc} useCases="Signup, checkout, settings — anywhere input meets validation."
        states="Pristine, hinted, invalid (announced + linked), submitted."
        a11y={"WCAG " + t.wcag.join(", ") + ". Placeholders vanish; labels persist — the poor panel proves why."} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3 border-rose-200 p-5 dark:border-rose-400/20">
          <Badge tone="rose">✕ Poor: placeholder as label</Badge>
          <input value={poor} onChange={(e) => setPoor(e.target.value)} placeholder="Email address"
            aria-label="Unlabelled input (placeholder only — the problem)" className="h-12 w-full rounded-xl border border-slate-300 px-3 text-base dark:border-white/15 dark:bg-transparent" />
          <button onClick={() => setPoorMsg(poor ? "Submitted (maybe). No confirmation, no error association — screen readers heard only “edit text, blank” until you typed." : "Nothing to submit — and no label ever told you what belongs here.")}
            className="h-11 w-full rounded-xl bg-slate-200 text-sm font-bold text-slate-500">Join</button>
          {poorMsg && <p className="text-[13px] text-slate-500">{poorMsg}</p>}
          <ul className="space-y-1 text-[13px] text-rose-700 dark:text-rose-300">
            <li>· Placeholder vanishes on input — the instruction is gone when needed most.</li>
            <li>· Grey placeholder often fails 4.5:1 before you even type.</li>
            <li>· No error association, no autocomplete, no required indication.</li>
          </ul>
        </Card>
        <Card className="space-y-3 border-emerald-200 p-5 dark:border-emerald-400/20">
          <Badge tone="emerald">✓ Improved: label + hint + linked error</Badge>
          {sent ? (
            <p role="status" className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
              ✓ You're on the list, {email} (simulated). <button onClick={() => { setSent(false); setEmail(""); setTouched(false); }} className="underline">Add another</button>
            </p>
          ) : (
            <form noValidate onSubmit={(e) => { e.preventDefault(); setTouched(true); if (!err) setSent(true); }}>
              <label htmlFor="af-email" className="text-sm font-bold">
                Email address <span aria-hidden className="text-rose-600">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <p id="af-hint" className="mt-0.5 text-xs text-slate-500">We send one confirmation, never spam. Name fields use autocomplete.</p>
              <input id="af-email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(true)}
                aria-invalid={showErr} aria-describedby={showErr ? "af-err af-hint" : "af-hint"}
                placeholder="you@company.com" autoComplete="email" inputMode="email"
                className={cx("mt-1 h-12 w-full rounded-xl border px-3 text-base", showErr ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-300 dark:border-white/15")} />
              {showErr && <p id="af-err" role="alert" className="mt-1 text-[13px] font-semibold text-rose-600">Enter an email like you@company.com — check for a missing “@” or domain.</p>}
              <button type="submit" className="mt-3 h-11 w-full rounded-xl bg-emerald-600 text-sm font-bold text-white">Join newsletter (simulated)</button>
            </form>
          )}
          <ul className="space-y-1 text-[13px] text-emerald-800 dark:text-emerald-100">
            <li>· Persistent label + required announced; placeholder is only an example.</li>
            <li>· Error names the fix, links via describedby, announces via role=alert.</li>
            <li>· autocomplete + inputMode help real keyboards and password managers.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
