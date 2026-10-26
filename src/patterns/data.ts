/**
 * Interaction Patterns Laboratory — shared catalogue, dataset and query logic.
 *
 * PATTERNS drives the overview gallery. RECORDS is a deterministic 48-row
 * dataset shared by the search, table and pagination demos so behavior can
 * be compared fairly. queryRecords() is pure and unit-tested.
 */
import { seeded } from "../lib/seed";

export type Complexity = "Foundational" | "Intermediate" | "Advanced";
export type PatternCategory = "Navigation" | "Data" | "Forms" | "Overlays" | "Feedback" | "Input";

export interface PatternDef {
  slug: string;
  name: string;
  tagline: string;
  desc: string;
  category: PatternCategory;
  complexity: Complexity;
  keyboard: string;
  useCases: string;
  order: number;
}

export const PATTERNS: PatternDef[] = [
  { slug: "navigation", name: "Navigation", tagline: "Find your way, stay oriented", desc: "Sidebar + topbar + breadcrumbs with active-route tracking, nested groups and a mobile drawer. Every link lands somewhere real.", category: "Navigation", complexity: "Intermediate", keyboard: "Tab through links; Enter activates; drawer closes on Esc.", useCases: "App shells, docs, admin consoles.", order: 1 },
  { slug: "search-and-filter", name: "Search & Filter", tagline: "Narrow 48 records to the right one", desc: "Multi-field search composed with category/status filters, sorting, chips and URL-synced state.", category: "Data", complexity: "Intermediate", keyboard: "Slash focuses search; chips are buttons; selects are native.", useCases: "Catalogues, admin lists, inboxes.", order: 2 },
  { slug: "data-table", name: "Data Table", tagline: "Sort, select, act — honestly", desc: "Sortable columns, page-scoped selection with indeterminate state, bulk actions, row menus and a detail drawer.", category: "Data", complexity: "Advanced", keyboard: "Checkboxes are native; sort buttons announce direction via aria-sort.", useCases: "Ops consoles, billing, user management.", order: 3 },
  { slug: "forms", name: "Forms & Validation", tagline: "Every control, validated kindly", desc: "Text, textarea, select, radios, checkboxes, switch and date inputs with blur/submit validation and preserved input.", category: "Forms", complexity: "Foundational", keyboard: "Native controls; errors linked with aria-describedby; summary uses role=alert.", useCases: "Settings, onboarding, checkout.", order: 4 },
  { slug: "multi-step-form", name: "Multi-Step Form", tagline: "A wizard that never loses your place", desc: "Validated steps, back-navigation with preserved values, review screen and guarded single submission.", category: "Forms", complexity: "Intermediate", keyboard: "Step indicator uses aria-current=step; errors announced per field.", useCases: "Project creation, signup, checkout.", order: 5 },
  { slug: "modal-and-dialog", name: "Modals & Dialogs", tagline: "Interrupt only with intent", desc: "Informational, confirmation, destructive, form and detail dialogs with focus trap, return-focus and Esc.", category: "Overlays", complexity: "Intermediate", keyboard: "Focus moves in on open, trapped while open, Esc closes, focus returns.", useCases: "Confirms, editors, detail views.", order: 6 },
  { slug: "menus-and-popovers", name: "Menus & Popovers", tagline: "Small surfaces, precise behavior", desc: "Dropdown menus, sort menu, user menu and an info popover with outside-click, Esc and arrow keys.", category: "Overlays", complexity: "Intermediate", keyboard: "Enter/Space opens; Esc closes; arrows move between items.", useCases: "Row actions, sorters, account menus.", order: 7 },
  { slug: "tabs-and-accordion", name: "Tabs & Accordion", tagline: "One view at a time, done right", desc: "Roving-tabindex tabs with proper tab/panel linkage plus single- and multi-open accordions.", category: "Navigation", complexity: "Foundational", keyboard: "Arrows/Home/End move tabs; accordions are plain buttons with aria-expanded.", useCases: "Settings pages, FAQs, detail views.", order: 8 },
  { slug: "notifications", name: "Notifications", tagline: "Feedback with manners", desc: "Success/info/warning/error toasts, inline and persistent alerts, a progress notification and a stacking cap.", category: "Feedback", complexity: "Foundational", keyboard: "Dismiss buttons are focusable; live regions announce without stealing focus.", useCases: "Save confirmations, background jobs, errors.", order: 9 },
  { slug: "command-palette", name: "Command Palette", tagline: "Keyboard-first control center", desc: "Ctrl/⌘K palette with fuzzy search, arrow navigation, guarded shortcut scope and real commands.", category: "Input", complexity: "Advanced", keyboard: "Ctrl/⌘K opens; arrows move; Enter runs; Esc closes; ignored while typing.", useCases: "Power-user navigation, large apps.", order: 10 },
  { slug: "file-upload", name: "File Upload", tagline: "Local simulation, honest limits", desc: "Picker + drop zone, type/size validation, per-file progress, failure injection with retry. Nothing leaves the browser.", category: "Input", complexity: "Intermediate", keyboard: "Native file input; remove/retry are buttons; progress uses progressbar.", useCases: "Attachments, imports, avatars.", order: 11 },
  { slug: "drag-and-drop", name: "Drag & Drop", tagline: "Pointer joy, keyboard parity", desc: "Kanban board with HTML5 drag-and-drop plus full keyboard controls, announcements and reset.", category: "Input", complexity: "Advanced", keyboard: "Arrow buttons move cards; a Move-to menu jumps columns; results announced.", useCases: "Boards, playlists, prioritization.", order: 12 },
  { slug: "progress-and-feedback", name: "Progress & Feedback", tagline: "Never fake a busy spinner", desc: "Determinate, indeterminate and step progress driven by real timers, with cancel, retry and completion.", category: "Feedback", complexity: "Foundational", keyboard: "Progress exposed via progressbar roles; controls stay labelled.", useCases: "Exports, onboarding, multi-phase jobs.", order: 13 },
  { slug: "pagination", name: "Pagination", tagline: "Page 4 of 12, without surprises", desc: "Prev/next, numbered pages with ellipsis, page-size control, clamped pages after filtering.", category: "Data", complexity: "Foundational", keyboard: "Current page uses aria-current; boundary buttons disable at the ends.", useCases: "Search results, audit logs, tables.", order: 14 },
  { slug: "tooltips", name: "Tooltips", tagline: "Help on hover and focus", desc: "Concise contextual help for pointer and keyboard users, with dismissal and placement variants.", category: "Feedback", complexity: "Foundational", keyboard: "Focus shows, blur/Esc hides; content never holds essential-only info.", useCases: "Icon buttons, jargon, truncated text.", order: 15 },
  { slug: "empty-error-states", name: "Empty & Error States", tagline: "Every dead end has a door", desc: "No data, no results, denied permission, retryable failure, offline queue and partial failure — each recoverable.", category: "Feedback", complexity: "Intermediate", keyboard: "Every recovery is a real button; outcomes announced via live regions.", useCases: "First-run, search, sync, billing.", order: 16 },
  { slug: "undo-and-confirmation", name: "Undo & Confirmation", tagline: "Destructive actions, safe defaults", desc: "Confirm-before-delete with named items, timed undo window for reversible actions, honest local-only semantics.", category: "Feedback", complexity: "Intermediate", keyboard: "Destructive dialogs default focus to Cancel; undo is a button with countdown.", useCases: "Deletes, archives, bulk edits.", order: 17 },
];

