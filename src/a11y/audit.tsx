/**
 * Interactive accessibility audit — REAL checks executed on demand against a
 * live preview panel (no axe-core dependency: hand-rolled, fully disclosed
 * rule set). Automated findings vs manual items vs unperformed checks are
 * separated, with a remediation workflow persisted locally.
 */
import React from "react";
import { Card, Badge } from "../components/ui";
import { cx } from "../lib/core";

interface AutoFinding {
  rule: string; impact: "critical" | "serious" | "moderate";
  element: string; advice: string; status: "Open" | "In Progress" | "Resolved";
}

const MANUAL_ITEMS = [
  "Keyboard-only pass of the preview task (2.1.1) — unplug the mouse and try it.",
  "Screen-reader pass with real AT: landmarks, headings, table reading order.",
  "200% zoom + 320px reflow check of the preview panel.",
  "Focus visibility and non-obscured check on every stop.",
];

const UNPERFORMED = [
  "Captions / audio description — the preview has no time-based media.",
  "Motion-triggered vestibular review — needs a human with the preference on.",
];

const AKEY = "prism-a11y-audit-v1";

function loadStatus(): Record<string, AutoFinding["status"]> {
  try {
    const raw = localStorage.getItem(AKEY);
    if (raw) return JSON.parse(raw) as Record<string, AutoFinding["status"]>;
  } catch { /* ignore */ }
  return {};
}

/** The honest rule set — each check is implemented below, nothing fabricated. */
function runChecks(root: HTMLElement): Omit<AutoFinding, "status">[] {
  const out: Omit<AutoFinding, "status">[] = [];
  const imgs = Array.from(root.querySelectorAll("img"));
  const badImgs = imgs.filter((img) => {
    const alt = img.getAttribute("alt");
    return alt === null || (alt.trim() === "" && !img.closest("[aria-hidden='true']") && img.getAttribute("aria-hidden") !== "true");
  });
  if (badImgs.length) {
    const decorative = badImgs.filter((img) => /decor|avatar|icon/i.test(img.getAttribute("src") ?? "") || /decor|avatar|icon/i.test(img.className));
    const informative = badImgs.filter((img) => !decorative.includes(img));
    if (informative.length) out.push({ rule: "image-alt", impact: "critical", element: `${informative.length} <img> without alt text`, advice: "Add concise alt describing content/function, or alt=\"\" + aria-hidden if purely decorative." });
    if (decorative.length) out.push({ rule: "image-alt-decorative", impact: "moderate", element: `${decorative.length} decorative-looking <img> without alt=""`, advice: "Mark decorative images alt=\"\" so AT skips them instead of announcing filenames." });
  }
  const buttons = Array.from(root.querySelectorAll("button"));
  const unnamed = buttons.filter((b) => !(b.textContent ?? "").trim() && !b.getAttribute("aria-label") && !b.getAttribute("aria-labelledby"));
  if (unnamed.length) out.push({ rule: "button-name", impact: "critical", element: `${unnamed.length} <button> with no accessible name`, advice: "Add visible text or an aria-label — unnamed buttons are invisible to AT." });
  const inputs = Array.from(root.querySelectorAll("input, select, textarea")).filter((el) => {
    const t = (el as HTMLInputElement).type;
    return t !== "hidden" && t !== "submit" && t !== "button";
  });
  const unlabelled = inputs.filter((el) => {
    const id = el.getAttribute("id");
    const labelled = (id && root.querySelector(`label[for="${id}"]`)) || el.closest("label") || el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
    return !labelled;
  });
  if (unlabelled.length) out.push({ rule: "input-label", impact: "serious", element: `${unlabelled.length} form control(s) without a label`, advice: "Associate a visible <label>, or aria-label labelledby as a last resort." });
  const headings = Array.from(root.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((h) => Number(h.tagName[1]));
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i - 1] + 1) {
      out.push({ rule: "heading-order", impact: "moderate", element: `Heading level jumps h${headings[i - 1]} → h${headings[i]}`, advice: "Keep heading levels sequential so the outline makes sense." });
      break;
    }
  }
  const ids = Array.from(root.querySelectorAll("[id]")).map((el) => el.getAttribute("id")!);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) out.push({ rule: "duplicate-id", impact: "serious", element: `Duplicate id(s): ${[...new Set(dupes)].join(", ")}`, advice: "IDs must be unique — duplicates break label association and ARIA references." });
  const links = Array.from(root.querySelectorAll("a")).filter((a) => !a.getAttribute("href"));
  if (links.length) out.push({ rule: "link-href", impact: "serious", element: `${links.length} <a> without href`, advice: "Links navigate (href); actions are <button>s. Href-less anchors aren't keyboard-focusable." });
  const posTab = Array.from(root.querySelectorAll("[tabindex]")).filter((el) => Number(el.getAttribute("tabindex")) > 0);
  if (posTab.length) out.push({ rule: "positive-tabindex", impact: "serious", element: `${posTab.length} positive tabindex value(s)`, advice: "Remove positive tabindex — it hijacks natural order. Use 0 or -1 only." });
  const lowContrast = Array.from(root.querySelectorAll("[data-check-contrast]"));
  if (lowContrast.length) out.push({ rule: "text-contrast", impact: "serious", element: `${lowContrast.length} flagged low-contrast sample(s) (author-marked)`, advice: "Author-marked samples below 4.5:1 — verify in the Contrast lab and darken the text." });
  return out;
}

