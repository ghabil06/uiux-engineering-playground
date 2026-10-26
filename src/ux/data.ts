/**
 * UX Engineering Laboratory — shared catalogues, sample data and pure helpers.
 * All calculations (SUS, funnel, metrics, recommendations, flow validation)
 * are pure functions so they are unit-testable. Everything labeled simulated.
 */

export interface Principle {
  id: string; name: string; explain: string; why: string;
  poor: string; improved: string; checklist: string[];
  contexts: string; tradeoff: string;
}

export const PRINCIPLES: Principle[] = [
  { id: "visibility", name: "Visibility of system status", explain: "The interface always shows what is happening — loading, saving, syncing, done.", why: "Silence breeds repeat-clicks, abandonment and distrust.", poor: "A Submit button that goes dead for 6 seconds.", improved: "Button shows a spinner, then success or a retryable error.", checklist: ["Every async action has pending feedback", "Completion is confirmed, not assumed", "Background work is discoverable"], contexts: "Forms, uploads, payments, sync.", tradeoff: "Too much status noise becomes its own distraction." },
  { id: "match", name: "Match with the real world", explain: "Speak the user's language — their words, their concepts, their order.", why: "Jargon forces translation effort on every screen.", poor: "Error 402: entitlement check failed on SKU-9.", improved: "“Your trial ended — pick a plan to keep exporting.”", checklist: ["Labels use user vocabulary", "No unexplained codes or IDs", "Flows follow real-world sequence"], contexts: "Errors, pricing, onboarding.", tradeoff: "Precision sometimes needs the technical term too — pair both." },
  { id: "control", name: "User control and freedom", explain: "Provide undo, cancel and emergency exits — everywhere, especially wizards.", why: "Fear of irreversible mistakes freezes exploration.", poor: "A 5-step wizard with no Back button.", improved: "Back preserves entries; Cancel asks once, then exits cleanly.", checklist: ["Undo for reversible actions", "Cancel/exit always available", "No traps or dead ends"], contexts: "Wizards, editors, bulk actions.", tradeoff: "Exits must not discard work silently — confirm or autosave." },
  { id: "consistency", name: "Consistency and standards", explain: "Same words, same controls, same placement for the same jobs.", why: "Inconsistency re-teaches the interface on every screen.", poor: "Save, Submit, OK and Done all meaning 'confirm'.", improved: "One verb per action, platform conventions respected.", checklist: ["One label per action", "Controls behave identically everywhere", "Platform conventions followed"], contexts: "Design systems, multi-team products.", tradeoff: "Blind consistency can preserve a bad pattern — fix the pattern once." },
  { id: "error-prev", name: "Error prevention", explain: "Design the mistake out: constraints, defaults, previews, confirmations.", why: "Preventing beats apologizing — for users and support load.", poor: "Free-text date field accepting 'yesterday-ish'.", improved: "Date picker + format hint + range guard.", checklist: ["Risky inputs constrained", "Destructive actions confirmed", "Defaults choose the safe path"], contexts: "Forms, settings, deletions.", tradeoff: "Over-constraining experts slows them — offer escape hatches." },
  { id: "recognition", name: "Recognition rather than recall", explain: "Show options, recent items and context instead of demanding memory.", why: "Working memory holds ~4 items; recall fails under stress.", poor: "Coupon field with no hint where codes live.", improved: "Available coupons listed; recent codes remembered.", checklist: ["Options visible, not memorized", "Recent/contextual items surfaced", "Instructions at point of use"], contexts: "Search, codes, complex config.", tradeoff: "Showing everything aids novices but clutters experts — progressive disclosure." },
  { id: "flexibility", name: "Flexibility and efficiency", explain: "Accelerators for experts, guidance for novices — same interface.", why: "One speed fits nobody; experts churn on hand-holding.", poor: "A 12-click flow with no shortcuts, saved views or bulk actions.", improved: "⌘K palette, saved filters, bulk edit alongside the guided path.", checklist: ["Shortcuts for repeated tasks", "Customization where it pays", "Novice path still discoverable"], contexts: "Pro tools, admin consoles.", tradeoff: "Every accelerator is maintenance and documentation surface." },
  { id: "minimal", name: "Aesthetic and minimalist design", explain: "Every element competes for attention — remove the ones losing.", why: "Clutter raises perceived effort and hides primary actions.", poor: "Dashboard with 14 equally-weighted widgets and 6 CTAs.", improved: "One primary action; secondary content behind tabs.", checklist: ["One primary action per view", "Removed, not restyled, extras", "Whitespace is structural"], contexts: "Dashboards, landing, settings.", tradeoff: "Minimalism can hide power — keep advanced paths discoverable." },
  { id: "recovery", name: "Helpful error recovery", explain: "Errors in plain language: what happened, why, and the exact fix.", why: "Users blame themselves and quit when errors blame them.", poor: "“Invalid input.” (Which field? Invalid how?)", improved: "“Card expired 02/26 — update the expiry date.” + link to the field.", checklist: ["Plain language, no codes alone", "Names the field and the fix", "Preserves entered work"], contexts: "Validation, payments, sync.", tradeoff: "Specific messages cost writing effort per failure mode." },
  { id: "help", name: "Help and documentation", explain: "Help at the moment of need: inline hints, empty states, searchable docs.", why: "Nobody reads the manual first; everyone needs help mid-task.", poor: "A 90-page PDF linked from the footer.", improved: "Contextual hint + 60-second video + searchable docs.", checklist: ["Help at point of need", "Searchable and task-based", "Empty states teach"], contexts: "Onboarding, complex features.", tradeoff: "Great inline help can mask underlying complexity — fix both." },
  { id: "affordance", name: "Clear affordances and signifiers", explain: "Controls must look operable: buttons look pressable, links look clickable.", why: "Invisible interactivity is undiscoverable interactivity.", poor: "Flat grey text that is secretly the primary button.", improved: "Filled button with hover/press states and 44px target.", checklist: ["Interactive ≠ static at a glance", "Hover/focus/press states exist", "Disabled explains itself"], contexts: "Flat design, custom controls.", tradeoff: "Heavy chrome everywhere recreates clutter — reserve it for actions." },
  { id: "feedback", name: "Feedback and responsiveness", explain: "Every interaction answers within 100ms — even if only 'working on it'.", why: "Delayed feedback breaks the action-reaction loop.", poor: "Tapping like-heart: nothing for 2s, then count jumps.", improved: "Optimistic heart + count, reconciled quietly on failure.", checklist: ["<100ms acknowledgment", "Optimistic UI reconciles errors", "No fake progress"], contexts: "Likes, toggles, realtime.", tradeoff: "Optimistic UI needs rollback design for the failure case." },
  { id: "disclosure", name: "Progressive disclosure", explain: "Show the 20% used 80% of the time; stage the rest behind clear doors.", why: "Everything-at-once overwhelms; nothing-at-all frustrates.", poor: "A 40-field settings page with no sections.", improved: "Essentials visible; Advanced in a disclosed, labelled section.", checklist: ["Core path uncluttered", "Advanced paths labelled, not hidden", "Disclosure state visible"], contexts: "Settings, filters, pro features.", tradeoff: "Hiding too aggressively creates 'where is it?' support tickets." },
  { id: "hierarchy", name: "Information hierarchy", explain: "Size, weight, position and spacing declare what matters first.", why: "Without hierarchy everything shouts and nothing is heard.", poor: "Six headings at identical size above identical paragraphs.", improved: "One H1 job statement, scannable H2s, details collapsed.", checklist: ["Single clear primary message", "Headings form an outline", "Scanning beats reading"], contexts: "Articles, dashboards, results.", tradeoff: "Strong hierarchy editorializes — ensure secondary content stays findable." },
  { id: "irreversible", name: "Control over irreversible actions", explain: "Deleting, charging, publishing: confirm with the item named, default to safe.", why: "One misclick can destroy trust permanently.", poor: "“Are you sure?” with no item name and Delete pre-focused.", improved: "Names the item + impact; Cancel focused; undo where possible.", checklist: ["Item named in the confirm", "Safe default focused", "Undo offered for reversible cases"], contexts: "Delete, billing, publish.", tradeoff: "Friction on every action fatigues — reserve for real irreversibility." },
];

