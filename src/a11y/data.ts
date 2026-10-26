/**
 * Accessibility laboratory — topics, WCAG checklist, contrast presets,
 * hex validation, and explorer registry entries.
 * Terminology rule: automated results ≠ conformance; simulations ≠ AT output.
 */
import type { DemoMeta } from "../lib/core";

export type Pour = "Perceivable" | "Operable" | "Understandable" | "Robust";

export interface A11yTopic {
  slug: string; name: string; tagline: string; desc: string;
  pour: Pour; difficulty: "Beginner" | "Intermediate" | "Advanced";
  wcag: string[]; why: string; mistakes: string[]; checklist: string[];
}

export const TOPICS: A11yTopic[] = [
  { slug: "semantic-html", name: "Semantic HTML", tagline: "Use the element that means it", desc: "Headings, landmarks, lists, tables and native controls — compared against div-soup with an inspectable markup view.", pour: "Robust", difficulty: "Beginner", wcag: ["1.3.1 Info and Relationships (A)", "4.1.1 Parsing (A)"], why: "Assistive tech navigates by semantics; divs expose nothing.", mistakes: ["Click-handler divs", "Skipped heading levels", "Tables for layout"], checklist: ["One h1 per view", "Landmarks: header/nav/main/footer", "Lists use list markup"] },
  { slug: "keyboard-navigation", name: "Keyboard Navigation", tagline: "Every pointer path has a key path", desc: "Tab order, Enter/Space activation, skip links and a live focus inspector — no traps, no pointer-only controls.", pour: "Operable", difficulty: "Intermediate", wcag: ["2.1.1 Keyboard (A)", "2.1.2 No Keyboard Trap (A)", "2.4.3 Focus Order (A)"], why: "Motor, vision and power users all depend on the keyboard.", mistakes: ["Div buttons", "Positive tabindex", "Hover-only menus"], checklist: ["Tab reaches everything", "Shift+Tab reverses", "No traps; skip link works"] },
  { slug: "focus-management", name: "Focus Management", tagline: "Focus is a cursor — never lose it", desc: "Focus order viewer, skip-link demo, route-change focus, restoration after dialogs, and obscured-focus checks.", pour: "Operable", difficulty: "Advanced", wcag: ["2.4.3 Focus Order (A)", "2.4.11 Focus Not Obscured, Minimum (AA)", "3.2.3 Consistent Navigation (AA)"], why: "Lost focus strands screen-reader and keyboard users silently.", mistakes: ["Focus dropped to body", "Sticky headers covering focus", "No focus on view change"], checklist: ["Focus visible everywhere", "Focus never obscured", "Restored after overlays"] },
  { slug: "screen-readers", name: "Names & Announcements", tagline: "What AT actually hears", desc: "Accessible-name computation, live regions, error announcements and state exposure — with honest simulation limits.", pour: "Perceivable", difficulty: "Intermediate", wcag: ["1.3.1 Info and Relationships (A)", "4.1.2 Name, Role, Value (A)", "4.1.3 Status Messages (AA)"], why: "Unnamed controls are invisible; silent updates never happened.", mistakes: ["Icon buttons without labels", "Placeholder as label", "Status only by color"], checklist: ["Every control named", "Live regions for async updates", "Expanded/checked exposed"] },
  { slug: "color-contrast", name: "Color Contrast", tagline: "Math, not eyeballing", desc: "Validated hex inputs, correct luminance math, AA thresholds for normal/large/non-text, presets and reset.", pour: "Perceivable", difficulty: "Beginner", wcag: ["1.4.3 Contrast, Minimum (AA)", "1.4.11 Non-text Contrast (AA)"], why: "Low vision, glare and cheap screens all punish thin contrast.", mistakes: ["Grey-on-grey placeholders", "Color-only status", "Text over busy photos"], checklist: ["4.5:1 body text", "3:1 large text + UI", "Tested in both themes"] },
  { slug: "forms", name: "Accessible Forms", tagline: "Labels that never leave", desc: "Poor vs improved form side by side: persistent labels, hints, associated errors, autocomplete and summary.", pour: "Understandable", difficulty: "Intermediate", wcag: ["1.3.5 Identify Input Purpose (AA)", "3.3.1 Error Identification (A)", "3.3.3 Error Suggestion (AA)"], why: "Forms are where users fail most — and blame themselves.", mistakes: ["Placeholder-only labels", "Errors announced nowhere", "Clearing input on error"], checklist: ["Visible persistent labels", "Errors named + linked", "autocomplete set"] },
  { slug: "dialogs", name: "Accessible Dialogs", tagline: "A lifecycle, not a popup", desc: "Title/description, initial focus, containment, Esc, backdrop discipline, restoration, long-content scroll, responsive sizing.", pour: "Operable", difficulty: "Intermediate", wcag: ["2.1.2 No Keyboard Trap (A)", "2.4.3 Focus Order (A)"], why: "Dialogs move users to a new context — the move must be managed.", mistakes: ["No focus trap", "Background still interactive", "Focus not returned"], checklist: ["Labelled + described", "Focus in, trapped, returned", "Esc + backdrop sane"] },
  { slug: "motion", name: "Motion & Reduced Motion", tagline: "Animate with consent", desc: "Transitions, loaders and expansions with OS-preference respect plus a scoped lab override for comparison.", pour: "Operable", difficulty: "Beginner", wcag: ["2.3.3 Animation from Interactions (AAA, cited as best practice)"], why: "Vestibular disorders make gratuitous motion physically harmful.", mistakes: ["Parallax everywhere", "Essential info only in animation", "Ignoring the OS setting"], checklist: ["Respects prefers-reduced-motion", "No flashing >3/s", "Content complete without motion"] },
  { slug: "wcag-checklist", name: "WCAG Checklist", tagline: "Evaluation aid, not certificate", desc: "POUR-organized checkpoints with criteria, manual steps, results and notes — progress computed from real selections.", pour: "Understandable", difficulty: "Intermediate", wcag: ["Covers 2.2 AA checkpoints used in this lab"], why: "Structure beats memory for consistent evaluations.", mistakes: ["Claiming conformance from scans", "Skipping manual checks", "No evidence recorded"], checklist: ["Every item has an owner", "Fails link to findings", "Re-run after fixes"] },
  { slug: "audit", name: "Accessibility Audit", tagline: "Real checks, honest scope", desc: "On-demand automated checks run against a live preview panel — violations with impact, element, rule and fix, plus manual items and a remediation workflow.", pour: "Robust", difficulty: "Advanced", wcag: ["Cross-cutting verification"], why: "Automation catches ~30%; this tool shows exactly which 30% and what remains manual.", mistakes: ["Clean scan = accessible", "Fabricated violations", "No remediation loop"], checklist: ["Automated ≠ complete", "Manual items tracked", "Findings resolved, re-scanned"] },
];

