import React from "react";
import { ORDERS, Order } from "../lib/demo-data";
import { Badge, Btn, Card, Field, inputCls, useToasts, Kpi } from "../components/ui";
import { Check, X, Search, Bell, ChevronLeft, ChevronRight, Shield, Download, Eye, Trash2, Menu } from "lucide-react";
import { cx } from "../lib/core";

/* ── MARKETING ── */
export function MarketingDemo() {
  const [billing, setBilling] = React.useState<"mo" | "yr">("yr");
  const [openFaq, setOpenFaq] = React.useState(0);
  const [form, setForm] = React.useState({ name: "", email: "", company: "", msg: "" });
  const [errs, setErrs] = React.useState<Record<string, string>>({});
  const [sent, setSent] = React.useState(false);
  const [mobileNav, setMobileNav] = React.useState(false);
  const { push, Toast } = useToasts();

  const plans = [
    { n: "Starter", mo: 19, feat: ["3 projects", "Community support", "1GB storage", "Basic analytics"], cta: "Start free" },
    { n: "Growth", mo: 49, feat: ["Unlimited projects", "Priority support", "100GB storage", "Advanced analytics", "SSO"], cta: "Start 14-day trial", hot: true },
    { n: "Scale", mo: 99, feat: ["Everything in Growth", "Dedicated CSM", "Audit logs", "99.99% SLA", "Custom DPA"], cta: "Talk to sales" },
  ];
  const faqs = [
    ["How does the trial work?", "14 days, no card required. Your workspace keeps everything when you upgrade — nothing is deleted."],
    ["Can I migrate from another tool?", "Yes — one-click importers for the top 6 tools plus a CSV fallback. Median migration is 11 minutes."],
    ["Is my data private?", "SOC 2 Type II, EU data residency option, and per-workspace encryption keys. We never train models on your content."],
    ["What happens if I cancel?", "You keep read access for 90 days and can export everything (JSON + CSV). No dark patterns."],
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2: Record<string, string> = {};
    if (form.name.trim().length < 2) e2.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e2.email = "Enter a valid work email.";
    if (form.msg.trim().length < 10) e2.msg = "Tell us a little more (10+ characters).";
    setErrs(e2);
    if (Object.keys(e2).length) { push("Check the form", "3 fields need attention — see inline messages.", "#e11d48"); return; }
    setSent(true);
    push("Demo request received", "Local simulation — no email was actually sent.", "#10b981");
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[.03]">
      {Toast}
      {/* nav */}
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
        <div className="flex h-14 items-center gap-4 px-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white text-sm font-black">N</span>
          <b className="text-[15px]">Northwind</b>
          <nav className="ml-6 hidden items-center gap-5 text-[13px] font-semibold text-slate-500 md:flex" aria-label="Marketing">
            {["Features", "Pricing", "Customers", "Docs"].map((l) => <a key={l} href="#/product/marketing" onClick={(e) => e.preventDefault()} className="hover:text-slate-900 dark:hover:text-white">{l}</a>)}
          </nav>
          <div className="ml-auto hidden gap-2 md:flex">
            <Btn variant="ghost" size="sm">Sign in</Btn>
            <Btn size="sm" onClick={() => document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" })}>Get started</Btn>
          </div>
          <button className="ml-auto rounded-lg p-2 md:hidden" onClick={() => setMobileNav(!mobileNav)} aria-label="Menu" aria-expanded={mobileNav}><Menu size={18} /></button>
        </div>
        {mobileNav && (
          <div className="border-t border-slate-100 px-5 py-3 md:hidden dark:border-white/10">
            {["Features", "Pricing", "Customers", "Docs", "Sign in", "Get started"].map((l) => (
              <a key={l} href="#lead-form" onClick={() => setMobileNav(false)} className="block py-2 text-sm font-semibold">{l}</a>
            ))}
          </div>
        )}
      </div>
      {/* hero */}
      <div className="grid gap-8 bg-gradient-to-b from-violet-50 to-white px-6 py-12 sm:px-10 md:grid-cols-2 md:items-center dark:from-violet-950/40 dark:to-transparent">
        <div>
          <Badge tone="violet">New · Analytics 2.0 is live</Badge>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Ship product decisions <span className="text-violet-600">10× faster</span></h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">Northwind unifies research, analytics and experiments so teams stop guessing. Median setup time: 11 minutes.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Btn size="lg" onClick={() => document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" })}>Start free trial</Btn>
            <Btn size="lg" variant="outline" onClick={() => push("Demo video", "2:14 — local simulation, no video hosted.", "#06b6d4")}>▶ Watch demo</Btn>
          </div>
          <p className="mt-3 text-xs text-slate-500">Free 14 days · No credit card · Cancel anytime</p>
        </div>
        <Card className="animate-floaty p-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500"><span>● ● ●</span><span>live dashboard</span></div>
          <p className="mt-2 text-3xl font-black">+38.2%</p>
          <p className="text-xs text-emerald-600 font-bold">activation vs last quarter</p>
          <div className="mt-3 flex h-24 items-end gap-1.5">{[40, 55, 48, 70, 62, 84, 78, 95, 88, 100, 92, 110].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-violet-600 to-cyan-400" style={{ height: `${(h / 110) * 100}%` }} />
          ))}</div>
        </Card>
      </div>
      {/* features */}
      <div className="grid gap-3 px-6 py-8 sm:grid-cols-3 sm:px-10">
        {[["⚡", "Realtime analytics", "Sub-second queries over billions of events."], ["🧪", "Built-in experiments", "Feature flags + stats engine, no PhD needed."], ["🔒", "Enterprise trust", "SOC 2, SSO, EU residency out of the box."]].map(([e, t, d]) => (
          <Card key={t} className="p-5"><span className="text-2xl">{e}</span><p className="mt-2 font-extrabold">{t}</p><p className="mt-1 text-sm text-slate-500">{d}</p></Card>
        ))}
      </div>
      {/* pricing */}
      <div className="border-t border-slate-100 px-6 py-10 sm:px-10 dark:border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black">Pricing that scales with you</h2>
          <div className="flex rounded-full bg-slate-100 p-1 text-sm font-bold dark:bg-white/10" role="group" aria-label="Billing period">
            {(["mo", "yr"] as const).map((b) => (
              <button key={b} onClick={() => setBilling(b)} aria-pressed={billing === b}
                className={cx("rounded-full px-4 py-1.5", billing === b ? "bg-white shadow dark:bg-slate-800" : "text-slate-500")}>
                {b === "mo" ? "Monthly" : "Yearly −20%"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.n} className={cx("relative p-6", p.hot && "ring-2 ring-violet-500")}>
              {p.hot && <Badge tone="violet" className="absolute -top-2.5 left-6">Most popular</Badge>}
              <p className="font-extrabold">{p.n}</p>
              <p className="mt-1"><span className="text-4xl font-black tabular-nums">${billing === "mo" ? p.mo : Math.round(p.mo * 0.8)}</span><span className="text-sm text-slate-500">/mo</span></p>
              <ul className="mt-4 space-y-2 text-sm">{p.feat.map((f) => <li key={f} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-emerald-500" />{f}</li>)}</ul>
              <Btn className="mt-5 w-full" variant={p.hot ? "primary" : "outline"} onClick={() => push(`${p.n} selected`, `${billing === "yr" ? "Yearly" : "Monthly"} billing — demo only.`, "#7c3aed")}>{p.cta}</Btn>
            </Card>
          ))}
        </div>
      </div>
      {/* faq */}
      <div className="border-t border-slate-100 px-6 py-10 sm:px-10 dark:border-white/10">
        <h2 className="text-2xl font-black">Questions, answered</h2>
        <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200 dark:divide-white/10 dark:border-white/10">
          {faqs.map(([q, a], i) => (
            <div key={q}>
              <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i} className="flex w-full items-center justify-between px-5 py-4 text-left font-bold hover:bg-slate-50 dark:hover:bg-white/5">
                {q}<ChevronRight size={16} className={cx("transition", openFaq === i && "rotate-90")} />
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{a}</p>}
            </div>
          ))}
        </div>
      </div>
      {/* lead form */}
      <div id="lead-form" className="border-t border-slate-100 bg-slate-50/60 px-6 py-10 sm:px-10 dark:border-white/10 dark:bg-white/[.02]">
        {sent ? (
          <Card className="mx-auto max-w-lg border-emerald-200 p-8 text-center dark:border-emerald-500/30">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check size={22} /></span>
            <h3 className="mt-3 text-xl font-black">You're on the list, {form.name.split(" ")[0] || "friend"}!</h3>
            <p className="mt-1 text-sm text-slate-500">Local simulation — nothing was sent anywhere. <button className="font-bold text-violet-600 hover:underline" onClick={() => { setSent(false); setForm({ name: "", email: "", company: "", msg: "" }); }}>Send another</button></p>
          </Card>
        ) : (
          <form onSubmit={submit} noValidate className="mx-auto max-w-lg space-y-4" aria-label="Request a demo">
            <h2 className="text-2xl font-black">Request a demo</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errs.name} htmlFor="ld-name"><input id="ld-name" className={inputCls(errs.name)} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ada Lovelace" autoComplete="name" /></Field>
              <Field label="Work email" error={errs.email} htmlFor="ld-email"><input id="ld-email" className={inputCls(errs.email)} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ada@company.com" autoComplete="email" /></Field>
            </div>
            <Field label="Company (optional)" htmlFor="ld-co"><input id="ld-co" className={inputCls()} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Analytical Engines Inc." /></Field>
            <Field label="What are you trying to solve?" error={errs.msg} htmlFor="ld-msg"><textarea id="ld-msg" rows={3} className={inputCls(errs.msg) + " h-auto py-2.5"} value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} placeholder="We run 20 experiments a month and can't tell what worked…" /></Field>
            <Btn type="submit" className="w-full" size="lg">Request demo →</Btn>
            <p className="text-center text-xs text-slate-400">Clearly labeled local simulation — no backend connected.</p>
          </form>
        )}
      </div>
      <footer className="flex flex-wrap gap-3 border-t border-slate-100 px-6 py-6 text-xs text-slate-500 sm:px-10 dark:border-white/10">
        <b className="text-slate-700 dark:text-slate-200">Northwind</b><span>© 2026 · Privacy · Terms · Status: <span className="font-bold text-emerald-600">● operational</span></span>
      </footer>
    </div>
  );
}

