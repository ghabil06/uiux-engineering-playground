/** Cognitive load — overloaded vs improved, with decision/step/control counters. */
import React from "react";
import { Card } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";

function Counters({ decisions, steps, controls, label }: { decisions: number; steps: number; controls: number; label: string }) {
  return (
    <dl aria-label={label} className="grid grid-cols-3 gap-2 text-center">
      {[["Decisions", decisions], ["Steps", steps], ["Visible controls", controls]].map(([k, v]) => (
        <div key={k as string} className="rounded-xl bg-white/60 p-2 dark:bg-white/5">
          <dt className="text-[10px] font-bold uppercase text-slate-500">{k}</dt>
          <dd className="text-2xl font-black tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function CognitiveLoad() {
  const [chaosDone, setChaosDone] = React.useState<string[]>([]);
  const [calmStep, setCalmStep] = React.useState(0);
  const [calmDone, setCalmDone] = React.useState(false);
  const [nav, setNav] = React.useState<string[]>([]);

  const chaos = ["Name", "Email", "Plan", "Seats", "Coupon", "Theme", "Timezone", "Avatar", "Bio", "Alerts", "Digest", "API key"];
  const toggleChaos = (c: string) => {
    setChaosDone((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Feel the difference between 12 simultaneous decisions and 3 staged ones. Counters track decisions, steps and visible controls — educational indicators, not brain measurements."
        useCases="Long forms, dense dashboards, sprawling navs."
        states="Chaotic multi-decide vs staged single-decide; both completable."
        a11y="Both versions fully keyboard-operable; the improved one additionally groups with fieldsets and announces progress." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-rose-200 p-5 dark:border-rose-400/20">
          <b>✕ Overloaded: everything at once</b>
          <p className="mt-1 text-[13px] text-slate-500">12 decisions, 1 giant step, 14 visible controls. Try finishing it.</p>
          <div className="mt-3"><Counters decisions={12} steps={1} controls={14} label="Overloaded version counts" /></div>
          <div className="mt-3 grid grid-cols-2 gap-1.5" role="group" aria-label="All settings at once">
            {chaos.map((c) => (
              <button key={c} onClick={() => toggleChaos(c)} aria-pressed={chaosDone.includes(c)}
                className={chaosDone.includes(c) ? "rounded-lg bg-slate-900 px-2 py-2 text-left text-xs font-bold text-white" : "rounded-lg bg-slate-100 px-2 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300"}>
                {chaosDone.includes(c) ? "✓ " : "○ "}{c}
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label="Overloaded navigation">
            {["Home", "Billing", "Team", "API", "Audit", "Exports", "Help"].map((n) => (
              <button key={n} onClick={() => setNav(nav.includes(n) ? nav.filter((x) => x !== n) : [...nav, n])} aria-pressed={nav.includes(n)}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold dark:bg-white/10">{n}</button>
            ))}
          </div>
          <p role="status" className="mt-2 text-xs text-slate-500">{chaosDone.length}/12 decided{chaosDone.length === 12 ? " — done, but at what cost?" : "…"}</p>
        </Card>

        <Card className="border-emerald-200 p-5 dark:border-emerald-400/20">
          <b>✓ Improved: chunked, defaulted, disclosed</b>
          <p className="mt-1 text-[13px] text-slate-500">3 decisions across 3 steps, 4 visible controls. Defaults handle the rest.</p>
          <div className="mt-3"><Counters decisions={3} steps={3} controls={4} label="Improved version counts" /></div>
          {!calmDone ? (
            <div className="mt-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">Step {calmStep + 1} of 3</p>
              {calmStep === 0 && (
                <fieldset className="mt-2"><legend className="text-sm font-bold">Who is this workspace for?</legend>
                  <span className="mt-1.5 grid gap-1.5">{["Just me", "My team", "Clients"].map((o, i) => (
                    <button key={o} onClick={() => setCalmStep(1)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-semibold hover:border-emerald-400 dark:border-white/10 dark:bg-transparent">{o}{i === 1 && " (recommended)"}</button>
                  ))}</span></fieldset>
              )}
              {calmStep === 1 && (
                <fieldset className="mt-2"><legend className="text-sm font-bold">Team size? <span className="font-normal text-slate-400">(sensible default: 5)</span></legend>
                  <span className="mt-1.5 flex gap-1.5">{["1", "5", "25+"].map((o) => (
                    <button key={o} onClick={() => setCalmStep(2)} className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-bold hover:border-emerald-400 dark:border-white/10 dark:bg-transparent">{o}</button>
                  ))}</span></fieldset>
              )}
              {calmStep === 2 && (
                <div className="mt-2">
                  <p className="text-sm font-bold">Notifications? <span className="font-normal text-slate-400">(digest default: weekly — changeable later)</span></p>
                  <span className="mt-1.5 flex gap-1.5">
                    <button onClick={() => setCalmDone(true)} className="h-11 flex-1 rounded-xl bg-emerald-600 text-sm font-bold text-white">Weekly digest ✓</button>
                    <button onClick={() => setCalmDone(true)} className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-bold dark:border-white/10">Customize later</button>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p role="status" className="mt-3 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
              ✓ Workspace configured in 3 decisions. <button onClick={() => { setCalmDone(false); setCalmStep(0); }} className="underline">Replay</button>
            </p>
          )}
          <ul className="mt-3 space-y-1 text-[13px] text-slate-600 dark:text-slate-300">
            <li>· <b>Chunking:</b> one question per screen.</li>
            <li>· <b>Defaults:</b> 9 of 12 chaos-toggles pre-decided sensibly.</li>
            <li>· <b>Recognition:</b> options shown, nothing recalled.</li>
          </ul>
        </Card>
      </div>
      <p className="rounded-2xl bg-amber-50 p-3 text-[13px] text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">
        Honest framing: these counters are <b>design heuristics</b>, not neuroscience. Real cognitive load is measured
        with methods like NASA-TLX or dual-task studies — see the Research lab.
      </p>
    </div>
  );
}