export interface CheckItem {
  id: string; pour: Pour; title: string; sc: string; how: string;
}
export type CheckResult = "unchecked" | "pass" | "fail" | "na";

export const CHECKLIST: CheckItem[] = [
  { id: "c-alt", pour: "Perceivable", title: "Text alternatives", sc: "1.1.1 Non-text Content (A)", how: "Inspect every img/icon: meaningful alt, or alt=\"\" + aria-hidden if decorative." },
  { id: "c-contrast", pour: "Perceivable", title: "Text contrast ≥ 4.5:1", sc: "1.4.3 Contrast, Minimum (AA)", how: "Sample body text with the Contrast lab; check both themes." },
  { id: "c-nontext", pour: "Perceivable", title: "Non-text contrast ≥ 3:1", sc: "1.4.11 Non-text Contrast (AA)", how: "Check icons, borders, focus rings against adjacent colors." },
  { id: "c-reflow", pour: "Perceivable", title: "Reflow at 320px / 400% zoom", sc: "1.4.10 Reflow (AA)", how: "Narrow to 320px: no two-dimensional scrolling, no clipped controls." },
  { id: "c-keyboard", pour: "Operable", title: "Full keyboard operation", sc: "2.1.1 Keyboard (A)", how: "Unplug the mouse: complete the core task with Tab/Enter/Esc/arrows." },
  { id: "c-trap", pour: "Operable", title: "No keyboard traps", sc: "2.1.2 No Keyboard Trap (A)", how: "Tab through widgets, embeds and dialogs; verify exit everywhere." },
  { id: "c-focusvis", pour: "Operable", title: "Visible focus indicator", sc: "2.4.7 Focus Visible (AA)", how: "Tab through: every stop shows a 2px+ indicator with 3:1 contrast." },
  { id: "c-obscured", pour: "Operable", title: "Focus not obscured", sc: "2.4.11 Focus Not Obscured, Minimum (AA)", how: "Sticky headers/footers must not cover the focused element." },
  { id: "c-target", pour: "Operable", title: "Target size ≥ 24px (AA)", sc: "2.5.8 Target Size, Minimum (AA)", how: "Spot-check icon buttons and pagination; note exceptions." },
  { id: "c-labels", pour: "Understandable", title: "Labels and instructions", sc: "3.3.2 Labels or Instructions (A)", how: "Every input has a persistent visible label, not placeholder-only." },
  { id: "c-errors", pour: "Understandable", title: "Error identification + suggestion", sc: "3.3.1/3.3.3 (A/AA)", how: "Trigger each error: field named, fix described, input preserved." },
  { id: "c-nav", pour: "Understandable", title: "Consistent navigation", sc: "3.2.3 Consistent Navigation (AA)", how: "Nav order and labels identical across views in this lab." },
  { id: "c-errprev", pour: "Understandable", title: "Error prevention for consequential actions", sc: "3.3.4 Error Prevention, Legal/Financial/Data (AA)", how: "Deletes/charges: review, verify, confirm with the item named." },
  { id: "c-status", pour: "Robust", title: "Status messages announced", sc: "4.1.3 Status Messages (AA)", how: "Save/search/upload outcomes appear in live regions without focus theft." },
  { id: "c-name", pour: "Robust", title: "Name, role, value", sc: "4.1.2 Name, Role, Value (A)", how: "Custom controls expose correct semantics; verify with the Names lab." },
  { id: "c-motion", pour: "Operable", title: "Motion respects preference", sc: "2.3.3 Animation from Interactions (AAA*)", how: "Enable reduced motion: content complete, no essential animation. (*best practice)" },
];

