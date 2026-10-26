/** Accessible dialogs — full lifecycle lab on the shared Dialog primitive. */
import React from "react";
import { TOPICS } from "./data";
import { Card } from "../components/ui";
import { Dialog } from "../components/foundation";
import { PatternDoc } from "../patterns/primitives";

const LONG = Array.from({ length: 12 }, (_, i) => `Paragraph ${i + 1}: dialog content must scroll inside the dialog — the page behind stays put and inert.`);

export default function A11yDialogsDemo() {
  const t = TOPICS.find((x) => x.slug === "dialogs")!;
  const [kind, setKind] = React.useState<null | "confirm" | "long" | "form">(null);
  const [name, setName] = React.useState("");
  const [log, setLog] = React.useState<string[]>([]);
  const trigger = React.useRef<HTMLButtonElement | null>(null);

  const open = (k: Exclude<typeof kind, null>, e: React.MouseEvent<HTMLButtonElement>) => {
    trigger.current = e.currentTarget;
    setKind(k);
  };
  const close = (note: string) => {
    setKind(null);
    setLog((l) => [`${new Date().toLocaleTimeString()} — ${note}`, ...l].slice(0, 5));
    trigger.current?.focus();
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose={t.desc} useCases="Confirms, editors, detail views — anywhere context switches."
        states="Closed, open (focus inside), submitting, long-scroll, restored."
        a11y={"WCAG " + t.wcag.join(", ") + ". Reuses the shared Dialog: labelled, described, modal, Esc, backdrop, focus in/trapped/returned."} />
      <Card className="flex flex-wrap gap-2 p-5">
        <button onClick={(e) => open("confirm", e)} className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-900">Confirm dialog</button>
        <button onClick={(e) => open("long", e)} className="h-11 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Long-content dialog</button>
        <button onClick={(e) => open("form", e)} className="h-11 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Form dialog</button>
      </Card>
      <Card className="p-4">
        <b className="text-sm">Lifecycle log <span className="font-normal text-slate-400">(open → focus → close → restored)</span></b>
        {log.length === 0
          ? <p className="mt-1 text-sm text-slate-500">No dialogs opened yet. Every close returns focus to its trigger — Tab once after closing to verify.</p>
          : <ul className="mt-2 space-y-1 text-[13px]">{log.map((l, i) => <li key={i}>· {l}</li>)}</ul>}
      </Card>
      {kind === "confirm" && (
        <Dialog title="Publish 12 pages?" desc="They go live immediately across all locales." onClose={() => close("Confirm dismissed — focus returned to Confirm dialog")}>
          <div className="flex justify-end gap-2">
            <button onClick={() => close("Publish cancelled")} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Keep editing</button>
            <button onClick={() => close("Published (simulated)")} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">Publish</button>
          </div>
        </Dialog>
      )}
      {kind === "long" && (
        <Dialog title="Terms of demo" desc="Twelve paragraphs. The dialog scrolls; the page does not." onClose={() => close("Long dialog closed")}>
          <div className="max-h-56 space-y-2 overflow-y-auto rounded-2xl bg-slate-50 p-3 text-sm dark:bg-white/5">
            {LONG.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <button onClick={() => close("Terms accepted (simulated)")} className="mt-3 h-10 w-full rounded-xl bg-violet-600 text-sm font-bold text-white">Accept</button>
        </Dialog>
      )}
      {kind === "form" && (
        <Dialog title="Rename project" desc="Names are unique per workspace." onClose={() => close("Rename dismissed")}>
          <form onSubmit={(e) => { e.preventDefault(); close(`Renamed to “${name || "Untitled"}” (simulated)`); }} className="space-y-3">
            <label htmlFor="dlg-name" className="block text-sm font-bold">Project name
              <input id="dlg-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 dark:border-white/15 dark:bg-transparent" /></label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => close("Rename dismissed")} className="h-10 rounded-xl px-4 text-sm font-bold text-slate-500">Cancel</button>
              <button type="submit" className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">Save name</button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}
