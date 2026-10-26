/** Contrast calculator — validated hex, correct luminance math, AA verdicts. */
import React from "react";
import { CONTRAST_PRESETS, isValidHex, normalizeHex, TOPICS } from "./data";
import { contrastRatio } from "../lib/core";
import { Card, Badge } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { cx } from "../lib/core";

export function verdict(ratio: number): { aa: boolean; aaLarge: boolean; nontext: boolean } {
  return { aa: ratio >= 4.5, aaLarge: ratio >= 3, nontext: ratio >= 3 };
}

export default function ContrastDemo() {
  const t = TOPICS.find((x) => x.slug === "color-contrast")!;
  const [fg, setFg] = React.useState("#0f172a");
  const [bg, setBg] = React.useState("#ffffff");
  const fgOk = isValidHex(fg);
  const bgOk = isValidHex(bg);
  const ratio = fgOk && bgOk ? contrastRatio(normalizeHex(fg), normalizeHex(bg)) : null;
  const v = ratio === null ? null : verdict(ratio);

  const row = (label: string, pass: boolean, need: string) => (
    <li className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold" style={{ background: pass ? "#ecfdf533" : "#fef2f233" }}>
      <span aria-hidden>{pass ? "✓" : "✕"}</span>
      <span className="flex-1">{label} <span className="font-normal opacity-70">(needs {need})</span></span>
      <Badge tone={pass ? "emerald" : "rose"}>{pass ? "Pass" : "Fail"}</Badge>
    </li>
  );

  return (
    <div className="space-y-4">
      <PatternDoc purpose={t.desc} useCases="Text, icons, borders, focus rings, charts — in both themes."
        states="Valid pair with verdicts; invalid input with named errors; presets; reset."
        a11y={"WCAG " + t.wcag.join(", ") + ". Contrast is necessary but not sufficient — semantics and behavior still apply."} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3 p-5">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-bold">Foreground hex
              <span className="mt-1 flex items-center gap-2">
                <input type="color" value={fgOk ? normalizeHex(fg) : "#000000"} onChange={(e) => setFg(e.target.value)} aria-label="Foreground color picker" className="h-10 w-12 cursor-pointer rounded-lg border border-slate-300" />
                <input value={fg} onChange={(e) => setFg(e.target.value)} aria-label="Foreground hex value" spellCheck={false}
                  aria-invalid={!fgOk} placeholder="#0f172a" className={cx("h-10 min-w-0 flex-1 rounded-xl border px-2 font-mono text-sm", fgOk ? "border-slate-300 dark:border-white/15" : "border-rose-400 ring-2 ring-rose-100")} />
              </span>
              {!fgOk && <span role="alert" className="mt-1 block font-normal text-rose-600">Use 3 or 6 hex digits, e.g. #475 or #475569.</span>}
            </label>
            <label className="text-xs font-bold">Background hex
              <span className="mt-1 flex items-center gap-2">
                <input type="color" value={bgOk ? normalizeHex(bg) : "#ffffff"} onChange={(e) => setBg(e.target.value)} aria-label="Background color picker" className="h-10 w-12 cursor-pointer rounded-lg border border-slate-300" />
                <input value={bg} onChange={(e) => setBg(e.target.value)} aria-label="Background hex value" spellCheck={false}
                  aria-invalid={!bgOk} placeholder="#ffffff" className={cx("h-10 min-w-0 flex-1 rounded-xl border px-2 font-mono text-sm", bgOk ? "border-slate-300 dark:border-white/15" : "border-rose-400 ring-2 ring-rose-100")} />
              </span>
              {!bgOk && <span role="alert" className="mt-1 block font-normal text-rose-600">Use 3 or 6 hex digits, e.g. #fff or #ffffff.</span>}
            </label>
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Preset pairs">
            {CONTRAST_PRESETS.map((p) => (
              <button key={p.label} onClick={() => { setFg(p.fg); setBg(p.bg); }}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold hover:bg-slate-200 dark:bg-white/10">{p.label}</button>
            ))}
            <button onClick={() => { setFg("#0f172a"); setBg("#ffffff"); }} className="rounded-full px-3 py-1.5 text-xs font-bold text-violet-600 underline">↺ Reset</button>
          </div>
          {ratio !== null ? (
            <>
              <p className="text-center"><span className="text-5xl font-black tabular-nums">{ratio.toFixed(2)}</span><span className="text-xl text-slate-400">:1</span></p>
              <ul className="space-y-1.5" aria-live="polite">
                {row("Normal text", v!.aa, "4.5:1")}
                {row("Large text (≥24px, or 19px bold)", v!.aaLarge, "3:1")}
                {row("Non-text UI (icons, borders, focus)", v!.nontext, "3:1")}
              </ul>
            </>
          ) : (
            <p role="status" className="rounded-2xl bg-slate-100 p-4 text-center text-sm font-semibold text-slate-500">Fix the highlighted hex input to compute the ratio.</p>
          )}
        </Card>
        <Card className="space-y-3 p-5">
          <b>Live preview <span className="font-normal text-slate-400">(your exact pair)</span></b>
          <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10" style={{ background: bgOk ? normalizeHex(bg) : "#fff", color: fgOk ? normalizeHex(fg) : "#000" }}>
            <p className="text-[15px]">Body copy at 15px — the quick brown fox jumps over the lazy dog.</p>
            <p className="mt-2 text-2xl font-bold">Large headline at 24px</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-bold"><span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-lg border-2" style={{ borderColor: fgOk ? normalizeHex(fg) : "#000" }}>✓</span> Icon + border sample (non-text)</p>
          </div>
          <ul className="space-y-1.5 text-[13px] text-slate-600 dark:text-slate-300">
            <li>· <b>Text vs non-text:</b> letters need 4.5:1; the icon/border beside them needs 3:1 against adjacent colors.</li>
            <li>· <b>Large text</b> earns the 3:1 bar because stroke width carries legibility.</li>
            <li>· Not everything is rated identically (disabled controls, logos, pure decoration are exempt) — and passing contrast never excuses missing labels or keyboard support.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
