import { Card, SectionHead, Badge } from "../components/ui";
import { DesignSystemNavTabs } from "./nav-tabs";
import { Check, X, Shield, Eye, Keyboard, Smartphone } from "lucide-react";

export default function GuidelinesPage() {
  const rules = [
    {
      component: "Buttons (Btn)",
      good: "One primary button per view hierarchy; use outline or ghost for secondary actions.",
      bad: "Stacking multiple competing primary buttons in the same container.",
      a11y: "Min 44px touch target on mobile; always ensure visible focus-visible outline.",
    },
    {
      component: "Form Inputs (Field & inputCls)",
      good: "Explicit visible label above or beside input; associate inline validation errors via aria-describedby.",
      bad: "Relying on placeholder text as the only form field label.",
      a11y: "Set aria-invalid='true' on error; error message container marked with role='alert'.",
    },
    {
      component: "Modals & Dialogs (Dialog)",
      good: "Trap focus inside while open; return focus to trigger element on dismiss.",
      bad: "Allowing users to tab into background elements while a modal overlay is active.",
      a11y: "role='dialog' and aria-modal='true'; always close cleanly on Escape key press.",
    },
    {
      component: "Toggles (Switch)",
      good: "Use for instant binary settings (e.g. notifications, dark mode); accompany with explicit label.",
      bad: "Using a toggle switch inside a form that requires a subsequent 'Submit' button.",
      a11y: "Native button with role='switch' and aria-checked='true|false'; Space key toggles.",
    },
    {
      component: "Status Alerts (Alert)",
      good: "Use role='alert' for immediate errors, role='status' for polite background updates.",
      bad: "Communicating severity purely by color without an icon or text keyword.",
      a11y: "Ensure 4.5:1 text contrast for all alert tone containers.",
    },
    {
      component: "Tabs (Tabs)",
      good: "Roving tabindex keyboard navigation with Left/Right arrow keys.",
      bad: "Requiring Tab key to visit every single tab in a list before reaching panel content.",
      a11y: "Tablist with role='tab', aria-selected='true', and associated aria-controls='panel-id'.",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHead
        kicker="Design System · Standards"
        title="Component Usage & Accessibility Guidelines"
        desc="Prescriptive engineering rules for component composition, interaction patterns, and strict WCAG 2.2 AA accessibility."
      />

      <DesignSystemNavTabs activePath="#/design-system/guidelines" />

      {/* Core Principles */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
              <Eye size={18} />
            </span>
            <b className="text-sm">Contrast & Clarity</b>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Never convey meaning through color alone. All interactive states feature text labels, distinct icons, and minimum 4.5:1 contrast against backdrops.
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300">
              <Keyboard size={18} />
            </span>
            <b className="text-sm">Keyboard First</b>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Every feature is operable via keyboard. Tab follows visual reading order; modals trap focus; roving tabindex handles toolbars and tabs.
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              <Smartphone size={18} />
            </span>
            <b className="text-sm">Touch Target Bounds</b>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Primary interactive controls maintain min 44×44px touch targets on mobile viewports to prevent mis-taps and adhere to Apple HIG and WCAG 2.2.
          </p>
        </Card>
      </div>

      {/* Component Guidelines Matrix */}
      <div className="space-y-4">
        {rules.map((r) => (
          <Card key={r.component} className="p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
              <h3 className="text-sm font-extrabold">{r.component}</h3>
              <Badge tone="violet">WCAG 2.2 AA</Badge>
            </div>
            <div className="mt-3 grid gap-3 text-xs md:grid-cols-3">
              <div className="rounded-xl bg-emerald-50/60 p-3 text-emerald-950 dark:bg-emerald-500/10 dark:text-emerald-100">
                <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300">
                  <Check size={14} /> Recommended (Do)
                </span>
                <p className="mt-1 leading-relaxed">{r.good}</p>
              </div>
              <div className="rounded-xl bg-rose-50/60 p-3 text-rose-950 dark:bg-rose-500/10 dark:text-rose-100">
                <span className="flex items-center gap-1 font-bold text-rose-700 dark:text-rose-300">
                  <X size={14} /> Anti-Pattern (Don&apos;t)
                </span>
                <p className="mt-1 leading-relaxed">{r.bad}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-slate-700 dark:bg-white/5 dark:text-slate-300">
                <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                  <Shield size={14} className="text-violet-600 dark:text-cyan-400" /> A11y & ARIA Spec
                </span>
                <p className="mt-1 leading-relaxed">{r.a11y}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
