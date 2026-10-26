import React from "react";
import { cx } from "../lib/core";

export function Badge({ children, tone = "slate", className }: { children: React.ReactNode; tone?: "slate"|"violet"|"emerald"|"amber"|"rose"|"sky"|"pink"; className?: string }) {
  const tones: Record<string,string> = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10",
    violet: "bg-violet-100 text-violet-800 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-200 dark:ring-violet-400/20",
    emerald: "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/20",
    amber: "bg-amber-100 text-amber-900 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-400/20",
    rose: "bg-rose-100 text-rose-800 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-200 dark:ring-rose-400/20",
    sky: "bg-sky-100 text-sky-800 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-400/20",
    pink: "bg-pink-100 text-pink-800 ring-pink-200 dark:bg-pink-500/15 dark:text-pink-200 dark:ring-pink-400/20",
  };
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1", tones[tone], className)}>{children}</span>;
}

export function Btn({ children, variant = "primary", size = "md", className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"secondary"|"ghost"|"danger"|"outline"; size?: "sm"|"md"|"lg" }) {
  const v: Record<string,string> = {
    primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-600/20 disabled:opacity-50",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 disabled:opacity-50",
    ghost: "hover:bg-slate-100 text-slate-700 dark:text-slate-200 dark:hover:bg-white/10",
    danger: "bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50",
    outline: "border border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:border-white/15 dark:hover:bg-white/5 text-slate-800 dark:text-slate-100",
  };
  const s = { sm: "h-8 px-3 text-[13px] rounded-lg", md: "h-10 px-4 text-sm rounded-xl", lg: "h-12 px-6 text-[15px] rounded-xl" };
  return <button className={cx("inline-flex items-center justify-center gap-2 font-semibold transition active:scale-[.98] disabled:cursor-not-allowed disabled:active:scale-100", v[variant], s[size], className)} {...rest}>{children}</button>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,.05)] dark:border-white/10 dark:bg-white/[.04]", className)}>{children}</div>;
}

export function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: string; error?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      {error && <p role="alert" className="text-xs font-medium text-rose-600 dark:text-rose-300">{error}</p>}
    </div>
  );
}

export const inputCls = (err?: string) =>
  cx(
    "h-10 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 dark:bg-white/5 dark:text-slate-100",
    err ? "border-rose-400 ring-2 ring-rose-100 dark:ring-rose-500/20" : "border-slate-300 dark:border-white/15 focus:border-violet-500"
  );

export function SectionHead({ kicker, title, desc, right }: { kicker: string; title: string; desc: string; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-cyan-300">{kicker}</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{desc}</p>
      </div>
      {right}
    </div>
  );
}

export function Empty({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-white/15">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl dark:bg-white/10">🗂️</div>
      <p className="mt-3 font-bold text-slate-800 dark:text-slate-100">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Kpi({ label, value, delta, spark, tone }: { label: string; value: string; delta: string; spark: number[]; tone: string }) {
  const pts = spark.map((v, i) => `${(i / (spark.length - 1)) * 100},${28 - (v / Math.max(...spark)) * 24}`).join(" ");
  return (
    <Card className="p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">{value}</p>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300">{delta}</span>
      </div>
      <svg viewBox="0 0 100 30" className="mt-2 h-8 w-full" aria-hidden>
        <polyline points={pts} fill="none" stroke={tone} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Card>
  );
}

export function ToastStack({ toasts }: { toasts: { id: number; title: string; desc?: string; tone: string }[] }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[90] flex w-[min(320px,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: t.tone }} />
            <p className="text-sm font-bold text-slate-900 dark:text-white">{t.title}</p>
          </div>
          {t.desc && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.desc}</p>}
        </div>
      ))}
    </div>
  );
}

export function useToasts() {
  const [toasts, setToasts] = React.useState<{ id: number; title: string; desc?: string; tone: string }[]>([]);
  const push = (title: string, desc?: string, tone = "#7c3aed") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p.slice(-3), { id, title, desc, tone }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3800);
  };
  return { toasts, push, Toast: <ToastStack toasts={toasts} /> };
}
