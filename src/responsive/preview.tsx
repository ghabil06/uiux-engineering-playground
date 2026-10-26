/**
 * Responsive preview primitive — a genuinely resizable pane.
 * usePreviewWidth measures the pane with ResizeObserver (falls back to the
 * slider value before measurement); children render from the measured width,
 * so real conditional layout behavior is exercised, not screenshotted.
 */
import React from "react";

export function usePreviewWidth(defaultW = 768): { ref: React.RefObject<HTMLDivElement | null>; measured: number | null; width: number } {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [measured, setMeasured] = React.useState<number | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setMeasured(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, measured, width: measured ?? defaultW };
}

export function PreviewShell({
  width, onWidth, min = 280, max, children, label,
}: {
  width: number; onWidth: (w: number) => void; min?: number; max?: number;
  children: (innerWidth: number) => React.ReactNode; label: string;
}) {
  const { ref, measured } = usePreviewWidth(width);
  const inner = measured ?? width;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex min-w-0 flex-1 items-center gap-2 text-xs font-bold">
          {label}
          <input type="range" min={min} max={max ?? 1100} value={Math.min(width, max ?? 1100)} onChange={(e) => onWidth(Number(e.target.value))}
            className="min-w-0 flex-1 accent-violet-600" aria-label={`${label} width in pixels`} />
        </label>
        <span role="status" className="rounded-lg bg-slate-900 px-2.5 py-1 font-mono text-xs font-bold text-white dark:bg-white dark:text-slate-900">
          {inner}px {measured === null ? "(target)" : "(measured)"}
        </span>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-slate-100/70 p-3 dark:bg-white/[.02]">
        <div ref={ref} style={{ width: Math.min(width, max ?? width), maxWidth: "100%" }}
          className="mx-auto overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm transition-[width] dark:border-white/15 dark:bg-slate-950">
          {children(inner)}
        </div>
      </div>
    </div>
  );
}
