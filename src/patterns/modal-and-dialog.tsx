/** Modals & dialogs — five kinds, one focus discipline. */
import React from "react";
import { Field, Card, inputCls, useToasts } from "../components/ui";
import { Dialog } from "../components/foundation";
import { PatternDoc } from "./primitives";
import { patternDef } from "./data";

type Kind = "info" | "confirm" | "destructive" | "form" | "detail" | null;

export default function ModalDemo() {
  const def = patternDef("modal-and-dialog");
  const [kind, setKind] = React.useState<Kind>(null);
  const [email, setEmail] = React.useState("");
  const [emailErr, setEmailErr] = React.useState("");
  const [log, setLog] = React.useState<string[]>([]);
  const { push, Toast } = useToasts();
  const trigger = React.useRef<HTMLButtonElement | null>(null);

  const open = (k: Exclude<Kind, null>, e: React.MouseEvent<HTMLButtonElement>) => {
    trigger.current = e.currentTarget;
    setKind(k);
  };
  const close = (note?: string) => {
    setKind(null);
    if (note) {
      setLog((l) => [`${new Date().toLocaleTimeString()} — ${note}`, ...l].slice(0, 4));
      push("Dialog closed", note, "#7c3aed");
    }
    trigger.current?.focus();
  };

  const sendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailErr("Enter a valid email to invite.");
      return;
    }
    close(`Invite queued for ${email} (simulated)`);
    setEmail("");
    setEmailErr("");
  };

  return (
    <div className="space-y-4">
      {Toast}
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Five dialog kinds; each traps focus, closes on Esc/backdrop, and returns focus to its trigger."
        a11y="role=dialog/alertdialog + aria-modal + labelled title/desc; destructive uses alertdialog semantics; no nested stacks." />
      <Card className="grid gap-2 p-5 sm:grid-cols-2 lg:grid-cols-5">
        {([
          ["info", "ℹ Info", "Release notes"],
          ["confirm", "✓ Confirm", "Publish changes"],
          ["destructive", "✕ Destructive", "Delete project"],
          ["form", "✎ Form", "Invite member"],
          ["detail", "▤ Detail", "View record"],
        ] as [Exclude<Kind, null>, string, string][]).map(([k, label, hint]) => (
          <span key={k} className="flex flex-col gap-1">
            <button onClick={(e) => open(k, e)}
              className={k === "destructive"
                ? "h-11 rounded-xl bg-rose-600 text-sm font-bold text-white hover:bg-rose-700"
                : "h-11 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"}>
              {label}
            </button>
            <span className="text-center text-[11px] text-slate-400">{hint}</span>
          </span>
        ))}
      </Card>

      {kind === "info" && (
        <Dialog title="What's new in 4.2" desc="Shipped Oct 20, 2026." onClose={() => close("Release notes dismissed")}>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Faster exports (3× on large workspaces).</li>
            <li>Dark mode follows your OS setting.</li>
            <li>Undo window extended to 30 seconds.</li>
          </ul>
          <button onClick={() => close("Release notes acknowledged")} className="mt-4 h-10 w-full rounded-xl bg-violet-600 text-sm font-bold text-white">Got it</button>
        </Dialog>
      )}
      {kind === "confirm" && (
        <Dialog title="Publish changes?" desc="12 edited pages will go live immediately." onClose={() => close("Publish cancelled — nothing went live")}>
          <div className="flex justify-end gap-2">
            <button onClick={() => close("Publish cancelled — nothing went live")} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Keep editing</button>
            <button onClick={() => close("Published 12 pages (simulated)")} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">Publish</button>
          </div>
        </Dialog>
      )}
      {kind === "destructive" && (
        <Dialog title="Delete “Atlas Website”?" desc="This removes 61 tasks and 8 members. This demo only flips local state." danger onClose={() => close("Delete cancelled — project kept")}>
          <div className="rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-900 dark:bg-rose-500/10 dark:text-rose-100">
            Type DELETE below is overkill for a demo — instead, the safe default (Cancel) is focused first.
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button autoFocus onClick={() => close("Delete cancelled — project kept")} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Cancel (safe)</button>
            <button onClick={() => close("Project deleted locally (simulated)")} className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white">Yes, delete</button>
          </div>
        </Dialog>
      )}
      {kind === "form" && (
        <Dialog title="Invite team member" desc="They'll get demo access immediately (simulated)." onClose={() => close()}>
          <form onSubmit={sendInvite} noValidate className="space-y-3">
            <Field label="Email" error={emailErr} htmlFor="dlg-email">
              <input id="dlg-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@company.com" className={inputCls(emailErr)} />
            </Field>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => close("Invite dismissed")} className="h-10 rounded-xl px-4 text-sm font-bold text-slate-500">Cancel</button>
              <button type="submit" className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">Send invite</button>
            </div>
          </form>
        </Dialog>
      )}
      {kind === "detail" && (
        <Dialog title="PRJ-1042 · Checkout revamp" desc="Record detail — read-only." onClose={() => close()}>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {[["Owner", "Rin S."], ["Status", "blocked"], ["Budget", "$11,900"], ["Updated", "2026-10-24"]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 p-2.5 dark:bg-white/5"><dt className="text-[10px] font-bold uppercase text-slate-400">{k}</dt><dd className="font-bold">{v}</dd></div>
            ))}
          </dl>
          <button onClick={() => close("Detail closed")} className="mt-4 h-10 w-full rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">Done</button>
        </Dialog>
      )}

      <Card className="p-4">
        <b className="text-sm">Interaction log <span className="font-normal text-slate-400">(proves focus-return + outcomes)</span></b>
        {log.length === 0
          ? <p className="mt-1 text-sm text-slate-500">Open a dialog above — every close records what happened and returns focus to its trigger button.</p>
          : <ul className="mt-2 space-y-1 text-[13px] text-slate-600 dark:text-slate-300">{log.map((l, i) => <li key={i}>· {l}</li>)}</ul>}
      </Card>
    </div>
  );
}
