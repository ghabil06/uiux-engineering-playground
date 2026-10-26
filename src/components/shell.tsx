import React from "react";
import { DEMOS, cx } from "../lib/core";
import { THEME_STORAGE_KEY, THEME_CLASS } from "../design-system/tokens";
import { Breadcrumb } from "./foundation";
import {
  LayoutGrid, Megaphone, Smartphone, LayoutDashboard, ShoppingBag, BarChart3, Brain, Component,
  Palette, Command, Compass, Layers, Sparkles, Accessibility, MonitorSmartphone, SwatchBook, FlaskConical,
  Search, Moon, Sun, Menu, X, ArrowLeft, Clock, Home, BookOpen, FlaskRound, Network, Route, Gauge,
} from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  megaphone: <Megaphone size={16} />, smartphone: <Smartphone size={16} />,
  "layout-dashboard": <LayoutDashboard size={16} />, "shopping-bag": <ShoppingBag size={16} />,
  "bar-chart": <BarChart3 size={16} />, brain: <Brain size={16} />, component: <Component size={16} />,
  palette: <Palette size={16} />, command: <Command size={16} />, compass: <Compass size={16} />,
  layers: <Layers size={16} />, sparkles: <Sparkles size={16} />, accessibility: <Accessibility size={16} />,
  "monitor-smartphone": <MonitorSmartphone size={16} />, swatch: <SwatchBook size={16} />, flask: <FlaskConical size={16} />,
};

export function iconFor(id: string) { return ICONS[id] ?? <LayoutGrid size={16} />; }