/* ── Heuristics lab ────────────────────────────────────── */

export interface HeuristicDemo {
  id: string; heuristic: string; principleId: string;
  poorTitle: string; poorDesc: string; poorCta: string;
  goodTitle: string; goodDesc: string; goodCta: string;
  explain: string;
}

export const HEURISTICS: HeuristicDemo[] = [
  { id: "h-status", heuristic: "Visibility of system status", principleId: "visibility", poorTitle: "Dead submit button", poorDesc: "Pressing it appears to do nothing for seconds.", poorCta: "Submit (dead)", goodTitle: "Honest submit button", goodDesc: "Loading → success, or a retryable error you can trigger.", goodCta: "Submit (honest)", explain: "Same action, different trust outcome. The honest version narrates pending → resolved, which is the whole heuristic." },
  { id: "h-consistency", heuristic: "Consistency and standards", principleId: "consistency", poorTitle: "Three words for Save", poorDesc: "Save, Submit and OK scattered across one flow.", poorCta: "???", goodTitle: "One verb everywhere", goodDesc: "“Save changes” on every step, in the same place.", goodCta: "Save changes", explain: "Recognition compounds: the second identical button is free, the second novel label costs re-learning." },
  { id: "h-errorprev", heuristic: "Error prevention", principleId: "error-prev", poorTitle: "Free-text expiry", poorDesc: "Anything goes in — errors arrive after submit.", poorCta: "Pay (hope)", goodTitle: "Constrained expiry", goodDesc: "MM/YY mask + range guard + instant hint.", goodCta: "Pay (guarded)", explain: "Constraints move the error from submit-time (expensive) to type-time (cheap)." },
  { id: "h-recognition", heuristic: "Recognition rather than recall", principleId: "recognition", poorTitle: "Coupon from memory", poorDesc: "Blank field, no hint where codes live.", poorCta: "Apply (blind)", goodTitle: "Coupons listed", goodDesc: "Available codes shown; recent one pre-highlighted.", goodCta: "Apply SAVE20", explain: "Showing options converts recall (fragile) into recognition (robust)." },
  { id: "h-control", heuristic: "User control and freedom", principleId: "control", poorTitle: "No way back", poorDesc: "Step 3 of 3 with no Back — a typo means restart.", poorCta: "Finish (!)", goodTitle: "Back that preserves", goodDesc: "Back keeps entries; Cancel confirms once.", goodCta: "← Back (safe)", explain: "Exits preserve work. Freedom without data loss is the actual requirement." },
  { id: "h-recovery", heuristic: "Helpful error recovery", principleId: "recovery", poorTitle: "“Invalid input.”", poorDesc: "No field, no reason, work preserved by luck.", poorCta: "OK (?)", goodTitle: "Named fix", goodDesc: "Field named, reason given, entry kept, focus moved.", goodCta: "Fix expiry date", explain: "A good error is a recovery plan: what, where, and the exact next action." },
];

