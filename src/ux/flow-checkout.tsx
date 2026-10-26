/** Checkout journey — simulated payment with approved AND declined paths. */
import { FLOW_CHECKOUT } from "./data";
import { FlowRunner } from "./flow";
import { Card } from "../components/ui";

export default function FlowCheckout() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[13px] font-semibold text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
        No real payment exists anywhere in this playground. The gateway node lets you pick “approved” or
        “declined” so both branches are explorable; entries are preserved on the failure path.
      </div>
      <Card className="p-4 text-[13px]">
        <b>About this journey:</b> cart → delivery → payment → gateway decision → (declined loops back with
        cart intact) → review → confirmation with a fictional order number.
      </Card>
      <FlowRunner def={FLOW_CHECKOUT} title="e-commerce checkout" />
    </div>
  );
}
