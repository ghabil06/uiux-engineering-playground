/** User-flow laboratory hub — four journeys + the reusable flow editor. */
import React from "react";
import { FLOW_REGISTRATION, type FlowDef } from "./data";
import { FlowRunner, FlowEditor } from "./flow";
import { Card, Badge } from "../components/ui";
import { Tabs } from "../components/foundation";

const JOURNEYS: [string, string, string, string][] = [
  ["Registration", "Details → validation → review → done, with an error loop.", "#/user-flows/registration", "6 nodes · 1 decision"],
  ["E-commerce checkout", "Cart → delivery → simulated payment → review → confirm, both gateway outcomes.", "#/user-flows/ecommerce-checkout", "7 nodes · approved/declined"],
  ["SaaS onboarding", "Welcome → use case → workspace → optional invite → done.", "#/user-flows/saas-onboarding", "6 nodes · skippable invite"],
  ["Error recovery", "Failure → plain-language cause → retry or CSV fallback → recovered.", "#/user-flows/error-recovery", "5 nodes · two recoveries"],
];

export default function FlowsHub() {
  const [tab, setTab] = React.useState(0);
  const [edited, setEdited] = React.useState<FlowDef>(FLOW_REGISTRATION);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {JOURNEYS.map(([t, d, href, meta]) => (
          <Card key={href} className="p-5">
            <b>{t}</b>
            <p className="mt-1 text-sm text-slate-500">{d}</p>
            <p className="mt-1 font-mono text-[11px] text-slate-400">{meta}</p>
            <a href={href} className="mt-3 inline-block rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white">Run journey →</a>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-extrabold">Try one here, or edit it</h3>
        <Badge tone="slate">same runner everywhere</Badge>
      </div>
      <Tabs tabs={["Run: registration", "Edit the flow"]} active={tab} onChange={setTab} label="Runner or editor" />
      <div role="tabpanel" aria-label={tab === 0 ? "Run registration flow" : "Edit registration flow"}>
        {tab === 0
          ? <FlowRunner def={edited} title="registration (edited live below)" />
          : <FlowEditor def={edited} onChange={setEdited} onReset={() => setEdited(FLOW_REGISTRATION)} />}
      </div>
      <p className="text-xs text-slate-500">
        The editor is intentionally list-based: every change re-validates instantly (missing labels, dead ends,
        single-branch decisions, unreachable nodes, missing success state) and the runner above follows your edits.
        No graph dependency required.
      </p>
    </div>
  );
}