/* ── Research methods ──────────────────────────────────── */

export type Evidence = "Qualitative" | "Quantitative" | "Mixed";
export interface Method {
  id: string; name: string; objective: string; questions: string;
  sources: string; evidence: Evidence; cost: 1 | 2 | 3; time: string;
  strengths: string; limits: string; bias: string; output: string; notAlone: string;
}

export const METHODS: Method[] = [
  { id: "interviews", name: "User interviews", objective: "Understand goals, mental models and context.", questions: "How do you…? What frustrates you about…?", sources: "5–12 representative users, purposive sampling.", evidence: "Qualitative", cost: 2, time: "Days", strengths: "Depth, surprise findings, language capture.", limits: "Said ≠ done; small-n.", bias: "Leading questions, confirmation bias, recall bias.", output: "Quotes, themes, opportunity map.", notAlone: "Pair with observation — never ship on interviews alone." },
  { id: "contextual", name: "Contextual inquiry", objective: "See real work in its real environment.", questions: "Show me how you handle… when…?", sources: "Users at work/home; apprentice-style shadowing.", evidence: "Qualitative", cost: 3, time: "Weeks", strengths: "Ecological validity; workarounds surface.", limits: "Expensive, scheduling-heavy, observer effect.", bias: "Hawthorne effect; over-indexing vivid sessions.", output: "Sequence models, breakdown list.", notAlone: "Triangulate counts with analytics." },
  { id: "surveys", name: "Surveys", objective: "Measure prevalence of attitudes/behaviors at scale.", questions: "How satisfied…? Which tools…? (closed + few open)", sources: "100+ respondents; mind sampling bias.", evidence: "Quantitative", cost: 1, time: "Days", strengths: "Cheap breadth; segmentable.", limits: "Shallow; garbage-in questions.", bias: "Acquiescence, sampling, survivorship.", output: "Distributions, segments, top complaints.", notAlone: "Never explains why — follow up qualitatively." },
  { id: "mod-test", name: "Moderated usability testing", objective: "Watch representative users attempt real tasks.", questions: "Task success? Where do they stall?", sources: "5–8 users per round, task scenarios.", evidence: "Mixed", cost: 2, time: "Days", strengths: "Finds real breakage fast; probe-able.", limits: "Lab ≠ field; facilitator influence.", bias: "Politeness, prompting too early.", output: "Task success, errors, severity-ranked issues.", notAlone: "One round isn't enough — iterate." },
  { id: "unmod-test", name: "Unmoderated usability testing", objective: "Task success at scale, fast.", questions: "Same as moderated, minus probes.", sources: "20–100 panel users, remote tools.", evidence: "Mixed", cost: 1, time: "Hours–days", strengths: "Fast, cheap, geographic reach.", limits: "No follow-up; cheaters; thin context.", bias: "Professional testers; satisficing.", output: "Success rates, misclick maps.", notAlone: "Use for benchmarking, not discovery." },
  { id: "observation", name: "Observational research", objective: "Record what people do unprompted.", questions: "Which paths dominate? Where do pauses cluster?", sources: "Session replays, field notes, support tickets.", evidence: "Qualitative", cost: 1, time: "Days", strengths: "Unfiltered behavior; always-on data.", limits: "No intent data; privacy constraints.", bias: "Interpretation without asking.", output: "Behavior clusters, rage-click reels.", notAlone: "Pair with interviews for the why." },
  { id: "diary", name: "Diary studies", objective: "Longitudinal habits and triggers over days/weeks.", questions: "When/why do you…? Log each occurrence.", sources: "10–20 committed participants.", evidence: "Mixed", cost: 3, time: "Weeks", strengths: "Time dimension; rare events captured.", limits: "Attrition; self-report burden.", bias: "Reactivity; selective logging.", output: "Timelines, trigger maps.", notAlone: "Needs an entry + exit interview." },
  { id: "tree", name: "Tree testing", objective: "Validate findability of an IA without visual design.", questions: "Where would you find…?", sources: "30–100 users, text-only tree.", evidence: "Quantitative", cost: 1, time: "Days", strengths: "Isolates IA from UI polish; cheap at scale.", limits: "No context, no content scent.", bias: "Task wording leaks answers.", output: "Success %, path analysis.", notAlone: "Follow with card sorts for regrouping." },
  { id: "cardsort", name: "Card sorting", objective: "Learn users' mental categories.", questions: "Group these; name the groups.", sources: "15–30 users, open or closed.", evidence: "Mixed", cost: 1, time: "Days", strengths: "Direct mental-model evidence.", limits: "Labels ≠ navigation; analysis effort.", bias: "Card wording dominates.", output: "Similarity matrix, candidate IA.", notAlone: "Validate with tree testing." },
  { id: "ab", name: "A/B testing", objective: "Causal comparison of two variants in production.", questions: "Does B lift conversion vs A?", sources: "Live traffic; power analysis first.", evidence: "Quantitative", cost: 2, time: "Weeks", strengths: "Real behavior, causal with randomization.", limits: "Needs volume; local maxima; slow.", bias: "Peeking, novelty effect.", output: "Lift + confidence interval.", notAlone: "Never explains why — add qualitative." },
  { id: "analytics", name: "Analytics analysis", objective: "Quantify what happens in product.", questions: "Where do funnels leak? Who retains?", sources: "Instrumented events, cohorts.", evidence: "Quantitative", cost: 1, time: "Hours", strengths: "Always on; huge n.", limits: "What, never why; instrumentation lies.", bias: "Survivorship; Simpson's paradox.", output: "Funnels, cohorts, segments.", notAlone: "Every anomaly needs a qualitative follow-up." },
  { id: "a11y-eval", name: "Accessibility evaluation", objective: "Find barriers for disabled users.", questions: "Keyboard-only pass? Screen-reader pass? Contrast?", sources: "WCAG 2.2 AA, assistive-tech users.", evidence: "Mixed", cost: 2, time: "Days", strengths: "Legal + moral + market coverage.", limits: "Checklists ≠ lived experience.", bias: "Automated-only false confidence.", output: "Barrier register with severities.", notAlone: "Always include disabled testers." },
  { id: "competitive", name: "Competitive analysis", objective: "Map how others solve it; spot table stakes.", questions: "Who does X best? What do users expect?", sources: "5–8 competitors, heuristic teardown.", evidence: "Qualitative", cost: 1, time: "Days", strengths: "Fast orientation; expectation baseline.", limits: "Copying ≠ strategy; surface-level.", bias: "Survivorship of visible winners.", output: "Comparison matrix, norms list.", notAlone: "Validate norms with your own users." },
];

