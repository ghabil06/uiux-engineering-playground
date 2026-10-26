/** Responsive typography — clamp scales, measure, wrapping, zoom safety. */
import React from "react";
import { Card } from "../components/ui";
import { PreviewShell } from "./preview";

export default function TypographyDemo() {
  const [w, setW] = React.useState(560);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-2 p-5">
          <b>Fluid scale <span className="font-normal text-slate-400">(one rule, every viewport)</span></b>
          <p style={{ fontSize: "clamp(28px, 6vw, 56px)" }} className="font-black leading-none tracking-tight">Display type that never clips</p>
          <p className="font-mono text-[11px] text-violet-700 dark:text-cyan-300">font-size: clamp(28px, 6vw, 56px)</p>
          <p className="max-w-[65ch] text-[15px] leading-relaxed">Body capped at 65ch: line length stays readable from phone to ultrawide. Containers constrain; text never stretches edge to edge.</p>
        </Card>
        <Card className="space-y-2 p-5">
          <b>Hostile content, tamed</b>
          <p className="rounded-xl bg-slate-50 p-3 text-sm break-all dark:bg-white/5">
            https://example.com/reports/quarterly/final/FINAL-v3-actually-final.pdf
          </p>
          <p className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-white/5" lang="de">
            Donaudampfschifffahrtsgesellschaftskapitänsmützenfabrikabc — break-all and hyphens keep long tokens inside the column.
          </p>
          <p className="min-h-[88px] rounded-xl bg-slate-50 p-3 text-sm dark:bg-white/5">
            This box uses min-height, never fixed height — translated or zoomed text grows the box instead of clipping.
          </p>
          <p className="text-xs text-slate-500">Zoom to 200%: nothing clips, nothing overlaps — relative units throughout, browser zoom never disabled.</p>
        </Card>
      </div>
      <Card className="p-5">
        <b>Measure lab <span className="font-normal text-slate-400">(drag the width — watch the measure)</span></b>
        <PreviewShell width={w} onWidth={setW} min={280} max={900} label="Measure preview">
          {() => (
            <p className="max-w-[65ch] p-4 text-[15px] leading-relaxed">
              The quick brown fox jumps over the lazy dog near the riverbank at dusk. At narrow widths this
              paragraph is simply a taller column; at wide widths it stops at 65 characters while the panel keeps growing.
            </p>
          )}
        </PreviewShell>
      </Card>
    </div>
  );
}
