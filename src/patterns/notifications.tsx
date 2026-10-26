/** Notifications — polite toasts, sticky errors, progress notification, stacking cap. */
import React from "react";
import { Card } from "../components/ui";
import { Alert } from "../components/foundation";
import { PatternDoc, Progress } from "./primitives";
import { patternDef } from "./data";
import { CheckCircle2, Info, AlertTriangle, OctagonX, X } from "lucide-react";
import { cx } from "../lib/core";

type Tone = "success" | "info" | "warning" | "error";
interface Toast { id: number; tone: Tone; title: string; desc: string; sticky?: boolean; progress?: number }

const ICON: Record<Tone, React.ReactNode> = {
  success: <CheckCircle2 size={17} aria-hidden />, info: <Info size={17} aria-hidden />,
  warning: <AlertTriangle size={17} aria-hidden />, error: <OctagonX size={17} aria-hidden />,
};
const BAR: Record<Tone, string> = {
  success: "border-emerald-200 dark:border-emerald-400/20", info: "border-sky-200 dark:border-sky-400/20",
  warning: "border-amber-200 dark:border-amber-400/20", error: "border-rose-300 dark:border-rose-400/30",
};

export default function NotificationsDemo() {
  const def = patternDef("notifications");
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [banner, setBanner] = React.useState(true);
  const idRef = React.useRef(0);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const fire = (tone: Tone, title: string, desc: string, sticky = false) => {
    const id = ++idRef.current;
    // Cap: keep at most 4 — drop the oldest dismissible one first.
    setToasts((p) => [...p.filter((t) => t.sticky).slice(-3), ...p.filter((t) => !t.sticky).slice(-2), { id, tone, title, desc, sticky }].slice(-4));
    if (!sticky) timers.current.push(window.setTimeout(() => dismiss(id), 4500));
  };
  const dismiss = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));

  const startJob = () => {
    const id = ++idRef.current;
    setToasts((p) => [...p.slice(-3), { id, tone: "info", title: "Exporting 48 projects…", desc: "Determinate — driven by a real timer.", progress: 0 }]);
    const iv = window.setInterval(() => {
      setToasts((p) => p.map((t) => {
        if (t.id !== id || t.progress === undefined) return t;
        const next = t.progress + 12;
        if (next >= 100) {
          window.clearInterval(iv);
          window.setTimeout(() => dismiss(id), 2500);
          return { ...t, tone: "success" as Tone, title: "Export complete", desc: "48 rows ready (simulated download).", progress: 100 };
        }
        return { ...t, progress: next };
      }));
    }, 300);
  };

  const polite = toasts.filter((t) => t.tone !== "error");
  const assertive = toasts.filter((t) => t.tone === "error");

  return (
    <div className="space-y-4">
      <PatternDoc purpose={def.desc} useCases={def.useCases}
        states="Four severities, inline + persistent alerts, determinate progress job, capped stack."
        a11y={def.keyboard + " Severity = icon + text + color; errors use an assertive region and never auto-dismiss."} />
      <Card className="flex flex-wrap gap-2 p-5">
        <button onClick={() => fire("success", "Workspace saved", "All changes stored locally.")} className="h-10 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white">✓ Success</button>
        <button onClick={() => fire("info", "Sync scheduled", "Runs every 15 minutes in this demo.")} className="h-10 rounded-xl bg-sky-600 px-4 text-sm font-bold text-white">ℹ Info</button>
        <button onClick={() => fire("warning", "Trial ends in 2 days", "Add billing to keep exports running.")} className="h-10 rounded-xl bg-amber-500 px-4 text-sm font-bold text-white">⚠ Warning</button>
        <button onClick={() => fire("error", "Export failed: quota reached", "Nothing was lost. Free space or retry — this stays until dismissed.", true)} className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-bold text-white">✕ Error (sticky)</button>
        <button onClick={startJob} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">⬇ Progress job</button>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Alert tone="info" title="Heads up — plan usage at 82%">
          Exports slow down past 90% in this (fictional) plan. Upgrade or archive old projects.
        </Alert>
        {banner && (
          <div role="alert" className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-sm dark:border-amber-400/20 dark:bg-amber-500/10">
            <AlertTriangle size={17} aria-hidden className="mt-0.5 shrink-0" />
            <span><b>Persistent:</b> 2 invites expire today. This banner stays until you act.
              <span className="mt-1 flex gap-2">
                <button onClick={() => setBanner(false)} className="rounded-lg bg-amber-500 px-3 py-1 text-xs font-black text-white">Review invites</button>
                <button onClick={() => setBanner(false)} className="text-xs font-bold underline">Dismiss</button>
              </span>
            </span>
          </div>
        )}
      </div>

      <div aria-live="polite" aria-label="Notifications" className="space-y-2">
        {polite.map((t) => (
          <div key={t.id} className={cx("flex items-start gap-2.5 rounded-2xl border bg-white p-3.5 shadow-lg dark:bg-slate-900", BAR[t.tone])}>
            <span className="mt-0.5 shrink-0">{ICON[t.tone]}</span>
            <span className="min-w-0 flex-1"><b className="text-sm">{t.title}</b><span className="block text-[13px] text-slate-500">{t.desc}</span>
              {t.progress !== undefined && <span className="mt-2 block"><Progress value={t.progress} label={t.title} /></span>}</span>
            <button onClick={() => dismiss(t.id)} aria-label={`Dismiss: ${t.title}`} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/10"><X size={15} /></button>
          </div>
        ))}
      </div>
      <div aria-live="assertive" aria-label="Errors" className="space-y-2">
        {assertive.map((t) => (
          <div key={t.id} role="alert" className={cx("flex items-start gap-2.5 rounded-2xl border-2 bg-white p-3.5 shadow-lg dark:bg-slate-900", BAR[t.tone])}>
            <span className="mt-0.5 shrink-0 text-rose-600">{ICON[t.tone]}</span>
            <span className="min-w-0 flex-1"><b className="text-sm">{t.title} (stays until dismissed)</b><span className="block text-[13px] text-slate-500">{t.desc}</span></span>
            <button onClick={() => dismiss(t.id)} aria-label={`Dismiss: ${t.title}`} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-black text-white">Dismiss</button>
          </div>
        ))}
      </div>
      {toasts.length === 0 && <p className="text-sm text-slate-500">Quiet. Fire a notification above — errors persist, the rest auto-dismiss, the stack caps at four.</p>}
    </div>
  );
}
