import React from "react";

// Accessible lightweight SVG charts (deterministic, no deps)
export function LineChart({ data, height = 180, color = "#7c3aed", label }: { data: number[]; height?: number; color?: string; label: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const W = 600, H = 200, P = 18;
  const X = (i: number) => P + (i / (data.length - 1)) * (W - P * 2);
  const Y = (v: number) => H - P - ((v - min) / (max - min || 1)) * (H - P * 2);
  const d = data.map((v, i) => `${i === 0 ? "M" : "L"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  const area = `${d} L${X(data.length - 1).toFixed(1)},${H - P} L${X(0).toFixed(1)},${H - P} Z`;
  const [hover, setHover] = React.useState<number | null>(null);
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} role="img" aria-label={label}
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const idx = Math.round(((e.clientX - r.left) / r.width) * (data.length - 1));
          setHover(Math.max(0, Math.min(data.length - 1, idx)));
        }} onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity=".28" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={P} x2={W - P} y1={H * f} y2={H * f} stroke="currentColor" strokeOpacity=".1" strokeDasharray="4 4" />
        ))}
        <path d={area} fill="url(#lg)" />
        <path d={d} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        {data.map((v, i) => (
          <circle key={i} cx={X(i)} cy={Y(v)} r={hover === i ? 5 : 2.6} fill={hover === i ? color : "#fff"} stroke={color} strokeWidth="2" />
        ))}
        {hover !== null && (
          <g className="chart-tip">
            <rect x={Math.min(Math.max(X(hover) - 44, 4), W - 92)} y={6} width={88} height={30} rx={8} fill="#0f172a" />
            <text x={Math.min(Math.max(X(hover), 48), W - 48)} y={25} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={700}>{data[hover].toLocaleString()}</text>
          </g>
        )}
      </svg>
      <figcaption className="sr-only">{label}. Values: {data.join(", ")}</figcaption>
    </figure>
  );
}

export function Bars({ data, labels, color = "#06b6d4", label }: { data: number[]; labels: string[]; color?: string; label: string }) {
  const max = Math.max(...data, 1);
  const [sel, setSel] = React.useState<number | null>(null);
  return (
    <figure role="img" aria-label={label}>
      <div className="flex h-44 items-end gap-2">
        {data.map((v, i) => (
          <button key={i} onClick={() => setSel(sel === i ? null : i)} aria-pressed={sel === i}
            aria-label={`${labels[i]}: ${v}`}
            className="group flex flex-1 flex-col items-center gap-1 rounded-t-lg outline-none"
            style={{ height: "100%", justifyContent: "flex-end" }}>
            <span className="text-[11px] font-bold tabular-nums text-slate-600 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 dark:text-slate-300">{v.toLocaleString()}</span>
            <span className="w-full rounded-t-lg transition-all" style={{ height: `${(v / max) * 78}%`, background: sel === i ? "#7c3aed" : color, opacity: sel === null || sel === i ? 1 : 0.4, minHeight: 8 }} />
            <span className="truncate text-[10px] font-semibold text-slate-500 dark:text-slate-400" style={{ maxWidth: 56 }}>{labels[i]}</span>
          </button>
        ))}
      </div>
      {sel !== null && <p className="mt-2 text-xs text-slate-500">Selected <b>{labels[sel]}</b> — {data[sel].toLocaleString()} (click again to clear)</p>}
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}

export function Donut({ parts, label }: { parts: { name: string; value: number; color: string }[]; label: string }) {
  const total = parts.reduce((a, p) => a + p.value, 0);
  let acc = 0;
  const R = 54, C = 2 * Math.PI * R;
  return (
    <figure className="flex items-center gap-4" role="img" aria-label={label}>
      <svg viewBox="0 0 140 140" className="h-32 w-32 -rotate-90" aria-hidden>
        <circle cx="70" cy="70" r={R} fill="none" strokeWidth="18" stroke="currentColor" className="text-slate-100 dark:text-white/10" />
        {parts.map((p) => {
          const frac = p.value / total;
          const dash = `${frac * C} ${C}`;
          const off = -(acc / total) * C;
          acc += p.value;
          return <circle key={p.name} cx="70" cy="70" r={R} fill="none" stroke={p.color} strokeWidth="18" strokeDasharray={dash} strokeDashoffset={off} strokeLinecap="butt" />;
        })}
        <text x="70" y="70" textAnchor="middle" dominantBaseline="central" fontSize={18} fontWeight={800} fill="currentColor" className="rotate-90" transform="rotate(90 70 70)">100%</text>
      </svg>
      <ul className="space-y-1.5 text-xs">
        {parts.map((p) => (
          <li key={p.name} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: p.color }} />
            <span className="font-semibold">{p.name}</span>
            <span className="tabular-nums opacity-70">{Math.round((p.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
      <figcaption className="sr-only">{label}: {parts.map((p) => `${p.name} ${Math.round((p.value / total) * 100)} percent`).join(", ")}</figcaption>
    </figure>
  );
}

export function DistBars({ train, serve, colorA = "#7c3aed", colorB = "#06b6d4" }: { train: number[]; serve: number[]; colorA?: string; colorB?: string }) {
  const max = Math.max(...train, ...serve);
  return (
    <div className="space-y-1.5" aria-hidden={false}>
      {train.map((t, i) => (
        <div key={i} className="grid grid-cols-[52px_1fr_1fr] items-center gap-2 text-[11px]">
          <span className="font-mono text-slate-500">bin {i + 1}</span>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div className="h-full rounded-full" style={{ width: `${(t / max) * 100}%`, background: colorA }} />
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div className="h-full rounded-full" style={{ width: `${((serve[i] ?? 0) / max) * 100}%`, background: colorB }} />
          </div>
        </div>
      ))}
    </div>
  );
}