export interface SelectorInput { goal: string; time: string; evidence: string }
export interface ScoredMethod { method: Method; score: number; reasons: string[] }

const GOAL_FIT: Record<string, string[]> = {
  "Understand needs": ["interviews", "contextual", "diary", "observation", "surveys"],
  "Evaluate usability": ["mod-test", "unmod-test", "a11y-eval", "observation"],
  "Fix findability": ["tree", "cardsort", "mod-test", "competitive"],
  "Compare designs": ["ab", "unmod-test", "mod-test", "surveys"],
  "Measure at scale": ["analytics", "surveys", "ab", "unmod-test"],
};
const TIME_OK: Record<string, number[]> = {
  Hours: [1], Days: [1, 2], Weeks: [1, 2, 3],
};

/** Score methods against goal/time/evidence. Pure and tested. */
export function recommendMethods(input: SelectorInput): ScoredMethod[] {
  const fits = GOAL_FIT[input.goal] ?? [];
  const costs = TIME_OK[input.time] ?? [1, 2, 3];
  return METHODS.map((m) => {
    let score = 0;
    const reasons: string[] = [];
    if (fits.includes(m.id)) { score += 3; reasons.push(`Strong fit for “${input.goal}”.`); }
    else if (fits.length) { score += 0; reasons.push("Weaker fit for this goal — use as a complement."); }
    if (costs.includes(m.cost)) { score += 2; reasons.push(`Fits a ${input.time.toLowerCase()} budget (cost ${"€".repeat(m.cost)}).`); }
    else { score -= 1; reasons.push(`Usually needs more than ${input.time.toLowerCase()} (cost ${"€".repeat(m.cost)}).`); }
    if (input.evidence === "Any" || m.evidence === input.evidence || m.evidence === "Mixed" || input.evidence === "Mixed") {
      score += 1; reasons.push(`Evidence type: ${m.evidence}.`);
    } else { score -= 1; reasons.push(`Produces ${m.evidence} evidence, you asked for ${input.evidence}.`); }
    return { method: m, score, reasons };
  })
    .sort((a, b) => b.score - a.score || a.method.cost - b.method.cost);
}

/* ── Personas & journey ────────────────────────────────── */

export interface Persona {
  id: string; name: string; role: string; goals: string[]; context: string;
  tasks: string[]; frustrations: string[]; accessNeeds: string;
  evidence: string; uncertainties: string;
}

