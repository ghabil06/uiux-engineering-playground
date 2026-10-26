/** Session states — warning, expiry, reauth that preserves safe input. */
import React from "react";
import { Card } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { Timer } from "lucide-react";

export default function SessionDemo() {
  const [phase, setPhase] = React.useState<"active" | "warning" | "expired">("active");
  const [left, setLeft] = React.useState(30);
  const [draft, setDraft] = React.useState("Quarterly report intro…");
  const [msg, setMsg] = React.useState("Session active (simulated clock — no real credentials involved).");

  React.useEffect(() => {
    if (phase !== "warning") return;
    if (left <= 0) {
      setPhase("expired");
      setMsg("Session expired (simulated). Your draft below was preserved — sign back in to continue.");
      return;
    }
    const iv = window.setTimeout(() => setLeft(left - 1), 1000);
    return () => window.clearTimeout(iv);
  }, [phase, left]);

  const startWarning = () => { setPhase("warning"); setLeft(30); setMsg("Expiring soon — save or extend."); };
  const extend = () => { setPhase("active"); setMsg("Session extended (simulated). Draft untouched."); };
  const reauth = () => { setPhase("active"); setMsg("✓ Signed back in (simulated) — draft intact, exactly where you left it."); };

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Expiry without data loss: warn early, expire loudly, resume exactly."
        useCases="Banking, editors, admin consoles."
        states="Active, expiring (countdown), expired, reauthenticated."
        a11y="Countdown announced politely at thresholds; expiry uses role=alert; draft never cleared." />
      <Card className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold tabular-nums dark:bg-white/10">
            <Timer size={13} aria-hidden />
            {phase === "active" ? "Session: active" : phase === "warning" ? `Session: expiring in ${left}s` : "Session: expired"}
          </span>
          {phase === "active" && <button onClick={startWarning} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Simulate 30s warning</button>}
          {phase === "warning" && <button onClick={extend} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">Stay signed in</button>}
          {phase === "warning" && <button onClick={() => { setLeft(0); }} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Expire now (demo shortcut)</button>}
          {phase === "expired" && <button onClick={reauth} className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white">Sign back in (simulated)</button>}
          {(phase !== "active") && <button onClick={() => { setPhase("active"); setMsg("Session active (simulated clock)."); }} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">↺ Reset demo</button>}
        </div>
        {phase === "warning" && (
          <p role="status" className="rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">
            Your session expires in {left}s — unsaved work is safe, but extend or sign in again to continue.
          </p>
        )}
        {phase === "expired" ? (
          <div role="alert" className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-4 dark:border-rose-400/30 dark:bg-rose-500/10">
            <p className="font-extrabold">Signed out (simulated) — nothing was submitted, nothing was lost.</p>
            <p className="mt-1 text-sm">The draft below survived. No passwords were touched; none exist here.</p>
          </div>
        ) : (
          <label className="block text-sm font-bold">Draft (safe input — preserved across expiry)
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3}
              className="mt-1 h-auto w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-white/15 dark:bg-transparent" />
          </label>
        )}
        {phase === "expired" && (
          <label className="block text-sm font-bold">Your preserved draft (read-only until sign-in)
            <textarea value={draft} readOnly rows={3} aria-label="Preserved draft, read only until sign in"
              className="mt-1 h-auto w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 dark:border-white/15 dark:bg-white/5" />
          </label>
        )}
        <p role="status" className="text-[13px] text-slate-500">{msg}</p>
      </Card>
    </div>
  );
}
