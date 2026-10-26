/** Error states — validation, retryable, non-retryable, field + page level. */
import React from "react";
import { Card } from "../components/ui";
import { ErrorState } from "../components/foundation";
import { PatternDoc } from "../patterns/primitives";

export default function ErrorsDemo() {
  const [code, setCode] = React.useState("");
  const [codeErr, setCodeErr] = React.useState("");
  const [tries, setTries] = React.useState(0);
  const [fatal, setFatal] = React.useState(false);

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[A-Z]{3}-\d{4}$/.test(code.trim())) {
      setCodeErr("Use the format ABC-1234 (three letters, dash, four digits) — see the hint under the field.");
      document.getElementById("er-code")?.focus();
      return;
    }
    setCodeErr("");
  };

  const retry = () => {
    const n = tries + 1;
    setTries(n);
  };

  return (
    <div className="space-y-4">
      <PatternDoc purpose="Errors at every altitude — field, inline, page — each with proportionate recovery."
        useCases="Validation, flaky networks, deprecated features."
        states="Field error, retryable (fails twice, then succeeds), non-retryable with alternative."
        a11y="role=alert for errors; focus moves to the problem; input preserved; retry never silently loops." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-2 p-5">
          <b>Field-level validation</b>
          <form noValidate onSubmit={submitCode}>
            <label htmlFor="er-code" className="text-sm font-bold">Invite code</label>
            <p id="er-hint" className="text-xs text-slate-500">Format ABC-1234. Errors name the fix and keep your typing.</p>
            <span className="mt-1 flex gap-2">
              <input id="er-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                aria-invalid={!!codeErr} aria-describedby={codeErr ? "er-code-err er-hint" : "er-hint"}
                placeholder="ABC-1234" className="h-11 min-w-0 flex-1 rounded-xl border border-slate-300 px-3 font-mono text-sm dark:border-white/15 dark:bg-transparent" />
              <button type="submit" className="h-11 shrink-0 rounded-xl bg-violet-600 px-4 text-sm font-bold text-white">Apply</button>
            </span>
            {codeErr && <p id="er-code-err" role="alert" className="mt-1 text-[13px] font-semibold text-rose-600">{codeErr}</p>}
            {!codeErr && code && <p role="status" className="mt-1 text-[13px] font-bold text-emerald-600">✓ Code accepted (simulated).</p>}
          </form>
        </Card>
        <Card className="space-y-2 p-5">
          <b>Retryable request (fails twice, then succeeds)</b>
          {tries < 2 ? (
            <ErrorState title={tries === 0 ? "Couldn't load the report" : `Attempt ${tries} failed`} desc="Simulated 500. Retry is safe — the operation is idempotent." onRetry={retry} />
          ) : (
            <p role="status" className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
              ✓ Report loaded on attempt {tries + 1}. <button onClick={() => setTries(0)} className="underline">Replay the failure</button>
            </p>
          )}
          <p className="text-xs text-slate-500">Attempts so far: {tries}. Real UIs should say when retry is pointless — see the non-retryable case.</p>
        </Card>
      </div>
      <Card className="p-5">
        <b>Non-retryable (deprecated) + page-level error</b>
        {!fatal ? (
          <span className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-slate-500">The legacy CSV importer was removed in v4. Retrying cannot help.</p>
            <button onClick={() => setFatal(true)} className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-bold dark:border-white/15">Open legacy importer</button>
          </span>
        ) : (
          <div role="alert" className="rounded-2xl border-2 border-rose-300 bg-rose-50 p-5 dark:border-rose-400/30 dark:bg-rose-500/10">
            <p className="font-extrabold">This importer no longer exists (410 Gone).</p>
            <p className="mt-1 text-sm">No retry is offered — instead: <b>use the new JSON importer</b> or <button onClick={() => setFatal(false)} className="font-bold underline">go back</button>.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
