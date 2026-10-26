/** SaaS onboarding journey — skippable invite, sensible defaults. */
import { FLOW_ONBOARDING } from "./data";
import { FlowRunner } from "./flow";
import { Card } from "../components/ui";

export default function FlowOnboarding() {
  return (
    <div className="space-y-4">
      <Card className="p-4 text-[13px]">
        <b>About this journey:</b> welcome (skip offered) → use case tailors defaults → workspace with
        prefilled sensbles → optional invite (skipping is shame-free) → ready state with a first-task checklist.
      </Card>
      <FlowRunner def={FLOW_ONBOARDING} title="SaaS onboarding" />
    </div>
  );
}
