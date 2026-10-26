/** Sitemap explorer + tree test (find the target, path tracked, scored honestly). */
import React from "react";
import { SITEMAP, flattenSitemap, type SiteNode } from "./data";
import { Card } from "../components/ui";
import { ChevronRight } from "lucide-react";
import { cx } from "../lib/core";

function Tree({ node, depth, open, toggle, select, selected }: {
  node: SiteNode; depth: number; open: Set<string>; toggle: (id: string) => void;
  select: (n: SiteNode, path: string[]) => void; selected: string | null;
}) {
  const hasKids = !!node.kids?.length;
  const isOpen = open.has(node.id);
  return (
    <li>
      <span className="flex items-center gap-1">
        {hasKids ? (
          <button onClick={() => toggle(node.id)} aria-expanded={isOpen} aria-label={`${isOpen ? "Collapse" : "Expand"} ${node.label}`}
            className="rounded-md p-1 hover:bg-slate-100 dark:hover:bg-white/10">
            <ChevronRight size={14} aria-hidden className={cx("transition", isOpen && "rotate-90")} />
          </button>
        ) : <span className="w-6" aria-hidden />}
        <button onClick={() => select(node, [])} aria-current={selected === node.id ? "true" : undefined}
          className={cx("min-w-0 flex-1 truncate rounded-lg px-2 py-1.5 text-left text-sm",
            selected === node.id ? "bg-violet-600 font-bold text-white" : "font-semibold hover:bg-slate-100 dark:hover:bg-white/5")}>
          {node.label} <span className="font-normal text-slate-400">· L{depth}</span>
        </button>
      </span>
      {hasKids && isOpen && (
        <ul className="ml-4 border-l-2 border-slate-200 pl-1 dark:border-white/10">
          {node.kids!.map((k) => (
            <Tree key={k.id} node={k} depth={depth + 1} open={open} toggle={toggle} select={select} selected={selected} />
          ))}
        </ul>
      )}
    </li>
  );
}

const TARGET = "Billing";

export default function SitemapDemo() {
  const flat = flattenSitemap(SITEMAP);
  const [open, setOpen] = React.useState<Set<string>>(new Set(["home", "product", "account"]));
  const [sel, setSel] = React.useState<SiteNode>(SITEMAP);
  const [testPath, setTestPath] = React.useState<string[]>(["Home"]);
  const [testDone, setTestDone] = React.useState<null | boolean>(null);

  const toggle = (id: string) => setOpen((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const kidsAt = (trail: string[]) => {
    let node: SiteNode | undefined = SITEMAP;
    for (const label of trail.slice(1)) node = node?.kids?.find((k) => k.label === label);
    return node?.kids ?? [];
  };

  const step = (label: string) => {
    const next = [...testPath, label];
    setTestPath(next);
    if (label === TARGET) setTestDone(true);
    else if (kidsAt(next).length === 0) setTestDone(false);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <b>Sitemap explorer <span className="font-normal text-slate-400">({flat.length} pages, depth 0–2)</span></b>
        <ul className="mt-2 space-y-0.5">
          <Tree node={SITEMAP} depth={0} open={open} toggle={toggle} select={(n) => setSel(n)} selected={sel.id} />
        </ul>
        <div className="mt-3 rounded-2xl bg-slate-50 p-3.5 text-sm dark:bg-white/5" aria-live="polite">
          <b>{sel.label}</b> <span className="text-slate-400">· {sel.desc}</span>
          <p className="mt-1 text-slate-600 dark:text-slate-300"><b>Purpose:</b> {sel.purpose}</p>
          <p className="mt-1 text-slate-600 dark:text-slate-300"><b>Related:</b> {sel.links.join(" · ")}</p>
        </div>
      </Card>
      <Card className="h-fit p-5">
        <b>Tree test: where would you find “{TARGET}”?</b>
        <p className="mt-1 text-[13px] text-slate-500">Click through the plain structure — no visuals, no search. One session proves nothing statistically; it still finds real scent failures.</p>
        <p className="mt-2 text-sm">Path: <b>{testPath.join(" → ")}</b></p>
        <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Tree test options">
          {testPath.length > 1 && <button onClick={() => { setTestPath(testPath.slice(0, -1)); setTestDone(null); }} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-white/10">← Back</button>}
          {kidsAt(testPath).map((k) => (
            <button key={k.id} onClick={() => step(k.label)} disabled={testDone !== null}
              className="rounded-xl bg-violet-100 px-3 py-2 text-sm font-bold text-violet-900 disabled:opacity-40 dark:bg-violet-500/15 dark:text-violet-100">{k.label}</button>
          ))}
          {kidsAt(testPath).length === 0 && testDone === null && <span className="text-sm text-slate-500">Dead end.</span>}
        </div>
        {testDone === true && (
          <p role="status" className="mt-3 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
            ✓ Reached {TARGET} in {testPath.length - 1} clicks. Strong information scent on this path.
          </p>
        )}
        {testDone === false && (
          <p role="alert" className="mt-3 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-900 dark:bg-rose-500/10 dark:text-rose-100">
            ✕ Dead end at “{testPath[testPath.length - 1]}” — {TARGET} lives under Home → Account. That gap is a finding: file it in the register.
          </p>
        )}
        <button onClick={() => { setTestPath(["Home"]); setTestDone(null); }} className="mt-2 text-xs font-bold text-violet-600 underline">↺ Restart tree test</button>
      </Card>
    </div>
  );
}
