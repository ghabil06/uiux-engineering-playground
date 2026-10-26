import React from "react";
import { Btn, Badge, Card, Field, inputCls, SectionHead } from "../components/ui";
import { Alert, Switch } from "../components/foundation";
import { DesignSystemNavTabs } from "./nav-tabs";
import { Copy, Check } from "lucide-react";

type ComponentTarget = "btn" | "badge" | "alert" | "switch" | "field";

export default function ComponentPlaygroundPage() {
  const [target, setTarget] = React.useState<ComponentTarget>("btn");

  // Props for Btn
  const [btnVariant, setBtnVariant] = React.useState<"primary" | "secondary" | "outline" | "ghost" | "danger">("primary");
  const [btnSize, setBtnSize] = React.useState<"sm" | "md" | "lg">("md");
  const [btnDisabled, setBtnDisabled] = React.useState(false);
  const [btnText, setBtnText] = React.useState("Click action");

  // Props for Badge
  const [badgeTone, setBadgeTone] = React.useState<"violet" | "sky" | "emerald" | "amber" | "rose" | "slate">("violet");
  const [badgeText, setBadgeText] = React.useState("Status Label");

  // Props for Alert
  const [alertTone, setAlertTone] = React.useState<"success" | "warning" | "danger" | "info">("success");
  const [alertTitle, setAlertTitle] = React.useState("Update confirmed");
  const [alertBody, setAlertBody] = React.useState("The requested resource was processed and persisted.");

  // Props for Switch
  const [switchChecked, setSwitchChecked] = React.useState(true);
  const [switchLabel, setSwitchLabel] = React.useState("Enable biometric login");

  // Props for Field
  const [fieldLabel, setFieldLabel] = React.useState("Work Email");
  const [fieldError, setFieldError] = React.useState("");
  const [fieldHint, setFieldHint] = React.useState("We will never share your email.");
  const [fieldVal, setFieldVal] = React.useState("ada@lovelace.org");

  const [copied, setCopied] = React.useState(false);

  // Generate code snippet
  let codeSnippet = "";
  if (target === "btn") {
    codeSnippet = `<Btn variant="${btnVariant}" size="${btnSize}"${btnDisabled ? " disabled" : ""}>\n  ${btnText}\n</Btn>`;
  } else if (target === "badge") {
    codeSnippet = `<Badge tone="${badgeTone}">\n  ${badgeText}\n</Badge>`;
  } else if (target === "alert") {
    codeSnippet = `<Alert tone="${alertTone}" title="${alertTitle}">\n  ${alertBody}\n</Alert>`;
  } else if (target === "switch") {
    codeSnippet = `<Switch\n  label="${switchLabel}"\n  checked={${switchChecked}}\n  onChange={setChecked}\n/>`;
  } else if (target === "field") {
    codeSnippet = `<Field label="${fieldLabel}"${fieldError ? ` error="${fieldError}"` : ""}${fieldHint ? ` hint="${fieldHint}"` : ""}>\n  <input className={inputCls(${fieldError ? '"err"' : ""})} value="${fieldVal}" />\n</Field>`;
  }

  const copyCode = () => {
    navigator.clipboard?.writeText(codeSnippet).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <SectionHead
        kicker="Design System · Interactive"
        title="Interactive Component Playground"
        desc="Experiment with live props, test interactive states, and copy production-ready JSX code directly."
      />

      <DesignSystemNavTabs activePath="#/design-system/playground" />

      {/* Target Component Selector */}
      <div className="flex flex-wrap gap-2">
        {(["btn", "badge", "alert", "switch", "field"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTarget(t)}
            aria-pressed={target === t}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              target === t ? "bg-violet-600 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300"
            }`}
          >
            {t === "btn" ? "Button" : t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Controls Column */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Props Controls</h3>

          {target === "btn" && (
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Label Text</label>
                <input
                  value={btnText}
                  onChange={(e) => setBtnText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-white/15 dark:bg-transparent"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Variant</label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(["primary", "secondary", "outline", "ghost", "danger"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setBtnVariant(v)}
                      aria-pressed={btnVariant === v}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${btnVariant === v ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Size</label>
                <div className="mt-1 flex gap-1">
                  {(["sm", "md", "lg"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setBtnSize(s)}
                      aria-pressed={btnSize === s}
                      className={`rounded-lg px-3 py-1 font-semibold ${btnSize === s ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 pt-2 font-semibold">
                <input
                  type="checkbox"
                  checked={btnDisabled}
                  onChange={(e) => setBtnDisabled(e.target.checked)}
                  className="h-4 w-4 accent-violet-600"
                />
                Disabled state
              </label>
            </div>
          )}

          {target === "badge" && (
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Badge Text</label>
                <input
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-white/15 dark:bg-transparent"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Tone</label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(["violet", "sky", "emerald", "amber", "rose", "slate"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setBadgeTone(t)}
                      aria-pressed={badgeTone === t}
                      className={`rounded-lg px-2.5 py-1 capitalize ${badgeTone === t ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {target === "alert" && (
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Title</label>
                <input
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-white/15 dark:bg-transparent"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Description</label>
                <textarea
                  value={alertBody}
                  onChange={(e) => setAlertBody(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2 dark:border-white/15 dark:bg-transparent"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Tone</label>
                <div className="mt-1 flex gap-1">
                  {(["success", "warning", "danger", "info"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setAlertTone(t)}
                      aria-pressed={alertTone === t}
                      className={`rounded-lg px-2.5 py-1 capitalize ${alertTone === t ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-white/10"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {target === "switch" && (
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Label</label>
                <input
                  value={switchLabel}
                  onChange={(e) => setSwitchLabel(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-white/15 dark:bg-transparent"
                />
              </div>
              <label className="flex items-center gap-2 pt-2 font-semibold">
                <input
                  type="checkbox"
                  checked={switchChecked}
                  onChange={(e) => setSwitchChecked(e.target.checked)}
                  className="h-4 w-4 accent-violet-600"
                />
                Checked state
              </label>
            </div>
          )}

          {target === "field" && (
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Field Label</label>
                <input
                  value={fieldLabel}
                  onChange={(e) => setFieldLabel(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-white/15 dark:bg-transparent"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Validation Error (optional)</label>
                <input
                  value={fieldError}
                  onChange={(e) => setFieldError(e.target.value)}
                  placeholder="e.g. Email is invalid"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-white/15 dark:bg-transparent"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-300">Hint Text</label>
                <input
                  value={fieldHint}
                  onChange={(e) => setFieldHint(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 dark:border-white/15 dark:bg-transparent"
                />
              </div>
            </div>
          )}
        </Card>

        {/* Live Preview Canvas & Code */}
        <div className="space-y-4 lg:col-span-3">
          <Card className="flex min-h-[220px] flex-col items-center justify-center p-8 bg-slate-50/50 dark:bg-white/[.02]">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Live Component Preview</p>
            
            {target === "btn" && (
              <Btn variant={btnVariant} size={btnSize} disabled={btnDisabled}>
                {btnText}
              </Btn>
            )}

            {target === "badge" && (
              <Badge tone={badgeTone}>{badgeText}</Badge>
            )}

            {target === "alert" && (
              <div className="w-full max-w-md">
                <Alert tone={alertTone} title={alertTitle}>
                  {alertBody}
                </Alert>
              </div>
            )}

            {target === "switch" && (
              <Switch
                label={switchLabel}
                checked={switchChecked}
                onChange={setSwitchChecked}
              />
            )}

            {target === "field" && (
              <div className="w-full max-w-md">
                <Field label={fieldLabel} error={fieldError} hint={fieldHint}>
                  <input
                    value={fieldVal}
                    onChange={(e) => setFieldVal(e.target.value)}
                    className={inputCls(fieldError)}
                  />
                </Field>
              </div>
            )}
          </Card>

          {/* Generated Code */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-400">Generated JSX</span>
              <Btn size="sm" variant="outline" onClick={copyCode}>
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy JSX"}
              </Btn>
            </div>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 font-mono text-xs text-slate-200">
              {codeSnippet}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  );
}