export const CONTRAST_PRESETS: { label: string; fg: string; bg: string }[] = [
  { label: "Body (default)", fg: "#0f172a", bg: "#ffffff" },
  { label: "Muted on white", fg: "#64748b", bg: "#ffffff" },
  { label: "Placeholder grey", fg: "#aaaaaa", bg: "#ffffff" },
  { label: "Dark theme body", fg: "#f1f5f9", bg: "#0a0a12" },
  { label: "Violet button", fg: "#ffffff", bg: "#7c3aed" },
  { label: "Amber warning", fg: "#92400e", bg: "#fef3c7" },
];

/** Strict 3- or 6-digit hex validation. */
export function isValidHex(v: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim());
}
export function normalizeHex(v: string): string {
  const t = v.trim().replace("#", "");
  const full = t.length === 3 ? t.split("").map((c) => c + c).join("") : t;
  return ("#" + full).toLowerCase();
}

const ACCENTS = ["#16a34a", "#2563eb", "#7c3aed", "#0ea5e9", "#f59e0b", "#ec4899", "#64748b", "#14b8a6", "#f43f5e", "#a855f7"];
const DIFFS: DemoMeta["difficulty"][] = ["Beginner", "Intermediate", "Advanced", "Intermediate", "Beginner", "Intermediate", "Intermediate", "Beginner", "Intermediate", "Advanced"];

export const A11Y_DEMOS: DemoMeta[] = TOPICS.map((t, i) => ({
  id: `a11y-${t.slug}`,
  name: t.name,
  description: t.tagline + ".",
  category: "Accessibility Lab",
  route: `#/accessibility/${t.slug}`,
  teaches: t.desc,
  interactions: t.checklist.slice(0, 2),
  difficulty: DIFFS[i],
  status: "functional",
  styles: ["Minimal"],
  icon: "accessibility",
  accent: ACCENTS[i],
  estimatedMins: 4 + ((i * 5) % 4),
}));
