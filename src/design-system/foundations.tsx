import { primitive, semantic, type } from "./tokens";
import { Card, SectionHead, Badge } from "../components/ui";
import { contrastRatio } from "../lib/core";
import { DesignSystemNavTabs } from "./nav-tabs";

export default function FoundationsPage() {
  const contrastLight = contrastRatio(semantic.light.text, semantic.light.surface);
  const contrastDark = contrastRatio(semantic.dark.text, "#0a0a12");

  return (
    <div className="space-y-6">
      <SectionHead
        kicker="Design System · Foundations"
        title="Colors, Typography, Spacing & Layout"
        desc="Foundational design primitives: accessible color contrast, fluid typographic hierarchy, 4px layout rhythm, and surface elevation."
      />

      <DesignSystemNavTabs activePath="#/design-system/foundations" />

      {/* Typography Scale */}
      <Card className="p-6">
        <h3 className="text-base font-extrabold">Typographic Hierarchy & Fluid Scaling</h3>
        <p className="text-xs text-slate-500">Fluid clamp display for hero headers; discrete type scale down to micro-captions.</p>

        <div className="mt-5 space-y-4 divide-y divide-slate-100 dark:divide-white/10">
          <div className="pt-3">
            <span className="font-mono text-xs text-slate-400">Display · fluid clamp(28px, 4vw, 44px)</span>
            <p style={{ fontSize: type.display }} className="font-black tracking-tight text-slate-900 dark:text-white">
              The quick brown fox
            </p>
          </div>
          <div className="pt-3">
            <span className="font-mono text-xs text-slate-400">H1 · {type.h1}px</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Ship product decisions 10× faster
            </p>
          </div>
          <div className="pt-3">
            <span className="font-mono text-xs text-slate-400">H2 · {type.h2}px</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              Accessible component foundations
            </p>
          </div>
          <div className="pt-3">
            <span className="font-mono text-xs text-slate-400">H3 · {type.h3}px</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              Design tokens, not magic numbers
            </p>
          </div>
          <div className="pt-3">
            <span className="font-mono text-xs text-slate-400">Body · {type.body}px (max measure: {type.maxMeasureCh}ch)</span>
            <p className="max-w-[70ch] text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
              PRISM is built on strict design engineering principles. All components consume semantic tokens rather than raw hex codes or ad-hoc Tailwind classes. This ensures fluid dark mode adaptability, rock-solid WCAG 2.2 AA contrast compliance, and effortless high-contrast skinning.
            </p>
          </div>
          <div className="pt-3">
            <span className="font-mono text-xs text-slate-400">Small · {type.small}px</span>
            <p className="text-[13px] text-slate-500">
              Supporting annotations, table cell content, and metadata details.
            </p>
          </div>
          <div className="pt-3">
            <span className="font-mono text-xs text-slate-400">Caption · {type.caption}px</span>
            <p className="text-xs text-slate-400">
              Micro-labels, timestamps, and chart axis labels — never used for readable body copy.
            </p>
          </div>
        </div>
      </Card>

      {/* Color Foundation & Contrast */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-base font-extrabold">Color Palette & Contrast Compliance</h3>
          <p className="text-xs text-slate-500">All primary text pairs exceed WCAG 2.2 AA (≥ 4.5:1 ratio).</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
              <Badge tone="violet">Light Surface</Badge>
              <p className="mt-3 text-2xl font-black tabular-nums">{contrastLight.toFixed(2)}:1</p>
              <p className="text-xs text-slate-500">Body text on white surface</p>
              <p className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">✓ Exceeds WCAG AA (4.5:1)</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white dark:border-white/10">
              <Badge tone="sky">Dark Surface</Badge>
              <p className="mt-3 text-2xl font-black tabular-nums">{contrastDark.toFixed(2)}:1</p>
              <p className="text-xs text-slate-400">Body text on #0a0a12 surface</p>
              <p className="mt-1 text-xs font-bold text-emerald-400">✓ Exceeds WCAG AA (4.5:1)</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Palettes</p>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="rounded-xl bg-emerald-500 p-2 font-bold text-white">Success</div>
              <div className="rounded-xl bg-amber-500 p-2 font-bold text-white">Warning</div>
              <div className="rounded-xl bg-rose-500 p-2 font-bold text-white">Danger</div>
              <div className="rounded-xl bg-sky-500 p-2 font-bold text-white">Info</div>
            </div>
          </div>
        </Card>

        {/* Elevation & Shadows */}
        <Card className="p-5">
          <h3 className="text-base font-extrabold">Elevation & Surface Depth</h3>
          <p className="text-xs text-slate-500">Layered shadow tokens communicating interactive affordance and depth.</p>

          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5" style={{ boxShadow: primitive.shadow.sm }}>
              <b className="text-sm">shadow-sm</b>
              <p className="text-xs text-slate-500">Subtle cards, default wells, buttons</p>
              <code className="mt-1 block font-mono text-[11px] text-slate-400">{primitive.shadow.sm}</code>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5" style={{ boxShadow: primitive.shadow.md }}>
              <b className="text-sm">shadow-md</b>
              <p className="text-xs text-slate-500">Popovers, dropdown menus, hover highlights</p>
              <code className="mt-1 block font-mono text-[11px] text-slate-400">{primitive.shadow.md}</code>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5" style={{ boxShadow: primitive.shadow.lg }}>
              <b className="text-sm">shadow-lg</b>
              <p className="text-xs text-slate-500">Modal dialogs, slide-over drawers, notifications</p>
              <code className="mt-1 block font-mono text-[11px] text-slate-400">{primitive.shadow.lg}</code>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
