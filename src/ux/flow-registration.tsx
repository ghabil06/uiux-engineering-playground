/** Registration journey — validation loop, review, guarded completion. */
import { FLOW_REGISTRATION } from "./data";
import { FlowRunner } from "./flow";
import { Card } from "../components/ui";

export default function FlowRegistration() {
  return (
    <div className="space-y-4">
      <Card className="p-4 text-[13px]">
        <b>About this journey:</b> details → validity decision (errors loop back with entries kept) →
        review with edit branches → done. Mirrors the validated wizard in the Patterns lab at flow level.
      </Card>
      <FlowRunner def={FLOW_REGISTRATION} title="registration" />
    </div>
  );
}