export const SAMPLE_PERSONAS: Persona[] = [
  { id: "p-opal", name: "Opal (Ops lead)", role: "Illustrative persona — synthesized for this demo, NOT research findings.", goals: ["Clear the invoice queue before Friday", "Never chase the same approval twice"], context: "Noisy open office, frequent interruptions, spotty wifi on site visits.", tasks: ["Bulk-approve invoices", "Reassign blocked items", "Export weekly report"], frustrations: ["Silent failures", "Filters that reset", "Jargon error codes"], accessNeeds: "Keyboard-first (RSI); 200% zoom on a 13″ laptop; low-vision-friendly contrast.", evidence: "ILLUSTRATIVE — no interviews were conducted. Replace with quotes + counts from real studies.", uncertainties: "Do approvals happen on mobile? Unknown — needs contextual inquiry." },
  { id: "p-jun", name: "Jun (New hire, week 2)", role: "Illustrative persona — synthesized for this demo, NOT research findings.", goals: ["Complete first invoice run unassisted", "Know who to ask without shame"], context: "Remote, async team, learning the domain vocabulary.", tasks: ["Follow the onboarding checklist", "Ask for review", "Find help docs"], frustrations: ["Unexplained acronyms", "Empty states with no next step", "Fear of breaking something"], accessNeeds: "Screen-reader trainee; prefers text over video; needs captions.", evidence: "ILLUSTRATIVE — placeholder. Validate with 5–8 onboarding interviews.", uncertainties: "Actual vocabulary gaps unknown — needs a survey + support-ticket analysis." },
];

export interface JourneyStage {
  id: string; name: string; goal: string; actions: string;
  touchpoints: string; concerns: string; friction: string;
  opportunities: string; confidence: "Low" | "Medium" | "High";
}

export const DEFAULT_STAGES: JourneyStage[] = [
  { id: "s1", name: "Awareness", goal: "Realize invoicing chaos is solvable", actions: "Reads a peer's post; googles “bulk invoice approval”", touchpoints: "Blog, search", concerns: "Is this for teams our size?", friction: "Generic landing copy", opportunities: "Role-specific landing variant", confidence: "Medium" },
  { id: "s2", name: "Entry", goal: "Start a trial in minutes", actions: "Signs up, connects accounting", touchpoints: "Signup, OAuth", concerns: "Will my data migrate?", friction: "CSV import errors silently", opportunities: "Guided import with preview", confidence: "High" },
  { id: "s3", name: "First task", goal: "Approve first 20 invoices", actions: "Filters queue, bulk-approves", touchpoints: "Queue, bulk bar", concerns: "What if I approve wrong?", friction: "No undo on bulk approve", opportunities: "30-second undo window", confidence: "High" },
  { id: "s4", name: "Main completion", goal: "Clear Friday queue solo", actions: "Reassigns, exports report", touchpoints: "Report export", concerns: "Can I prove what I did?", friction: "Export lacks audit trail", opportunities: "One-click audit export", confidence: "Medium" },
  { id: "s5", name: "Follow-up", goal: "Stay in control weekly", actions: "Reviews digest, tunes rules", touchpoints: "Email digest", concerns: "Alert fatigue?", friction: "Noisy default alerts", opportunities: "Smart digest defaults", confidence: "Low" },
];

/* ── IA ────────────────────────────────────────────────── */

export interface SiteNode { id: string; label: string; desc: string; purpose: string; links: string[]; kids?: SiteNode[] }

export const SITEMAP: SiteNode = {
  id: "home", label: "Home", desc: "Marketing landing", purpose: "Convert visitors; route existing users to login.", links: ["Pricing", "Login"],
  kids: [
    {
      id: "product", label: "Product", desc: "Feature hub", purpose: "Explain capabilities by job, not by feature list.", links: ["Pricing", "Docs"],
      kids: [
        { id: "invoices", label: "Invoices", desc: "Queue, approve, export", purpose: "Core job: clear the invoice queue fast.", links: ["Reports", "Settings"] },
        { id: "approvals", label: "Approvals", desc: "Rules and chains", purpose: "Configure who approves what, once.", links: ["Invoices", "Team"] },
        { id: "reports", label: "Reports", desc: "Audit + exports", purpose: "Prove what happened; satisfy auditors.", links: ["Invoices"] },
      ],
    },
    {
      id: "account", label: "Account", desc: "Workspace admin", purpose: "Manage team, billing and security.", links: ["Help"],
      kids: [
        { id: "team", label: "Team", desc: "Members and roles", purpose: "Invite, assign, offboard.", links: ["Security"] },
        { id: "billing", label: "Billing", desc: "Plan and invoices", purpose: "Pay, upgrade, download receipts.", links: ["Team"] },
        { id: "security", label: "Security", desc: "SSO, keys, audit", purpose: "Satisfy IT review.", links: ["Billing"] },
      ],
    },
    { id: "docs", label: "Docs", desc: "Guides + API", purpose: "Task-based help and reference.", links: ["Product"] },
  ],
};

export function flattenSitemap(node: SiteNode, depth = 0): { node: SiteNode; depth: number; path: string[] }[] {
  const self = [{ node, depth, path: [node.label] }];
  return (node.kids ?? []).flatMap((k) =>
    [{ node: k, depth: depth + 1, path: [node.label, k.label] }].concat(
      (k.kids ?? []).flatMap((g) => [{ node: g, depth: depth + 2, path: [node.label, k.label, g.label] }]),
    ),
  ).concat(self);
}

