/** Multi-step form — validated wizard with preserved values, review and guarded submit. */
import React from "react";
import { Field, Card, inputCls, useToasts } from "../components/ui";
import { PatternDoc, StepProgress } from "./primitives";
import { patternDef } from "./data";
import { Check } from "lucide-react";
import { cx } from "../lib/core";

const STEPS = ["Account", "Project", "Review"];

export default function MultiStepDemo() {
  const def = patternDef("multi-step-form");
  const [s, setS] = React.useState(0);
  const [f, setF] = React.useState({ email: "", password: "", proj: "", cat: "Website", notes: "" });
  const [errs, setErrs] = React.useState<Record<string, string>>({});
  const [sending, setSending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const { push, Toast } = useToasts();
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const validate = (step: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email — we'll send the invite there.";
      if (f.password.length < 8) e.password = "Use at least 8 characters.";
    }
    if (step === 1 && f.proj.trim().length < 3) e.proj = "Name the project (3+ characters).";
    return e;
  };

  const next = () => {
    const e = validate(s);
    setErrs(e);
    if (Object.keys(e).length) {
      push("This step isn't complete", "Fix the highlighted field to continue.", "#e11d48");
      return;
    }
    setS(s + 1);
  };

  const submit = () => {
    if (sending || done) return;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setDone(true);
      push("Workspace created", "Simulated — no account was actually registered.", "#10b981");
    }, 1000);
  };

  if (done) {
    return (
      <div className="space-y-4">
        {Toast}
        <Card className="border-emerald-200 p-8 text-center dark:border-emerald-500/30">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check size={22} /></span>
          <h3 className="mt-3 text-xl font-black">“{f.proj}” is ready (simulated)!</h3>
          <p className="mt-1 text-sm text-slate-500">Invite sent to {f.email} · {f.cat} · {f.notes || "no notes"}. Nothing was persisted anywhere.</p>
          <button onClick={() => { setS(0); setF({ email: "", password: "", proj: "", cat: "Website", notes: "" }); setErrs({}); setDone(false); }}
            className="mt-4 h-10 rounded-xl border border-slate-300 px-5 text-sm font-bold dark:border-white/15">↺ Start over</button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Toast}
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Per-step validation, preserved back-navigation, review, guarded submit, simulated confirmation."
        a11y={def.keyboard} />
      <Card className="p-6">
        <StepProgress steps={STEPS} current={s} label="Signup progress" />
        <div className="mt-6 min-h-[190px]" role="group" aria-label={`Step ${s + 1} of ${STEPS.length}: ${STEPS[s]}`}>
          {s === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Work email *" error={errs.email} htmlFor="w-email">
                <input id="w-email" value={f.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="you@company.com" autoComplete="email" className={inputCls(errs.email)} />
              </Field>
              <Field label="Password *" hint="8+ characters." error={errs.password} htmlFor="w-pass">
                <input id="w-pass" type="password" value={f.password} onChange={(e) => set("password", e.target.value)}
                  autoComplete="new-password" className={inputCls(errs.password)} />
              </Field>
            </div>
          )}
          {s === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Project name *" error={errs.proj} htmlFor="w-proj">
                <input id="w-proj" value={f.proj} onChange={(e) => set("proj", e.target.value)}
                  placeholder="Atlas Website Redesign" className={inputCls(errs.proj)} />
              </Field>
              <Field label="Category" htmlFor="w-cat">
                <select id="w-cat" value={f.cat} onChange={(e) => set("cat", e.target.value)} className={inputCls()}>
                  {["Website", "Mobile", "API", "Internal"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Notes (optional)" htmlFor="w-notes">
                  <textarea id="w-notes" rows={2} value={f.notes} onChange={(e) => set("notes", e.target.value)}
                    placeholder="Anything the team should know…" className={inputCls() + " h-auto py-2.5"} />
                </Field>
              </div>
            </div>
          )}
          {s === 2 && (
            <dl className="grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2 dark:bg-white/5">
              {[["Email", f.email, 0], ["Project", f.proj, 1], ["Category", f.cat, 1], ["Notes", f.notes || "—", 1]].map(([k, val, step]) => (
                <div key={k as string} className="flex items-center justify-between gap-2 rounded-xl bg-white p-3 dark:bg-white/5">
                  <span><span className="block text-[11px] font-bold uppercase text-slate-400">{k}</span><b>{val as string}</b></span>
                  <button onClick={() => setS(step as number)} className="text-xs font-bold text-violet-600 hover:underline" aria-label={`Edit ${k}`}>Edit</button>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div className="mt-5 flex gap-2">
          <button onClick={() => { setS(Math.max(0, s - 1)); setErrs({}); }} disabled={s === 0 || sending}
            className="h-11 rounded-xl border border-slate-300 px-5 text-sm font-bold disabled:opacity-40 dark:border-white/15">← Back</button>
          {s < 2 ? (
            <button onClick={next} className="h-11 flex-1 rounded-xl bg-violet-600 text-sm font-bold text-white hover:bg-violet-700">Continue →</button>
          ) : (
            <button onClick={submit} disabled={sending}
              className={cx("h-11 flex-1 rounded-xl text-sm font-bold text-white", sending ? "bg-violet-400" : "bg-emerald-600 hover:bg-emerald-700")}>
              {sending ? "Creating… (one click only)" : "Create workspace (simulated)"}
            </button>
          )}
        </div>
        <p className="mt-3 text-xs text-slate-500">Back never loses entries · Continue is blocked until the step validates · double-submit is impossible while sending.</p>
      </Card>
    </div>
  );
}
