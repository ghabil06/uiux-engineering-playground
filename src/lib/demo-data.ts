import { seeded } from "./core";

// ── Enterprise dashboard rows ──
export interface Order {
  id: string;
  customer: string;
  email: string;
  plan: "Starter" | "Growth" | "Enterprise";
  status: "active" | "trialing" | "past_due" | "churned" | "pending";
  mrr: number;
  seats: number;
  updated: string;
  region: string;
}
const FIRST = ["Ava","Liam","Maya","Noah","Zoe","Ethan","Priya","Kai","Lena","Omar","Ivy","Jonas","Sofia","Mateo","Nora","Felix","Aisha","Theo","June","Ravi"];
const LAST = ["Chen","Park","Garcia","Kim","Novak","Patel","Silva","Haddad","Moreau","Okafor","Lindqvist","Rossi","Tanaka","Weber","Ali","Dubois","Khan","Muller","Sato","Costa"];
const REGIONS = ["NA-East","NA-West","EU-Central","EU-West","APAC","LATAM"];
const PLANS: Order["plan"][] = ["Starter","Growth","Enterprise"];
const STATUSES: Order["status"][] = ["active","trialing","past_due","churned","pending"];

export const ORDERS: Order[] = Array.from({ length: 64 }, (_, i) => {
  const r = (k: number) => seeded(i * 13 + k);
  return {
    id: `ORD-${2400 + i}`,
    customer: `${FIRST[Math.floor(r(1) * FIRST.length)]} ${LAST[Math.floor(r(2) * LAST.length)]}`,
    email: `user${2400 + i}@example.com`,
    plan: PLANS[Math.floor(r(3) * 3)],
    status: STATUSES[Math.floor(r(4) * 5)],
    mrr: Math.floor(29 + r(5) * 2400),
    seats: Math.floor(1 + r(6) * 120),
    updated: `2026-10-${String(1 + Math.floor(r(7) * 25)).padStart(2, "0")}`,
    region: REGIONS[Math.floor(r(8) * REGIONS.length)],
  };
});

// ── Ecommerce ──
export interface Product { id: string; name: string; cat: string; price: number; rating: number; stock: number; blurb: string; hue: string; emoji: string; tag?: string; }
export const PRODUCTS: Product[] = [
  { id: "p1", name: "Aurora Desk Lamp", cat: "Home", price: 89, rating: 4.8, stock: 14, blurb: "Warm-to-cool adaptive light with presence dimming.", hue: "#f59e0b", emoji: "💡", tag: "Bestseller" },
  { id: "p2", name: "Mono Mechanical Keyboard", cat: "Tech", price: 149, rating: 4.9, stock: 8, blurb: "Gasket-mounted, hot-swap, PBT keycaps.", hue: "#8b5cf6", emoji: "⌨️", tag: "New" },
  { id: "p3", name: "Drift Ceramic Vase", cat: "Home", price: 54, rating: 4.6, stock: 22, blurb: "Hand-glazed stoneware, each piece unique.", hue: "#06b6d4", emoji: "🏺" },
  { id: "p4", name: "Pulse Wireless Headphones", cat: "Tech", price: 199, rating: 4.7, stock: 5, blurb: "40h battery, adaptive ANC, multipoint.", hue: "#ec4899", emoji: "🎧", tag: "Low stock" },
  { id: "p5", name: "Atlas Canvas Backpack", cat: "Outdoor", price: 129, rating: 4.5, stock: 30, blurb: "22L weatherproof roll-top with laptop sleeve.", hue: "#10b981", emoji: "🎒" },
  { id: "p6", name: "Ferment Starter Kit", cat: "Kitchen", price: 42, rating: 4.4, stock: 41, blurb: "Kimchi, kombucha & sourdough in one box.", hue: "#f97316", emoji: "🫙" },
  { id: "p7", name: "Orbit Smart Watch S", cat: "Tech", price: 249, rating: 4.6, stock: 11, blurb: "AMOLED, dual-band GPS, 10-day battery.", hue: "#0ea5e9", emoji: "⌚️" },
  { id: "p8", name: "Terra Trail Runners", cat: "Outdoor", price: 139, rating: 4.7, stock: 18, blurb: "Grippy lug sole, recycled upper.", hue: "#84cc16", emoji: "👟" },
  { id: "p9", name: "Ember Pour-Over Set", cat: "Kitchen", price: 68, rating: 4.8, stock: 26, blurb: "Borosilicate dripper + walnut collar.", hue: "#ef4444", emoji: "☕️", tag: "Staff pick" },
];

