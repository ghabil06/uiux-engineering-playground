/** Recovery patterns — retry, reset, cancel, undo with clear outcomes. */
import React from "react";
import { Card } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { Progress } from "../patterns/primitives";
import { Undo2 } from "lucide-react";

export default function RecoveryDemo() {
  const [tries, setTries] = React.useState(0);
  const [saved, setSaved] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [archived, setArchived] = React.useState(false);
  const [undoLeft, setUndoLeft] = React.useState(0);

  const retry = () => {
    const n = tries + 1;
    setTries(n);
  };

  const send = () => {
    if (sending) return;
    setSending(true);
    window.setTimeout(() => { setSending(false); setSaved(true); }, 800);
  };

  const archive = () => {
    setArchived(true);
    setUndoLeft(8);
    const iv = window.setInterval(() => {
      setUndoLeft((u) => {
        if (u <= 1) { window.clearInterval(iv); return 0; }
        return u - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose="The complete recovery toolkit with honest outcomes: what each action does, and what it cannot do."
        useCases="Every failure state in this laboratory."
        states="Failed→retried, dirty→saved, cancelled, archived→undone-or-committed."
        a11y="Every recovery is a labelled button; outcomes announced; undo countdown visible as text + progress." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-2 p-5">
          <b>Retry <span className="font-normal text-slate-400">(idempotent ops only)</span></b>
          {tries < 2 ? (
            <>
              <p role="alert" className="rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-900 dark:bg-rose-500/10 dark:text-rose-100">Sync failed (simulated 500). Attempt {tries + 1}.</p>
              <button onClick={retry} className="h-10 w-full rounded-xl bg-rose-600 text-sm font-bold text-white">Retry sync</button>
            </>
          ) : (
            <p role="status" className="rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
              ✓ Synced on attempt {tries + 1}. <button onClick={() => setTries(0)} className="underline">Replay</button>
            </p>
          )}
        </Card>
        <Card className="space-y-2 p-5">
          <b>Reset & cancel</b>
          <p className="text-sm text-slate-500">Draft: <b>{saved ? "saved ✓" : "unsaved changes"}</b></p>
          <span className="flex gap-2">
            <button onClick={send} disabled={sending || saved} className="h-10 flex-1 rounded-xl bg-violet-600 text-sm font-bold text-white disabled:opacity-40">
              {sending ? "Saving…" : saved ? "Saved" : "Save draft"}
            </button>
            <button onClick={() => setSaved(false)} disabled={!saved && true} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Discard</button>
          </span>
          <p className="text-xs text-slate-500">Cancel here is safe: nothing destructive is pending, so no confirm is demanded. Confirmations are reserved for real irreversibility.</p>
          <button onClick={() => setSaved(false)} className="text-xs font-bold text-violet-600 underline">↺ Reset demo</button>
        </Card>
        <Card className="space-y-2 p-5">
          <b>Undo (reversible deletes)</b>
          {!archived ? (
            <button onClick={archive} className="h-10 w-full rounded-xl border border-slate-300 text-sm font-bold dark:border-white/15">Archive “Atlas Website”</button>
          ) : undoLeft > 0 ? (
            <div role="status" className="rounded-2xl bg-slate-900 p-3 text-white">
              <span className="flex items-center gap-2 text-sm"><Undo2 size={14} aria-hidden /> Archived.
                <button onClick={() => { setArchived(false); setUndoLeft(0); }} className="ml-auto rounded-lg bg-white px-3 py-1 text-xs font-black text-slate-900">Undo ({undoLeft}s)</button>
              </span>
              <span className="mt-2 block"><Progress value={undoLeft} max={8} label="Undo window" tone="bg-white" /></span>
            </div>
          ) : (
            <p role="status" className="rounded-2xl bg-slate-100 p-3 text-sm font-semibold dark:bg-white/5">
              Archived permanently (in this demo). <button onClick={() => setArchived(false)} className="font-bold text-violet-600 underline">Restore for demo purposes</button>
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
