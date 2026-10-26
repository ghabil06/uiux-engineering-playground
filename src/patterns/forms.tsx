/** Forms & Validation — every common control with kind, well-timed validation. */
import React from "react";
import { Field, Card, inputCls, useToasts } from "../components/ui";
import { Checkbox, Switch } from "../components/foundation";
import { PatternDoc } from "./primitives";
import { patternDef } from "./data";
import { cx } from "../lib/core";

interface V { name: string; email: string; bio: string; plan: string; contact: string; news: boolean; updates: boolean; birth: string; fail: boolean }
const INIT: V = { name: "", email: "", bio: "", plan: "", contact: "email", news: true, updates: false, birth: "", fail: false };

export default function FormsDemo() {
  const def = patternDef("forms");
  const [v, setV] = React.useState<V>(INIT);
  const [touched, setTouched] = React.useState<Set<string>>(new Set());
  const [sending, setSending] = React.useState(false);
  const [done, setDone] = React.useState<null | { ok: boolean }>(null);
  const { push, Toast } = useToasts();
  const set = (k: keyof V, val: string | boolean) => setV((p) => ({ ...p, [k]: val }));
  const touch = (k: string) => setTouched((p) => new Set(p).add(k));

  const errs: Partial<Record<keyof V, string>> = {};
  if (!v.name.trim() || v.name.trim().length < 2) errs.name = "Enter your full name (at least 2 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errs.email = "Enter a valid email like you@company.com.";
  if (v.bio.length > 280) errs.bio = `Shorten by ${v.bio.length - 280} characters (max 280).`;
  if (!v.plan) errs.plan = "Choose a plan so we can set up your workspace.";
  if (v.birth) {
    const d = new Date(v.birth + "T00:00:00");
    if (Number.isNaN(d.getTime())) errs.birth = "Enter a real date (YYYY-MM-DD).";
    else if (d > new Date()) errs.birth = "Birth date can't be in the future.";
  }
  const show = (k: keyof V) => touched.has(k) || done !== null ? errs[k] : undefined;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(new Set(["name", "email", "bio", "plan", "birth"]));
    if (Object.keys(errs).length) {
      setDone(null);
      push("3+ fields need attention", "Errors are listed next to each field.", "#e11d48");
      document.getElementById("form-errors")?.focus();
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      if (v.fail) {
        setDone({ ok: false });
        push("Submission failed (simulated)", "Your entries were preserved — fix nothing, just retry.", "#e11d48");
      } else {
        setDone({ ok: true });
        push("Profile saved", "Local simulation — nothing left your browser.", "#10b981");
      }
    }, 900);
  };

  const errCount = Object.keys(errs).length;

  return (
    <div className="space-y-4">
      {Toast}
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Pristine, touched, invalid, submitting, success, failure; values always preserved."
        a11y={def.keyboard + " Errors appear only after interaction (blur/submit), never on pristine fields."} />
      {done?.ok ? (
        <Card className="border-emerald-200 p-8 text-center dark:border-emerald-500/30">
          <p className="text-4xl">✓</p>
          <h3 className="mt-2 text-xl font-black">Profile saved for {v.name.split(" ")[0]}!</h3>
          <p className="mt-1 text-sm text-slate-500">Simulated success — plan <b>{v.plan}</b>, contact via <b>{v.contact}</b>, newsletter {v.news ? "on" : "off"}.</p>
          <button onClick={() => { setV(INIT); setTouched(new Set()); setDone(null); }} className="mt-4 h-10 rounded-xl border border-slate-300 px-5 text-sm font-bold dark:border-white/15">↺ Start a new response</button>
        </Card>
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-5 lg:grid-cols-2" aria-label="Profile form">
          <Card className="space-y-4 p-5">
            <h3 className="font-extrabold">About you</h3>
            <Field label="Full name *" error={show("name")} htmlFor="f-name">
              <input id="f-name" value={v.name} onChange={(e) => set("name", e.target.value)} onBlur={() => touch("name")}
                aria-invalid={!!show("name")}
                placeholder="Ada Lovelace" autoComplete="name" className={inputCls(show("name"))} />
            </Field>
            <Field label="Email *" error={show("email")} htmlFor="f-email">
              <input id="f-email" value={v.email} onChange={(e) => set("email", e.target.value)} onBlur={() => touch("email")}
                aria-invalid={!!show("email")} placeholder="ada@company.com" autoComplete="email" className={inputCls(show("email"))} />
            </Field>
            <Field label="Bio (optional)" hint={`${v.bio.length}/280`} error={show("bio")} htmlFor="f-bio">
              <textarea id="f-bio" rows={3} value={v.bio} onChange={(e) => set("bio", e.target.value)} onBlur={() => touch("bio")}
                aria-invalid={!!show("bio")} placeholder="What should teammates know?" className={inputCls(show("bio")) + " h-auto py-2.5"} />
            </Field>
            <Field label="Birth date (optional)" error={show("birth")} htmlFor="f-birth">
              <input id="f-birth" type="date" value={v.birth} onChange={(e) => set("birth", e.target.value)} onBlur={() => touch("birth")}
                aria-invalid={!!show("birth")} className={inputCls(show("birth"))} />
            </Field>
          </Card>
          <Card className="space-y-4 p-5">
            <h3 className="font-extrabold">Preferences</h3>
            <Field label="Plan *" error={show("plan")} htmlFor="f-plan">
              <select id="f-plan" value={v.plan} onChange={(e) => set("plan", e.target.value)} onBlur={() => touch("plan")}
                aria-invalid={!!show("plan")} className={inputCls(show("plan"))}>
                <option value="">Choose a plan…</option>
                <option>Starter</option><option>Growth</option><option>Enterprise</option>
              </select>
            </Field>
            <fieldset>
              <legend className="text-[13px] font-semibold">Preferred contact</legend>
              <span className="mt-1.5 flex gap-4 text-sm font-semibold">
                {(["email", "phone", "none"] as const).map((o) => (
                  <label key={o} className="flex cursor-pointer items-center gap-1.5 capitalize">
                    <input type="radio" name="contact" checked={v.contact === o} onChange={() => set("contact", o)} className="h-4 w-4 accent-violet-600" />{o}
                  </label>
                ))}
              </span>
            </fieldset>
            <Checkbox label="Email me product news" checked={v.news} onChange={(b) => set("news", b)} hint="About twice a month. Unsubscribe anytime." />
            <Switch label="Weekly digest" checked={v.updates} onChange={(b) => set("updates", b)} hint="Monday summary of workspace activity." />
            <Checkbox label="Simulate server failure on submit" checked={v.fail} onChange={(b) => set("fail", b)} hint="Demo control: shows the failure path with preserved input." />
            {errCount > 0 && touched.size > 0 && (
              <div id="form-errors" tabIndex={-1} role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-900 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-100">
                {errCount} field{errCount === 1 ? " needs" : "s need"} attention — each error names its fix.
              </div>
            )}
            {done && !done.ok && (
              <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-900 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-100">
                The demo server rejected this (simulated). Nothing was lost — press Submit again or uncheck the failure toggle.
              </div>
            )}
            <div className="flex gap-2">
              <button type="submit" disabled={sending}
                className={cx("h-11 flex-1 rounded-xl bg-violet-600 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-60")}>
                {sending ? "Saving…" : "Save profile (simulated)"}
              </button>
              <button type="button" onClick={() => { setV(INIT); setTouched(new Set()); setDone(null); }}
                className="h-11 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Reset</button>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}
