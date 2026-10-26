/** Responsive forms — single column, wrapping errors, 44px targets at 320px. */
import React from "react";
import { Card } from "../components/ui";
import { PreviewShell } from "./preview";
import { cx } from "../lib/core";

export default function RespFormsDemo() {
  const [w, setW] = React.useState(360);
  const [v, setV] = React.useState({ name: "", email: "", plan: "", notes: "" });
  const [errs, setErrs] = React.useState<Record<string, string>>({});
  const [sent, setSent] = React.useState(false);
  const set = (k: keyof typeof v, val: string) => setV((p) => ({ ...p, [k]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (v.name.trim().length < 2) er.name = "Enter your full name so the team knows who joined.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) er.email = "Enter an email like you@company.com.";
    if (!v.plan) er.plan = "Pick a plan — Starter is free and changeable later.";
    setErrs(er);
    if (!Object.keys(er).length) setSent(true);
  };

  const input = (bad?: string) => cx("h-12 w-full rounded-xl border bg-white px-3 text-base dark:bg-transparent",
    bad ? "border-rose-400 ring-2 ring-rose-100" : "border-slate-300 dark:border-white/15");

  return (
    <div className="space-y-3">
      <PreviewShell width={w} onWidth={setW} min={280} max={720} label="Form preview (try 320)">
        {() => (
          <form noValidate onSubmit={submit} className="space-y-3 p-4" aria-label="Responsive signup">
            {sent ? (
              <p role="status" className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-900">✓ Joined as {v.name} (simulated). <button type="button" onClick={() => { setSent(false); setV({ name: "", email: "", plan: "", notes: "" }); setErrs({}); }} className="underline">Start over</button></p>
            ) : (
              <>
                <div>
                  <label htmlFor="rf-name" className="text-sm font-bold">Full name</label>
                  <input id="rf-name" value={v.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={input(errs.name) + " mt-1"} />
                  {errs.name && <p role="alert" className="mt-1 text-[13px] font-semibold text-rose-600">{errs.name}</p>}
                </div>
                <div>
                  <label htmlFor="rf-email" className="text-sm font-bold">Email</label>
                  <input id="rf-email" value={v.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" inputMode="email" className={input(errs.email) + " mt-1"} />
                  {errs.email && <p role="alert" className="mt-1 text-[13px] font-semibold text-rose-600">{errs.email}</p>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="rf-plan" className="text-sm font-bold">Plan</label>
                    <select id="rf-plan" value={v.plan} onChange={(e) => set("plan", e.target.value)} className={input(errs.plan) + " mt-1"}>
                      <option value="">Choose…</option><option>Starter</option><option>Growth</option>
                    </select>
                    {errs.plan && <p role="alert" className="mt-1 text-[13px] font-semibold text-rose-600">{errs.plan}</p>}
                  </div>
                  <div>
                    <label htmlFor="rf-notes" className="text-sm font-bold">Notes <span className="font-normal text-slate-400">(optional)</span></label>
                    <input id="rf-notes" value={v.notes} onChange={(e) => set("notes", e.target.value)} className={input() + " mt-1"} />
                  </div>
                </div>
                <button type="submit" className="h-12 w-full rounded-xl bg-violet-600 text-[15px] font-bold text-white">Create account (simulated)</button>
              </>
            )}
          </form>
        )}
      </PreviewShell>
      <Card className="p-4 text-[13px]">
        <b>Why this survives 320px:</b> single column (two-up only ≥640px inside the pane) · 48px inputs ·
        errors wrap instead of truncating · labels never collapse to placeholders · full-width submit in the thumb zone.
      </Card>
    </div>
  );
}