export const PATTERN_SLUGS = PATTERNS.map((p) => p.slug);

export function patternDef(slug: string): PatternDef {
  const found = PATTERNS.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown pattern slug: ${slug}`);
  return found;
}

/* ── Deterministic dataset ─────────────────────────────── */

export type RecStatus = "active" | "draft" | "review" | "archived";
export type RecCategory = "Website" | "Mobile" | "API" | "Internal";

export interface Rec {
  id: string;
  name: string;
  owner: string;
  category: RecCategory;
  status: RecStatus;
  updated: string;
  budget: number;
}

const OWNERS = ["Amara K.", "Jonas M.", "Rin S.", "Priya N.", "Theo B.", "Lena W."];
const CATS: RecCategory[] = ["Website", "Mobile", "API", "Internal"];
const STATUSES: RecStatus[] = ["active", "draft", "review", "archived"];
const TOPICS = ["Checkout", "Onboarding", "Search", "Billing", "Notifications", "Dashboard", "Auth", "Exports", "Inbox", "Reports", "Profile", "Sync"];

export const RECORDS: Rec[] = Array.from({ length: 48 }, (_, i) => {
  const r = (k: number) => seeded(i * 31 + k);
  return {
    id: `PRJ-${1000 + i}`,
    name: `${TOPICS[i % TOPICS.length]} ${CATS[Math.floor(r(1) * 4)].toLowerCase()} revamp ${Math.floor(i / TOPICS.length) + 1}`,
    owner: OWNERS[Math.floor(r(2) * OWNERS.length)],
    category: CATS[Math.floor(r(3) * 4)],
    status: STATUSES[Math.floor(r(4) * 4)],
    updated: `2026-10-${String(1 + Math.floor(r(5) * 27)).padStart(2, "0")}`,
    budget: 400 + Math.floor(r(6) * 46) * 250,
  };
});

export type SortKey = "name" | "owner" | "status" | "updated" | "budget";

export interface RecQuery {
  q?: string;
  cats?: RecCategory[];
  statuses?: RecStatus[];
  sortKey?: SortKey;
  sortDir?: 1 | -1;
  page?: number;
  perPage?: number;
}

export interface RecResult {
  rows: Rec[];
  total: number;
  pages: number;
  page: number;
}

/** Pure filter → sort → paginate pipeline shared by search, table and pager demos. */
export function queryRecords(recs: Rec[], q: RecQuery): RecResult {
  const term = (q.q ?? "").trim().toLowerCase();
  const filtered = recs.filter((r) => {
    if (term && !(r.id + " " + r.name + " " + r.owner).toLowerCase().includes(term)) return false;
    if (q.cats?.length && !q.cats.includes(r.category)) return false;
    if (q.statuses?.length && !q.statuses.includes(r.status)) return false;
    return true;
  });
  const key = q.sortKey ?? "updated";
  const dir = q.sortDir ?? -1;
  const sorted = [...filtered].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
    return cmp * dir;
  });
  const perPage = q.perPage ?? 8;
  const pages = Math.max(1, Math.ceil(sorted.length / perPage));
  const page = Math.min(Math.max(1, q.page ?? 1), pages);
  return { rows: sorted.slice((page - 1) * perPage, page * perPage), total: sorted.length, pages, page };
}

/* ── Explorer mapping ──────────────────────────────────── */

const DIFF: Record<Complexity, "Beginner" | "Intermediate" | "Advanced"> = {
  Foundational: "Beginner",
  Intermediate: "Intermediate",
  Advanced: "Advanced",
};

const ACCENTS = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#6366f1", "#14b8a6", "#f43f5e", "#a855f7", "#eab308", "#22c55e", "#0ea5e9", "#f97316", "#64748b", "#7c3aed", "#06b6d4", "#ef4444"];

export interface PatternDemoMeta {
  id: string;
  name: string;
  description: string;
  route: string;
  teaches: string;
  interactions: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  accent: string;
  estimatedMins: number;
}

/** Explorer visual-style tag per pattern (shared STYLE_FILTERS vocabulary). */
export const PATTERN_STYLE: Record<string, string> = {
  navigation: "Minimal", "search-and-filter": "Dense", "data-table": "Dense",
  forms: "Light", "multi-step-form": "Light", "modal-and-dialog": "Minimal",
  "menus-and-popovers": "Minimal", "tabs-and-accordion": "Minimal",
  notifications: "Flat", "command-palette": "Dark", "file-upload": "Light",
  "drag-and-drop": "Flat", "progress-and-feedback": "Flat", pagination: "Dense",
  tooltips: "Minimal", "empty-error-states": "Light", "undo-and-confirmation": "Minimal",
};

export const PATTERN_DEMOS: (PatternDemoMeta & { category: "Patterns"; status: "functional"; icon: string; styles: string[] })[] =
  PATTERNS.map((p, i) => ({
    id: `pattern-${p.slug}`,
    name: p.name,
    description: p.tagline + ".",
    category: "Patterns" as const,
    route: `#/patterns/${p.slug}`,
    teaches: p.desc,
    interactions: [p.keyboard.split(";")[0]],
    difficulty: DIFF[p.complexity],
    status: "functional" as const,
    styles: [PATTERN_STYLE[p.slug] ?? "Minimal"],
    icon: "command",
    accent: ACCENTS[i % ACCENTS.length],
    estimatedMins: 4 + ((i * 7) % 4),
  }));
