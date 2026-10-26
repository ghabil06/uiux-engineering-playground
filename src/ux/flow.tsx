/**
 * Reusable user-flow system: FlowRunner (follow a journey) + FlowEditor
 * (list-based editing with a synchronized diagram + validation).
 * Diagrams are never decorative — every node is traversable, and a text
 * equivalent is always rendered alongside.
 */
import React from "react";
import { Card } from "../components/ui";
import { validateFlow, nextFlowId, type FlowDef, type FlowNode } from "./data";
import { cx } from "../lib/core";

const KIND_STYLE: Record<FlowNode["kind"], string> = {
  start: "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
  step: "bg-violet-100 text-violet-900 dark:bg-violet-500/15 dark:text-violet-100",
  decision: "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-100",
  success: "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100",
  fail: "bg-rose-100 text-rose-900 dark:bg-rose-500/15 dark:text-rose-100",
};

export function FlowDiagram({ def, current }: { def: FlowDef; current?: string | null }) {
  return (
    <ol aria-label="Flow diagram" className="space-y-0">
      {def.nodes.map((n) => {
        const outs = def.edges.filter((e) => e.from === n.id);
        return (
          <li key={n.id} className="relative flex gap-3 pb-4 last:pb-0">
            <span aria-hidden className="flex flex-col items-center">
              <span className={cx("z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ring-2",
                current === n.id ? "bg-violet-600 text-white ring-violet-300" : "bg-white text-slate-500 ring-slate-200 dark:bg-white/10 dark:ring-white/15")}>
                {n.kind === "start" ? "▶" : n.kind === "decision" ? "◆" : n.kind === "success" ? "✓" : n.kind === "fail" ? "!" : "•"}
              </span>
              <span className="w-0.5 flex-1 bg-slate-200 dark:bg-white/10" />
            </span>
            <span className={cx("min-w-0 flex-1 rounded-2xl px-3.5 py-2.5 text-sm", KIND_STYLE[n.kind], current === n.id && "ring-2 ring-violet-500")}
              aria-current={current === n.id ? "step" : undefined}>
              <b className="block">{n.label || <i className="opacity-60">Untitled node</i>} <span className="ml-1 text-[10px] font-black uppercase opacity-60">{n.kind}</span></b>
              {n.detail && <span className="mt-0.5 block text-[13px] opacity-80">{n.detail}</span>}
              {outs.length > 0 && (
                <span className="mt-1 block text-xs font-semibold opacity-75">
                  → {outs.map((e) => `${e.label ? `${e.label}: ` : ""}${def.nodes.find((x) => x.id === e.to)?.label || e.to}`).join(" · ")}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function FlowTextEquivalent({ def }: { def: FlowDef }) {
  return (
    <details className="rounded-2xl bg-slate-50 p-3 text-[13px] dark:bg-white/5">
      <summary className="cursor-pointer font-bold">Text equivalent of this diagram</summary>
      <ol className="mt-2 list-decimal space-y-1 pl-5">
        {def.nodes.map((n) => {
          const outs = def.edges.filter((e) => e.from === n.id);
          return (
            <li key={n.id}>
              <b>{n.label || n.id}</b> ({n.kind})
              {outs.length > 0 && <> — then: {outs.map((e) => `${e.label ? `if “${e.label}” go to ` : "go to "}${def.nodes.find((x) => x.id === e.to)?.label || e.to}`).join("; ")}</>}
            </li>
          );
        })}
      </ol>
    </details>
  );
}

export function FlowRunner({ def, title }: { def: FlowDef; title: string }) {
  const [current, setCurrent] = React.useState(def.start);
  const [trail, setTrail] = React.useState<string[]>([def.start]);
  const [announce, setAnnounce] = React.useState(`Started: ${def.nodes.find((n) => n.id === def.start)?.label}`);
  const node = def.nodes.find((n) => n.id === current)!;
  const outs = def.edges.filter((e) => e.from === current);

  const go = (to: string, label?: string) => {
    const dest = def.nodes.find((n) => n.id === to)!;
    setCurrent(to);
    setTrail((t) => [...t, to]);
    setAnnounce(`${label ? `${label}: ` : ""}arrived at ${dest.label} (${dest.kind}). Step ${trail.length + 1}.`);
  };
  const reset = () => {
    setCurrent(def.start); setTrail([def.start]);
    setAnnounce(`Restarted: ${def.nodes.find((n) => n.id === def.start)?.label}`);
  };
  React.useEffect(() => { reset(); }, [def]);

  const finished = node.kind === "success" || node.kind === "fail";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="p-5">
        <b>Follow the journey <span className="font-normal text-slate-400">({title})</span></b>
        <p role="status" aria-live="polite" className="mt-2 rounded-2xl bg-violet-50 p-3 text-sm font-semibold text-violet-900 dark:bg-violet-500/10 dark:text-violet-100">
          {announce}
        </p>
        <div className={cx("mt-3 rounded-2xl border-2 p-4", node.kind === "success" ? "border-emerald-400" : node.kind === "fail" ? "border-rose-400" : "border-slate-200 dark:border-white/10")}>
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">{node.kind}{finished ? " — end of path" : ""}</p>
          <h4 className="mt-0.5 text-lg font-black">{node.label}</h4>
          {node.detail && <p className="mt-1 text-sm text-slate-500">{node.detail}</p>}
          {(!finished || node.kind === "fail") && (
            <div className="mt-3 space-y-2">
              {outs.map((e) => {
                const dest = def.nodes.find((n) => n.id === e.to)!;
                return (
                  <button key={e.to + (e.label ?? "")} onClick={() => go(e.to, e.label)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-left text-sm font-bold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900">
                    <span>{e.label ? `${e.label} → ${dest.label}` : `Continue → ${dest.label}`}</span><span aria-hidden>→</span>
                  </button>
                );
              })}
              {outs.length === 0 && <p className="text-sm font-bold text-amber-600">Dead end — this node needs an outgoing transition (see validation).</p>}
            </div>
          )}
          {finished && (
            <button onClick={reset} className="mt-3 h-10 w-full rounded-xl border border-slate-300 text-sm font-bold dark:border-white/15">↺ Run this journey again</button>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500">Trail: {trail.map((id) => def.nodes.find((n) => n.id === id)?.label).join(" → ")}</p>
      </Card>
      <Card className="space-y-3 p-5">
        <b>Diagram <span className="font-normal text-slate-400">(current step highlighted)</span></b>
        <FlowDiagram def={def} current={current} />
        <FlowTextEquivalent def={def} />
      </Card>
    </div>
  );
}

export function FlowEditor({ def, onChange, onReset }: { def: FlowDef; onChange: (d: FlowDef) => void; onReset: () => void }) {
  const issues = validateFlow(def);
  const [edge, setEdge] = React.useState({ from: def.nodes[0]?.id ?? "", to: "", label: "" });

  const patchNode = (id: string, patch: Partial<FlowNode>) =>
    onChange({ ...def, nodes: def.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)) });

  const removeNode = (id: string) => {
    if (def.nodes.length <= 1) return;
    onChange({
      ...def,
      start: def.start === id ? def.nodes.find((n) => n.id !== id)!.id : def.start,
      nodes: def.nodes.filter((n) => n.id !== id),
      edges: def.edges.filter((e) => e.from !== id && e.to !== id),
    });
  };

  const addNode = (kind: FlowNode["kind"]) => {
    const id = nextFlowId("n");
    onChange({ ...def, nodes: [...def.nodes, { id, label: kind === "decision" ? "New decision?" : "New step", kind }] });
  };

  const addEdge = () => {
    if (!edge.from || !edge.to || edge.from === edge.to) return;
    if (def.edges.some((e) => e.from === edge.from && e.to === edge.to && (e.label ?? "") === edge.label)) return;
    onChange({ ...def, edges: [...def.edges, { from: edge.from, to: edge.to, label: edge.label || undefined }] });
    setEdge({ from: edge.from, to: "", label: "" });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="space-y-3 p-5">
        <div className="flex items-center gap-2">
          <b>Nodes & transitions</b>
          <button onClick={onReset} className="ml-auto rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold dark:border-white/10">↺ Reset example</button>
        </div>
        <ul className="space-y-2">
          {def.nodes.map((n) => (
            <li key={n.id} className="rounded-2xl border border-slate-200 p-2.5 dark:border-white/10">
              <span className="flex gap-1.5">
                <label className="sr-only" htmlFor={`nl-${n.id}`}>Label for node {n.id}</label>
                <input id={`nl-${n.id}`} value={n.label} onChange={(e) => patchNode(n.id, { label: e.target.value })}
                  placeholder="Untitled node" className="h-9 min-w-0 flex-1 rounded-lg border border-slate-300 px-2 text-sm font-bold dark:border-white/15 dark:bg-transparent" />
                <label className="sr-only" htmlFor={`nk-${n.id}`}>Kind for {n.label || n.id}</label>
                <select id={`nk-${n.id}`} value={n.kind} onChange={(e) => patchNode(n.id, { kind: e.target.value as FlowNode["kind"] })}
                  className="h-9 rounded-lg border border-slate-300 bg-transparent px-1 text-xs font-bold dark:border-white/15">
                  {(["start", "step", "decision", "success", "fail"] as const).map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
                <button onClick={() => removeNode(n.id)} disabled={def.nodes.length <= 1} aria-label={`Remove ${n.label || n.id}`}
                  className="h-9 rounded-lg border border-rose-200 px-2.5 text-xs font-bold text-rose-600 disabled:opacity-40">✕</button>
              </span>
              <span className="mt-1 block text-[11px] text-slate-400">
                {def.edges.filter((e) => e.from === n.id).length} outgoing · {def.start === n.id ? "START node" : <button className="font-bold text-violet-600" onClick={() => onChange({ ...def, start: n.id })}>make start</button>}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button onClick={() => addNode("step")} className="h-9 flex-1 rounded-xl bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900">+ Step</button>
          <button onClick={() => addNode("decision")} className="h-9 flex-1 rounded-xl bg-amber-500 text-xs font-bold text-white">+ Decision</button>
          <button onClick={() => addNode("success")} className="h-9 flex-1 rounded-xl bg-emerald-600 text-xs font-bold text-white">+ End</button>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Add transition</p>
          <span className="mt-1.5 grid grid-cols-[1fr_1fr] gap-1.5">
            <label className="text-xs font-bold">From
              <select value={edge.from} onChange={(e) => setEdge({ ...edge, from: e.target.value })} className="mt-0.5 h-9 w-full rounded-lg border border-slate-300 bg-transparent px-1 dark:border-white/15">
                {def.nodes.map((n) => <option key={n.id} value={n.id}>{n.label || n.id}</option>)}
              </select></label>
            <label className="text-xs font-bold">To
              <select value={edge.to} onChange={(e) => setEdge({ ...edge, to: e.target.value })} className="mt-0.5 h-9 w-full rounded-lg border border-slate-300 bg-transparent px-1 dark:border-white/15">
                <option value="">Choose…</option>
                {def.nodes.filter((n) => n.id !== edge.from).map((n) => <option key={n.id} value={n.id}>{n.label || n.id}</option>)}
              </select></label>
          </span>
          <span className="mt-1.5 flex gap-1.5">
            <label className="sr-only" htmlFor="edge-label">Branch label (optional)</label>
            <input id="edge-label" value={edge.label} onChange={(e) => setEdge({ ...edge, label: e.target.value })}
              placeholder="Branch label, e.g. approved (optional)" className="h-9 min-w-0 flex-1 rounded-lg border border-slate-300 px-2 text-sm dark:border-white/15 dark:bg-transparent" />
            <button onClick={addEdge} disabled={!edge.from || !edge.to} className="h-9 rounded-xl bg-violet-600 px-4 text-xs font-bold text-white disabled:opacity-40">Connect</button>
          </span>
          <ul className="mt-2 space-y-1 text-xs">
            {def.edges.map((e, i) => (
              <li key={i} className="flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 dark:bg-white/5">
                <span className="min-w-0 flex-1 truncate font-semibold">{def.nodes.find((n) => n.id === e.from)?.label || e.from} → {def.nodes.find((n) => n.id === e.to)?.label || e.to}{e.label ? ` (“${e.label}”)` : ""}</span>
                <button onClick={() => onChange({ ...def, edges: def.edges.filter((_, j) => j !== i) })} aria-label={`Remove transition ${i + 1}`} className="rounded p-1 text-rose-600">✕</button>
              </li>
            ))}
            {def.edges.length === 0 && <li className="text-slate-400">No transitions yet.</li>}
          </ul>
        </div>
        <div role={issues.length ? "alert" : "status"} className={cx("rounded-2xl p-3 text-[13px] font-semibold", issues.length ? "bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-100" : "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100")}>
          {issues.length === 0 ? "✓ Flow valid: labelled nodes, connected transitions, reachable success state." : (
            <ul className="list-disc space-y-0.5 pl-5">{issues.map((m, i) => <li key={i}>{m}</li>)}</ul>
          )}
        </div>
      </Card>
      <Card className="h-fit space-y-3 p-5">
        <b>Live diagram <span className="font-normal text-slate-400">(syncs as you edit)</span></b>
        <FlowDiagram def={def} />
        <FlowTextEquivalent def={def} />
      </Card>
    </div>
  );
}
