/**
 * Route architecture — Phase 1.
 *
 * Hash routes (required for static single-file hosting: no server rewrites).
 * Single source of truth for: path → document title, demo metadata binding,
 * and not-found handling. Every path listed here must render a real page —
 * the explorer only links to paths present in ROUTES (verified by test).
 */
import { DEMOS } from "./core";

export interface RouteDef {
  /** Hash path without query string, e.g. "#/product/dashboard". */
  path: string;
  /** Document title set on navigation. */
  title: string;
  /** Demo catalogue id, when the route renders a demo (drives DemoFrame + breadcrumbs). */
  demoId?: string;
  group: "Explorer" | "Product Types" | "Visual Styles" | "Patterns" | "UX Disciplines" | "UX Laboratory" | "States" | "AI" | "Accessibility" | "Accessibility Lab" | "Responsive" | "Responsive Lab" | "Interface States" | "System" | "Design System";
}

export const ROUTES: RouteDef[] = [
  { path: "#/", title: "PRISM — UI/UX Engineering Playground", group: "Explorer" },
  { path: "#/product/marketing", title: "Marketing Website · PRISM", demoId: "marketing", group: "Product Types" },
  { path: "#/product/mobile", title: "Mobile App · PRISM", demoId: "mobile", group: "Product Types" },
  { path: "#/product/dashboard", title: "Enterprise Dashboard · PRISM", demoId: "dashboard", group: "Product Types" },
  { path: "#/product/ecommerce", title: "E-commerce · PRISM", demoId: "ecommerce", group: "Product Types" },
  { path: "#/product/analytics", title: "Analytics Suite · PRISM", demoId: "analytics", group: "Product Types" },
  { path: "#/product/aiml", title: "ML Reliability · PRISM", demoId: "aiml", group: "Product Types" },
  { path: "#/product/design-system", title: "Design System · PRISM", demoId: "design-system", group: "Product Types" },
  { path: "#/design-system/tokens", title: "Token Explorer · Design System · PRISM", group: "Design System" },
  { path: "#/design-system/foundations", title: "Foundations · Design System · PRISM", group: "Design System" },
  { path: "#/design-system/components", title: "Component Catalogue · Design System · PRISM", group: "Design System" },
  { path: "#/design-system/playground", title: "Component Playground · Design System · PRISM", group: "Design System" },
  { path: "#/design-system/guidelines", title: "Usage & Accessibility · Design System · PRISM", group: "Design System" },
  { path: "#/design-system/states", title: "State Coverage · Design System · PRISM", group: "Design System" },
  { path: "#/design-system/audit", title: "Token & Component Audit · Design System · PRISM", group: "Design System" },
  { path: "#/styles", title: "Style Gallery · PRISM", group: "Visual Styles" },
  { path: "#/styles/compare", title: "Style Comparison · PRISM", group: "Visual Styles" },
  { path: "#/styles/minimalism", title: "Minimalism · PRISM", demoId: "style-minimalism", group: "Visual Styles" },
  { path: "#/styles/light-ui", title: "Light UI · PRISM", demoId: "style-light-ui", group: "Visual Styles" },
  { path: "#/styles/dark-ui", title: "Dark UI · PRISM", demoId: "style-dark-ui", group: "Visual Styles" },
  { path: "#/styles/bento-grid", title: "Bento Grid · PRISM", demoId: "style-bento-grid", group: "Visual Styles" },
  { path: "#/styles/glassmorphism", title: "Glassmorphism · PRISM", demoId: "style-glassmorphism", group: "Visual Styles" },
  { path: "#/styles/neumorphism", title: "Neumorphism · PRISM", demoId: "style-neumorphism", group: "Visual Styles" },
  { path: "#/styles/swiss-grid", title: "Swiss Grid · PRISM", demoId: "style-swiss-grid", group: "Visual Styles" },
  { path: "#/styles/brutalism", title: "Brutalism · PRISM", demoId: "style-brutalism", group: "Visual Styles" },
  { path: "#/styles/editorial", title: "Editorial · PRISM", demoId: "style-editorial", group: "Visual Styles" },
  { path: "#/styles/flat-design", title: "Flat Design · PRISM", demoId: "style-flat-design", group: "Visual Styles" },
  { path: "#/styles/material-inspired", title: "Material-Inspired · PRISM", demoId: "style-material-inspired", group: "Visual Styles" },
  { path: "#/styles/data-dense", title: "Data-Dense UI · PRISM", demoId: "style-data-dense", group: "Visual Styles" },
  { path: "#/patterns", title: "Pattern Gallery · PRISM", group: "Patterns" },
  { path: "#/patterns/navigation", title: "Navigation Patterns · PRISM", demoId: "pattern-navigation", group: "Patterns" },
  { path: "#/patterns/search-and-filter", title: "Search & Filter · PRISM", demoId: "pattern-search-and-filter", group: "Patterns" },
  { path: "#/patterns/data-table", title: "Data Table · PRISM", demoId: "pattern-data-table", group: "Patterns" },
  { path: "#/patterns/forms", title: "Forms & Validation · PRISM", demoId: "pattern-forms", group: "Patterns" },
  { path: "#/patterns/multi-step-form", title: "Multi-Step Form · PRISM", demoId: "pattern-multi-step-form", group: "Patterns" },
  { path: "#/patterns/modal-and-dialog", title: "Modals & Dialogs · PRISM", demoId: "pattern-modal-and-dialog", group: "Patterns" },
  { path: "#/patterns/menus-and-popovers", title: "Menus & Popovers · PRISM", demoId: "pattern-menus-and-popovers", group: "Patterns" },
  { path: "#/patterns/tabs-and-accordion", title: "Tabs & Accordion · PRISM", demoId: "pattern-tabs-and-accordion", group: "Patterns" },
  { path: "#/patterns/notifications", title: "Notifications · PRISM", demoId: "pattern-notifications", group: "Patterns" },
  { path: "#/patterns/command-palette", title: "Command Palette · PRISM", demoId: "pattern-command-palette", group: "Patterns" },
  { path: "#/patterns/file-upload", title: "File Upload · PRISM", demoId: "pattern-file-upload", group: "Patterns" },
  { path: "#/patterns/drag-and-drop", title: "Drag & Drop · PRISM", demoId: "pattern-drag-and-drop", group: "Patterns" },
  { path: "#/patterns/progress-and-feedback", title: "Progress & Feedback · PRISM", demoId: "pattern-progress-and-feedback", group: "Patterns" },
  { path: "#/patterns/pagination", title: "Pagination · PRISM", demoId: "pattern-pagination", group: "Patterns" },
  { path: "#/patterns/tooltips", title: "Tooltips · PRISM", demoId: "pattern-tooltips", group: "Patterns" },
  { path: "#/patterns/empty-error-states", title: "Empty & Error States · PRISM", demoId: "pattern-empty-error-states", group: "Patterns" },
  { path: "#/patterns/undo-and-confirmation", title: "Undo & Confirmation · PRISM", demoId: "pattern-undo-and-confirmation", group: "Patterns" },
  { path: "#/ux", title: "UX Disciplines · PRISM", demoId: "ux", group: "UX Disciplines" },
  { path: "#/ux-principles", title: "UX Principles · PRISM", demoId: "ux-principles", group: "UX Laboratory" },
  { path: "#/ux-principles/usability-heuristics", title: "Heuristics Lab · PRISM", demoId: "ux-heuristics", group: "UX Laboratory" },
  { path: "#/ux-principles/cognitive-load", title: "Cognitive Load Lab · PRISM", demoId: "ux-cognitive-load", group: "UX Laboratory" },
  { path: "#/ux-principles/feedback-and-affordances", title: "Feedback & Affordances · PRISM", demoId: "ux-feedback", group: "UX Laboratory" },
  { path: "#/ux-principles/consistency", title: "Consistency Lab · PRISM", demoId: "ux-consistency", group: "UX Laboratory" },
  { path: "#/ux-principles/error-prevention", title: "Error Prevention Lab · PRISM", demoId: "ux-error-prevention", group: "UX Laboratory" },
  { path: "#/ux-research", title: "UX Research Methods · PRISM", demoId: "ux-research", group: "UX Laboratory" },
  { path: "#/ux-research/personas", title: "Persona Builder · PRISM", demoId: "ux-personas", group: "UX Laboratory" },
  { path: "#/ux-research/journey-mapping", title: "Journey Mapping · PRISM", demoId: "ux-journey", group: "UX Laboratory" },
  { path: "#/ux-research/method-selector", title: "Method Selector · PRISM", demoId: "ux-method-selector", group: "UX Laboratory" },
  { path: "#/ux-research/usability-testing", title: "Usability Testing Lab · PRISM", demoId: "ux-usability-testing", group: "UX Laboratory" },
  { path: "#/information-architecture", title: "Information Architecture · PRISM", demoId: "ux-ia", group: "UX Laboratory" },
  { path: "#/information-architecture/sitemaps", title: "Sitemap & Tree Test · PRISM", demoId: "ux-sitemap", group: "UX Laboratory" },
  { path: "#/information-architecture/card-sorting", title: "Card Sorting · PRISM", demoId: "ux-cardsort", group: "UX Laboratory" },
  { path: "#/user-flows", title: "User-Flow Laboratory · PRISM", demoId: "ux-flows", group: "UX Laboratory" },
  { path: "#/user-flows/registration", title: "Flow: Registration · PRISM", demoId: "ux-flow-registration", group: "UX Laboratory" },
  { path: "#/user-flows/ecommerce-checkout", title: "Flow: Checkout · PRISM", demoId: "ux-flow-checkout", group: "UX Laboratory" },
  { path: "#/user-flows/saas-onboarding", title: "Flow: SaaS Onboarding · PRISM", demoId: "ux-flow-onboarding", group: "UX Laboratory" },
  { path: "#/user-flows/error-recovery", title: "Flow: Error Recovery · PRISM", demoId: "ux-flow-error", group: "UX Laboratory" },
  { path: "#/ux-metrics", title: "UX Metrics & Findings · PRISM", demoId: "ux-metrics", group: "UX Laboratory" },
  { path: "#/states", title: "Interface States · PRISM", demoId: "states", group: "States" },
  { path: "#/accessibility/semantic-html", title: "Semantic HTML · PRISM", demoId: "a11y-semantic-html", group: "Accessibility Lab" },
  { path: "#/accessibility/keyboard-navigation", title: "Keyboard Navigation · PRISM", demoId: "a11y-keyboard-navigation", group: "Accessibility Lab" },
  { path: "#/accessibility/focus-management", title: "Focus Management · PRISM", demoId: "a11y-focus-management", group: "Accessibility Lab" },
  { path: "#/accessibility/screen-readers", title: "Names & Announcements · PRISM", demoId: "a11y-screen-readers", group: "Accessibility Lab" },
  { path: "#/accessibility/color-contrast", title: "Color Contrast · PRISM", demoId: "a11y-color-contrast", group: "Accessibility Lab" },
  { path: "#/accessibility/forms", title: "Accessible Forms · PRISM", demoId: "a11y-forms", group: "Accessibility Lab" },
  { path: "#/accessibility/dialogs", title: "Accessible Dialogs · PRISM", demoId: "a11y-dialogs", group: "Accessibility Lab" },
  { path: "#/accessibility/motion", title: "Motion & Reduced Motion · PRISM", demoId: "a11y-motion", group: "Accessibility Lab" },
  { path: "#/accessibility/wcag-checklist", title: "WCAG Checklist · PRISM", demoId: "a11y-wcag-checklist", group: "Accessibility Lab" },
  { path: "#/accessibility/audit", title: "Accessibility Audit · PRISM", demoId: "a11y-audit", group: "Accessibility Lab" },
  { path: "#/responsive/breakpoints", title: "Breakpoint Lab · PRISM", demoId: "resp-breakpoints", group: "Responsive Lab" },
  { path: "#/responsive/layouts", title: "Fluid, Grid & Flex · PRISM", demoId: "resp-layouts", group: "Responsive Lab" },
  { path: "#/responsive/typography", title: "Responsive Typography · PRISM", demoId: "resp-typography", group: "Responsive Lab" },
  { path: "#/responsive/navigation", title: "Responsive Navigation · PRISM", demoId: "resp-navigation", group: "Responsive Lab" },
  { path: "#/responsive/tables", title: "Responsive Tables · PRISM", demoId: "resp-tables", group: "Responsive Lab" },
  { path: "#/responsive/forms", title: "Responsive Forms · PRISM", demoId: "resp-forms", group: "Responsive Lab" },
  { path: "#/responsive/device-preview", title: "Device Preview · PRISM", demoId: "resp-device-preview", group: "Responsive Lab" },
  { path: "#/interface-states/loading", title: "Loading States · PRISM", demoId: "state-loading", group: "Interface States" },
  { path: "#/interface-states/empty", title: "Empty States · PRISM", demoId: "state-empty", group: "Interface States" },
  { path: "#/interface-states/errors", title: "Error States · PRISM", demoId: "state-errors", group: "Interface States" },
  { path: "#/interface-states/success", title: "Success States · PRISM", demoId: "state-success", group: "Interface States" },
  { path: "#/interface-states/offline", title: "Offline States · PRISM", demoId: "state-offline", group: "Interface States" },
  { path: "#/interface-states/permissions", title: "Permission States · PRISM", demoId: "state-permissions", group: "Interface States" },
  { path: "#/interface-states/session", title: "Session States · PRISM", demoId: "state-session", group: "Interface States" },
  { path: "#/interface-states/partial-failure", title: "Partial Failure · PRISM", demoId: "state-partial-failure", group: "Interface States" },
  { path: "#/interface-states/stale-data", title: "Stale Data · PRISM", demoId: "state-stale-data", group: "Interface States" },
  { path: "#/interface-states/recovery", title: "Recovery Patterns · PRISM", demoId: "state-recovery", group: "Interface States" },
  { path: "#/ai", title: "AI Studio · PRISM", demoId: "ai", group: "AI" },
  { path: "#/accessibility", title: "Accessibility Lab · PRISM", demoId: "a11y", group: "Accessibility" },
  { path: "#/responsive", title: "Responsive Lab · PRISM", demoId: "responsive", group: "Responsive" },
  { path: "#/tokens", title: "Tokens & Theming · PRISM", demoId: "tokens", group: "System" },
  { path: "#/testing", title: "Testing Lab · PRISM", demoId: "testing", group: "System" },
];

export const NOT_FOUND_TITLE = "Page not found · PRISM";

/** Strip query string, look up the route, report whether it exists. */
export function resolveRoute(rawHash: string): { def: RouteDef | null; path: string } {
  const path = (rawHash.split("?")[0] || "#/") as string;
  return { def: ROUTES.find((r) => r.path === path) ?? null, path };
}

/** Invariant: every demo in the catalogue has exactly one route. */
export function catalogueCoverage(): { missing: string[] } {
  const missing = DEMOS.filter((d) => !ROUTES.some((r) => r.path === d.route)).map((d) => d.id);
  return { missing };
}
