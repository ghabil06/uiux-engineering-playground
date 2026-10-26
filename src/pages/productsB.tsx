import React from "react";
import { PRODUCTS, ANALYTICS_DAYS, ML_MODELS, ML_ALERTS, DRIFT_FEATURES, Alert } from "../lib/demo-data";
import { Badge, Btn, Card, Field, inputCls, useToasts, Kpi } from "../components/ui";
import { LineChart, Bars, Donut, DistBars } from "../components/charts";
import { ShoppingCart, Star, X, Minus, Plus, Check, ArrowRight, AlertTriangle, ShieldCheck, GitCompare, Eye, Copy } from "lucide-react";
import { cx } from "../lib/core";

/* ── ECOMMERCE ── */
export function EcommerceDemo() {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("All");
  const [sort, setSort] = React.useState("feat");
  const [cart, setCart] = React.useState<Record<string, number>>({ p2: 1 });
  const [openCart, setOpenCart] = React.useState(false);
  const [detail, setDetail] = React.useState<string | null>(null);
  const [stage, setStage] = React.useState<"shop" | "checkout" | "done">("shop");
  const [co, setCo] = React.useState({ email: "", name: "", addr: "", city: "", zip: "", card: "", exp: "", cvc: "" });
  const [errs, setErrs] = React.useState<Record<string, string>>({});
  const [orderNo] = React.useState(() => `PX-${Math.floor(100000 + Math.random() * 899999)}`);
  const { push, Toast } = useToasts();

  const list = PRODUCTS.filter((p) => (cat === "All" || p.cat === cat) && (p.name + p.blurb + p.cat).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const sub = Object.entries(cart).reduce((a, [id, n]) => a + (PRODUCTS.find((p) => p.id === id)?.price ?? 0) * n, 0);
  const ship = sub === 0 ? 0 : sub > 150 ? 0 : 9;
  const tax = sub * 0.08;

  const add = (id: string) => {
    const p = PRODUCTS.find((x) => x.id === id)!;
    if ((cart[id] ?? 0) >= p.stock) { push("Only a few left", `${p.name}: ${p.stock} in stock.`, "#e11d48"); return; }
    setCart({ ...cart, [id]: (cart[id] ?? 0) + 1 });
    push("Added to cart", `${p.name} × ${(cart[id] ?? 0) + 1}`, "#10b981");
  };

  const checkout = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(co.email)) er.email = "Valid email required.";
    if (co.name.trim().length < 2) er.name = "Name required.";
    if (co.addr.trim().length < 4) er.addr = "Street address required.";
    if (co.city.trim().length < 2) er.city = "City required.";
    if (!/^\d{5}$/.test(co.zip.trim())) er.zip = "5-digit ZIP.";
    if (!/^\d{12,19}$/.test(co.card.replace(/\s/g, ""))) er.card = "12–19 digit test card (try 4242….).";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(co.exp)) er.exp = "MM/YY.";
    if (!/^\d{3,4}$/.test(co.cvc)) er.cvc = "3–4 digits.";
    setErrs(er);
    if (Object.keys(er).length) return;
    setStage("done");
  };

  if (stage === "done") {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-emerald-200 bg-white p-8 text-center dark:border-emerald-500/30 dark:bg-white/[.03]">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">🎉</span>
        <h2 className="mt-3 text-2xl font-black">Order {orderNo} confirmed</h2>
        <p className="mt-1 text-sm text-slate-500">${(sub + ship + tax).toFixed(2)} · {count} items · receipt sent to {co.email} <b>(simulated — no charge, no email)</b>.</p>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-left text-sm dark:bg-white/5">
          {Object.entries(cart).map(([id, n]) => { const p = PRODUCTS.find((x) => x.id === id)!; return <div key={id} className="flex justify-between py-1"><span>{p.emoji} {p.name} × {n}</span><b>${(p.price * n).toFixed(2)}</b></div>; })}
        </div>
        <Btn className="mt-5" onClick={() => { setCart({}); setStage("shop"); setOpenCart(false); }}>Continue shopping</Btn>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[.03]">
      {Toast}
      <div className="flex items-center gap-3 bg-slate-950 px-5 py-3 text-white">
        <span className="text-xl">◍</span><b>Northloop</b>
        <span className="hidden text-xs text-slate-400 sm:block">fictional demo store — no real payments</span>
        <button onClick={() => setOpenCart(true)} aria-label={`Open cart, ${count} items`} className="ml-auto flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-slate-900 hover:bg-slate-200">
          <ShoppingCart size={16} /> {count} · ${sub.toFixed(0)}
        </button>
      </div>

      {stage === "shop" ? (
        <>
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-3 dark:border-white/10">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" aria-label="Search products" className="h-10 min-w-[180px] flex-1 rounded-xl border border-slate-300 px-3 text-sm dark:border-white/15 dark:bg-white/5" />
            <div className="flex gap-1.5" role="group" aria-label="Category">
              {["All", "Tech", "Home", "Outdoor", "Kitchen"].map((c) => (
                <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={cx("rounded-full px-3 py-1.5 text-xs font-bold", cat === c ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300")}>{c}</button>
              ))}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products" className="h-10 rounded-xl border border-slate-300 px-2 text-sm dark:border-white/15 dark:bg-transparent">
              <option value="feat">Featured</option><option value="price-asc">Price ↑</option><option value="price-desc">Price ↓</option><option value="rating">Top rated</option>
            </select>
          </div>
          {list.length === 0 ? (
            <div className="p-12 text-center"><p className="text-4xl">🛒</p><p className="mt-2 font-extrabold">Nothing matches “{q}”</p>
              <Btn size="sm" variant="outline" className="mt-3" onClick={() => { setQ(""); setCat("All"); }}>Clear search</Btn></div>
          ) : (
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <Card key={p.id} className="group overflow-hidden">
                  <button onClick={() => setDetail(p.id)} className="block w-full p-5 pb-0 text-left" aria-label={`View ${p.name}`}>
                    <span className="flex h-28 items-center justify-center rounded-2xl text-5xl transition group-hover:scale-105" style={{ background: `${p.hue}18` }}>{p.emoji}</span>
                    <span className="mt-3 flex items-center gap-2">{p.tag && <Badge tone="amber">{p.tag}</Badge>}<span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{p.cat}</span></span>
                    <span className="mt-1 block font-extrabold">{p.name}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Star size={12} className="fill-amber-400 text-amber-400" /> {p.rating} · {p.stock} left</span>
                  </button>
                  <div className="flex items-center gap-2 p-5 pt-3">
                    <b className="text-lg tabular-nums">${p.price}</b>
                    <Btn size="sm" className="ml-auto" onClick={() => add(p.id)}>Add to cart</Btn>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <form onSubmit={checkout} noValidate className="mx-auto max-w-xl space-y-4 p-6" aria-label="Checkout">
          <button type="button" onClick={() => setStage("shop")} className="text-sm font-bold text-violet-600">← Back to shop</button>
          <h2 className="text-2xl font-black">Checkout <span className="text-sm font-medium text-slate-400">(simulation)</span></h2>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-white/5">
            {Object.entries(cart).map(([id, n]) => { const p = PRODUCTS.find((x) => x.id === id)!; return <div key={id} className="flex justify-between py-0.5"><span>{p.name} × {n}</span><b>${(p.price * n).toFixed(2)}</b></div>; })}
            <div className="mt-2 border-t border-slate-200 pt-2 dark:border-white/10">
              <div className="flex justify-between text-slate-500"><span>Shipping {sub > 150 ? "(free over $150)" : ""}</span><span>${ship.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-base font-black"><span>Total</span><span>${(sub + ship + tax).toFixed(2)}</span></div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" error={errs.email} htmlFor="co-e"><input id="co-e" className={inputCls(errs.email)} value={co.email} onChange={(e) => setCo({ ...co, email: e.target.value })} placeholder="you@co.com" autoComplete="email" /></Field>
            <Field label="Full name" error={errs.name} htmlFor="co-n"><input id="co-n" className={inputCls(errs.name)} value={co.name} onChange={(e) => setCo({ ...co, name: e.target.value })} autoComplete="name" /></Field>
            <Field label="Address" error={errs.addr} htmlFor="co-a"><input id="co-a" className={inputCls(errs.addr)} value={co.addr} onChange={(e) => setCo({ ...co, addr: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" error={errs.city} htmlFor="co-c"><input id="co-c" className={inputCls(errs.city)} value={co.city} onChange={(e) => setCo({ ...co, city: e.target.value })} /></Field>
              <Field label="ZIP" error={errs.zip} htmlFor="co-z"><input id="co-z" className={inputCls(errs.zip)} value={co.zip} onChange={(e) => setCo({ ...co, zip: e.target.value })} inputMode="numeric" /></Field>
            </div>
            <Field label="Card (test)" error={errs.card} htmlFor="co-cc"><input id="co-cc" className={inputCls(errs.card)} value={co.card} onChange={(e) => setCo({ ...co, card: e.target.value })} placeholder="4242 4242 4242 4242" inputMode="numeric" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Expiry" error={errs.exp} htmlFor="co-x"><input id="co-x" className={inputCls(errs.exp)} value={co.exp} onChange={(e) => setCo({ ...co, exp: e.target.value })} placeholder="MM/YY" /></Field>
              <Field label="CVC" error={errs.cvc} htmlFor="co-v"><input id="co-v" className={inputCls(errs.cvc)} value={co.cvc} onChange={(e) => setCo({ ...co, cvc: e.target.value })} inputMode="numeric" /></Field>
            </div>
          </div>
          <Btn type="submit" size="lg" className="w-full">Pay ${(sub + ship + tax).toFixed(2)} (simulated)</Btn>
        </form>
      )}

      {/* product detail */}
      {detail && (() => { const p = PRODUCTS.find((x) => x.id === detail)!; return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={p.name}>
          <div className="absolute inset-0 bg-black/45" onClick={() => setDetail(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 dark:bg-slate-900">
            <button onClick={() => setDetail(null)} aria-label="Close" className="absolute right-4 top-4 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/10"><X size={18} /></button>
            <span className="flex h-36 items-center justify-center rounded-2xl text-7xl" style={{ background: `${p.hue}18` }}>{p.emoji}</span>
            <h3 className="mt-3 text-xl font-black">{p.name}</h3>
            <p className="text-sm text-slate-500">{p.blurb}</p>
            <p className="mt-2 flex items-center gap-1 text-sm"><Star size={14} className="fill-amber-400 text-amber-400" /><b>{p.rating}</b> · {p.stock} in stock</p>
            <div className="mt-4 flex items-center gap-3"><b className="text-2xl">${p.price}</b>
              <Btn className="ml-auto" onClick={() => { add(p.id); setDetail(null); setOpenCart(true); }}>Add & view cart</Btn></div>
          </div>
        </div>); })()}

      {/* cart drawer */}
      {openCart && (
        <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenCart(false)} />
          <div className="relative flex w-full max-w-sm flex-col bg-white p-5 dark:bg-slate-950">
            <div className="flex items-center justify-between"><h3 className="text-lg font-black">Cart ({count})</h3>
              <button onClick={() => setOpenCart(false)} aria-label="Close cart" className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/10"><X size={18} /></button></div>
            <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
              {Object.keys(cart).length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-white/15">
                  <p className="text-4xl">🛒</p><p className="mt-2 font-extrabold">Your cart is empty</p>
                  <p className="text-sm text-slate-500">Beautiful empty states suggest a next step.</p>
                  <Btn size="sm" className="mt-3" onClick={() => setOpenCart(false)}>Browse products</Btn>
                </div>
              )}
              {Object.entries(cart).map(([id, n]) => { const p = PRODUCTS.find((x) => x.id === id)!; return (
                <div key={id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 dark:border-white/10">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl" style={{ background: `${p.hue}18` }}>{p.emoji}</span>
                  <span className="min-w-0 flex-1"><b className="block truncate text-sm">{p.name}</b><span className="text-xs text-slate-500">${p.price} each</span></span>
                  <span className="flex items-center gap-1">
                    <button onClick={() => { if (n <= 1) { const c = { ...cart }; delete c[id]; setCart(c); } else setCart({ ...cart, [id]: n - 1 }); }} aria-label={`Decrease ${p.name}`} className="rounded-lg border p-1.5 hover:bg-slate-50 dark:border-white/10"><Minus size={13} /></button>
                    <b className="w-6 text-center tabular-nums">{n}</b>
                    <button onClick={() => add(id)} aria-label={`Increase ${p.name}`} className="rounded-lg border p-1.5 hover:bg-slate-50 dark:border-white/10"><Plus size={13} /></button>
                  </span>
                </div>); })}
            </div>
            {count > 0 && (
              <div className="border-t border-slate-200 pt-3 dark:border-white/10">
                <div className="flex justify-between text-sm"><span>Subtotal</span><b>${sub.toFixed(2)}</b></div>
                <div className="flex justify-between text-sm text-slate-500"><span>Shipping</span><span>{ship === 0 ? "FREE" : `$${ship.toFixed(2)}`}</span></div>
                <Btn className="mt-3 w-full" size="lg" onClick={() => { setOpenCart(false); setStage("checkout"); }}>Checkout →</Btn>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── ANALYTICS ── */
export function AnalyticsDemo() {
  const [range, setRange] = React.useState<7 | 14 | 30>(30);
  const [channel, setChannel] = React.useState("All");
  const [drill, setDrill] = React.useState<string | null>(null);
  const [errMode, setErrMode] = React.useState(false);
  const { push, Toast } = useToasts();
  const rows = ANALYTICS_DAYS.slice(-range).filter((r) => channel === "All" || r.channel === channel);

  if (errMode) {
    return (
      <Card className="p-10 text-center">
        <p className="text-4xl">📡</p><h3 className="mt-2 text-lg font-black">Warehouse unreachable (simulated)</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">The query failed after 8s. Cached snapshot from 09:41 is available — stale data must always be labeled as stale.</p>
        <div className="mt-4 flex justify-center gap-2"><Btn onClick={() => setErrMode(false)}><Check size={15} /> Retry live query</Btn>
          <Btn variant="outline" onClick={() => { setErrMode(false); push("Loaded snapshot", "Data labeled STALE · 09:41.", "#f59e0b"); }}>Use stale snapshot</Btn></div>
      </Card>
    );
  }
  if (rows.length === 0) {
    return <Card className="p-10 text-center"><p className="text-4xl">🈳</p><p className="mt-2 font-black">No rows for this filter</p>
      <Btn size="sm" variant="outline" className="mt-3" onClick={() => { setChannel("All"); setRange(30); }}>Reset filters</Btn></Card>;
  }

  const visitors = rows.reduce((a, r) => a + r.visitors, 0);
  const signups = rows.reduce((a, r) => a + r.signups, 0);
  const revenue = rows.reduce((a, r) => a + r.revenue, 0);
  const csv = () => {
    const text = "day,visitors,signups,revenue,channel\n" + rows.map((r) => `${r.day},${r.visitors},${r.signups},${r.revenue},${r.channel}`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
    a.download = "analytics-export.csv"; a.click();
    push("Exported CSV", `${rows.length} rows downloaded.`, "#10b981");
  };

  return (
    <div className="space-y-4">
      {Toast}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-full bg-slate-200/60 p-1 text-[13px] font-bold dark:bg-white/10" role="group" aria-label="Date range">
          {([7, 14, 30] as const).map((r) => <button key={r} onClick={() => setRange(r)} aria-pressed={range === r} className={cx("rounded-full px-4 py-1.5", range === r ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>Last {r}d</button>)}
        </div>
        <select value={channel} onChange={(e) => setChannel(e.target.value)} aria-label="Channel filter" className="h-9 rounded-full border border-slate-300 px-3 text-sm dark:border-white/15 dark:bg-transparent">
          {["All", "Organic", "Paid", "Referral"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="text-xs font-semibold text-slate-400">● Fresh · synced 4 min ago</span>
        <span className="ml-auto flex gap-2">
          <Btn size="sm" variant="outline" onClick={() => setErrMode(true)}>Simulate outage</Btn>
          <Btn size="sm" variant="outline" onClick={csv}>⬇ Export CSV</Btn>
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Kpi label="Visitors" value={visitors.toLocaleString()} delta="+12.4%" spark={rows.map((r) => r.visitors)} tone="#7c3aed" />
        <Kpi label="Signups" value={signups.toLocaleString()} delta={`${((signups / visitors) * 100).toFixed(1)}% cvr`} spark={rows.map((r) => r.signups)} tone="#06b6d4" />
        <Kpi label="Revenue" value={`$${revenue.toLocaleString()}`} delta="+8.1%" spark={rows.map((r) => r.revenue)} tone="#10b981" />
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <div className="flex items-center justify-between"><b>Visitors over time</b><span className="text-xs text-slate-400">hover for values · click bars below to drill</span></div>
          <LineChart data={rows.map((r) => r.visitors)} label={`Visitors, last ${range} days`} />
          <div className="mt-2 flex gap-4 text-xs font-semibold"><span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-full bg-violet-600" /> Visitors</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-full bg-cyan-500" /> 7-day avg</span></div>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <b>Signups by day</b>
          <div className="mt-2"><Bars data={rows.slice(-12).map((r) => r.signups)} labels={rows.slice(-12).map((r) => r.day.replace("Oct ", ""))} label="Signups by day" /></div>
          <div className="mt-3"><Donut label="Revenue share by channel" parts={[{ name: "Organic", value: 46, color: "#7c3aed" }, { name: "Paid", value: 34, color: "#06b6d4" }, { name: "Referral", value: 20, color: "#10b981" }]} /></div>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between p-4"><b>Daily breakdown {drill ? `· drilled into Oct ${drill}` : ""}</b>
          {drill && <button onClick={() => setDrill(null)} className="text-xs font-bold text-violet-600">Clear drill-down ✕</button>}</div>
        <div className="max-h-64 overflow-auto">
          <table className="w-full min-w-[560px] text-left text-[13px]">
            <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase text-slate-500 dark:bg-slate-900"><tr><th className="p-3">Day</th><th className="p-3">Channel</th><th className="p-3 text-right">Visitors</th><th className="p-3 text-right">Signups</th><th className="p-3 text-right">CVR</th><th className="p-3 text-right">Revenue</th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.day} onClick={() => setDrill(r.day.replace("Oct ", ""))} className={cx("cursor-pointer border-t border-slate-100 hover:bg-violet-50/50 dark:border-white/5", drill === r.day.replace("Oct ", "") && "bg-violet-50 dark:bg-violet-500/10")}>
                <td className="p-3 font-bold">{r.day}</td><td className="p-3"><Badge tone="slate">{r.channel}</Badge></td>
                <td className="p-3 text-right tabular-nums">{r.visitors.toLocaleString()}</td><td className="p-3 text-right tabular-nums">{r.signups.toLocaleString()}</td>
                <td className="p-3 text-right tabular-nums">{r.conv}%</td><td className="p-3 text-right font-bold tabular-nums">${r.revenue.toLocaleString()}</td>
              </tr>))}</tbody>
          </table>
        </div>
        {drill && <p className="border-t border-slate-100 p-3 text-xs text-slate-500 dark:border-white/10">Drill-down: Oct {drill} generated <b>{rows.find((r) => r.day === `Oct ${drill}`)?.signups} signups</b> — click another row to compare. KPIs above always equal the visible table.</p>}
      </Card>
    </div>
  );
}

/* ── AI/ML ── */
export function AimlDemo() {
  const [modelId, setModelId] = React.useState("m3");
  const [alerts, setAlerts] = React.useState<Alert[]>(ML_ALERTS);
  const [selAlert, setSelAlert] = React.useState("a1");
  const [history, setHistory] = React.useState<string[]>(["09:12 — a2 acknowledged by s.osei", "08:40 — nightly eval finished (AUC 0.874)"]);
  const [compare, setCompare] = React.useState<string[]>(["m3", "m1"]);
  const [inspect, setInspect] = React.useState(1);
  const { push, Toast } = useToasts();
  const model = ML_MODELS.find((m) => m.id === modelId)!;
  const alert = alerts.find((a) => a.id === selAlert)!;

  const setStatus = (id: string, s: Alert["status"]) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, status: s } : a)));
    setHistory([`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} — ${id} → ${s} by you (simulated)`, ...history]);
    push(`Alert ${s}`, `${id} updated locally.`, s === "resolved" ? "#10b981" : "#f59e0b");
  };

  const preds = [
    { id: "txn_88121", label: "legitimate", conf: "high", note: "Score 0.12 — far from 0.5 boundary. Amount + device consistent with history." },
    { id: "txn_88144", label: "fraud", conf: "medium", note: "Score 0.68 — near review threshold 0.65. New device is the main driver (SHAP +0.21)." },
    { id: "txn_88190", label: "needs review", conf: "low", note: "Score 0.51 — model is uncertain. Queued for human review; do not auto-decline." },
  ];

  return (
    <div className="space-y-4">
      {Toast}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
        Simulated data for education. Confidence is shown as model-score bands, <u>not</u> calibrated probabilities. Drift alone ≠ degradation — always check labels & evals.
      </div>
      {/* registry */}
      <div className="grid gap-3 md:grid-cols-4">
        {ML_MODELS.map((m) => (
          <button key={m.id} onClick={() => setModelId(m.id)} aria-pressed={modelId === m.id}
            className={cx("rounded-2xl border p-4 text-left transition", modelId === m.id ? "border-violet-500 ring-2 ring-violet-200 dark:ring-violet-500/20" : "border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-white/[.03]")}>
            <span className="flex items-center gap-2 text-sm font-extrabold">{m.name}
              <span className={cx("ml-auto h-2 w-2 rounded-full", m.status === "healthy" ? "bg-emerald-500" : m.status === "watch" ? "bg-amber-500" : "bg-rose-500")} /></span>
            <span className="text-xs text-slate-500">{m.version} · {m.owner}</span>
            <span className="mt-2 grid grid-cols-3 gap-1 text-center text-[11px]">
              <span className="rounded-lg bg-slate-100 py-1 dark:bg-white/10"><b>AUC {m.auc}</b></span>
              <span className="rounded-lg bg-slate-100 py-1 dark:bg-white/10"><b>F1 {m.f1}</b></span>
              <span className="rounded-lg bg-slate-100 py-1 dark:bg-white/10"><b>PSI {m.drift}</b></span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="space-y-3 p-5 lg:col-span-3">
          <div className="flex flex-wrap items-center gap-2"><h3 className="font-black">{model.name} <span className="font-mono text-xs text-slate-400">{model.version}</span></h3>
            <Badge tone={model.status === "healthy" ? "emerald" : model.status === "watch" ? "amber" : "rose"}>{model.status}</Badge>
            <span className="ml-auto text-xs text-slate-400">updated {model.updated}</span></div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[["AUC", String(model.auc)], ["F1", String(model.f1)], ["p50 latency", `${model.latency}ms`], ["Max PSI", String(model.drift)]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 p-2.5 dark:bg-white/5"><p className="text-[10px] font-bold uppercase text-slate-400">{k}</p><p className="font-black tabular-nums">{v}</p></div>
            ))}
          </div>
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-slate-500">Feature drift (train ■ vs serve ■)</p>
            <div className="space-y-3">
              {DRIFT_FEATURES.map((f) => (
                <div key={f.name} className="rounded-xl border border-slate-100 p-2.5 dark:border-white/10">
                  <div className="mb-1.5 flex items-center gap-2 text-xs font-bold">{f.name}
                    <Badge tone={f.psi > 0.25 ? "rose" : f.psi > 0.15 ? "amber" : "emerald"}>PSI {f.psi}</Badge></div>
                  <DistBars train={f.train} serve={f.serve} />
                </div>
              ))}
            </div>
          </div>
          {/* comparison */}
          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
            <p className="flex items-center gap-1.5 text-xs font-extrabold"><GitCompare size={13} /> Compare versions</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ML_MODELS.map((m) => (
                <button key={m.id} onClick={() => setCompare(compare.includes(m.id) ? compare.filter((c) => c !== m.id) : [...compare.slice(-1), m.id])}
                  aria-pressed={compare.includes(m.id)} className={cx("rounded-full px-3 py-1 text-xs font-bold", compare.includes(m.id) ? "bg-violet-600 text-white" : "bg-white ring-1 ring-slate-200 dark:bg-transparent dark:ring-white/15")}>
                  {m.name} {m.version}</button>
              ))}
            </div>
            <table className="mt-2 w-full text-xs"><thead><tr className="text-left text-slate-400"><th className="py-1">Model</th><th>AUC</th><th>F1</th><th>PSI</th></tr></thead>
              <tbody>{compare.map((id) => { const m = ML_MODELS.find((x) => x.id === id)!; return <tr key={id} className="border-t border-slate-200/60 dark:border-white/10"><td className="py-1 font-bold">{m.name}</td><td className="tabular-nums">{m.auc}</td><td className="tabular-nums">{m.f1}</td><td className="tabular-nums">{m.drift}</td></tr>; })}</tbody></table>
          </div>
          {/* prediction inspector */}
          <div>
            <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-500"><Eye size={13} /> Prediction inspector</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {preds.map((p, i) => (
                <button key={p.id} onClick={() => setInspect(i)} aria-pressed={inspect === i}
                  className={cx("rounded-2xl border p-3 text-left text-xs", inspect === i ? "border-violet-500 ring-2 ring-violet-200" : "border-slate-200 dark:border-white/10")}>
                  <b className="font-mono">{p.id}</b><span className="mt-1 block font-extrabold">{p.label} · {p.conf} confidence</span>
                </button>
              ))}
            </div>
            <p className="mt-2 rounded-xl bg-violet-50 p-3 text-xs leading-relaxed dark:bg-violet-500/10"><b>{preds[inspect].id}:</b> {preds[inspect].note}</p>
          </div>
        </Card>

        {/* alerts */}
        <div className="space-y-3 lg:col-span-2">
          <Card className="p-4">
            <b className="flex items-center gap-2 text-sm"><AlertTriangle size={15} className="text-amber-500" /> Alert queue ({alerts.filter((a) => a.status === "open").length} open)</b>
            <div className="mt-2 space-y-2">
              {alerts.map((a) => (
                <button key={a.id} onClick={() => setSelAlert(a.id)} aria-pressed={selAlert === a.id}
                  className={cx("w-full rounded-2xl border p-3 text-left text-[13px]", selAlert === a.id ? "border-violet-500 bg-violet-50/60 dark:bg-violet-500/10" : "border-slate-200 dark:border-white/10")}>
                  <span className="flex items-center gap-2"><Badge tone={a.severity === "P1" ? "rose" : a.severity === "P2" ? "amber" : "slate"}>{a.severity}</Badge>
                    <b className="truncate">{a.title}</b></span>
                  <span className="mt-1 flex items-center gap-2 text-xs text-slate-500"><Badge tone={a.status === "open" ? "rose" : a.status === "acknowledged" ? "amber" : "emerald"}>{a.status}</Badge> {a.model} · {a.time}</span>
                </button>
              ))}
            </div>
          </Card>
          {alert && (
            <Card className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Alert detail · {alert.id}</p>
              <h4 className="mt-1 font-extrabold">{alert.title}</h4>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">{alert.detail}</p>
              <div className="mt-3 flex gap-2">
                <Btn size="sm" variant="outline" disabled={alert.status !== "open"} onClick={() => setStatus(alert.id, "acknowledged")}>Acknowledge</Btn>
                <Btn size="sm" disabled={alert.status === "resolved"} onClick={() => setStatus(alert.id, "resolved")}><ShieldCheck size={14} /> Resolve</Btn>
              </div>
              <div className="mt-3 border-t border-slate-100 pt-2 dark:border-white/10">
                <p className="text-[11px] font-bold uppercase text-slate-400">Investigation history</p>
                <ul className="mt-1 space-y-1 text-xs text-slate-500">{history.map((h, i) => <li key={i}>· {h}</li>)}</ul>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── DESIGN SYSTEM ── */
const CODE: Record<string, string> = {
  button: `<Btn variant="primary" size="md" onClick={save}>\n  Save changes\n</Btn>`,
  input: `<Field label="Email" error={err} htmlFor="em">\n  <input id="em" className={inputCls(err)} />\n</Field>`,
  badge: `<Badge tone="emerald">● active</Badge>`,
  dialog: `<div role="dialog" aria-modal="true"\n  aria-label="Confirm">…focus trap…</div>`,
};

export function DesignSystemDemo() {
  const [tab, setTab] = React.useState("buttons");
  const [v, setV] = React.useState<"primary" | "secondary" | "ghost" | "danger" | "outline">("primary");
  const [copied, setCopied] = React.useState(false);
  const { push, Toast } = useToasts();
  const tabs = [["buttons", "Buttons"], ["inputs", "Inputs"], ["badges", "Badges & Alerts"], ["tabs", "Tabs & Dialog"], ["tables", "Tables & Skeletons"]];

  return (
    <div className="space-y-4">
      {Toast}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-violet-50/70 p-3 text-xs text-violet-950 dark:bg-violet-500/10 dark:text-violet-200">
        <span className="font-bold">📚 Dedicated documentation routes:</span>
        <div className="flex flex-wrap gap-2">
          <a href="#/design-system/tokens" className="font-semibold underline hover:text-violet-700 dark:hover:text-white">Token Explorer</a>
          <span>·</span>
          <a href="#/design-system/foundations" className="font-semibold underline hover:text-violet-700 dark:hover:text-white">Foundations</a>
          <span>·</span>
          <a href="#/design-system/components" className="font-semibold underline hover:text-violet-700 dark:hover:text-white">Component Catalogue</a>
          <span>·</span>
          <a href="#/design-system/playground" className="font-semibold underline hover:text-violet-700 dark:hover:text-white">Interactive Playground</a>
          <span>·</span>
          <a href="#/design-system/guidelines" className="font-semibold underline hover:text-violet-700 dark:hover:text-white">Guidelines & A11y</a>
          <span>·</span>
          <a href="#/design-system/states" className="font-semibold underline hover:text-violet-700 dark:hover:text-white">State Matrix</a>
          <span>·</span>
          <a href="#/design-system/audit" className="font-semibold underline hover:text-violet-700 dark:hover:text-white">Token Audit</a>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 dark:border-white/10 dark:bg-white/[.03]" role="tablist" aria-label="Component groups">
        {tabs.map(([id, l]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={cx("rounded-xl px-4 py-2 text-sm font-bold", tab === id ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5")}>{l}</button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,.05)] dark:border-white/10 dark:bg-white/[.04] space-y-4 p-6 lg:col-span-3" role="tabpanel">
          {tab === "buttons" && (
            <>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Variant">
                {(["primary", "secondary", "ghost", "danger", "outline"] as const).map((x) => (
                  <button key={x} onClick={() => setV(x)} aria-pressed={v === x} className={cx("rounded-full px-3 py-1 text-xs font-bold capitalize", v === x ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-white/10")}>{x}</button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50 p-6 dark:bg-white/5">
                <Btn variant={v} size="sm">Small</Btn><Btn variant={v}>Default</Btn><Btn variant={v} size="lg">Large</Btn>
                <Btn variant={v} disabled>Disabled</Btn>
                <Btn variant={v} onClick={() => push("Clicked", `${v} button fires onClick.`, "#7c3aed")}>Click me</Btn>
              </div>
              <Guidelines good="One primary action per view." bad="Don't stack three competing primaries." a11y="44px+ targets, visible focus, aria-disabled while loading." />
            </>
          )}
          {tab === "inputs" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Text input" hint="Always pair with a visible label."><input className={inputCls()} placeholder="Ada Lovelace" /></Field>
                <Field label="With error" error="Enter a valid email."><input className={inputCls("e")} defaultValue="ada@" aria-invalid="true" aria-describedby="x" /></Field>
                <Field label="Select" htmlFor="ds-s"><select id="ds-s" className={inputCls()}><option>Growth</option><option>Enterprise</option></select></Field>
                <Field label="Switches & checks">
                  <span className="flex gap-4 text-sm font-semibold"><label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="h-5 w-5 accent-violet-600" /> Email</label>
                    <label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-violet-600" /> SMS</label></span>
                </Field>
              </div>
              <Guidelines good="Inline errors name the fix." bad="Don't rely on placeholder as label." a11y="Associate errors with role=alert + aria-invalid." />
            </>
          )}
          {tab === "badges" && (
            <>
              <div className="flex flex-wrap gap-2"><Badge tone="emerald">● active</Badge><Badge tone="amber">◐ trialing</Badge><Badge tone="rose">● past due</Badge><Badge tone="sky">Growth</Badge><Badge tone="violet">New</Badge><Badge tone="slate">Archived</Badge></div>
              <div className="space-y-2">
                {[["emerald", "✓ Deployed to production in 42s."], ["amber", "⚠ Trial ends in 2 days — add a payment method."], ["rose", "✕ Sync failed. Retry or view logs."]].map(([t, m]) => (
                  <div key={m as string} role={t === "rose" ? "alert" : "status"} className={cx("rounded-2xl border p-3 text-sm font-semibold", t === "emerald" ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100" : t === "amber" ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100" : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-100")}>{m}</div>
                ))}
              </div>
              <Guidelines good="Color + text + icon, never color alone." bad="Don't use red for neutral info." a11y="Alerts use role=alert/status for SR announcement." />
            </>
          )}
          {tab === "tabs" && <TabsDialogDemo />}
          {tab === "tables" && (
            <>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
                <table className="w-full min-w-[420px] text-sm"><thead><tr className="bg-slate-50 text-left text-[11px] uppercase text-slate-500 dark:bg-white/5"><th className="p-3">User</th><th className="p-3">Plan</th><th className="p-3 text-right">MRR</th></tr></thead>
                  <tbody>{[["Ava Chen", "Growth", "$490"], ["Liam Park", "Enterprise", "$2,400"], ["Maya Garcia", "Starter", "$29"]].map(([a, b, c]) => (
                    <tr key={a} className="border-t border-slate-100 dark:border-white/5"><td className="p-3 font-bold">{a}</td><td className="p-3"><Badge tone="sky">{b}</Badge></td><td className="p-3 text-right tabular-nums">{c}</td></tr>))}</tbody></table>
              </div>
              <div className="space-y-2" aria-label="Skeleton loading example"><p className="text-xs font-bold text-slate-400">Skeleton (loading state):</p>
                {[90, 70, 80].map((w, i) => <div key={i} className="h-4 animate-pulse rounded bg-slate-200 dark:bg-white/10" style={{ width: `${w}%` }} />)}</div>
              <div><p className="text-xs font-bold text-slate-400">Progress:</p><div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10" role="progressbar" aria-valuenow={68} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress"><div className="h-full w-[68%] rounded-full bg-violet-600" /></div></div>
            </>
          )}
        </div>
        <Card className="h-fit p-5 lg:col-span-2">
          <div className="flex items-center justify-between"><b className="text-sm">Usage code</b>
            <button onClick={() => { navigator.clipboard?.writeText(CODE[tab === "tabs" ? "dialog" : tab === "tables" ? "badge" : tab] ?? CODE.button).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold hover:bg-slate-50 dark:border-white/10" aria-label="Copy code">
              <Copy size={12} /> {copied ? "Copied!" : "Copy"}</button></div>
          <pre className="code-block mt-2 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-slate-200">{CODE[tab === "tabs" ? "dialog" : tab === "tables" ? "badge" : tab] ?? CODE.button}</pre>
          <div className="mt-3 rounded-2xl bg-violet-50 p-3 text-xs leading-relaxed dark:bg-violet-500/10">
            <b>Token mapping:</b> surfaces → <code>bg-white / white/4</code> · borders → <code>slate-200 / white-10</code> · action → <code>violet-600</code> · focus → 2px violet ring. New themes override semantic tokens, never components.
          </div>
          <Btn size="sm" variant="outline" className="mt-3 w-full" onClick={() => { window.location.hash = "#/tokens"; }}>Open token system →</Btn>
        </Card>
      </div>
    </div>
  );
}

function Guidelines({ good, bad, a11y }: { good: string; bad: string; a11y: string }) {
  return (
    <div className="grid gap-2 text-xs sm:grid-cols-3">
      <p className="rounded-xl bg-emerald-50 p-3 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100"><b>✓ Do:</b> {good}</p>
      <p className="rounded-xl bg-rose-50 p-3 text-rose-900 dark:bg-rose-500/10 dark:text-rose-100"><b>✕ Don't:</b> {bad}</p>
      <p className="rounded-xl bg-sky-50 p-3 text-sky-900 dark:bg-sky-500/10 dark:text-sky-100"><b>♿ A11y:</b> {a11y}</p>
    </div>
  );
}

function TabsDialogDemo() {
  const [t, setT] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Demo tabs" className="flex gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-white/10">
        {["Overview", "Usage", "A11y"].map((l, i) => (
          <button key={l} role="tab" aria-selected={t === i} onClick={() => setT(i)} className={cx("flex-1 rounded-xl py-2 text-sm font-bold", t === i ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>{l}</button>
        ))}
      </div>
      <div role="tabpanel" className="rounded-2xl border border-slate-200 p-4 text-sm dark:border-white/10">
        {t === 0 && "Tabs group related content. Arrow keys move between tabs; content is a single tab stop."}
        {t === 1 && "Use tabs for 2–6 peer views. Prefer pages or accordions beyond that."}
        {t === 2 && "role=tablist/tab/tabpanel, aria-selected, and full keyboard support are required."}
      </div>
      <div className="flex gap-2">
        <Btn size="sm" onClick={() => setOpen(true)}>Open dialog</Btn>
        <Btn size="sm" variant="outline" onClick={() => setDrawer(true)}>Open drawer <ArrowRight size={13} /></Btn>
      </div>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Example dialog">
          <div className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 dark:bg-slate-900">
            <h4 className="font-black">Delete workspace?</h4>
            <p className="mt-1 text-sm text-slate-500">Type DELETE to confirm — destructive actions need friction + escape.</p>
            <div className="mt-4 flex justify-end gap-2"><Btn size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn><Btn size="sm" variant="danger" onClick={() => setOpen(false)}>Delete</Btn></div>
          </div>
        </div>
      )}
      {drawer && (
        <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal="true" aria-label="Example drawer">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
          <div className="relative w-full max-w-xs bg-white p-5 dark:bg-slate-900"><h4 className="font-black">Filters</h4><p className="text-sm text-slate-500">Drawers keep context visible — dialogs demand a decision.</p>
            <Btn size="sm" className="mt-4 w-full" onClick={() => setDrawer(false)}>Apply</Btn></div>
        </div>
      )}
    </div>
  );
}