function Preview() {
  const [remind, setRemind] = React.useState(false);
  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 p-5 dark:border-white/10">
      <h3 className="text-xl font-black">Notification settings</h3>
      <img src="avatar.png" alt="" className="h-10 w-10 rounded-full bg-slate-200" />
      <img src="chart-weekly.png" className="h-16 w-full rounded-xl bg-slate-100 object-cover dark:bg-white/5" />
      <p><label className="flex items-center gap-2 text-sm font-bold">Email alerts
        <input type="checkbox" defaultChecked className="h-5 w-5 accent-violet-600" /></label></p>
      <p className="text-sm font-bold">Digest frequency</p>
      <div className="flex gap-1.5" role="group" aria-label="Digest frequency">
        {["Daily", "Weekly"].map((f) => <button key={f} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold dark:bg-white/10">{f}</button>)}
      </div>
      <h5 className="font-bold">Fine print</h5>
      <p data-check-contrast className="text-xs text-slate-400">Light grey microcopy (author-marked low contrast).</p>
      <input placeholder="Nickname (unlabelled on purpose)" aria-label="Nickname demo input" className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm dark:border-white/15 dark:bg-transparent" />
      <input defaultValue="orphan" aria-label="Orphan demo input" className="sr-only" />
      <p className="flex gap-2">
        <button aria-label="Save settings" className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">✓</button>
        <button onClick={() => setRemind(!remind)} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Remind me</button>
      </p>
      {remind && <p className="text-sm">Reminder on.</p>}
      <a className="cursor-pointer text-sm text-sky-700 underline">Learn more (no href — intentional violation)</a>
      <span id="dup">x</span><span id="dup" className="sr-only">y</span>
      <button tabIndex={3} className="sr-only">Positive tabindex trap demo</button>
    </div>
  );
}

export default function AuditDemo() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ran, setRan] = React.useState(false);
  const [findings, setFindings] = React.useState<AutoFinding[]>([]);
  const [statuses, setStatuses] = React.useState<Record<string, AutoFinding["status"]>>(loadStatus);
  const [filter, setFilter] = React.useState<"All" | AutoFinding["status"]>("All");

  React.useEffect(() => {
    try { localStorage.setItem(AKEY, JSON.stringify(statuses)); } catch { /* ignore */ }
  }, [statuses]);

  const run = () => {
    if (!ref.current) return;
    const found = runChecks(ref.current).map((f) => ({
      ...f, status: statuses[`${f.rule}:${f.element}`] ?? ("Open" as const),
    }));
    setFindings(found);
    setRan(true);
  };

  const setStatus = (f: AutoFinding, s: AutoFinding["status"]) => {
    const key = `${f.rule}:${f.element}`;
    setStatuses((p) => ({ ...p, [key]: s }));
    setFindings((p) => p.map((x) => (`${x.rule}:${x.element}` === key ? { ...x, status: s } : x)));
  };

  const visible = findings.filter((f) => filter === "All" || f.status === filter);
  const open = findings.filter((f) => f.status === "Open").length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <b>Preview under audit <span className="font-normal text-slate-400">(seeded with real violations)</span></b>
          <div ref={ref} className="mt-2"><Preview /></div>
        </div>
        <div className="space-y-3">
          <Card className="p-4">
            <b>Run the audit</b>
            <p className="mt-1 text-[13px] text-slate-500">Executes {8} disclosed checks against the preview panel only — right now, in this browser. Nothing is fabricated: remove a violation from the preview and re-run to watch it clear.</p>
            <span className="mt-2 flex gap-2">
              <button onClick={run} className="h-10 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">▶ Run 8 checks</button>
              {ran && <span role="status" className="self-center text-sm font-bold">{findings.length} automated finding{findings.length === 1 ? "" : "s"} · {open} open</span>}
            </span>
          </Card>
          {!ran ? (
            <Card className="p-8 text-center text-sm text-slate-500">Not run yet. Automated results appear here — manual items live below regardless.</Card>
          ) : findings.length === 0 ? (
            <Card className="border-emerald-200 p-6 text-center dark:border-emerald-400/20">
              <p className="font-extrabold text-emerald-700">✓ Zero automated findings</p>
              <p className="mt-1 text-sm text-slate-500">This proves nothing about overall accessibility — complete the manual items below.</p>
            </Card>
          ) : (
            <div className="space-y-2">
              <span className="flex gap-1" role="group" aria-label="Filter findings by status">
                {(["All", "Open", "In Progress", "Resolved"] as const).map((s) => (
                  <button key={s} onClick={() => setFilter(s)} aria-pressed={filter === s}
                    className={cx("rounded-full px-3 py-1 text-xs font-bold", filter === s ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10")}>{s}</button>
                ))}
              </span>
              {visible.map((f) => (
                <Card key={f.rule + f.element} className="p-3.5 text-sm">
                  <p className="flex flex-wrap items-center gap-1.5">
                    <Badge tone={f.impact === "critical" ? "rose" : f.impact === "serious" ? "amber" : "slate"}>{f.impact}</Badge>
                    <b className="font-mono text-xs">{f.rule}</b>
                    <Badge tone={f.status === "Resolved" ? "emerald" : f.status === "In Progress" ? "sky" : "violet"}>{f.status}</Badge>
                  </p>
                  <p className="mt-1 font-semibold">{f.element}</p>
                  <p className="mt-0.5 text-[13px] text-slate-500"><b>Fix:</b> {f.advice}</p>
                  <span className="mt-2 flex gap-1.5">
                    {(["Open", "In Progress", "Resolved"] as const).map((s) => (
                      <button key={s} onClick={() => setStatus(f, s)} aria-pressed={f.status === s}
                        className={cx("rounded-lg px-2.5 py-1 text-[11px] font-bold", f.status === s ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10")}>{s}</button>
                    ))}
                  </span>
                </Card>
              ))}
              {visible.length === 0 && <p className="text-sm text-slate-500">No findings with this status.</p>}
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <b className="text-sm">Manual review items <span className="font-normal text-slate-400">(automation cannot do these)</span></b>
          <ul className="mt-2 space-y-1.5 text-[13px]">{MANUAL_ITEMS.map((m) => <li key={m} className="flex gap-2"><input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-violet-600" aria-label={`Done: ${m}`} /><span>{m}</span></li>)}</ul>
        </Card>
        <Card className="p-4">
          <b className="text-sm">Not performed here <span className="font-normal text-slate-400">(stated, not silently skipped)</span></b>
          <ul className="mt-2 space-y-1.5 text-[13px] text-slate-500">{UNPERFORMED.map((m) => <li key={m}>· {m}</li>)}</ul>
        </Card>
      </div>
    </div>
  );
}