export interface SortCard { id: string; label: string }
export const SORT_CARDS: SortCard[] = [
  { id: "c1", label: "Reset password" }, { id: "c2", label: "Download invoice" },
  { id: "c3", label: "Invite teammate" }, { id: "c4", label: "Enable SSO" },
  { id: "c5", label: "Export audit log" }, { id: "c6", label: "Change plan" },
  { id: "c7", label: "API keys" }, { id: "c8", label: "Notification prefs" },
];
export interface SortGroup { id: string; name: string; cards: string[] }
export const DEFAULT_GROUPS: SortGroup[] = [
  { id: "g1", name: "Account & access", cards: ["c1", "c3", "c4"] },
  { id: "g2", name: "Billing & records", cards: ["c2", "c5", "c6"] },
  { id: "g3", name: "Developer & prefs", cards: ["c7", "c8"] },
];

/* ── Flows ─────────────────────────────────────────────── */

export interface FlowNode { id: string; label: string; kind: "start" | "step" | "decision" | "success" | "fail"; detail?: string }
export interface FlowEdge { from: string; to: string; label?: string }
export interface FlowDef { nodes: FlowNode[]; edges: FlowEdge[]; start: string }

export function validateFlow(def: FlowDef): string[] {
  const issues: string[] = [];
  const ids = new Set(def.nodes.map((n) => n.id));
  if (!ids.has(def.start)) issues.push("Start node is missing from the node list.");
  for (const n of def.nodes) {
    if (!n.label.trim()) issues.push(`Node “${n.id}” has no label.`);
    const out = def.edges.filter((e) => e.from === n.id);
    if ((n.kind === "step" || n.kind === "decision" || n.kind === "start") && out.length === 0)
      issues.push(`“${n.label || n.id}” has no outgoing transition (dead end).`);
    if (n.kind === "decision" && out.length < 2) issues.push(`Decision “${n.label || n.id}” needs at least two branches.`);
  }
  for (const e of def.edges) {
    if (!ids.has(e.from) || !ids.has(e.to)) issues.push(`Transition references a removed node (${e.from} → ${e.to}).`);
  }
  // reachability from start
  const seen = new Set<string>([def.start]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const e of def.edges) {
      if (seen.has(e.from) && !seen.has(e.to) && ids.has(e.to)) { seen.add(e.to); grew = true; }
    }
  }
  for (const n of def.nodes) {
    if (!seen.has(n.id)) issues.push(`“${n.label || n.id}” is unreachable from the start.`);
  }
  if (!def.nodes.some((n) => n.kind === "success")) issues.push("No success end-state — every flow needs a definition of done.");
  return issues;
}

let flowSeq = 0;
export function nextFlowId(prefix: string): string {
  flowSeq += 1;
  return `${prefix}-${Date.now().toString(36)}-${flowSeq}`;
}

export const FLOW_REGISTRATION: FlowDef = {
  start: "start",
  nodes: [
    { id: "start", label: "Start", kind: "start", detail: "Visitor clicks “Start trial”." },
    { id: "details", label: "Enter details", kind: "step", detail: "Name, work email, password." },
    { id: "valid", label: "Details valid?", kind: "decision", detail: "Inline validation on blur + submit." },
    { id: "fix", label: "Resolve errors", kind: "step", detail: "Named errors; entries preserved." },
    { id: "review", label: "Review information", kind: "step", detail: "Summary with per-field Edit links." },
    { id: "done", label: "Workspace created", kind: "success", detail: "Simulated confirmation + next steps." },
  ],
  edges: [
    { from: "start", to: "details" }, { from: "details", to: "valid" },
    { from: "valid", to: "review", label: "valid" }, { from: "valid", to: "fix", label: "errors" },
    { from: "fix", to: "valid", label: "re-check" }, { from: "review", to: "done", label: "confirm" },
    { from: "review", to: "details", label: "edit" },
  ],
};

export const FLOW_CHECKOUT: FlowDef = {
  start: "cart",
  nodes: [
    { id: "cart", label: "Review cart", kind: "start", detail: "2 items, quantities editable." },
    { id: "delivery", label: "Delivery details", kind: "step", detail: "Address validated per field." },
    { id: "pay", label: "Payment (simulated)", kind: "step", detail: "Test card only — no real charge, ever." },
    { id: "auth", label: "Payment approved?", kind: "decision", detail: "Simulated gateway; user picks the outcome to explore both paths." },
    { id: "declined", label: "Card declined", kind: "fail", detail: "Reason shown; cart + entries preserved; retry or change method." },
    { id: "review", label: "Review order", kind: "step", detail: "Totals, address, method — one last check." },
    { id: "done", label: "Order confirmed", kind: "success", detail: "Order number + receipt (both fictional)." },
  ],
  edges: [
    { from: "cart", to: "delivery" }, { from: "delivery", to: "pay" }, { from: "pay", to: "auth" },
    { from: "auth", to: "review", label: "approved" }, { from: "auth", to: "declined", label: "declined" },
    { from: "declined", to: "pay", label: "retry / change" }, { from: "review", to: "done", label: "place order" },
  ],
};

