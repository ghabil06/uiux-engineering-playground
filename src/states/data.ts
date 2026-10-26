/**
 * Interface-states laboratory — discriminated-union request machine,
 * component/state coverage matrix, and explorer entries.
 * One explicit model replaces scattered booleans: impossible combinations
 * (e.g. loading AND success) are unrepresentable by construction.
 */
import type { DemoMeta } from "../lib/core";

export type ReqState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; at: string }
  | { status: "error"; message: string }
  | { status: "retrying"; attempt: number };

export type ReqEvent =
  | { type: "start" }
  | { type: "resolve" }
  | { type: "fail"; message: string }
  | { type: "retry" }
  | { type: "reset" };

/**
 * Pure transition function. Returns the next state plus whether the
 * transition was permitted — invalid transitions are rejected safely
 * (state unchanged) instead of producing impossible combinations.
 */
export function transition(s: ReqState, e: ReqEvent): { next: ReqState; ok: boolean } {
  switch (s.status) {
    case "idle":
      return e.type === "start" ? { next: { status: "loading" }, ok: true } : { next: s, ok: false };
    case "loading":
      if (e.type === "resolve") return { next: { status: "success", at: new Date().toLocaleTimeString() }, ok: true };
      if (e.type === "fail") return { next: { status: "error", message: e.message }, ok: true };
      return { next: s, ok: false };
    case "error":
      if (e.type === "retry") return { next: { status: "retrying", attempt: 1 }, ok: true };
      if (e.type === "reset") return { next: { status: "idle" }, ok: true };
      return { next: s, ok: false };
    case "retrying":
      if (e.type === "resolve") return { next: { status: "success", at: new Date().toLocaleTimeString() }, ok: true };
      if (e.type === "fail") return { next: { status: "error", message: e.message }, ok: true };
      if (e.type === "reset") return { next: { status: "idle" }, ok: true };
      return { next: s, ok: false };
    case "success":
      return e.type === "reset" ? { next: { status: "idle" }, ok: true } : { next: s, ok: false };
  }
}

export const PERMITTED: Record<ReqState["status"], string[]> = {
  idle: ["start"],
  loading: ["resolve", "fail"],
  error: ["retry", "reset"],
  retrying: ["resolve", "fail", "reset"],
  success: ["reset"],
};

export interface MatrixRow {
  component: string;
  states: string[];
  demo: string | null;
  note: string;
}

export const MATRIX: MatrixRow[] = [
  { component: "Button", states: ["idle", "loading", "disabled", "success"], demo: "#/interface-states/loading", note: "Loading implies disabled; success is transient confirmation." },
  { component: "Input", states: ["idle", "focus", "error", "disabled", "success"], demo: "#/accessibility/forms", note: "Errors named + linked; values preserved." },
  { component: "Form", states: ["idle", "validating", "error", "submitting", "success"], demo: "#/patterns/forms", note: "No errors before touch; summary on submit." },
  { component: "Data table", states: ["loading", "empty", "populated", "error", "stale"], demo: "#/patterns/data-table", note: "Skeleton rows; empty offers reset; stale is labelled." },
  { component: "Chart panel", states: ["loading", "populated", "empty", "error", "stale"], demo: "#/interface-states/stale-data", note: "Text equivalent always; never color-only." },
  { component: "File upload", states: ["idle", "uploading", "success", "error", "retrying"], demo: "#/patterns/file-upload", note: "Per-file states; retry is idempotent." },
  { component: "Dialog", states: ["closed", "open", "submitting", "error"], demo: "#/accessibility/dialogs", note: "Focus in, trapped, returned; Esc sane." },
  { component: "Notification", states: ["queued", "visible", "dismissed", "persistent"], demo: "#/patterns/notifications", note: "Errors persist; the rest auto-dismiss; capped." },
  { component: "Navigation", states: ["idle", "loading", "offline", "denied"], demo: "#/patterns/navigation", note: "Active route announced; drawer Esc-closes." },
  { component: "AI response", states: ["idle", "streaming", "complete", "error", "stale"], demo: "#/ai", note: "Streaming labelled; confidence as bands." },
];

const ACCENTS = ["#0ea5e9", "#8b5cf6", "#ef4444", "#10b981", "#f59e0b", "#64748b", "#a855f7", "#ec4899", "#14b8a6", "#f97316"];

export interface StateDemoDef { slug: string; name: string; tagline: string; desc: string; difficulty: DemoMeta["difficulty"] }

export const STATE_DEFS: StateDemoDef[] = [
  { slug: "loading", name: "Loading States", tagline: "Skeletons, spinners and honest waits", desc: "Skeleton, spinner, inline, full-panel and delayed-response loading — each labelled, none fake.", difficulty: "Beginner" },
  { slug: "empty", name: "Empty States", tagline: "Blank slates that teach", desc: "First-use, no-results, no-filter-match and cleared collections — every one with a next action.", difficulty: "Beginner" },
  { slug: "errors", name: "Error States", tagline: "Failures with a way back", desc: "Validation, retryable, non-retryable, field- and page-level errors — all with recovery.", difficulty: "Intermediate" },
  { slug: "success", name: "Success States", tagline: "Confirm, then get out of the way", desc: "Inline, toast, workflow-complete and saved indicators — confirmation without noise.", difficulty: "Beginner" },
  { slug: "offline", name: "Offline States", tagline: "Simulated disconnection, queued work", desc: "Explicitly simulated offline mode: banner, queued writes, reconnect flush. Real connectivity untouched.", difficulty: "Intermediate" },
  { slug: "permissions", name: "Permission States", tagline: "Denied, explained, escapable", desc: "Restricted action with a plain-language reason plus a safe alternative — never a bare 403.", difficulty: "Beginner" },
  { slug: "session", name: "Session States", tagline: "Warn, expire, resume", desc: "Pre-expiry warning, simulated expiry, reauthentication that preserves safe input. No real credentials.", difficulty: "Intermediate" },
  { slug: "partial-failure", name: "Partial Failure", tagline: "One panel down, the page lives on", desc: "Independent sections where one fails; retry targets only the failed section.", difficulty: "Advanced" },
  { slug: "stale-data", name: "Stale Data", tagline: "Old data, honestly labelled", desc: "Explicit sample timestamps, refresh action, cached-vs-fresh distinction.", difficulty: "Intermediate" },
  { slug: "recovery", name: "Recovery Patterns", tagline: "Retry, reset, cancel, undo", desc: "The full recovery toolkit in one place with clear outcomes per action.", difficulty: "Beginner" },
];

export const STATE_DEMOS: DemoMeta[] = STATE_DEFS.map((d, i) => ({
  id: `state-${d.slug}`,
  name: d.name,
  description: d.tagline + ".",
  category: "Interface States",
  route: `#/interface-states/${d.slug}`,
  teaches: d.desc,
  interactions: ["Trigger control", "Recovery action"],
  difficulty: d.difficulty,
  status: "functional",
  styles: ["Minimal"],
  icon: "layers",
  accent: ACCENTS[i],
  estimatedMins: 3 + ((i * 3) % 3),
}));
