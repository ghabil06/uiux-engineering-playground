/**
 * PRISM component foundation — Phase 1.
 *
 * Typed, accessible primitives shared by the shell, explorer and all demos.
 * Conventions:
 *  - Every interactive element has an accessible name (children, aria-label or aria-labelledby).
 *  - Keyboard: natively focusable elements only; roving tabindex documented where used (Tabs).
 *  - Focus: global 2px `:focus-visible` ring from index.css — never remove it.
 *  - Responsive: fluid width, min 44px touch targets for primary actions, no fixed pixel layouts.
 *  - Theming: semantic Tailwind pairs only (`slate-*` + `dark:*`), no hardcoded hex.
 */
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cx } from "../lib/core";

/* ── Layout ─────────────────────────────────────────────── */

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-[1400px] px-4", className)}>{children}</div>;
}

export function PageHeading({ kicker, title, desc }: { kicker: string; title: string; desc: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-cyan-300">{kicker}</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{desc}</p>
    </div>
  );
}

/* ── Buttons ────────────────────────────────────────────── */

/** Square icon-only button. `label` is required — icon buttons must always be named. */
export function IconButton({
  label, children, className, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} {...rest}
      className={cx("inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5", className)}>
      {children}
    </button>
  );
}

/* ── Form controls ──────────────────────────────────────── */

export function Select({
  label, options, value, onChange, id,
}: {
  label: string; options: readonly string[]; value: string;
  onChange: (v: string) => void; id?: string;
}) {
  const autoId = React.useId();
  const selectId = id ?? autoId;
  return (
    <span className="inline-flex items-center gap-2">
      <label htmlFor={selectId} className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">{label}</label>
      <span className="relative inline-flex">
        <select id={selectId} value={value} onChange={(e) => onChange(e.target.value)}
          className="h-10 appearance-none rounded-xl border border-slate-300 bg-transparent pl-3 pr-9 text-sm font-semibold dark:border-white/15">
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={15} aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
      </span>
    </span>
  );
}

export function Checkbox({
  label, checked, onChange, hint,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-sm font-semibold">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-violet-600" aria-describedby={hint ? `${label}-hint` : undefined} />
      <span>{label}{hint && <span id={`${label}-hint`} className="block text-xs font-normal text-slate-500">{hint}</span>}</span>
    </label>
  );
}

/**
 * Toggle switch. Keyboard: Space/Enter via native button; state exposed with
 * `role="switch"` + `aria-checked`. Never communicate state by color alone —
 * the knob position + label carry meaning.
 */
export function Switch({
  label, checked, onChange, hint,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string;
}) {
  return (
    <span className="inline-flex items-center gap-3">
      <button type="button" role="switch" aria-checked={checked} aria-label={label}
        onClick={() => onChange(!checked)}
        className={cx("h-8 min-w-[56px] rounded-full p-1 transition", checked ? "bg-violet-600" : "bg-slate-300 dark:bg-white/20")}>
        <span className={cx("block h-6 w-6 rounded-full bg-white shadow transition-transform", checked && "translate-x-6")} />
      </button>
      <span className="text-sm font-semibold">{label}{hint && <span className="block text-xs font-normal text-slate-500">{hint}</span>}</span>
    </span>
  );
}

/* ── Navigation ─────────────────────────────────────────── */