export function useHashRoute(): string {
  const [hash, setHash] = React.useState(() => window.location.hash || "#/");
  React.useEffect(() => {
    const fn = () => {
      setHash(window.location.hash || "#/");
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  return hash;
}

export function useTheme() {
  const [dark, setDark] = React.useState(() => {
    try { return localStorage.getItem(THEME_STORAGE_KEY) === "dark"; } catch { return false; }
  });
  React.useEffect(() => {
    document.documentElement.classList.toggle(THEME_CLASS, dark);
    try { localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light"); } catch { /* noop */ }
  }, [dark]);
  return { dark, setDark };
}

export function useRecent(route: string) {
  React.useEffect(() => {
    if (route === "#/" ) return;
    try {
      const raw = localStorage.getItem("prism-recent") || "[]";
      const arr = (JSON.parse(raw) as { route: string; ts: number }[]).filter((r) => r.route !== route);
      arr.unshift({ route, ts: Date.now() });
      localStorage.setItem("prism-recent", JSON.stringify(arr.slice(0, 6)));
    } catch { /* noop */ }
  }, [route]);
}

export function getRecent(): { route: string; ts: number }[] {
  try { return JSON.parse(localStorage.getItem("prism-recent") || "[]"); } catch { return []; }
}

const NAV = [
  { group: "Explorer", items: [{ route: "#/", label: "Explore all", icon: <Home size={16} /> }] },
  {
    group: "Product types", items: DEMOS.filter((d) => d.category === "Product Types").map((d) => ({ route: d.route, label: d.name, icon: iconFor(d.icon) })),
  },
  {
    group: "Craft", items: [
      { route: "#/styles", label: "Visual Style Lab", icon: <Palette size={16} /> },
      { route: "#/patterns", label: "Pattern Lab", icon: <Command size={16} /> },
      { route: "#/ux", label: "UX Disciplines", icon: <Compass size={16} /> },
      { route: "#/states", label: "Interface States", icon: <Layers size={16} /> },
      { route: "#/ai", label: "AI Studio", icon: <Sparkles size={16} /> },
    ],
  },
  {
    group: "UX Lab", items: [
      { route: "#/ux-principles", label: "Principles", icon: <BookOpen size={16} /> },
      { route: "#/ux-research", label: "Research", icon: <FlaskRound size={16} /> },
      { route: "#/information-architecture", label: "Info Architecture", icon: <Network size={16} /> },
      { route: "#/user-flows", label: "User Flows", icon: <Route size={16} /> },
      { route: "#/ux-metrics", label: "Metrics & Findings", icon: <Gauge size={16} /> },
    ],
  },
  {
    group: "Design System", items: [
      { route: "#/design-system/tokens", label: "Token Explorer", icon: <SwatchBook size={16} /> },
      { route: "#/design-system/foundations", label: "Foundations", icon: <Layers size={16} /> },
      { route: "#/design-system/components", label: "Component Catalogue", icon: <Component size={16} /> },
      { route: "#/design-system/playground", label: "Playground", icon: <Sparkles size={16} /> },
      { route: "#/design-system/guidelines", label: "Guidelines & A11y", icon: <BookOpen size={16} /> },
      { route: "#/design-system/states", label: "State Coverage", icon: <Command size={16} /> },
      { route: "#/design-system/audit", label: "Token Audit", icon: <FlaskConical size={16} /> },
    ],
  },
  {
    group: "System", items: [
      { route: "#/accessibility", label: "Accessibility", icon: <Accessibility size={16} /> },
      { route: "#/responsive", label: "Responsive", icon: <MonitorSmartphone size={16} /> },
      { route: "#/tokens", label: "Tokens & Theming", icon: <SwatchBook size={16} /> },
      { route: "#/testing", label: "Testing Lab", icon: <FlaskConical size={16} /> },
    ],
  },
];

export function Shell({ route, dark, setDark, children }: { route: string; dark: boolean; setDark: (v: boolean) => void; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const activeDemo = DEMOS.find((d) => d.route === route);
  React.useEffect(() => setOpen(false), [route]);

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-app)] transition-colors">
      {/* topbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[var(--bg-header)] backdrop-blur dark:border-white/10">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
          <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden dark:hover:bg-white/10" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <a href="#/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 text-sm font-black text-white shadow-lg shadow-violet-600/25">◈</span>
            <span className="leading-none">
              <span className="block text-[15px] font-extrabold tracking-tight">PRISM</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">UX Engineering Playground</span>
            </span>
          </a>
          <div className="relative mx-auto hidden w-full max-w-md md:block">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) window.location.hash = `#/?q=${encodeURIComponent(q.trim())}`; }}
              placeholder="Search 90 demos — try “cart”, “drift”, “palette”…  (Enter)"
              className="h-9 w-full rounded-full border border-slate-200 bg-slate-100/70 pl-9 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/10" aria-label="Search demos" />
            {q && (
              <div className="absolute left-0 right-0 top-11 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
                {DEMOS.filter((d) => (d.name + d.teaches + d.category).toLowerCase().includes(q.toLowerCase())).slice(0, 6).map((d) => (
                  <a key={d.id} href={d.route} onClick={() => setQ("")} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-white/5">
                    <span style={{ color: d.accent }}>{iconFor(d.icon)}</span>
                    <span className="font-semibold">{d.name}</span>
                    <span className="ml-auto text-xs text-slate-400">{d.category}</span>
                  </a>
                ))}
                {DEMOS.filter((d) => (d.name + d.teaches).toLowerCase().includes(q.toLowerCase())).length === 0 && (
                  <p className="px-4 py-3 text-sm text-slate-500">No matches — press Enter for full search.</p>
                )}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            {route !== "#/" && (
              <a href="#/" className="hidden items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold hover:bg-slate-50 sm:inline-flex dark:border-white/10 dark:hover:bg-white/5">
                <ArrowLeft size={13} /> Explorer
              </a>
            )}
            <button onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/10">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
        {activeDemo && (
          <div className="border-t border-slate-100 dark:border-white/5">
            <div className="mx-auto flex max-w-[1400px] items-center gap-3 overflow-x-auto px-4 py-1.5 text-xs no-scrollbar">
              <Breadcrumb trail={[{ label: "Explorer", href: "#/" }, { label: activeDemo.category }, { label: activeDemo.name }]} />
              <span className="ml-auto hidden shrink-0 items-center gap-1 text-slate-400 sm:flex"><Clock size={12} /> ~{activeDemo.estimatedMins} min · {activeDemo.status === "functional" ? "● fully functional" : "○ illustrative"}</span>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto flex max-w-[1400px] items-start gap-6 px-4 py-6">
        {/* sidebar */}
        <aside className={cx("w-60 shrink-0 lg:sticky lg:top-24", open ? "fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto bg-white p-4 pt-16 shadow-2xl dark:bg-slate-950" : "hidden lg:block")}>
          <nav className="space-y-5" aria-label="Playground sections">
            {NAV.map((g) => (
              <div key={g.group}>
                <p className="px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{g.group}</p>
                <ul className="mt-1.5 space-y-0.5">
                  {g.items.map((it) => {
                    const active = route === it.route || (it.route !== "#/" && route.startsWith(it.route));
                    return (
                      <li key={it.route + it.label}>
                        <a href={it.route} aria-current={active ? "page" : undefined}
                          className={cx("flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13.5px] font-semibold transition",
                            active ? "bg-violet-600 text-white shadow-md shadow-violet-600/25" : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white")}>
                          {it.icon}<span className="truncate">{it.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-4 text-white">
            <p className="text-[13px] font-extrabold">Built like production</p>
            <p className="mt-1 text-xs leading-relaxed text-white/80">Deterministic local data. No API keys. Every control wired — nothing decorative.</p>
            <a href="#/testing" className="mt-3 inline-flex rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur hover:bg-white/25">Open QA report →</a>
          </div>
        </aside>
        {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

        <main className="min-w-0 flex-1" id="main">{children}</main>
      </div>

      <footer className="border-t border-slate-200 py-8 dark:border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-extrabold text-slate-700 dark:text-slate-200">PRISM Playground</span>
          <span>· All data simulated locally · WCAG 2.2 AA target · Vite + React + Tailwind</span>
          <span className="ml-auto">Press <kbd className="rounded border px-1.5 py-0.5 font-mono text-[11px]">⌘K</kbd> in Pattern Lab for the command palette</span>
        </div>
      </footer>
    </div>
  );
}
