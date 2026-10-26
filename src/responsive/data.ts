/**
 * Responsive laboratory — viewport presets and explorer entries.
 * Previews use genuine adjustable CSS widths (measured, not screenshots).
 */
import type { DemoMeta } from "../lib/core";

export interface Viewport { label: string; w: number; h: number; note: string }

export const VIEWPORTS: Viewport[] = [
  { label: "Mobile portrait", w: 360, h: 640, note: "320–430px phones live here." },
  { label: "Mobile landscape", w: 740, h: 360, note: "Short heights stress sticky chrome." },
  { label: "Tablet", w: 768, h: 1024, note: "The awkward middle: touch + room." },
  { label: "Laptop", w: 1280, h: 800, note: "Most common desktop class." },
  { label: "Desktop", w: 1440, h: 900, note: "Wide: max-width containers earn their keep." },
];

export interface RespDemoDef { slug: string; name: string; tagline: string; desc: string; difficulty: DemoMeta["difficulty"] }

export const RESP_DEFS: RespDemoDef[] = [
  { slug: "breakpoints", name: "Breakpoint Lab", tagline: "Drag the width, watch the layout", desc: "Adjustable preview width with presets, live width readout, and layout changes at content-driven points.", difficulty: "Beginner" },
  { slug: "layouts", name: "Fluid, Grid & Flex", tagline: "Three techniques, three problems", desc: "Fluid type/spacing, grid dashboards, wrapping flex — each with failure modes and fixes.", difficulty: "Intermediate" },
  { slug: "typography", name: "Responsive Typography", tagline: "Clamp, measure and wrapping", desc: "Fluid scales, 45–75ch measures, long URLs, no clipped fixed heights, zoom-safe text.", difficulty: "Beginner" },
  { slug: "navigation", name: "Responsive Navigation", tagline: "Bar becomes menu, accessibly", desc: "Desktop bar collapsing to a keyboard-operable drawer driven by measured width.", difficulty: "Intermediate" },
  { slug: "tables", name: "Responsive Tables", tagline: "Scroll, prioritize or cardify", desc: "Three strategies on one dataset: labelled scroller, priority columns, card list — semantics kept.", difficulty: "Intermediate" },
  { slug: "forms", name: "Responsive Forms", tagline: "Single column, big targets", desc: "Stacked fields, wrapping errors, 44px targets and visible labels at 320px.", difficulty: "Beginner" },
  { slug: "device-preview", name: "Device Preview", tagline: "Five viewports + custom sizes", desc: "A real interactive sample page inside a genuinely resizable frame — dimensions always shown.", difficulty: "Beginner" },
];

const ACCENTS = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#6366f1", "#64748b"];

export const RESP_DEMOS: DemoMeta[] = RESP_DEFS.map((d, i) => ({
  id: `resp-${d.slug}`,
  name: d.name,
  description: d.tagline + ".",
  category: "Responsive Lab",
  route: `#/responsive/${d.slug}`,
  teaches: d.desc,
  interactions: ["Width control", "Strategy switch"],
  difficulty: d.difficulty,
  status: "functional",
  styles: ["Minimal"],
  icon: "monitor-smartphone",
  accent: ACCENTS[i],
  estimatedMins: 4 + ((i * 3) % 3),
}));