export const FLOW_ONBOARDING: FlowDef = {
  start: "welcome",
  nodes: [
    { id: "welcome", label: "Welcome", kind: "start", detail: "Value promise in one sentence; skip offered." },
    { id: "usecase", label: "Choose use case", kind: "step", detail: "Invoicing / Approvals / Reporting — tailors defaults." },
    { id: "workspace", label: "Configure workspace", kind: "step", detail: "Name, currency, fiscal start; sensible defaults prefilled." },
    { id: "invite", label: "Invite teammate?", kind: "decision", detail: "Optional — skippable without shame." },
    { id: "send", label: "Send invite", kind: "step", detail: "Fictional address; simulated send." },
    { id: "done", label: "Ready to work", kind: "success", detail: "First-task checklist shown." },
  ],
  edges: [
    { from: "welcome", to: "usecase" }, { from: "usecase", to: "workspace" }, { from: "workspace", to: "invite" },
    { from: "invite", to: "send", label: "invite" }, { from: "invite", to: "done", label: "skip" }, { from: "send", to: "done" },
  ],
};

export const FLOW_ERROR: FlowDef = {
  start: "sync",
  nodes: [
    { id: "sync", label: "Sync invoices", kind: "start", detail: "User triggers a manual sync." },
    { id: "result", label: "Sync OK?", kind: "decision", detail: "Simulated service; user picks the outcome." },
    { id: "failed", label: "Sync failed (simulated 500)", kind: "fail", detail: "Plain-language cause; queue kept; nothing lost." },
    { id: "choice", label: "Retry or export CSV?", kind: "decision", detail: "Two honest options, no dead end." },
    { id: "done", label: "Recovered", kind: "success", detail: "Synced on retry, or CSV downloaded as fallback." },
  ],
  edges: [
    { from: "sync", to: "result" }, { from: "result", to: "done", label: "success" },
    { from: "result", to: "failed", label: "failure" }, { from: "failed", to: "choice" },
    { from: "choice", to: "done", label: "retry works" }, { from: "choice", to: "done", label: "CSV fallback" },
  ],
};

/* ── Usability testing + metrics ───────────────────────── */

export interface Observation {
  id: number; task: string; completed: boolean; help: boolean;
  errors: number; seconds: number | null; notes: string; sample?: boolean;
}

export const SAMPLE_OBS: Observation[] = [
  { id: 1, task: "Locate PRJ-1042 and set status to review", completed: true, help: false, errors: 1, seconds: 96, notes: "Found via search; hesitated on status menu.", sample: true },
  { id: 2, task: "Locate PRJ-1042 and set status to review", completed: true, help: true, errors: 3, seconds: 214, notes: "Needed prompt: status lives in row menu.", sample: true },
  { id: 3, task: "Locate PRJ-1042 and set status to review", completed: false, help: true, errors: 5, seconds: null, notes: "Gave up at pagination — SIMULATED example, not a real participant.", sample: true },
];

export interface StudyMetrics {
  n: number; completionRate: number | null; avgErrors: number | null;
  helpRate: number | null; medianSeconds: number | null; medianN: number;
  caveat: string;
}

/** Correct denominators; median only with ≥3 valid times; missing times excluded. */
export function calcMetrics(obs: Observation[]): StudyMetrics {
  const n = obs.length;
  if (!n) return { n: 0, completionRate: null, avgErrors: null, helpRate: null, medianSeconds: null, medianN: 0, caveat: "No observations yet — add some below." };
  const done = obs.filter((o) => o.completed).length;
  const times = obs.map((o) => o.seconds).filter((t): t is number => typeof t === "number" && t > 0).sort((a, b) => a - b);
  const mid = times.length % 2 ? times[Math.floor(times.length / 2)] : times.length ? (times[times.length / 2 - 1] + times[times.length / 2]) / 2 : null;
  return {
    n,
    completionRate: Math.round((done / n) * 100),
    avgErrors: Math.round((obs.reduce((a, o) => a + o.errors, 0) / n) * 10) / 10,
    helpRate: Math.round((obs.filter((o) => o.help).length / n) * 100),
    medianSeconds: times.length >= 3 ? Math.round((mid ?? 0)) : null,
    medianN: times.length,
    caveat: times.length < 3
      ? `Median withheld: only ${times.length} valid time${times.length === 1 ? "" : "s"} (need ≥3). Missing times are excluded, never zero-filled.`
      : `Median from ${times.length} valid times; ${n - times.length} missing excluded. n=${n} is directional, not significant.`,
  };
}

export const SUS_ITEMS = [
  "I think that I would like to use this system frequently.",
  "I found the system unnecessarily complex.",
  "I thought the system was easy to use.",
  "I think that I would need the support of a technical person to be able to use this system.",
  "I found the various functions in this system were well integrated.",
  "I thought there was too much inconsistency in this system.",
  "I would imagine that most people would learn to use this system very quickly.",
  "I found the system very cumbersome to use.",
  "I felt very confident using the system.",
  "I needed to learn a lot of things before I could get going with this system.",
];