// ── Analytics ──
export const ANALYTICS_DAYS = Array.from({ length: 30 }, (_, i) => {
  const base = 4200 + Math.sin(i / 3.1) * 900 + seeded(i) * 700;
  const conv = 2.1 + Math.sin(i / 5) * 0.7 + seeded(i + 99) * 0.9;
  return {
    day: `Oct ${i + 1}`,
    visitors: Math.round(base),
    signups: Math.round(base * (conv / 100)),
    revenue: Math.round(base * (conv / 100) * 48),
    channel: i % 3 === 0 ? "Organic" : i % 3 === 1 ? "Paid" : "Referral",
    conv: Number(conv.toFixed(2)),
  };
});

// ── ML ──
export interface MLModel { id: string; name: string; version: string; status: "healthy" | "watch" | "degraded"; auc: number; f1: number; latency: number; drift: number; owner: string; updated: string; }
export const ML_MODELS: MLModel[] = [
  { id: "m1", name: "fraud-xgb", version: "v4.2.1", status: "healthy", auc: 0.943, f1: 0.881, latency: 42, drift: 0.06, owner: "Risk ML", updated: "2h ago" },
  { id: "m2", name: "churn-prophet", version: "v2.9.0", status: "watch", auc: 0.874, f1: 0.792, latency: 88, drift: 0.18, owner: "Growth", updated: "6h ago" },
  { id: "m3", name: "support-llm-router", version: "v1.14.3", status: "degraded", auc: 0.801, f1: 0.733, latency: 310, drift: 0.34, owner: "CX Platform", updated: "26m ago" },
  { id: "m4", name: "pricing-elastic", version: "v3.0.7", status: "healthy", auc: 0.912, f1: 0.845, latency: 61, drift: 0.09, owner: "Marketplace", updated: "1d ago" },
];
export interface Alert { id: string; model: string; severity: "P1" | "P2" | "P3"; title: string; detail: string; time: string; status: "open" | "acknowledged" | "resolved"; feature: string; }
export const ML_ALERTS: Alert[] = [
  { id: "a1", model: "support-llm-router", severity: "P1", title: "PSI 0.34 on intent_length — significant shift", detail: "Training vs serving distribution diverged beyond 0.25 threshold. Top drifted bins: 180–240 tokens (+14pp). Correlates with new help-center template rollout.", time: "26m ago", status: "open", feature: "intent_length" },
  { id: "a2", model: "churn-prophet", severity: "P2", title: "AUC −3.1pp week-over-week", detail: "Rolling 7-day AUC fell from 0.905 to 0.874. Drop concentrated in EU-West cohort. Drift alone does not prove degradation — backtest pending.", time: "2h ago", status: "acknowledged", feature: "tenure_days" },
  { id: "a3", model: "fraud-xgb", severity: "P3", title: "Latency p95 approaching SLO", detail: "p95 at 142ms vs 150ms SLO after feature-store migration. No accuracy impact detected.", time: "5h ago", status: "open", feature: "p95_latency" },
  { id: "a4", model: "pricing-elastic", severity: "P3", title: "Label delay increased to 38h", detail: "Ground-truth delay grew after checkout instrumentation change. Evaluation window extended.", time: "1d ago", status: "resolved", feature: "label_delay" },
];
export const DRIFT_FEATURES = [
  { name: "intent_length", psi: 0.34, train: [12, 28, 34, 18, 8], serve: [8, 16, 26, 30, 20] },
  { name: "tenure_days", psi: 0.18, train: [10, 22, 30, 24, 14], serve: [12, 20, 26, 24, 18] },
  { name: "ticket_sentiment", psi: 0.11, train: [8, 18, 36, 26, 12], serve: [9, 19, 33, 26, 13] },
  { name: "device_type", psi: 0.07, train: [44, 38, 18], serve: [42, 39, 19] },
];
