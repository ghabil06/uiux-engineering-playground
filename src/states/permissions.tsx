/** Permission states — denied with reason, safe alternative, no fake security. */
import React from "react";
import { Card } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { Lock } from "lucide-react";

export default function PermissionsDemo() {
  const [role, setRole] = React.useState<"Viewer" | "Editor" | "Admin">("Viewer");
  const [asked, setAsked] = React.useState(false);
  const [deleted, setDeleted] = React.useState<string[]>([]);

  const canDelete = role === "Admin";
  const attempt = (name: string) => {
    if (!canDelete) {
      setAsked(false);
      document.getElementById("perm-note")?.focus();
      return;
    }
    setDeleted([...deleted, name]);
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Denial that teaches: who can act, why you can't, and what to do instead — while stating plainly that front-end gating is UX, not security."
        useCases="Role-gated actions, billing, admin panels."
        states="Allowed, denied-with-reason, access-requested, safe alternative."
        a11y="Denials announced; alternatives focusable; never rely on hiding alone (hidden ≠ secure)." />
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
        Front-end permission UI is <b>user experience, not security</b> — a real server must re-check everything.
        This demo gates nothing but pixels.
      </div>
      <Card className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <b className="text-sm">Acting as:</b>
          <span className="flex gap-1 rounded-full bg-slate-200/60 p-1 dark:bg-white/10" role="group" aria-label="Simulated role">
            {(["Viewer", "Editor", "Admin"] as const).map((r) => (
              <button key={r} onClick={() => { setRole(r); setAsked(false); }} aria-pressed={role === r}
                className={role === r ? "rounded-full bg-white px-3.5 py-1.5 text-[13px] font-bold shadow dark:bg-slate-800" : "rounded-full px-3.5 py-1.5 text-[13px] font-bold text-slate-500"}>{r}</button>
            ))}
          </span>
        </div>
        <ul className="space-y-2">
          {["Atlas Website", "Billing API"].filter((n) => !deleted.includes(n)).map((n) => (
            <li key={n} className="flex items-center gap-2 rounded-2xl border border-slate-200 p-3 text-sm dark:border-white/10">
              <b className="min-w-0 flex-1 truncate">{n}</b>
              <button onClick={() => attempt(n)} aria-label={`Delete ${n}`}
                className={canDelete ? "h-9 rounded-xl bg-rose-600 px-3 text-xs font-black text-white" : "h-9 rounded-xl border border-slate-300 px-3 text-xs font-bold text-slate-400 dark:border-white/15"}>
                Delete
              </button>
            </li>
          ))}
          {deleted.length === 2 && <li className="text-sm text-slate-500">Both removed (local demo). <button onClick={() => setDeleted([])} className="font-bold text-violet-600 underline">Restore</button></li>}
        </ul>
        {!canDelete && (
          <div id="perm-note" tabIndex={-1} role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm outline-none dark:border-rose-400/20 dark:bg-rose-500/10">
            <p className="flex items-center gap-2 font-extrabold"><Lock size={15} aria-hidden /> Deletion needs the Admin role — you're a {role}.</p>
            <p className="mt-1">Safe alternatives: <b>duplicate the project</b>, or <b>request Admin access</b> (simulated approval below).</p>
            <span className="mt-2 flex flex-wrap gap-2">
              {!asked ? (
                <button onClick={() => setAsked(true)} className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white">Request Admin access</button>
              ) : (
                <span role="status" className="rounded-xl bg-emerald-100 px-3 py-2 text-[13px] font-bold text-emerald-900">✓ Request sent (simulated). An admin would approve out-of-band.</span>
              )}
              <button onClick={() => setDeleted([...deleted, "Atlas Website (copy)"])} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Duplicate instead</button>
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}
