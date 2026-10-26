/** Device preview — presets + custom sizes around a live interactive sample. */
import React from "react";
import { VIEWPORTS, type Viewport } from "./data";
import { Card } from "../components/ui";
import { cx } from "../lib/core";

const CUSTOM_VP: Viewport = { label: "Custom", w: 0, h: 0, note: "" };

function SizeInput({ id, label, value, max, onPick }: {
  id: string; label: string; value: number; max: number; onPick: (n: number) => void;
}) {
  return (
    <span className="flex items-center gap-1">
      <label className="sr-only" htmlFor={id}>{label}</label>
      <input
        id={id} type="number" min={280} max={max} value={value}
        onChange={(e) => onPick(Number(e.target.value) || 280)}
        className="h-9 w-20 rounded-lg border border-slate-300 px-2 tabular-nums dark:border-white/15 dark:bg-transparent"
      />
    </span>
  );
}

function SamplePage({ w }: { w: number }) {
  const [tab, setTab] = React.useState("Today");
  const [done, setDone] = React.useState<string[]>([]);
  const tasks = ["Review queue", "Approve invoices", "Export report"];
  return (
    <div className="flex h-full flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-slate-200 px-3 dark:border-white/10">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600 text-[11px] font-black text-white">A</span>
        <b className="text-[13px]">Acme</b>
        {w >= 560 ? (
          <nav className="ml-2 flex gap-1" aria-label="Sample">
            {["Today", "Week", "Reports"].map((t) => (
              <button key={t} onClick={() => setTab(t)} aria-pressed={tab === t}
                className={cx("rounded-lg px-2.5 py-1 text-xs font-bold", tab === t ? "bg-slate-900 text-white" : "text-slate-500")}>{t}</button>
            ))}
          </nav>
        ) : (
          <span className="ml-auto text-[11px] font-bold text-slate-400">{tab} ▾</span>
        )}
      </div>
      <div className={cx("grid flex-1 gap-2 overflow-auto p-3", w >= 900 ? "grid-cols-3" : w >= 560 ? "grid-cols-2" : "grid-cols-1")}>
        {tasks.map((t) => {
          const on = done.includes(t);
          return (
            <button key={t} onClick={() => setDone(on ? done.filter((x) => x !== t) : [...done, t])} aria-pressed={on}
              className={cx("rounded-2xl border p-3 text-left text-[13px] font-bold", on ? "border-emerald-400 bg-emerald-50" : "border-slate-200 dark:border-white/10")}>
              {on ? "✓ " : "○ "}{t}
              <span className="block text-[11px] font-normal text-slate-400">{tab} view · interactive at any size</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DevicePreview() {
  const [vp, setVp] = React.useState<Viewport>(VIEWPORTS[0]);
  const [custom, setCustom] = React.useState({ w: 360, h: 640 });

  const dims = vp.label === "Custom" ? custom : { w: vp.w, h: vp.h };

  return (
    <div className="space-y-3">
      <Card className="flex flex-wrap items-center gap-2 p-4">
        {VIEWPORTS.map((v) => (
          <button key={v.label} onClick={() => setVp(v)} aria-pressed={vp.label === v.label} title={v.note}
            className={cx("h-9 rounded-xl px-3 text-[13px] font-bold", vp.label === v.label ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10")}>
            {v.label}
          </button>
        ))}
        <span className="flex items-center gap-1.5 text-xs font-bold">
          Custom
          <SizeInput id="dv-w" label="Custom width" value={custom.w} max={1600}
            onPick={(n) => { setCustom({ ...custom, w: n }); setVp(CUSTOM_VP); }} />
          <span aria-hidden>×</span>
          <SizeInput id="dv-h" label="Custom height" value={custom.h} max={1200}
            onPick={(n) => { setCustom({ ...custom, h: n }); setVp(CUSTOM_VP); }} />
        </span>
        <button onClick={() => setVp(VIEWPORTS[0])} className="h-9 rounded-xl border border-slate-300 px-3 text-xs font-bold dark:border-white/15">↺ Reset 360×640</button>
        <span role="status" className="ml-auto font-mono text-xs font-bold">viewport: {dims.w} × {dims.h}px</span>
      </Card>
      <p className="text-xs text-slate-500">{vp.label !== "Custom" ? vp.note : "Custom size — type any width/height."} Framed simulation: real responsive CSS, interactive content — not device emulation (no device pixels, UA or touch simulation claimed).</p>
      <div className="overflow-auto rounded-3xl bg-slate-100/70 p-4 dark:bg-white/[.02]">
        <div className="mx-auto overflow-hidden rounded-[2rem] border-[10px] border-slate-900 shadow-2xl transition-all dark:border-black"
          style={{ width: Math.min(dims.w + 20, 1200), maxWidth: "100%" }}>
          <div className="overflow-auto bg-white dark:bg-slate-950" style={{ height: Math.min(Math.max(dims.h, 280), 700) }}>
            <SamplePage w={dims.w} />
          </div>
        </div>
        <p className="mt-2 text-center font-mono text-[11px] text-slate-400">frame shows {dims.w}×{dims.h} of live layout (frame capped for page usability)</p>
      </div>
    </div>
  );
}
