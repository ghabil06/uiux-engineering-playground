/**
 * Style Laboratory catalogue — one metadata record per style.
 * Education content (traits, usage, risks, a11y) lives here;
 * presentation lives in the per-style components.
 */
export type StyleFamily = "Calm" | "Expressive" | "Systematic";

export interface StyleDef {
  slug: string;
  name: string;
  tagline: string;
  desc: string;
  family: StyleFamily;
  /** Curated learning order (1 = start here). */
  order: number;
  traits: string[];
  typography: string;
  surfaces: string;
  spacing: string;
  borders: string;
  elevation: string;
  color: string;
  useCases: string;
  risks: string;
  a11y: string;
  accent: string;
  /** Visual-style vocabulary tag in the explorer registry. */
  vocab: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export const STYLE_DEFS: StyleDef[] = [
  {
    slug: "minimalism", name: "Minimalism", tagline: "Less, but better",
    desc: "Removes everything that doesn't serve the task. Generous whitespace, one typeface, a single accent — every remaining element must earn its place.",
    family: "Calm", order: 1,
    traits: ["One typeface", "Generous whitespace", "Single accent"],
    typography: "Neutral grotesk, tight tracking on headings, 15–16px body.",
    surfaces: "Flat white, hairline dividers instead of boxes.",
    spacing: "Large vertical rhythm (32–64px section gaps).",
    borders: "Almost none — 1px neutral dividers only.",
    elevation: "None. Hierarchy comes from size and spacing.",
    color: "Near-black text, grey secondary, one violet action.",
    useCases: "Productivity tools, docs, onboarding — anywhere comprehension speed matters.",
    risks: "Can feel cold or undifferentiated; key actions may go quiet without strong copy.",
    a11y: "Excellent baseline — few competing signals, trivially logical focus order.",
    accent: "#111111", vocab: "Minimal", difficulty: "Beginner",
  },
  {
    slug: "light-ui", name: "Light UI", tagline: "Airy and trustworthy",
    desc: "The default language of SaaS: bright surfaces, subtle borders, familiar blue actions. Note — light UI is a surface treatment, not a full style; it can coexist with bento, swiss or dense layouts.",
    family: "Calm", order: 2,
    traits: ["White surfaces", "Soft borders", "Blue primary"],
    typography: "System sans, medium-weight headings, roomy line-height.",
    surfaces: "White cards on a pale blue-grey page.",
    spacing: "Comfortable 16–24px card padding.",
    borders: "1px soft grey borders + small radii.",
    elevation: "Small soft shadows (sm/md).",
    color: "Slate text, sky-blue actions, pastel status fills.",
    useCases: "General SaaS, forms-heavy admin, marketing-adjacent product.",
    risks: "Can look generic; glare in bright environments; grey-on-grey placeholder traps.",
    a11y: "Keep body text ≥ 4.5:1 on white; never use placeholder as label.",
    accent: "#0284c7", vocab: "Light", difficulty: "Beginner",
  },
  {
    slug: "dark-ui", name: "Dark UI", tagline: "Focus after hours",
    desc: "Dark neutral surfaces recede so content glows. Built for dashboards, media and night-shift operations — with layered elevation instead of flat black.",
    family: "Calm", order: 3,
    traits: ["Layered dark surfaces", "Neon accents", "Elevated cards"],
    typography: "Slightly larger body (15px+), semibold headings, tabular numerals.",
    surfaces: "#0B0B14 base, raised panels at white/4–8%.",
    spacing: "Same rhythm as light UI; dividers are translucent.",
    borders: "1px white/10 rings rather than solid lines.",
    elevation: "Glow accents + layered translucency instead of shadows.",
    color: "Off-white text (#E2E8F0), cyan/violet accents, tinted status badges.",
    useCases: "Ops dashboards, code and media tools, evening-use consumer apps.",
    risks: "Long-form reading is slower; pure-black + pure-white causes halation.",
    a11y: "Avoid #000/#FFF pairs; keep status readable without color (icons + text).",
    accent: "#22d3ee", vocab: "Dark", difficulty: "Intermediate",
  },
  {
    slug: "bento-grid", name: "Bento Grid", tagline: "Modular feast",
    desc: "Compartmentalized storytelling: each capability gets a tile sized by importance, with one hero tile anchoring the composition.",
    family: "Expressive", order: 4,
    traits: ["Mismatched tiles", "Large radii", "One hero tile"],
    typography: "Bold display numerals in the hero tile, compact labels elsewhere.",
    surfaces: "Contrasting tile fills — dark hero, pastel supporters.",
    spacing: "Tight 8–12px gutters; tiles touch intentionally.",
    borders: "Borderless; separation comes from fill contrast.",
    elevation: "Flat, with one gradient CTA tile for emphasis.",
    color: "Editorial mix: ink, amber, violet gradient.",
    useCases: "Feature marketing, home dashboards, portfolio-style overviews.",
    risks: "Tiles can fragment a single workflow; DOM order must stay logical on mobile.",
    a11y: "Keep DOM order logical when tiles span; don't rely on sighted layout alone.",
    accent: "#7c3aed", vocab: "Bento", difficulty: "Intermediate",
  },
  {
    slug: "glassmorphism", name: "Glassmorphism", tagline: "Frosted depth",
    desc: "Layered translucency over rich color. Beautiful for overlays and players — dangerous for dense text without a solid scrim fallback.",
    family: "Expressive", order: 5,
    traits: ["backdrop-blur", "Translucent layers", "Vivid backdrop"],
    typography: "Semibold white type with subtle shadow for legibility.",
    surfaces: "White/10–20 fills with 18px backdrop blur and saturation boost.",
    spacing: "Airy; panels float with 24px+ margins.",
    borders: "1px white/35 hairlines to sell the glass edge.",
    elevation: "Blur + translucency replace shadows.",
    color: "Vivid gradient backdrop (fuchsia→violet→cyan), white foreground.",
    useCases: "Media players, widgets, overlays, marketing hero panels.",
    risks: "Text contrast collapses over busy backgrounds; blur is expensive on low-end GPUs.",
    a11y: "Always add a solid scrim behind text; this demo ships an opacity fallback toggle.",
    accent: "#e879f9", vocab: "Glass", difficulty: "Intermediate",
  },
  {
    slug: "neumorphism", name: "Neumorphism", tagline: "Soft extrusion",
    desc: "UI pressed from a single slab — twin light/shadow extrusions do all the talking. Tactile and calm, but historically contrast-starved.",
    family: "Expressive", order: 6,
    traits: ["Dual shadows", "Monochrome", "Pill controls"],
    typography: "Soft grey, medium weight; labels carry state meaning.",
    surfaces: "Single #E0E5EC slab; raised vs recessed lighting.",
    spacing: "Generous — shadows need room to read.",
    borders: "None; light and shadow are the border.",
    elevation: "8px extrusion shadows; inset shadows for pressed states.",
    color: "Strictly monochrome greys with one slate action.",
    useCases: "Small tactile panels: dials, toggles, music or smart-home controls.",
    risks: "Classic trade-off: the 'pure' recipe fails contrast; controls can vanish into the slab.",
    a11y: "This demo deliberately exceeds the pure recipe (3:1+ controls) and labels every state in text.",
    accent: "#475569", vocab: "Neumorphic", difficulty: "Advanced",
  },
  {
    slug: "swiss-grid", name: "Swiss / Grid Design", tagline: "Rational order",
    desc: "The International Typographic Style: mathematics, hierarchy and one fearless accent. The grid — made visible — guides every placement.",
    family: "Systematic", order: 7,
    traits: ["Visible 12-col grid", "Grotesk type", "Red + black + white"],
    typography: "Uppercase black-weight display, ragged-right body, numbered sections.",
    surfaces: "Paper white with a faint blueprint grid.",
    spacing: "Strict 8pt baseline; rule lines separate zones.",
    borders: "Thick black rules (2–4px) as structural elements.",
    elevation: "None — flat by doctrine.",
    color: "Black, white, and a single signal red.",
    useCases: "Editorial dashboards, data journalism, design-tool chrome.",
    risks: "Can feel rigid or cold for playful or emotional brands.",
    a11y: "Strong by construction — large type, strict hierarchy, real grid alignment.",
    accent: "#dc2626", vocab: "Swiss", difficulty: "Intermediate",
  },
  {
    slug: "brutalism", name: "Brutalism", tagline: "Loud and honest",
    desc: "Raw borders, offset hard shadows, zero gradients. Personality as a feature — every structural choice is deliberately visible.",
    family: "Expressive", order: 8,
    traits: ["3px black borders", "Hard offset shadows", "Acid fills"],
    typography: "Black-weight uppercase, oversized numerals, rotated stickers.",
    surfaces: "Cream paper with sticker-bright panels.",
    spacing: "Chunky and uneven on purpose — but consistent gutters.",
    borders: "3px solid #111 everywhere; shadow 6px 6px 0 #111.",
    elevation: "Hard offset shadows only — no blur.",
    color: "Cream + ink + lime/violet acid accents.",
    useCases: "Youth brands, creative tools, launches that need to be remembered.",
    risks: "Visual noise scales badly; shadow-everything destroys hierarchy if overused.",
    a11y: "Keep black borders and large type; reserve acid fills for large targets, never body text.",
    accent: "#7c3aed", vocab: "Brutalist", difficulty: "Advanced",
  },
  {
    slug: "editorial", name: "Editorial Design", tagline: "Print heritage",
    desc: "Magazine craft on the web: serif display, drop caps, pull quotes, hairline rules — and ruthless line-length discipline.",
    family: "Systematic", order: 9,
    traits: ["Serif display", "Drop caps", "Hairline rules"],
    typography: "Georgia-style serif display, 55–70ch measure, italic pull quotes.",
    surfaces: "Warm paper (#FAF7F0) with stone hairlines.",
    spacing: "Print-like rhythm; centered masthead, ruled sections.",
    borders: "1px stone hairlines; double rules for emphasis.",
    elevation: "None — depth comes from typography.",
    color: "Ink on paper, one oxblood/stone accent.",
    useCases: "Reports, changelogs-as-stories, onboarding narratives, help centers.",
    risks: "Needs real copy — lorem ipsum kills it; oversized type overflows small screens.",
    a11y: "Serifs are fine at 16px+; clamp display sizes so nothing clips at 320px.",
    accent: "#78350f", vocab: "Editorial", difficulty: "Intermediate",
  },
  {
    slug: "flat-design", name: "Flat Design", tagline: "Honest pixels",
    desc: "Two-dimensional color blocks and crisp iconography. Fast to render, easy to scale — but buttons must still look tappable without shadows.",
    family: "Systematic", order: 10,
    traits: ["No shadows", "Bold blocks", "Icon-forward"],
    typography: "Geometric sans, bold short labels, underlined links.",
    surfaces: "Solid color blocks; white content cards.",
    spacing: "Even 16px rhythm; icons carry wayfinding.",
    borders: "None or 2px solid tone-on-tone.",
    elevation: "None — color contrast creates hierarchy.",
    color: "Primary triad (red/amber/green) plus ink; never color-alone for state.",
    useCases: "Illustrated SaaS, education, mobile-first consumer flows.",
    risks: "Affordance blur — flat buttons can read as decoration; color-only states exclude users.",
    a11y: "Underline links, add icons + text to every status, keep 44px targets.",
    accent: "#0f172a", vocab: "Flat", difficulty: "Beginner",
  },
  {
    slug: "material-inspired", name: "Material-Inspired", tagline: "Tactile paper",
    desc: "Paper metaphor: surfaces lift, ink ripples, motion explains hierarchy. An educational homage — not an official implementation of any external system.",
    family: "Systematic", order: 11,
    traits: ["Elevation steps", "FAB", "State layers"],
    typography: "Roboto-style grotesk, sentence case, medium emphasis.",
    surfaces: "Layered paper: resting, raised, and modal elevations.",
    spacing: "8dp grid; 16dp card padding; FAB offset.",
    borders: "Borderless; elevation separates layers.",
    elevation: "Three explicit steps: rest / raise / modal — with matching shadows.",
    color: "Deep violet primary, tonal containers, on-surface text.",
    useCases: "Android-adjacent products, settings-dense apps, cross-platform kits.",
    risks: "Can feel 'default' without custom tokens; elevation alone must never be the only cue.",
    a11y: "Pair elevation with labels; keep ripple/state layers ≥3:1 on controls.",
    accent: "#673ab7", vocab: "Material", difficulty: "Intermediate",
  },
  {
    slug: "data-dense", name: "Data-Dense UI", tagline: "Bloomberg-grade",
    desc: "Maximum signal per pixel for operators who live in the tool. Compact but readable — with an explicit density control, because density is a preference, not a verdict.",
    family: "Systematic", order: 12,
    traits: ["Compact rows", "KPI strip", "Density control"],
    typography: "12–13px mono for figures, sans for labels, tabular numerals.",
    surfaces: "Dark ops console; hairline row dividers.",
    spacing: "Density-driven: 4/8/12px row padding (Compact/Comfortable/Spacious).",
    borders: "Hairline dividers; sticky header rule.",
    elevation: "None — information density replaces depth.",
    color: "Ink console, emerald/amber/rose status dots + text.",
    useCases: "Trading, NOC, support queues, logistics — expert daily drivers.",
    risks: "Intimidating for casual users; tiny targets if density isn't handled deliberately.",
    a11y: "Rows stay ≥32px with 44px-equivalent hit areas; density toggle always available.",
    accent: "#10b981", vocab: "Dense", difficulty: "Advanced",
  },
];

export const STYLE_SLUGS = STYLE_DEFS.map((d) => d.slug);

export function styleDef(slug: string): StyleDef {
  const found = STYLE_DEFS.find((d) => d.slug === slug);
  if (!found) throw new Error(`Unknown style slug: ${slug}`);
  return found;
}
