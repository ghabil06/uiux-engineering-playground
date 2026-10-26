/**
 * PRISM centralized design tokens — Phase 1 foundation.
 *
 * Layers:
 *  - `primitive`: raw values (palette ramps, spacing steps). Never used directly in components.
 *  - `semantic`: meaning-bound aliases (`action`, `surface`, `text`) with light/dark values.
 *    Components consume ONLY semantic tokens (via the `token()` helpers or Tailwind classes
 *    mapped below). Adding a theme = overriding the semantic layer.
 *  - `component`: per-variant recipes (button sizes/variants) kept in `components/foundation.tsx`.
 *
 * Purpose of each major token is documented inline. Contrast targets: body text ≥ 4.5:1,
 * large text & UI components ≥ 3:1 (WCAG 2.2 AA).
 */

export const primitive = {
  violet: { 100: "#ede9fe", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9" },
  cyan: { 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4" },
  slate: { 100: "#f1f5f9", 200: "#e2e8f0", 500: "#64748b", 700: "#334155", 900: "#0f172a", 950: "#020617" },
  status: { success: "#10b981", warning: "#f59e0b", danger: "#e11d48", info: "#0ea5e9" },
  /** 4px-base spacing scale */
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, "2xl": 48, "3xl": 64 },
  /** Corner radii */
  radius: { sm: 8, md: 12, lg: 14, xl: 16, "2xl": 24, full: 9999 },
  /** Elevation (light theme). Dark theme reuses keys with white-based shadows. */
  shadow: {
    sm: "0 1px 2px rgb(0 0 0 / .06)",
    md: "0 4px 12px rgb(0 0 0 / .10)",
    lg: "0 12px 32px rgb(0 0 0 / .16)",
  },
} as const;

export type ThemeName = "light" | "dark";

export interface SemanticTokens {
  /** Primary action fill (buttons, active states) */
  action: string;
  /** Action fill on hover */
  actionHover: string;
  /** Default page background */
  background: string;
  /** Card / panel surface */
  surface: string;
  /** Sunken surface (inputs, wells) */
  surfaceSunken: string;
  /** Default border color */
  border: string;
  /** Primary body text */
  text: string;
  /** Secondary / muted text */
  textMuted: string;
  /** 2px keyboard focus ring color */
  focusRing: string;
}

export const semantic: Record<ThemeName, SemanticTokens> = {
  light: {
    action: primitive.violet[600],
    actionHover: primitive.violet[700],
    background: "#f6f6f8",
    surface: "#ffffff",
    surfaceSunken: primitive.slate[100],
    border: primitive.slate[200],
    text: primitive.slate[900],
    textMuted: primitive.slate[500],
    focusRing: primitive.violet[600],
  },
  dark: {
    action: primitive.cyan[400],
    actionHover: primitive.cyan[500],
    background: "#0a0a12",
    surface: "rgb(255 255 255 / .04)",
    surfaceSunken: "rgb(255 255 255 / .06)",
    border: "rgb(255 255 255 / .10)",
    text: "#f1f5f9",
    textMuted: "#94a3b8",
    focusRing: primitive.cyan[400],
  },
};

/** Typography scale — fluid display via clamp, fixed steps below. */
export const type = {
  display: "clamp(28px, 4vw, 44px)",
  h1: 30,
  h2: 24,
  h3: 20,
  body: 15,
  small: 13,
  caption: 12,
  maxMeasureCh: 70,
} as const;

/** Content-driven breakpoints (NOT device names — see Responsive Lab). */
export const breakpoints = {
  /** Single column, hamburger nav, card-tables */
  sm: 640,
  /** Two-column grids, condensed nav */
  md: 768,
  /** Sidebar + three-column, dense tables */
  lg: 1024,
  /** Max content width */
  maxWidth: 1400,
} as const;

/** Motion: snappy micro-interactions, full kill under reduced motion. */
export const motion = {
  fast: 120,
  base: 200,
  slow: 320,
  ease: "cubic-bezier(.2,.7,.3,1)",
  /** Applied app-wide when the user prefers reduced motion (see index.css). */
  reducedMotionQuery: "(prefers-reduced-motion: reduce)",
} as const;

/** Z-index layers — dialogs always above nav; toasts topmost. */
export const zIndex = {
  content: 0,
  stickyNav: 50,
  drawer: 70,
  dialog: 80,
  toast: 90,
} as const;

/** Focus indicator spec consumed by index.css `:focus-visible`. */
export const focus = {
  widthPx: 2,
  offsetPx: 2,
  light: semantic.light.focusRing,
  dark: semantic.dark.focusRing,
} as const;

/** Helper: read a semantic token for the active theme. */
export function token<K extends keyof SemanticTokens>(key: K, theme: ThemeName): SemanticTokens[K] {
  return semantic[theme][key];
}

/** localStorage key + DOM hook shared by the pre-paint script and the theme hook. */
export const THEME_STORAGE_KEY = "prism-theme";
export const THEME_CLASS = "dark";
