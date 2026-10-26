/**
 * Pattern-lab shared primitives — built on foundation tokens, no duplication.
 * SearchInput, Chip, Pagination, Progress and Tooltip are used across
 * the per-pattern demos with identical contracts.
 */
import React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cx } from "../lib/core";

/* ── Search input with clear ───────────────────────────── */

export function SearchInput({
  value, onChange, label = "Search", placeholder = "Search…", hint,
}: {
  value: string; onChange: (v: string) => void; label?: string; placeholder?: string; hint?: string;
}) {
  const id = React.useId();
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">{label}</label>
      <div className="relative">
        <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          role="searchbox" aria-label={label}
          className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-9 text-sm outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-white/15 dark:bg-white/5" />
        {value && (
          <button onClick={() => onChange("")} aria-label={`Clear ${label.toLowerCase()}`}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10">
            <X size={14} />
          </button>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/* ── Removable filter chip ─────────────────────────────── */

export function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 py-1 pl-3 pr-1.5 text-xs font-bold text-violet-900 dark:bg-violet-500/15 dark:text-violet-100">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`}
        className="rounded-full p-0.5 hover:bg-violet-200 dark:hover:bg-white/10">
        <X size={12} />
      </button>
    </span>
  );
}

/* ── Pagination ────────────────────────────────────────── */

export function Pagination({
  page, pages, total, perPage, onPage, onPerPage, perPageOptions = [5, 8, 12],
}: {
  page: number; pages: number; total: number; perPage: number;
  onPage: (p: number) => void; onPerPage?: (n: number) => void; perPageOptions?: number[];
}) {
  const numbers = React.useMemo(() => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const set = new Set([1, 2, page - 1, page, page + 1, pages - 1, pages].filter((n) => n >= 1 && n <= pages));
    const sorted = [...set].sort((a, b) => a - b);
    const out: (number | "…")[] = [];
    sorted.forEach((n, i) => {
      if (i > 0 && n - (sorted[i - 1] as number) > 1) out.push("…");
      out.push(n);
    });
    return out;
  }, [page, pages]);

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center gap-2 text-sm">
      <p className="text-xs text-slate-500" role="status">
        Page <b>{page}</b> of <b>{pages}</b> · <b>{total}</b> result{total === 1 ? "" : "s"}
      </p>
      {onPerPage && (
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          Per page
          <select value={perPage} onChange={(e) => onPerPage(Number(e.target.value))}
            className="h-8 rounded-lg border border-slate-300 bg-transparent px-1.5 dark:border-white/15">
            {perPageOptions.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      )}
      <span className="ml-auto flex items-center gap-1">
        <button onClick={() => onPage(page - 1)} disabled={page <= 1} aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-35 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">
          <ChevronLeft size={15} />
        </button>
        {numbers.map((n, i) =>
          n === "…" ? (
            <span key={`e${i}`} aria-hidden className="px-1 text-slate-400">…</span>
          ) : (
            <button key={n} onClick={() => onPage(n)} aria-label={`Page ${n}`} aria-current={n === page ? "page" : undefined}
              className={cx("h-8 min-w-8 rounded-lg px-1.5 text-[13px] font-bold", n === page ? "bg-violet-600 text-white" : "hover:bg-slate-100 dark:hover:bg-white/10")}>
              {n}
            </button>
          ),
        )}
        <button onClick={() => onPage(page + 1)} disabled={page >= pages} aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-35 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">
          <ChevronRight size={15} />
        </button>
      </span>
    </nav>
  );
}

/* ── Progress ──────────────────────────────────────────── */

export function Progress({
  value, max = 100, label, tone = "bg-violet-600",
}: {
  value: number | null; max?: number; label: string; tone?: string;
}) {
  if (value === null) {
    return (
      <div role="progressbar" aria-label={label} className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-violet-500" />
        <span className="sr-only">{label} — loading</span>
      </div>
    );
  }
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}
        className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <div className={cx("h-full rounded-full transition-all", tone)} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs tabular-nums text-slate-500" aria-hidden>{pct}%</p>
    </div>
  );
}

export function StepProgress({ steps, current, label }: { steps: string[]; current: number; label: string }) {
  return (
    <ol aria-label={label} className="flex items-center gap-1">
      {steps.map((s, i) => (
        <li key={s} className="flex flex-1 items-center gap-1.5" aria-current={i === current ? "step" : undefined}>
          <span className={cx("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black",
            i < current ? "bg-emerald-500 text-white" : i === current ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-500 dark:bg-white/10")}>
            {i < current ? "✓" : i + 1}
          </span>
          <span className={cx("hidden truncate text-xs font-bold sm:block", i === current ? "" : "text-slate-400")}>{s}</span>
          {i < steps.length - 1 && <span aria-hidden className={cx("h-0.5 flex-1 rounded", i < current ? "bg-emerald-400" : "bg-slate-200 dark:bg-white/10")} />}
        </li>
      ))}
    </ol>
  );
}

/* ── Pattern doc block ─────────────────────────────────── */

export function PatternDoc({ purpose, useCases, states, a11y }: { purpose: string; useCases: string; states: string; a11y: string }) {
  return (
    <details className="rounded-2xl border border-slate-200 bg-white text-sm dark:border-white/10 dark:bg-white/[.03]">
      <summary className="cursor-pointer rounded-2xl px-5 py-3 font-extrabold hover:bg-slate-50 dark:hover:bg-white/5">
        About this pattern — purpose, states & accessibility
      </summary>
      <dl className="space-y-2 border-t border-slate-100 px-5 py-4 text-[13px] leading-relaxed dark:border-white/10">
        <div><dt className="font-bold text-violet-700 dark:text-cyan-300">Purpose</dt><dd className="text-slate-600 dark:text-slate-300">{purpose}</dd></div>
        <div><dt className="font-bold text-violet-700 dark:text-cyan-300">Use it for</dt><dd className="text-slate-600 dark:text-slate-300">{useCases}</dd></div>
        <div><dt className="font-bold text-violet-700 dark:text-cyan-300">States handled</dt><dd className="text-slate-600 dark:text-slate-300">{states}</dd></div>
        <div><dt className="font-bold text-violet-700 dark:text-cyan-300">Accessibility</dt><dd className="text-slate-600 dark:text-slate-300">{a11y}</dd></div>
      </dl>
    </details>
  );
}

/* ── Tooltip ───────────────────────────────────────────── */

export function Tooltip({
  label, tip, side = "top", children,
}: {
  label: string; tip: string; side?: "top" | "bottom" | "left" | "right"; children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const pos =
    side === "top" ? "bottom-full left-1/2 mb-2 -translate-x-1/2" :
    side === "bottom" ? "left-1/2 top-full mt-2 -translate-x-1/2" :
    side === "left" ? "right-full top-1/2 mr-2 -translate-y-1/2" :
    "left-full top-1/2 ml-2 -translate-y-1/2";
  return (
    <span className="relative inline-flex"
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
      onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ "aria-describedby"?: string }>, { "aria-describedby": open ? id : undefined })
        : children}
      <span className="sr-only">{label}. </span>
      {open && (
        <span id={id} role="tooltip" className={cx("absolute z-50 w-52 rounded-xl bg-slate-900 p-2.5 text-xs leading-relaxed text-white shadow-xl dark:bg-white dark:text-slate-900", pos)}>
          {tip}
        </span>
      )}
    </span>
  );
}
