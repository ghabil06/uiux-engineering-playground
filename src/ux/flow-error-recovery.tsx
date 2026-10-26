/** Error-recovery journey — failure explained, two honest recoveries. */
import { FLOW_ERROR } from "./data";
import { FlowRunner } from "./flow";
import { Card } from "../components/ui";

export default function FlowErrorRecovery() {
  return (
    <div className="space-y-4">
      <Card className="p-4 text-[13px]">
        <b>About this journey:</b> sync → outcome decision → plain-language failure (queue kept, nothing lost) →
        retry <i>or</i> CSV fallback → recovered. Both recovery branches are first-class, not afterthoughts.
      </Card>
      <FlowRunner def={FLOW_ERROR} title="error recovery" />
    </div>
  );
}