/* ── MOBILE ── */
export function MobileDemo() {
  const [step, setStep] = React.useState(0);
  const [tab, setTab] = React.useState("home");
  const [done, setDone] = React.useState(false);
  const [prefs, setPrefs] = React.useState({ launches: true, mentions: true, digest: false });
  const [name, setName] = React.useState("Maya Chen");
  const [handle, setHandle] = React.useState("@mayaships");
  const [saved, setSaved] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { push, Toast } = useToasts();

  const slides = [
    ["👋", "Welcome to Pulse", "Track habits, streaks and focus in under 30 seconds a day."],
    ["📊", "See real progress", "Charts that respect your attention — no vanity metrics."],
    ["🔔", "Gentle nudges", "Notifications you control. Silence is a feature."],
  ];

  if (!done) {
    const [e, t, d] = slides[step];
    return (
      <div className="mx-auto max-w-sm">
        {Toast}
        <div className="overflow-hidden rounded-[2rem] border-[10px] border-slate-900 bg-white shadow-2xl dark:bg-slate-950">
          <div className="flex justify-center pt-2"><span className="h-5 w-28 rounded-full bg-slate-900 dark:bg-white/20" /></div>
          <div className="flex min-h-[480px] flex-col items-center px-6 py-8 text-center">
            <span className="text-6xl">{e}</span>
            <h3 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">{t}</h3>
            <p className="mt-2 text-sm text-slate-500">{d}</p>
            <div className="mt-4 flex gap-1.5">{slides.map((_, i) => <span key={i} className={cx("h-1.5 rounded-full transition-all", i === step ? "w-6 bg-violet-600" : "w-1.5 bg-slate-300")} />)}</div>
            <div className="mt-auto w-full space-y-2 pt-8">
              <Btn className="w-full rounded-2xl" size="lg" onClick={() => step < 2 ? setStep(step + 1) : setDone(true)}>{step < 2 ? "Continue" : "Get started"}</Btn>
              <button onClick={() => setDone(true)} className="w-full py-1 text-xs font-bold text-slate-400">Skip onboarding</button>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">Browser simulation of a native flow — same states, touch-sized targets (≥44pt).</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      {Toast}
      <div className="overflow-hidden rounded-[2rem] border-[10px] border-slate-900 bg-slate-50 shadow-2xl dark:bg-slate-950">
        <div className="flex justify-center bg-white pt-2 dark:bg-slate-900"><span className="h-5 w-28 rounded-full bg-slate-900 dark:bg-white/20" /></div>
        <div className="min-h-[480px] bg-white pb-4 dark:bg-slate-900">
          <div className="flex items-center justify-between px-5 pt-3">
            <b className="text-slate-900 dark:text-white">{tab === "home" ? "Today" : tab === "stats" ? "Progress" : tab === "bell" ? "Inbox" : "Profile"}</b>
            <button className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Notifications" onClick={() => setTab("bell")}>
              <Bell size={18} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>
          </div>
          <div className="px-5 py-3">
            {tab === "home" && (
              <div className="space-y-3">
                <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/70">Current streak</p>
                  <p className="text-4xl font-black">12 days 🔥</p>
                  <button onClick={() => push("Check-in logged", "Streak extended — local state only.", "#10b981")} className="mt-3 w-full rounded-xl bg-white/20 py-2.5 text-sm font-bold backdrop-blur hover:bg-white/30 active:scale-[.98]">Log today's check-in</button>
                </div>
                {[["Morning run", "5.2 km · done", true], ["Read 20 pages", "12/20 so far", false], ["No sugar", "day 3", false]].map(([t, s, on]) => (
                  <label key={t as string} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 dark:border-white/10">
                    <input type="checkbox" defaultChecked={on as boolean} className="h-6 w-6 accent-violet-600" aria-label={t as string} />
                    <span><span className="block text-sm font-bold">{t}</span><span className="block text-xs text-slate-500">{s}</span></span>
                  </label>
                ))}
              </div>
            )}
            {tab === "stats" && (
              loading ? <div className="space-y-2 py-8" aria-busy="true">{[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />)}</div>
              : <div className="space-y-3">
                <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 900); }} className="text-xs font-bold text-violet-600">↻ Simulate reload</button>
                {[["Mon", 70], ["Tue", 45], ["Wed", 90], ["Thu", 60], ["Fri", 100]].map(([d, v]) => (
                  <div key={d as string}><div className="flex justify-between text-xs font-bold"><span>{d}</span><span>{v}%</span></div>
                  <div className="mt-1 h-3 rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${v}%` }} /></div></div>
                ))}
                <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-white/5">Empty state preview: <button className="font-bold text-violet-600" onClick={() => push("Empty state", "“No workouts yet — log your first run.” + CTA.", "#06b6d4")}>show copy</button></div>
              </div>
            )}
            {tab === "bell" && (
              <div className="space-y-2">
                {(Object.keys(prefs) as (keyof typeof prefs)[]).map((k) => (
                  <label key={k} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 text-sm font-bold dark:border-white/10">
                    <span className="capitalize">{k}</span>
                    <button role="switch" aria-checked={prefs[k]} aria-label={`${k} notifications`} onClick={() => { setPrefs({ ...prefs, [k]: !prefs[k] }); push("Preference saved", `${k} ${!prefs[k] ? "on" : "off"}.`, "#7c3aed"); }}
                      className={cx("h-8 w-14 rounded-full p-1 transition", prefs[k] ? "bg-violet-600" : "bg-slate-300")}>
                      <span className={cx("block h-6 w-6 rounded-full bg-white shadow transition", prefs[k] ? "translate-x-6" : "")} />
                    </button>
                  </label>
                ))}
                <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">⚠️ Error state: failed to load 1 notification. <button className="font-bold underline" onClick={() => push("Retried", "Recovered on retry — idempotent fetch.", "#10b981")}>Retry</button></div>
              </div>
            )}
            {tab === "me" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xl font-black text-white">M</span>
                  <div><p className="font-black">{name || "Your name"}</p><p className="text-xs text-slate-500">{handle || "@handle"}</p></div>
                </div>
                <Field label="Display name" error={err} htmlFor="m-name"><input id="m-name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls(err)} /></Field>
                <Field label="Handle" htmlFor="m-handle"><input id="m-handle" value={handle} onChange={(e) => setHandle(e.target.value)} className={inputCls()} /></Field>
                <Btn className="w-full rounded-2xl" onClick={() => {
                  if (name.trim().length < 2) { setErr("Name needs at least 2 characters."); return; }
                  if (!/^@[\w.]{2,}$/.test(handle.trim())) { setErr("Handle like @maya.ship"); return; }
                  setErr(""); setSaved(true); push("Profile saved", "Validated locally.", "#10b981"); setTimeout(() => setSaved(false), 2000);
                }}>{saved ? "✓ Saved!" : "Save profile"}</Btn>
                <button onClick={() => { setDone(false); setStep(0); }} className="w-full text-center text-xs font-bold text-slate-400">↺ Replay onboarding</button>
              </div>
            )}
          </div>
        </div>
        <nav className="grid grid-cols-4 border-t border-slate-200 bg-white px-2 py-2 dark:border-white/10 dark:bg-slate-900" aria-label="Mobile tabs">
          {[["home", "🏠", "Home"], ["stats", "📊", "Stats"], ["bell", "🔔", "Inbox"], ["me", "👤", "You"]].map(([id, e, l]) => (
            <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? "page" : undefined}
              className={cx("flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-bold", tab === id ? "text-violet-600" : "text-slate-400")}>
              <span className="text-lg">{e}</span>{l}
            </button>
          ))}
        </nav>
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">States covered: onboarding · loading · empty · error · success · validation.</p>
    </div>
  );
}