/** Standard SUS: (odd − 1) + (5 − even), sum × 2.5. Requires all 10 answers 1–5. */
export function susScore(answers: (number | null)[]): number | null {
  if (answers.length !== 10 || answers.some((a) => a === null || a < 1 || a > 5)) return null;
  let sum = 0;
  (answers as number[]).forEach((a, i) => { sum += i % 2 === 0 ? a - 1 : 5 - a; });
  return sum * 2.5;
}

/* ── Methodologies ─────────────────────────────────────── */

export interface Methodology {
  id: string; name: string; purpose: string; stages: { name: string; activities: string; artifacts: string }[];
  misuse: string; useful: string;
}

export const METHODOLOGIES: Methodology[] = [
  { id: "dt", name: "Design Thinking", purpose: "Creative confidence for ambiguous, human problems.", stages: [{ name: "Empathize", activities: "Interviews, shadowing", artifacts: "Notes, quotes" }, { name: "Define", activities: "Synthesis, POV statements", artifacts: "Problem frame" }, { name: "Ideate", activities: "Brainstorms, worst-idea", artifacts: "Concepts" }, { name: "Prototype", activities: "Paper → clickable", artifacts: "Testable prototype" }, { name: "Test", activities: "5-user rounds", artifacts: "Findings + iteration" }], misuse: "Sticky-note theater with no prototype or test.", useful: "New-market discovery, wicked problems." },
  { id: "dd", name: "Double Diamond", purpose: "Diverge/converge discipline across problem and solution.", stages: [{ name: "Discover", activities: "Research, audits", artifacts: "Insights" }, { name: "Define", activities: "Prioritize, brief", artifacts: "Design challenge" }, { name: "Develop", activities: "Ideate, prototype", artifacts: "Candidates" }, { name: "Deliver", activities: "Test, ship, measure", artifacts: "Release + metrics" }], misuse: "Skipping divergence — solutioneering with extra steps.", useful: "Ambiguous briefs needing visible decision trails." },
  { id: "lean", name: "Lean UX", purpose: "Learn fastest with cross-functional builders.", stages: [{ name: "Hypothesize", activities: "Assumption mapping", artifacts: "Testable hypothesis" }, { name: "Experiment", activities: "MVP, concierge, fake-door", artifacts: "Running experiment" }, { name: "Feedback", activities: "Measure + observe", artifacts: "Evidence" }, { name: "Learn", activities: "Persevere/pivot", artifacts: "Decision" }], misuse: "Calling sketches 'validation' without users.", useful: "Fast-moving teams with shippable slices." },
  { id: "jtbd", name: "Jobs to Be Done", purpose: "Design for progress people hire products to make.", stages: [{ name: "Context", activities: "Switch interviews", artifacts: "Job stories" }, { name: "Struggle", activities: "Forces analysis", artifacts: "Push/pull/anxiety/habit" }, { name: "Outcome", activities: "Success criteria", artifacts: "Hiring criteria" }], misuse: "Personas renamed as jobs with no struggle.", useful: "Stalled activation, competing on outcomes." },
  { id: "ucd", name: "User-Centered Design", purpose: "The iterative loop underneath all of the above.", stages: [{ name: "Understand", activities: "Research context of use", artifacts: "Requirements" }, { name: "Specify", activities: "User + org requirements", artifacts: "Spec" }, { name: "Design", activities: "Solutions with users", artifacts: "Designs" }, { name: "Evaluate", activities: "Test against requirements", artifacts: "Results → iterate" }], misuse: "One usability test at the end, labeled UCD.", useful: "Always — it is the operating system, not a phase." },
];

/* ── Findings register ─────────────────────────────────── */

export type Severity = "Critical" | "Major" | "Minor";
export type FindingStatus = "Open" | "In Progress" | "Resolved";
export interface Finding {
  id: string; title: string; where: string; problem: string; evidence: string;
  severity: Severity; impact: string; proposal: string; status: FindingStatus;
}

export const SEED_FINDINGS: Finding[] = [
  { id: "f1", title: "Bulk archive has no undo", where: "Data table demo", problem: "Archiving 8 rows cannot be undone; users must re-import.", evidence: "Heuristic audit (H3), confirmed in usability-testing sample obs #3.", severity: "Major", impact: "Fear of bulk actions; support tickets.", proposal: "30-second undo window (see Undo pattern).", status: "Open" },
  { id: "f2", title: "Expiry errors don't name the field", where: "Checkout journey", problem: "“Payment failed” with no field-level guidance.", evidence: "Cognitive walkthrough + sample task errors.", severity: "Critical", impact: "Checkout abandonment on first failure.", proposal: "Field-level message + focus move (see Error recovery flow).", status: "In Progress" },
  { id: "f3", title: "Palette shortcut undiscoverable", where: "Command palette", problem: "⌘K hint only in footer; new users never find it.", evidence: "Tree-test style probe, n=4 (illustrative).", severity: "Minor", impact: "Power feature underused.", proposal: "Empty-state hint + onboarding tip.", status: "Resolved" },
];

export function findingsToCSV(rows: Finding[]): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const head = "id,title,where,problem,evidence,severity,impact,proposal,status";
  return [head, ...rows.map((f) => [f.id, f.title, f.where, f.problem, f.evidence, f.severity, f.impact, f.proposal, f.status].map(esc).join(","))].join("\n");
}
