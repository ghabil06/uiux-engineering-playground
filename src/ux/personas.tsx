/** Personas — illustrative samples + builder with evidence discipline. */
import React from "react";
import { SAMPLE_PERSONAS, type Persona } from "./data";
import { Card, Badge } from "../components/ui";

const EMPTY = { name: "", role: "", goals: "", context: "", tasks: "", frustrations: "", accessNeeds: "", evidence: "", uncertainties: "" };

function PersonaCard({ p, mine }: { p: Persona; mine?: boolean }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[.03]">
      <div className="flex flex-wrap items-center gap-2">
        <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-black text-white">
          {p.name.split(/[\s(]/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("")}
        </span>
        <div><h3 className="font-extrabold">{p.name}</h3><p className="text-xs text-slate-500">{p.role}</p></div>
        {mine && <Badge tone="emerald" className="ml-auto">Built by you (session)</Badge>}
      </div>
      <dl className="mt-3 space-y-1.5 text-[13px]">
        <div><dt className="font-bold">Goals</dt><dd>{p.goals.join(" · ")}</dd></div>
        <div><dt className="font-bold">Context</dt><dd className="text-slate-600 dark:text-slate-300">{p.context}</dd></div>
        <div><dt className="font-bold">Tasks</dt><dd className="text-slate-600 dark:text-slate-300">{p.tasks.join(" · ")}</dd></div>
        <div><dt className="font-bold">Frustrations</dt><dd className="text-slate-600 dark:text-slate-300">{p.frustrations.join(" · ")}</dd></div>
        <div><dt className="font-bold">♿ Access & environment</dt><dd className="text-slate-600 dark:text-slate-300">{p.accessNeeds}</dd></div>
        <div className="rounded-xl bg-sky-50 p-2.5 dark:bg-sky-500/10"><dt className="font-bold">Evidence</dt><dd>{p.evidence}</dd></div>
        <div className="rounded-xl bg-amber-50 p-2.5 dark:bg-amber-500/10"><dt className="font-bold">Open uncertainties</dt><dd>{p.uncertainties}</dd></div>
      </dl>
    </article>
  );
}

export default function PersonasDemo() {
  const [f, setF] = React.useState(EMPTY);
  const [mine, setMine] = React.useState<Persona[]>([]);
  const [err, setErr] = React.useState("");
  const set = (k: keyof typeof EMPTY, v: string) => setF((p) => ({ ...p, [k]: v }));

  const build = () => {
    if (f.name.trim().length < 2) { setErr("Give the persona a name (2+ characters)."); return; }
    if (!f.evidence.trim()) { setErr("Evidence is required — even “none yet, needs interviews” counts. Never ship an evidence-free persona."); return; }
    setErr("");
    const split = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
    setMine([{ id: `mine-${Date.now()}`, name: f.name.trim(), role: f.role.trim() || "Custom persona (session-local)", goals: split(f.goals), context: f.context, tasks: split(f.tasks), frustrations: split(f.frustrations), accessNeeds: f.accessNeeds, evidence: f.evidence, uncertainties: f.uncertainties }]);
  };

  const input = "mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm dark:border-white/15 dark:bg-transparent";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[13px] font-semibold text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
        Illustrative samples only — no real users were studied. Demographics below are placeholders, not findings.
        Uncertainties are first-class fields: every assumption must name its next study.
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {SAMPLE_PERSONAS.map((p) => <PersonaCard key={p.id} p={p} />)}
      </div>
      <Card className="space-y-3 p-5">
        <b>Persona builder <span className="font-normal text-slate-400">(evidence is mandatory — the form refuses otherwise)</span></b>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-bold">Name *<input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="E.g. Sam (Field tech)" className={input} /></label>
          <label className="text-xs font-bold">Role / archetype<input value={f.role} onChange={(e) => set("role", e.target.value)} placeholder="E.g. Approver, week 1" className={input} /></label>
          <label className="text-xs font-bold">Goals (comma-separated)<input value={f.goals} onChange={(e) => set("goals", e.target.value)} placeholder="Clear queue, avoid rework" className={input} /></label>
          <label className="text-xs font-bold">Tasks (comma-separated)<input value={f.tasks} onChange={(e) => set("tasks", e.target.value)} placeholder="Bulk-approve, export" className={input} /></label>
          <label className="text-xs font-bold">Context of use<input value={f.context} onChange={(e) => set("context", e.target.value)} placeholder="Where, devices, interruptions" className={input} /></label>
          <label className="text-xs font-bold">Frustrations (comma-separated)<input value={f.frustrations} onChange={(e) => set("frustrations", e.target.value)} placeholder="Silent failures, jargon" className={input} /></label>
          <label className="text-xs font-bold">Access & environment needs<input value={f.accessNeeds} onChange={(e) => set("accessNeeds", e.target.value)} placeholder="Keyboard-only, captions…" className={input} /></label>
          <label className="text-xs font-bold">Evidence *<input value={f.evidence} onChange={(e) => set("evidence", e.target.value)} placeholder="Quotes, counts — or 'none yet'" className={input} /></label>
          <label className="text-xs font-bold sm:col-span-2">Uncertainties needing research<input value={f.uncertainties} onChange={(e) => set("uncertainties", e.target.value)} placeholder="What would prove this wrong?" className={input} /></label>
        </div>
        {err && <p role="alert" className="text-sm font-bold text-rose-600">{err}</p>}
        <button onClick={build} className="h-11 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white">Build persona card</button>
      </Card>
      {mine.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {mine.map((p) => <PersonaCard key={p.id} p={p} mine />)}
        </div>
      )}
    </div>
  );
}
