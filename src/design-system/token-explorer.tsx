import { useState } from "react";
import { primitive, semantic, breakpoints, motion, zIndex, type ThemeName } from "./tokens";
import { Card, SectionHead, Badge, Btn } from "../components/ui";
import { DesignSystemNavTabs } from "./nav-tabs";
import { Copy, Check } from "lucide-react";

export default function TokenExplorerPage() {
  const [activeTheme, setActiveTheme] = useState<ThemeName>("light");
  const [copied, setCopied] = useState(false);

  const cssExport = `:root {
  /* Primitive Colors */
  --color-violet-600: ${primitive.violet[600]};
  --color-cyan-400: ${primitive.cyan[400]};
  --color-status-success: ${primitive.status.success};
  --color-status-warning: ${primitive.status.warning};
  --color-status-danger: ${primitive.status.danger};
  --color-status-info: ${primitive.status.info};

  /* Semantic Tokens (Light) */
  --action: ${semantic.light.action};
  --action-hover: ${semantic.light.actionHover};
  --background: ${semantic.light.background};
  --surface: ${semantic.light.surface};
  --surface-sunken: ${semantic.light.surfaceSunken};
  --border: ${semantic.light.border};
  --text: ${semantic.light.text};
  --text-muted: ${semantic.light.textMuted};
  --focus-ring: ${semantic.light.focusRing};

  /* Radii & Spacing */
  --radius-sm: ${primitive.radius.sm}px;
  --radius-md: ${primitive.radius.md}px;
  --radius-lg: ${primitive.radius.lg}px;
  --radius-xl: ${primitive.radius.xl}px;
}

.dark {
  /* Semantic Tokens (Dark) */
  --action: ${semantic.dark.action};
  --action-hover: ${semantic.dark.actionHover};
  --background: ${semantic.dark.background};
  --surface: ${semantic.dark.surface};
  --surface-sunken: ${semantic.dark.surfaceSunken};
  --border: ${semantic.dark.border};
  --text: ${semantic.dark.text};
  --text-muted: ${semantic.dark.textMuted};
  --focus-ring: ${semantic.dark.focusRing};
}`;

  const copyTokens = () => {
    navigator.clipboard?.writeText(cssExport).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <SectionHead
        kicker="Design System · Tokens"
        title="Token Explorer & Categories"
        desc="Single source of truth for PRISM styling: primitives, semantic aliases, typography, spacing, elevation, motion, and z-index layers."
      />

      <DesignSystemNavTabs activePath="#/design-system/tokens" />

      {/* Layer Architecture Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <Badge tone="violet">Layer 1: Primitives</Badge>
          <h3 className="mt-2 text-sm font-bold">Raw Values</h3>
          <p className="mt-1 text-xs text-slate-500">
            Raw hex codes, pixel steps, and numeric scales. Primitives are never consumed directly by components.
          </p>
        </Card>
        <Card className="p-4">
          <Badge tone="sky">Layer 2: Semantics</Badge>
          <h3 className="mt-2 text-sm font-bold">Meaning-Bound Aliases</h3>
          <p className="mt-1 text-xs text-slate-500">
            Intent tokens like <code className="font-mono text-[11px]">action</code>, <code className="font-mono text-[11px]">surface</code>, <code className="font-mono text-[11px]">border</code>, mapped per theme.
          </p>
        </Card>
        <Card className="p-4">
          <Badge tone="emerald">Layer 3: Components</Badge>
          <h3 className="mt-2 text-sm font-bold">Component Recipes</h3>
          <p className="mt-1 text-xs text-slate-500">
            Variant styles, button sizes, dialog focus specs, and accessible interactive states.
          </p>
        </Card>
      </div>

      {/* Semantic Tokens Live Inspector */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold">Semantic Tokens Inspector</h3>
            <p className="text-xs text-slate-500">Inspect values and switch active theme layer below.</p>
          </div>
          <div className="flex gap-1 rounded-full bg-slate-100 p-1 dark:bg-white/10" role="group" aria-label="Theme selector">
            <button
              onClick={() => setActiveTheme("light")}
              aria-pressed={activeTheme === "light"}
              className={`rounded-full px-3 py-1 text-xs font-bold ${activeTheme === "light" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}
            >
              Light Semantics
            </button>
            <button
              onClick={() => setActiveTheme("dark")}
              aria-pressed={activeTheme === "dark"}
              className={`rounded-full px-3 py-1 text-xs font-bold ${activeTheme === "dark" ? "bg-slate-900 text-white shadow" : "text-slate-500"}`}
            >
              Dark Semantics
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(semantic[activeTheme]).map(([key, val]) => (
            <div key={key} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-white/10">
              <span
                className="h-8 w-8 shrink-0 rounded-lg border border-black/10 shadow-sm"
                style={{ background: val.startsWith("rgb") || val.startsWith("#") ? val : undefined }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-xs font-bold text-slate-700 dark:text-slate-200">{key}</p>
                <p className="truncate font-mono text-[11px] text-slate-400">{val}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Spacing & Radii */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-extrabold">Spacing Scale (4px Base)</h3>
          <p className="text-xs text-slate-500">Predictable 4px grid steps for padding, margins and gaps.</p>
          <div className="mt-4 space-y-2">
            {Object.entries(primitive.space).map(([k, px]) => (
              <div key={k} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-mono font-bold">{k}</span>
                <span className="w-16 font-mono text-slate-400">{px}px</span>
                <div className="h-4 rounded bg-violet-500/30 dark:bg-cyan-500/30" style={{ width: px * 2 }} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-extrabold">Corner Radii</h3>
          <p className="text-xs text-slate-500">Consistent rounding from subtle tags to full pills.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(primitive.radius).map(([k, r]) => (
              <div
                key={k}
                className="flex h-16 flex-col items-center justify-center border border-slate-300 bg-slate-50 p-2 text-center dark:border-white/10 dark:bg-white/5"
                style={{ borderRadius: r === 9999 ? "9999px" : `${r}px` }}
              >
                <span className="font-mono text-xs font-bold">{k}</span>
                <span className="text-[11px] text-slate-400">{r}px</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Motion, Breakpoints & Z-Index */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-sm font-bold">Motion Specs</h3>
          <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <li>· <b>Fast:</b> {motion.fast}ms (snappy hovers)</li>
            <li>· <b>Base:</b> {motion.base}ms (modals, drawers)</li>
            <li>· <b>Slow:</b> {motion.slow}ms (complex choreographies)</li>
            <li>· <b>Curve:</b> {motion.ease}</li>
            <li>· <b>A11y:</b> Kills animation under prefers-reduced-motion</li>
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-bold">Content Breakpoints</h3>
          <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <li>· <b>sm:</b> {breakpoints.sm}px (single-column cards)</li>
            <li>· <b>md:</b> {breakpoints.md}px (two-column layouts)</li>
            <li>· <b>lg:</b> {breakpoints.lg}px (three-column dashboards)</li>
            <li>· <b>max:</b> {breakpoints.maxWidth}px max container width</li>
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-bold">Z-Index Elevation Stack</h3>
          <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <li>· <b>Toasts:</b> {zIndex.toast} (highest alert layer)</li>
            <li>· <b>Dialogs:</b> {zIndex.dialog} (modal focus traps)</li>
            <li>· <b>Drawers:</b> {zIndex.drawer} (slide-over details)</li>
            <li>· <b>Sticky Nav:</b> {zIndex.stickyNav} (fixed headers)</li>
          </ul>
        </Card>
      </div>

      {/* CSS Custom Properties Export */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold">CSS Custom Properties Export</h3>
            <p className="text-xs text-slate-500">Drop-in CSS variables generated directly from PRISM token specifications.</p>
          </div>
          <Btn size="sm" variant="outline" onClick={copyTokens}>
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy CSS"}
          </Btn>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200">
          {cssExport}
        </pre>
      </Card>
    </div>
  );
}
