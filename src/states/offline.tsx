/** Offline states — explicitly simulated disconnection with queued work. */
import React from "react";
import { Card } from "../components/ui";
import { PatternDoc } from "../patterns/primitives";
import { WifiOff } from "lucide-react";

export default function OfflineDemo() {
  const [offline, setOffline] = React.useState(false);
  const [queue, setQueue] = React.useState<string[]>([]);
  const [note, setNote] = React.useState("Online. Toggle offline to see the honest simulation.");

  const save = () => {
    const entry = `Edit ${queue.length + 1} @ ${new Date().toLocaleTimeString()}`;
    if (offline) {
      setQueue((q) => [...q, entry]);
      setNote(`Queued locally (${queue.length + 1} waiting) — nothing was sent.`);
    } else {
      setNote(`Saved ${entry} (simulated server round-trip).`);
    }
  };

  const reconnect = () => {
    setOffline(false);
    if (queue.length) {
      setNote(`✓ Reconnected — ${queue.length} queued edit${queue.length === 1 ? "" : "s"} synced in order.`);
      setQueue([]);
    } else setNote("Online. Nothing was queued.");
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Disconnection without deception: the toggle simulates offline mode; real connectivity is never touched or claimed."
        useCases="Field apps, travel, flaky wifi."
        states="Online, offline banner, queued writes, reconnect flush."
        a11y="Banner uses role=alert on transition; queue counts announced politely; all actions stay keyboard-reachable." />
      <Card className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => { setOffline(!offline); setNote(offline ? "Online. Nothing was queued." : "Offline (simulated). Editing queues locally."); }}
            aria-pressed={offline} className={offline ? "h-11 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white" : "h-11 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15"}>
            {offline ? "⛔ Offline (simulated)" : "🌐 Go offline (simulated)"}
          </button>
          <button onClick={save} className="h-11 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">Save edit</button>
          <button onClick={reconnect} className="h-11 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white">
            {queue.length > 0 ? `Reconnect + flush (${queue.length})` : "Reconnect"}
          </button>
        </div>
        {offline && (
          <p role="alert" className="flex items-center gap-2 rounded-2xl bg-slate-900 p-3 text-sm font-bold text-white">
            <WifiOff size={16} aria-hidden /> You're offline — simulated. Your browser's real network status is untouched and unclaimed.
          </p>
        )}
        <p role="status" className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold dark:bg-white/5">{note}</p>
        {queue.length > 0 && (
          <ul className="space-y-1" aria-label="Queued edits">
            {queue.map((e) => <li key={e} className="rounded-xl bg-amber-50 px-3 py-1.5 text-[13px] font-semibold text-amber-900 dark:bg-amber-500/10 dark:text-amber-100">⏳ {e}</li>)}
          </ul>
        )}
      </Card>
    </div>
  );
}