/** Breadcrumb trail. Collapses to Home + current page on narrow viewports. */
export function Breadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-xs">
        {trail.map((t, i) => {
          const last = i === trail.length - 1;
          const hideMiddle = trail.length > 2 && i > 0 && !last;
          return (
            <li key={t.label} className={cx("flex items-center gap-1.5", hideMiddle && "hidden sm:flex")}>
              {i > 0 && <ChevronRight size={12} aria-hidden className="shrink-0 text-slate-300" />}
              {last || !t.href
                ? <span aria-current={last ? "page" : undefined} className={last ? "font-bold text-slate-800 dark:text-white" : "text-slate-500"}>{t.label}</span>
                : <a href={t.href} className="font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">{t.label}</a>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Tabs. Keyboard: ArrowLeft/ArrowRight move between tabs (roving tabindex),
 * Home/End jump. Panels must carry `role="tabpanel"`.
 */
export function Tabs({
  tabs, active, onChange, label,
}: {
  tabs: string[]; active: number; onChange: (i: number) => void; label: string;
}) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const keyDown = (e: React.KeyboardEvent, i: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next !== null) { e.preventDefault(); onChange(next); refs.current[next]?.focus(); }
  };
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 no-scrollbar dark:border-white/10 dark:bg-white/[.03]">
      {tabs.map((t, i) => (
        <button key={t} role="tab" aria-selected={active === i} tabIndex={active === i ? 0 : -1}
          ref={(el) => { refs.current[i] = el; }}
          onClick={() => onChange(i)} onKeyDown={(e) => keyDown(e, i)}
          className={cx("shrink-0 rounded-xl px-4 py-2 text-[13px] font-bold", active === i ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5")}>
          {t}
        </button>
      ))}
    </div>
  );
}

/**
 * Dropdown menu. Keyboard: Enter/Space opens, Esc closes and refocuses the
 * trigger, ArrowDown/ArrowUp move between items. Closes on outside click.
 */
export function Dropdown({
  label, items,
}: {
  label: string; items: { label: string; onSelect: () => void; danger?: boolean }[];
}) {
  const [open, setOpen] = React.useState(false);
  const [hi, setHi] = React.useState(0);
  const root = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const outside = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    // Escape works from anywhere while open (focus often stays on the trigger
    // after mouse-open) and returns focus to the trigger.
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        root.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", esc);
    };
  }, [open ]);

  return (
    <div ref={root} className="relative inline-block">
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => { setOpen(!open); setHi(0); }}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-300 px-3 text-sm font-bold dark:border-white/15">
        {label}<ChevronDown size={14} aria-hidden className={cx("transition", open && "rotate-180")} />
      </button>
      {open && (
        <ul role="menu" aria-label={label}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setOpen(false); }
            if (e.key === "ArrowDown") { e.preventDefault(); setHi((hi + 1) % items.length); }
            if (e.key === "ArrowUp") { e.preventDefault(); setHi((hi - 1 + items.length) % items.length); }
            if (e.key === "Enter") { items[hi]?.onSelect(); setOpen(false); }
          }}
          className="absolute left-0 top-11 z-50 min-w-[180px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-2xl dark:border-white/10 dark:bg-slate-900">
          {items.map((it, i) => (
            <li key={it.label} role="none">
              <button role="menuitem" onMouseEnter={() => setHi(i)}
                onClick={() => { it.onSelect(); setOpen(false); }}
                className={cx("flex w-full items-center px-4 py-2.5 text-left text-sm font-semibold", hi === i && "bg-violet-600 text-white", it.danger && hi !== i && "text-rose-600")}>
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Feedback ───────────────────────────────────────────── */

/**
 * Modal dialog. Requirements honored by every consumer: `role="dialog"` +
 * `aria-modal`, labelled by title, Esc closes, backdrop click cancels,
 * initial focus moves inside. Use `AlertDialog` semantics (role="alertdialog")
 * for destructive confirmations.
 */
export function Dialog({
  title, desc, onClose, children, danger,
}: {
  title: string; desc?: string; onClose: () => void; children: React.ReactNode; danger?: boolean;
}) {
  const closeRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    closeRef.current?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose ]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role={danger ? "alertdialog" : "dialog"}
      aria-modal="true" aria-label={title} aria-describedby={desc ? "dlg-desc" : undefined}>
      <div className="absolute inset-0 bg-black/45" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-black">{title}</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close dialog"
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/10">✕</button>
        </div>
        {desc && <p id="dlg-desc" className="mt-1 text-sm text-slate-500">{desc}</p>}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

/** Inline status message. `tone="danger"` uses role="alert" (immediate), else role="status" (polite). */
export function Alert({
  tone, title, children,
}: {
  tone: "success" | "warning" | "danger" | "info"; title: string; children?: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100",
    warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100",
    danger: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-100",
    info: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-100",
  };
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cx("rounded-2xl border p-3.5 text-sm", styles[tone])}>
      <p className="font-extrabold">{title}</p>
      {children && <div className="mt-1 leading-relaxed opacity-90">{children}</div>}
    </div>
  );
}

/** Content-shaped loading placeholder. Always pair with `aria-busy` on the region. */
export function Skeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cx("space-y-2", className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10"
          style={{ width: `${[92, 78, 86, 64][i % 4]}%` }} />
      ))}
    </div>
  );
}

/** Failed-load state with retry. `onRetry` is required — errors must offer recovery. */
export function ErrorState({ title, desc, onRetry }: { title: string; desc: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-rose-200 bg-rose-50/50 px-6 py-10 text-center dark:border-rose-400/20 dark:bg-rose-500/5">
      <span aria-hidden className="text-3xl">⚠️</span>
      <p className="mt-2 font-extrabold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{desc}</p>
      <button onClick={onRetry} className="mt-4 h-10 rounded-xl bg-rose-600 px-5 text-sm font-bold text-white hover:bg-rose-700">
        Try again
      </button>
    </div>
  );
}