/* ── DASHBOARD ── */
const STATUS_TONE: Record<Order["status"], string> = { active: "emerald", trialing: "sky", past_due: "amber", churned: "rose", pending: "slate" };

export function DashboardDemo() {
  const [q, setQ] = React.useState("");
  const [plan, setPlan] = React.useState("All");
  const [status, setStatus] = React.useState("All");
  const [sortK, setSortK] = React.useState<"mrr" | "seats" | "customer">("mrr");
  const [dir, setDir] = React.useState<1 | -1>(-1);
  const [page, setPage] = React.useState(0);
  const [sel, setSel] = React.useState<Set<string>>(new Set());
  const [detail, setDetail] = React.useState<Order | null>(null);
  const [confirm, setConfirm] = React.useState<null | { action: string }>(null);
  const [notifs, setNotifs] = React.useState([{ t: "Sync finished — 64 records", time: "2m", read: false }, { t: "2 trials expire tomorrow", time: "1h", read: false }]);
  const [showNotifs, setShowNotifs] = React.useState(false);
  const [role, setRole] = React.useState<"Admin" | "Manager" | "Viewer">("Admin");
  const [collapsed, setCollapsed] = React.useState(false);
  const [removed, setRemoved] = React.useState<Set<string>>(new Set());
  const { push, Toast } = useToasts();
  const PER = 8;

  const rows = ORDERS.filter((o) => !removed.has(o.id)).filter((o) =>
    (o.customer + o.email + o.id).toLowerCase().includes(q.toLowerCase()) && (plan === "All" || o.plan === plan) && (status === "All" || o.status === status)
  ).sort((a, b) => {
    const av = a[sortK], bv = b[sortK];
    return (typeof av === "number" ? av - (bv as number) : String(av).localeCompare(String(bv))) * dir;
  });
  const pages = Math.max(1, Math.ceil(rows.length / PER));
  const view = rows.slice(page * PER, page * PER + PER);
  const mrr = rows.reduce((a, r) => a + r.mrr, 0);
  const canEdit = role !== "Viewer";

  const toggleSort = (k: typeof sortK) => { if (sortK === k) setDir(dir === 1 ? -1 : 1); else { setSortK(k); setDir(-1); } };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[.03]">
      {Toast}
      <div className="flex min-h-[640px]">
        {/* sidebar */}
        <aside className={cx("hidden shrink-0 flex-col gap-1 border-r border-slate-200 bg-slate-50/60 p-3 transition-all sm:flex dark:border-white/10 dark:bg-white/[.02]", collapsed ? "w-14" : "w-52")} aria-label="Dashboard nav">
          <button onClick={() => setCollapsed(!collapsed)} className="mb-2 rounded-lg p-2 text-slate-500 hover:bg-slate-200/60" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? "→" : "←"}</button>
          {[["📊", "Overview"], ["🧾", "Orders"], ["👥", "Customers"], ["📦", "Products"], ["⚙️", "Settings"]].map(([e, l], i) => (
            <a key={l} href="#/product/dashboard" onClick={(e2) => e2.preventDefault()} aria-current={i === 1 ? "page" : undefined}
              className={cx("flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-bold", i === 1 ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-slate-200/50 dark:text-slate-300")}>
              <span>{e}</span>{!collapsed && l}
            </a>
          ))}
          {!collapsed && (
            <div className="mt-auto rounded-xl bg-slate-900 p-3 text-white dark:bg-white/10">
              <p className="text-xs font-extrabold">Role simulation</p>
              <div className="mt-2 grid grid-cols-3 gap-1 text-[11px] font-bold" role="group" aria-label="Role">
                {(["Admin", "Manager", "Viewer"] as const).map((r) => (
                  <button key={r} onClick={() => { setRole(r); push(`Role: ${r}`, r === "Viewer" ? "Mutations disabled (simulated)." : "Full demo permissions.", "#0ea5e9"); }}
                    className={cx("rounded-lg py-1", role === r ? "bg-white text-slate-900" : "bg-white/10")}>{r}</button>
                ))}
              </div>
              {!canEdit && <p className="mt-2 flex items-center gap-1 text-[11px] text-amber-300"><Shield size={11} /> read-only mode</p>}
            </div>
          )}
        </aside>

        <div className="min-w-0 flex-1">
          {/* header */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3 dark:border-white/10">
            <div className="text-sm text-slate-400">Home <span aria-hidden>/</span> <b className="text-slate-800 dark:text-white">Orders</b></div>
            <div className="relative ml-auto">
              <button onClick={() => setShowNotifs(!showNotifs)} aria-label={`Notifications, ${notifs.filter((n) => !n.read).length} unread`} aria-expanded={showNotifs} className="relative rounded-xl border border-slate-200 p-2 hover:bg-slate-50 dark:border-white/10">
                <Bell size={17} />{notifs.some((n) => !n.read) && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-11 z-20 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900" role="dialog" aria-label="Notification center">
                  <div className="flex items-center justify-between px-4 py-2.5 text-sm font-extrabold">Notifications
                    <button className="text-xs text-violet-600" onClick={() => setNotifs(notifs.map((n) => ({ ...n, read: true })))}>Mark all read</button></div>
                  {notifs.map((n, i) => (
                    <div key={i} className="flex items-start gap-2 border-t border-slate-100 px-4 py-2.5 text-[13px] dark:border-white/5">
                      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" />}
                      <span>{n.t}<span className="block text-[11px] text-slate-400">{n.time} ago</span></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold sm:flex dark:bg-white/10"><Shield size={13} /> {role}</span>
          </div>

          <div className="space-y-4 p-5">
            <div className="grid gap-3 sm:grid-cols-4">
              <Kpi label="Filtered MRR" value={`$${mrr.toLocaleString()}`} delta={`${rows.length} accts`} spark={[3, 5, 4, 7, 6, 9, 8]} tone="#7c3aed" />
              <Kpi label="Avg seats" value={rows.length ? String(Math.round(rows.reduce((a, r) => a + r.seats, 0) / rows.length)) : "—"} delta="per acct" spark={[2, 4, 3, 5, 6, 5, 7]} tone="#06b6d4" />
              <Kpi label="Past-due" value={String(rows.filter((r) => r.status === "past_due").length)} delta="needs action" spark={[1, 2, 2, 3, 2, 4, 3]} tone="#f59e0b" />
              <Kpi label="Churned" value={String(rows.filter((r) => r.status === "churned").length)} delta="in filter" spark={[4, 3, 3, 2, 2, 1, 1]} tone="#f43f5e" />
            </div>

            {/* controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px] flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search customer, email, ID…" aria-label="Search orders"
                  className="h-10 w-full rounded-xl border border-slate-300 pl-9 pr-3 text-sm dark:border-white/15 dark:bg-white/5" />
              </div>
              <select value={plan} onChange={(e) => { setPlan(e.target.value); setPage(0); }} aria-label="Filter by plan" className="h-10 rounded-xl border border-slate-300 bg-transparent px-2 text-sm dark:border-white/15">
                {["All", "Starter", "Growth", "Enterprise"].map((p) => <option key={p}>{p}</option>)}
              </select>
              <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} aria-label="Filter by status" className="h-10 rounded-xl border border-slate-300 bg-transparent px-2 text-sm dark:border-white/15">
                {["All", "active", "trialing", "past_due", "churned", "pending"].map((p) => <option key={p}>{p}</option>)}
              </select>
              <Btn size="sm" variant="outline" onClick={() => { setQ(""); setPlan("All"); setStatus("All"); setPage(0); setSel(new Set()); }}><Trash2 size={13} /> Reset</Btn>
              <Btn size="sm" variant="outline" onClick={() => push("Export started", `${rows.length} rows → CSV (simulated download).`, "#0ea5e9")}><Download size={13} /> Export</Btn>
            </div>

            {/* bulk bar */}
            {sel.size > 0 && (
              <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white" role="status">
                {sel.size} selected
                <Btn size="sm" className="bg-white !text-violet-700 hover:bg-violet-50" disabled={!canEdit} onClick={() => setConfirm({ action: `Approve ${sel.size} account(s)` })}>Approve</Btn>
                <Btn size="sm" className="bg-white/15 !text-white hover:bg-white/25" disabled={!canEdit} onClick={() => setConfirm({ action: `Suspend ${sel.size} account(s)` })}>Suspend</Btn>
                <button className="ml-auto underline" onClick={() => setSel(new Set())}>Clear</button>
              </div>
            )}
            {!canEdit && <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">Viewer role: sorting, filtering and detail views work — mutations are disabled (front-end simulation; real auth would be server-enforced).</p>}

            {/* table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
              <table className="w-full min-w-[720px] text-left text-[13px]">
                <thead>
                  <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-white/5">
                    <th className="p-3"><input type="checkbox" aria-label="Select all on page" checked={view.length > 0 && view.every((r) => sel.has(r.id))}
                      onChange={(e) => { const n = new Set(sel); view.forEach((r) => e.target.checked ? n.add(r.id) : n.delete(r.id)); setSel(n); }} className="h-4 w-4 accent-violet-600" /></th>
                    {[["customer", "Customer"], ["mrr", "MRR"], ["seats", "Seats"]].map(([k, l]) => (
                      <th key={k}><button onClick={() => toggleSort(k as typeof sortK)} className="flex items-center gap-1 p-3 font-bold hover:text-slate-800" aria-sort={sortK === k ? (dir === 1 ? "ascending" : "descending") : "none"}>{l} {sortK === k ? (dir === 1 ? "↑" : "↓") : "↕"}</button></th>
                    ))}
                    <th className="p-3">Plan</th><th className="p-3">Status</th><th className="p-3">Region</th><th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {view.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100 hover:bg-violet-50/40 dark:border-white/5 dark:hover:bg-white/5">
                      <td className="p-3"><input type="checkbox" aria-label={`Select ${r.customer}`} checked={sel.has(r.id)}
                        onChange={() => { const n = new Set(sel); sel.has(r.id) ? n.delete(r.id) : n.add(r.id); setSel(n); }} className="h-4 w-4 accent-violet-600" /></td>
                      <td className="p-3"><b>{r.customer}</b><span className="block text-xs text-slate-400">{r.id} · {r.email}</span></td>
                      <td className="p-3 font-bold tabular-nums">${r.mrr.toLocaleString()}</td>
                      <td className="p-3 tabular-nums">{r.seats}</td>
                      <td className="p-3"><Badge tone="sky">{r.plan}</Badge></td>
                      <td className="p-3"><Badge tone={STATUS_TONE[r.status] as never}>{r.status.replace("_", " ")}</Badge></td>
                      <td className="p-3 text-slate-500">{r.region}</td>
                      <td className="p-3 text-right"><button onClick={() => setDetail(r)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold hover:bg-slate-50 dark:border-white/10" aria-label={`View ${r.customer}`}><Eye size={13} /> View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {view.length === 0 && (
                <div className="p-10 text-center"><p className="font-extrabold">No accounts match these filters</p>
                  <p className="mt-1 text-sm text-slate-500">Try widening the search — filters combine with AND.</p>
                  <Btn size="sm" variant="outline" className="mt-3" onClick={() => { setQ(""); setPlan("All"); setStatus("All"); }}>Clear filters</Btn></div>
              )}
            </div>

            {/* pagination */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs text-slate-500">Page {page + 1} of {pages} · {rows.length} rows</span>
              <span className="ml-auto flex gap-1">
                <Btn size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft size={14} /></Btn>
                {Array.from({ length: pages }).slice(0, 6).map((_, i) => (
                  <button key={i} onClick={() => setPage(i)} aria-current={page === i ? "page" : undefined}
                    className={cx("h-8 w-8 rounded-lg text-[13px] font-bold", page === i ? "bg-violet-600 text-white" : "hover:bg-slate-100 dark:hover:bg-white/10")}>{i + 1}</button>
                ))}
                <Btn size="sm" variant="outline" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight size={14} /></Btn>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-[70] flex justify-end" role="dialog" aria-modal="true" aria-label={`Account ${detail.customer}`}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetail(null)} />
          <div className="relative w-full max-w-sm overflow-y-auto bg-white p-6 shadow-2xl dark:bg-slate-950">
            <button onClick={() => setDetail(null)} className="absolute right-4 top-4 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Close detail"><X size={18} /></button>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-xl font-black text-violet-700">{detail.customer[0]}</span>
            <h3 className="mt-3 text-xl font-black">{detail.customer}</h3>
            <p className="text-sm text-slate-500">{detail.email} · {detail.id}</p>
            <div className="mt-3 flex gap-2"><Badge tone="sky">{detail.plan}</Badge><Badge tone={STATUS_TONE[detail.status] as never}>{detail.status}</Badge></div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {[["MRR", `$${detail.mrr.toLocaleString()}`], ["Seats", String(detail.seats)], ["Region", detail.region], ["Updated", detail.updated]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-slate-50 p-3 dark:bg-white/5"><dt className="text-[11px] font-bold uppercase text-slate-400">{k}</dt><dd className="font-extrabold">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-4 flex gap-2">
              <Btn size="sm" disabled={!canEdit} onClick={() => { push("Approved", `${detail.customer} approved (simulated).`, "#10b981"); setDetail(null); }}>Approve</Btn>
              <Btn size="sm" variant="outline" disabled={!canEdit} onClick={() => { const n = new Set(removed); n.add(detail.id); setRemoved(n); setDetail(null); push("Record archived", "Undo available in Pattern Lab.", "#f59e0b"); }}>Archive</Btn>
            </div>
          </div>
        </div>
      )}

      {/* confirm */}
      {confirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-label="Confirm action">
          <div className="absolute inset-0 bg-black/45" onClick={() => setConfirm(null)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-black">Confirm bulk action?</h3>
            <p className="mt-1 text-sm text-slate-500">{confirm.action}. This demo mutates local state only and can be reset by clearing filters.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Btn size="sm" variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
              <Btn size="sm" onClick={() => { push("Done", `${confirm.action} applied locally.`, "#10b981"); setSel(new Set()); setConfirm(null); }}>Confirm</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
