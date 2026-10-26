/** Error prevention & recovery — free-text vs guarded input, then a named-fix recovery. */
import React from "react";
import { Card } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";

export default function ErrorPrevention() {
  const [free, setFree] = React.useState("");
  const [freeMsg, setFreeMsg] = React.useState<string | null>(null);
  const [mm, setMm] = React.useState("");
  const [yy, setYy] = React.useState("");
  const [guardMsg, setGuardMsg] = React.useState<string | null>(null);

  const payFree = () => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(free.trim())) {
      setFreeMsg("“Payment failed: invalid expiry.” Your cart is intact, but which part was wrong? (This is the expensive error.)");
      return;
    }
    setFreeMsg("Paid (simulated). You guessed the format correctly — most users won't.");
  };

  const payGuarded = () => {
    const m = Number(mm);
    const now = new Date();
    const fullYear = 2000 + Number(yy || 0);
    if (!mm || !yy) { setGuardMsg("Pick a month and year — the error arrives before submit, not after."); return; }
    if (fullYear < now.getFullYear() || (fullYear === now.getFullYear() && m < now.getMonth() + 1)) {
      setGuardMsg(`Card expired ${mm}/${yy} — try a current card. Entry preserved, focus stays here.`);
      document.getElementById("exp-mm")?.focus();
      return;
    }
    setGuardMsg("Paid (simulated). The guardrails made the mistake nearly impossible.");
  };

  const input = "h-11 rounded-xl border border-slate-300 px-3 text-sm dark:border-white/15 dark:bg-transparent";

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Move errors from submit-time (expensive) to type-time (cheap): masks, ranges, previews, confirmations."
        useCases="Payments, dates, deletions, settings with consequences."
        states="Unvalidated, guarded-hint, named-fix recovery, preserved entries."
        a11y="Guards announced via descriptions; recovery moves focus to the field; nothing is ever silently cleared." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-rose-200 p-5 dark:border-rose-400/20">
          <b>✕ Free-text expiry</b>
          <p className="mt-1 text-[13px] text-slate-500">Anything goes in. Errors arrive after submit, unnamed.</p>
          <div className="mt-3 flex gap-2">
            <label className="sr-only" htmlFor="free-exp">Card expiry, any format</label>
            <input id="free-exp" value={free} onChange={(e) => setFree(e.target.value)} placeholder="whatever…" className={input + " min-w-0 flex-1"} />
            <button onClick={payFree} className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-900">Pay</button>
          </div>
          {freeMsg && <p role={freeMsg.startsWith("Paid") ? "status" : "alert"} className="mt-2 text-[13px] font-semibold">{freeMsg}</p>}
        </Card>
        <Card className="border-emerald-200 p-5 dark:border-emerald-400/20">
          <b>✓ Guarded expiry</b>
          <p className="mt-1 text-[13px] text-slate-500">Constrained inputs + range check + named recovery.</p>
          <div className="mt-3 flex gap-2">
            <label className="sr-only" htmlFor="exp-mm">Expiry month</label>
            <select id="exp-mm" value={mm} onChange={(e) => setMm(e.target.value)} aria-describedby="exp-hint"
              className={input + " w-24"}>
              <option value="">MM</option>
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <label className="sr-only" htmlFor="exp-yy">Expiry year</label>
            <select id="exp-yy" value={yy} onChange={(e) => setYy(e.target.value)}
              className={input + " w-24"}>
              <option value="">YY</option>
              {["24", "25", "26", "27", "28", "29", "30"].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <button onClick={payGuarded} className="h-11 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white">Pay</button>
          </div>
          <p id="exp-hint" className="mt-1 text-xs text-slate-500">Only real calendar months are selectable; past dates are caught with the field named.</p>
          {guardMsg && <p role={guardMsg.startsWith("Paid") ? "status" : "alert"} className="mt-2 text-[13px] font-semibold">{guardMsg}</p>}
        </Card>
      </div>
      <Card className="p-4 text-[13px]">
        <b>Prevention toolkit:</b> constrain (pickers, masks) · default safe · preview consequences ·
        confirm destructive with the item named · never clear user input on error.
      </Card>
    </div>
  );
}
