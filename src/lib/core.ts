import { PATTERN_DEMOS } from "../patterns/data";
import { A11Y_DEMOS } from "../a11y/data";
import { RESP_DEMOS } from "../responsive/data";
import { STATE_DEMOS } from "../states/data";

export { seeded } from "./seed";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type DemoStatus = "functional" | "illustrative";

export interface DemoMeta {
  id: string;
  name: string;
  /** Short description shown on the card (what the demo teaches is in `teaches`). */
  description?: string;
  category: string;
  route: string;
  teaches: string;
  interactions: string[];
  difficulty: Difficulty;
  status: DemoStatus;
  /** Dominant visual style(s), drawn from STYLE_FILTERS vocabulary. */
  styles: string[];
  icon: string;
  accent: string;
  estimatedMins: number;
}

/** Visual-style vocabulary shared by the explorer filter and the Style Lab. */
export const STYLE_FILTERS = [
  "Minimal", "Light", "Dark", "Bento", "Glass", "Neumorphic",
  "Swiss", "Brutalist", "Editorial", "Flat", "Material", "Dense",
] as const;

export interface DemoFilter {
  q?: string;
  category?: string;
  difficulty?: string;
  style?: string;
}

/** Pure catalogue filter — single source of truth for explorer search/filter behavior. */
export function filterDemos(demos: DemoMeta[], f: DemoFilter): DemoMeta[] {
  const q = (f.q ?? "").trim().toLowerCase();
  return demos.filter((d) => {
    if (q) {
      const hay = (d.name + " " + (d.description ?? "") + " " + d.teaches + " " + d.category + " " + d.interactions.join(" ")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.category && f.category !== "All" && d.category !== f.category) return false;
    if (f.difficulty && f.difficulty !== "All" && d.difficulty !== f.difficulty) return false;
    if (f.style && f.style !== "All" && !d.styles.includes(f.style)) return false;
    return true;
  });
}

export const DEMOS: DemoMeta[] = [
  { id: "marketing", name: "Marketing Website", description: "A complete SaaS landing page with pricing, FAQ and lead capture.", category: "Product Types", route: "#/product/marketing", teaches: "Landing persuasion, pricing psychology & lead capture", interactions: ["Pricing toggle", "FAQ accordion", "Validated lead form"], difficulty: "Beginner", status: "functional", styles: ["Light", "Minimal"], icon: "megaphone", accent: "#7c3aed", estimatedMins: 6 },
  { id: "mobile", name: "Mobile App Simulation", description: "A touch-first app flow in a phone frame, explorable in the browser.", category: "Product Types", route: "#/product/mobile", teaches: "Onboarding, bottom tabs & touch-first states", interactions: ["Onboarding flow", "Tab bar", "Push prefs"], difficulty: "Beginner", status: "functional", styles: ["Light", "Flat"], icon: "smartphone", accent: "#06b6d4", estimatedMins: 5 },
  { id: "dashboard", name: "Enterprise Dashboard", description: "An ops console with a fully working data table and role simulation.", category: "Product Types", route: "#/product/dashboard", teaches: "Tables, bulk actions, roles & detail views", interactions: ["Sort / filter / paginate", "Bulk approve", "Role switcher"], difficulty: "Advanced", status: "functional", styles: ["Light", "Dense"], icon: "layout-dashboard", accent: "#0ea5e9", estimatedMins: 10 },
  { id: "ecommerce", name: "E-commerce Store", description: "A fictional storefront with real cart math and checkout validation.", category: "Product Types", route: "#/product/ecommerce", teaches: "Catalog, cart math & checkout validation", interactions: ["Search / sort", "Cart drawer", "Checkout form"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Minimal"], icon: "shopping-bag", accent: "#f59e0b", estimatedMins: 8 },
  { id: "analytics", name: "Analytics Suite", description: "KPI cards, charts and tables that always agree with each other.", category: "Product Types", route: "#/product/analytics", teaches: "KPI consistency, drill-down & export", interactions: ["Date range", "Channel filter", "Drill-down + CSV"], difficulty: "Advanced", status: "functional", styles: ["Light", "Dense"], icon: "bar-chart", accent: "#10b981", estimatedMins: 9 },
  { id: "aiml", name: "ML Reliability & Drift", description: "Model health, drift monitoring and alert triage on simulated data.", category: "Product Types", route: "#/product/aiml", teaches: "Registry, drift vs degradation & alert triage", interactions: ["Version compare", "Acknowledge / resolve", "Prediction inspector"], difficulty: "Advanced", status: "functional", styles: ["Dark", "Dense"], icon: "brain", accent: "#ec4899", estimatedMins: 10 },
  { id: "design-system", name: "Design System Explorer", description: "Browsable component variants with guidelines and code samples.", category: "Product Types", route: "#/product/design-system", teaches: "Variants, tokens, a11y notes & code", interactions: ["Variant switcher", "Token inspector", "Copy code"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Minimal"], icon: "component", accent: "#6366f1", estimatedMins: 7 },
  { id: "style-minimalism", name: "Minimalism", description: "The Atlas workspace with nothing left to take away.", category: "Visual Styles", route: "#/styles/minimalism", teaches: "Whitespace, restraint and quiet actions", interactions: ["Task filter", "Rename project", "Detail dialog"], difficulty: "Beginner", status: "functional", styles: ["Minimal"], icon: "palette", accent: "#111111", estimatedMins: 4 },
  { id: "style-light-ui", name: "Light UI", description: "Bright surfaces, soft borders and familiar blue actions.", category: "Visual Styles", route: "#/styles/light-ui", teaches: "Surface treatments vs full design styles", interactions: ["Status pills", "Progress card", "Detail dialog"], difficulty: "Beginner", status: "functional", styles: ["Light"], icon: "palette", accent: "#0284c7", estimatedMins: 4 },
  { id: "style-dark-ui", name: "Dark UI", description: "Layered dark elevation with neon accents and honest status.", category: "Visual Styles", route: "#/styles/dark-ui", teaches: "Elevation without pure black, readable status", interactions: ["Status legend", "Glow progress", "Detail dialog"], difficulty: "Intermediate", status: "functional", styles: ["Dark"], icon: "palette", accent: "#22d3ee", estimatedMins: 5 },
  { id: "style-bento-grid", name: "Bento Grid", description: "Hero tile plus contrasting supporters that reflow on mobile.", category: "Visual Styles", route: "#/styles/bento-grid", teaches: "Tile hierarchy and responsive regrouping", interactions: ["Hero progress", "Tile tasks", "Sticker dialog"], difficulty: "Intermediate", status: "functional", styles: ["Bento"], icon: "palette", accent: "#7c3aed", estimatedMins: 5 },
  { id: "style-glassmorphism", name: "Glassmorphism", description: "Frosted panels over vivid color — with a solid fallback.", category: "Visual Styles", route: "#/styles/glassmorphism", teaches: "Translucency plus contrast-safe fallback", interactions: ["Opacity toggle", "Frosted tasks", "Glass dialog"], difficulty: "Intermediate", status: "functional", styles: ["Glass"], icon: "palette", accent: "#e879f9", estimatedMins: 5 },
  { id: "style-neumorphism", name: "Neumorphism", description: "Soft extrusion with contrast fixed — the honest version.", category: "Visual Styles", route: "#/styles/neumorphism", teaches: "Tactile states without invisible controls", interactions: ["Raised/sunken tabs", "Slab tasks", "Press states"], difficulty: "Advanced", status: "functional", styles: ["Neumorphic"], icon: "palette", accent: "#475569", estimatedMins: 5 },
  { id: "style-swiss-grid", name: "Swiss / Grid Design", description: "A visible 12-column grid, black rules and signal red.", category: "Visual Styles", route: "#/styles/swiss-grid", teaches: "Grid-driven hierarchy and numbered order", interactions: ["Ruled table", "Numbered tabs", "Poster dialog"], difficulty: "Intermediate", status: "functional", styles: ["Swiss"], icon: "palette", accent: "#dc2626", estimatedMins: 5 },
  { id: "style-brutalism", name: "Brutalism", description: "Black borders, hard shadows and acid fills — on purpose.", category: "Visual Styles", route: "#/styles/brutalism", teaches: "Deliberate loudness that stays usable", interactions: ["Sticker cards", "Chunky filters", "Poster dialog"], difficulty: "Advanced", status: "functional", styles: ["Brutalist"], icon: "palette", accent: "#7c3aed", estimatedMins: 5 },
  { id: "style-editorial", name: "Editorial Design", description: "Serif display, drop caps and pull quotes with real copy.", category: "Visual Styles", route: "#/styles/editorial", teaches: "Magazine rhythm and line-length discipline", interactions: ["Ledger search", "Pull-quote progress", "Print dialog"], difficulty: "Intermediate", status: "functional", styles: ["Editorial"], icon: "palette", accent: "#78350f", estimatedMins: 5 },
  { id: "style-flat-design", name: "Flat Design", description: "Solid blocks and icons — state never carried by color alone.", category: "Visual Styles", route: "#/styles/flat-design", teaches: "Affordance without shadows", interactions: ["Icon statuses", "Block KPIs", "Flat dialog"], difficulty: "Beginner", status: "functional", styles: ["Flat"], icon: "palette", accent: "#0f172a", estimatedMins: 4 },
  { id: "style-material-inspired", name: "Material-Inspired", description: "Paper elevations, FAB and state layers — an homage.", category: "Visual Styles", route: "#/styles/material-inspired", teaches: "Elevation steps and motion meaning", interactions: ["FAB create", "Tonal chips", "Sheet dialog"], difficulty: "Intermediate", status: "functional", styles: ["Material"], icon: "palette", accent: "#673ab7", estimatedMins: 5 },
  { id: "style-data-dense", name: "Data-Dense UI", description: "An ops console with Compact/Comfortable/Spacious density.", category: "Visual Styles", route: "#/styles/data-dense", teaches: "Density as a user-controlled preference", interactions: ["Density control", "Sortable table", "Console dialog"], difficulty: "Advanced", status: "functional", styles: ["Dense"], icon: "palette", accent: "#10b981", estimatedMins: 6 },
  ...PATTERN_DEMOS,
  { id: "ux", name: "UX Disciplines & Methods", description: "Nine methods with deliverables, examples and validation guidance.", category: "UX Disciplines", route: "#/ux", teaches: "JTBD, heuristics, Double Diamond & research", interactions: ["JTBD canvas", "Heuristic audit", "Flow builder"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Editorial"], icon: "compass", accent: "#14b8a6", estimatedMins: 10 },
  { id: "ux-principles", name: "UX Principles", description: "Fifteen principles with poor/improved pairs plus a methodology selector.", category: "UX Laboratory", route: "#/ux-principles", teaches: "What each principle demands — and its trade-offs", interactions: ["Principle filter", "Workflow selector", "Checklists"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Editorial"], icon: "compass", accent: "#0ea5e9", estimatedMins: 8 },
  { id: "ux-heuristics", name: "Usability Heuristics Lab", description: "Trigger poor and improved versions of six heuristics side by side.", category: "UX Laboratory", route: "#/ux-principles/usability-heuristics", teaches: "Feeling heuristics through working outcomes", interactions: ["Poor/improved triggers", "Severity checklist", "Session log"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Minimal"], icon: "compass", accent: "#8b5cf6", estimatedMins: 7 },
  { id: "ux-cognitive-load", name: "Cognitive Load Lab", description: "Twelve-at-once chaos versus three staged decisions, counted.", category: "UX Laboratory", route: "#/ux-principles/cognitive-load", teaches: "Chunking, defaults and disclosure", interactions: ["Chaos toggles", "Staged wizard", "Decision counters"], difficulty: "Beginner", status: "functional", styles: ["Light", "Minimal"], icon: "compass", accent: "#f59e0b", estimatedMins: 5 },
  { id: "ux-feedback", name: "Feedback & Affordances", description: "Buttons that answer, inputs that guide — poor versus improved.", category: "UX Laboratory", route: "#/ux-principles/feedback-and-affordances", teaches: "The 100ms loop and honest states", interactions: ["Like-button pair", "Inline help", "Select/disabled"], difficulty: "Beginner", status: "functional", styles: ["Light", "Flat"], icon: "compass", accent: "#10b981", estimatedMins: 5 },
  { id: "ux-consistency", name: "Consistency Lab", description: "Identical buttons, three verbs — then one language done right.", category: "UX Laboratory", route: "#/ux-principles/consistency", teaches: "One verb per action, stable ranks", interactions: ["Confusion scorer", "Ranked flow", "Convention list"], difficulty: "Beginner", status: "functional", styles: ["Swiss", "Minimal"], icon: "compass", accent: "#64748b", estimatedMins: 4 },
  { id: "ux-error-prevention", name: "Error Prevention Lab", description: "Free-text expiry versus guarded inputs with named recovery.", category: "UX Laboratory", route: "#/ux-principles/error-prevention", teaches: "Moving errors from submit-time to type-time", interactions: ["Free-text pay", "Guarded pay", "Focus recovery"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Minimal"], icon: "compass", accent: "#ef4444", estimatedMins: 5 },
  { id: "ux-research", name: "UX Research Methods", description: "Thirteen methods with costs, biases and outputs, plus a selector.", category: "UX Laboratory", route: "#/ux-research", teaches: "Matching method to question, risk and budget", interactions: ["Method selector", "Method explorer", "Bias notes"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Editorial"], icon: "compass", accent: "#14b8a6", estimatedMins: 9 },
  { id: "ux-personas", name: "Persona Builder", description: "Illustrative samples plus a builder that refuses evidence-free personas.", category: "UX Laboratory", route: "#/ux-research/personas", teaches: "Evidence discipline and uncertainty tracking", interactions: ["Sample cards", "Guided builder", "Access needs"], difficulty: "Beginner", status: "functional", styles: ["Light", "Flat"], icon: "compass", accent: "#ec4899", estimatedMins: 5 },
  { id: "ux-journey", name: "Journey Mapping", description: "Editable five-stage map with confidence, export and local persistence.", category: "UX Laboratory", route: "#/ux-research/journey-mapping", teaches: "Stages, friction and opportunity mapping", interactions: ["Stage editor", "Add/remove", "JSON export"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Editorial"], icon: "compass", accent: "#a855f7", estimatedMins: 7 },
  { id: "ux-method-selector", name: "Method Selector", description: "Goal, time, evidence, risk and maturity → ranked research plan.", category: "UX Laboratory", route: "#/ux-research/method-selector", teaches: "Transparent, reasoned method choice", interactions: ["Five-criteria form", "Ranked shortlist", "Score reasons"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Dense"], icon: "compass", accent: "#0ea5e9", estimatedMins: 5 },
  { id: "ux-usability-testing", name: "Usability Testing Lab", description: "Run a sample task, log observations, get honest metrics.", category: "UX Laboratory", route: "#/ux-research/usability-testing", teaches: "Correct denominators and missing-data honesty", interactions: ["Task prototype", "Observation log", "Live metrics"], difficulty: "Advanced", status: "functional", styles: ["Light", "Dense"], icon: "compass", accent: "#f97316", estimatedMins: 8 },
  { id: "ux-ia", name: "Information Architecture", description: "IA rules plus a click-counted depth walkthrough.", category: "UX Laboratory", route: "#/information-architecture", teaches: "Depth budgets and label scent", interactions: ["Depth walk", "Rule cards", "Hub links"], difficulty: "Beginner", status: "functional", styles: ["Swiss", "Minimal"], icon: "compass", accent: "#6366f1", estimatedMins: 4 },
  { id: "ux-sitemap", name: "Sitemap & Tree Test", description: "Expandable sitemap with page purposes plus a scored findability test.", category: "UX Laboratory", route: "#/information-architecture/sitemaps", teaches: "Hierarchy browsing and tree testing", interactions: ["Tree explorer", "Find-the-page test", "Path tracking"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Dense"], icon: "compass", accent: "#22c55e", estimatedMins: 6 },
  { id: "ux-cardsort", name: "Card Sorting", description: "Drag or menu-move 8 cards into named groups you control.", category: "UX Laboratory", route: "#/information-architecture/card-sorting", teaches: "Mental-model elicitation without statistics theater", interactions: ["Drag + Move-to", "Group CRUD", "Reset"], difficulty: "Beginner", status: "functional", styles: ["Light", "Flat"], icon: "compass", accent: "#eab308", estimatedMins: 5 },
  { id: "ux-flows", name: "User-Flow Laboratory", description: "Four runnable journeys plus a validating flow editor.", category: "UX Laboratory", route: "#/user-flows", teaches: "Diagrams that execute, editor that validates", interactions: ["Journey hub", "Live editor", "Validation"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Minimal"], icon: "compass", accent: "#7c3aed", estimatedMins: 8 },
  { id: "ux-flow-registration", name: "Flow: Registration", description: "Validation loop, review branches, guarded completion.", category: "UX Laboratory", route: "#/user-flows/registration", teaches: "Error loops that preserve work", interactions: ["Branch choices", "Trail", "Text equivalent"], difficulty: "Beginner", status: "functional", styles: ["Light", "Minimal"], icon: "compass", accent: "#06b6d4", estimatedMins: 4 },
  { id: "ux-flow-checkout", name: "Flow: Checkout", description: "Simulated gateway with approved and declined branches.", category: "UX Laboratory", route: "#/user-flows/ecommerce-checkout", teaches: "Failure paths as first-class design", interactions: ["Gateway choice", "Retry loop", "Receipt end"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Minimal"], icon: "compass", accent: "#f59e0b", estimatedMins: 5 },
  { id: "ux-flow-onboarding", name: "Flow: SaaS Onboarding", description: "Skippable invite, sensible defaults, ready state.", category: "UX Laboratory", route: "#/user-flows/saas-onboarding", teaches: "Shame-free skipping and defaults", interactions: ["Use-case branch", "Skip path", "Trail"], difficulty: "Beginner", status: "functional", styles: ["Light", "Flat"], icon: "compass", accent: "#10b981", estimatedMins: 4 },
  { id: "ux-flow-error", name: "Flow: Error Recovery", description: "Explained failure with retry and CSV-fallback recoveries.", category: "UX Laboratory", route: "#/user-flows/error-recovery", teaches: "Recovery as designed outcome", interactions: ["Outcome choice", "Two recoveries", "Trail"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Minimal"], icon: "compass", accent: "#ef4444", estimatedMins: 4 },
  { id: "ux-metrics", name: "UX Metrics & Findings", description: "Editable success, time, funnel, satisfaction, SUS — plus findings register.", category: "UX Laboratory", route: "#/ux-metrics", teaches: "Honest denominators and standard SUS scoring", interactions: ["Editable datasets", "SUS calculator", "Findings CRUD"], difficulty: "Advanced", status: "functional", styles: ["Light", "Dense"], icon: "compass", accent: "#a855f7", estimatedMins: 9 },
  { id: "states", name: "Interface State Lab", description: "Sixteen interface states with messages and recovery paths.", category: "States", route: "#/states", teaches: "16 states with recovery paths", interactions: ["State matrix", "Offline toggle", "Retry flows"], difficulty: "Beginner", status: "functional", styles: ["Light", "Minimal"], icon: "layers", accent: "#eab308", estimatedMins: 6 },
  { id: "ai", name: "AI Interaction Studio", description: "A simulated assistant chat with streaming, citations and feedback.", category: "AI", route: "#/ai", teaches: "Streaming, citations, confidence & feedback", interactions: ["Streaming chat", "Tone control", "Rate + retry"], difficulty: "Advanced", status: "functional", styles: ["Dark", "Glass"], icon: "sparkles", accent: "#a855f7", estimatedMins: 8 },
  { id: "a11y", name: "Accessibility Lab", description: "Hands-on contrast, focus, live-region and target-size exercises.", category: "Accessibility", route: "#/accessibility", teaches: "Contrast math, focus, live regions & targets", interactions: ["Contrast checker", "Focus trap", "Screen-reader sim"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Minimal"], icon: "accessibility", accent: "#22c55e", estimatedMins: 9 },
  { id: "responsive", name: "Responsive Lab", description: "One layout previewed at mobile, tablet and desktop widths.", category: "Responsive", route: "#/responsive", teaches: "Breakpoints, tables & touch on small screens", interactions: ["Viewport switcher", "Table modes", "Type scale"], difficulty: "Beginner", status: "functional", styles: ["Light", "Minimal"], icon: "monitor-smartphone", accent: "#0ea5e9", estimatedMins: 6 },
  { id: "tokens", name: "Tokens & Theming", description: "The live token editor behind this entire playground's themes.", category: "System", route: "#/tokens", teaches: "Primitive → semantic tokens & theme switching", interactions: ["Theme editor", "Radius / shadow", "Export tokens"], difficulty: "Intermediate", status: "functional", styles: ["Light", "Swiss"], icon: "swatch", accent: "#64748b", estimatedMins: 7 },
  { id: "testing", name: "Testing Lab", description: "A unit suite that runs in the browser plus E2E and QA checklists.", category: "System", route: "#/testing", teaches: "Live unit tests, E2E checklist & QA docs", interactions: ["Run suite live", "E2E matrix", "Perf budget"], difficulty: "Advanced", status: "functional", styles: ["Light", "Dense"], icon: "flask", accent: "#f97316", estimatedMins: 8 },
  ...A11Y_DEMOS,
  ...RESP_DEMOS,
  ...STATE_DEMOS,
];

export const CATEGORIES = ["All", ...Array.from(new Set(DEMOS.map((d) => d.category)))];

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

export function contrastRatio(hex1: string, hex2: string): number {
  const lum = (hex: string) => {
    const c = hex.replace("#", "");
    const rgb = [0, 2, 4].map((i) => {
      const v = parseInt(c.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };
  const l1 = lum(hex1);
  const l2 = lum(hex2);
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
}
