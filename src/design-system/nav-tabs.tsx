import { cx } from "../lib/core";

export const DS_SECTIONS = [
  { path: "#/design-system/tokens", label: "Token Explorer" },
  { path: "#/design-system/foundations", label: "Foundations" },
  { path: "#/design-system/components", label: "Components" },
  { path: "#/design-system/playground", label: "Playground" },
  { path: "#/design-system/guidelines", label: "Guidelines & A11y" },
  { path: "#/design-system/states", label: "State Coverage" },
  { path: "#/design-system/audit", label: "Token Audit" },
] as const;

export function DesignSystemNavTabs({ activePath }: { activePath: string }) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 dark:border-white/10 dark:bg-white/[.03]" role="tablist" aria-label="Design System Navigation">
      {DS_SECTIONS.map((tab) => {
        const isActive = activePath === tab.path;
        return (
          <a
            key={tab.path}
            href={tab.path}
            role="tab"
            aria-selected={isActive}
            className={cx(
              "rounded-xl px-3.5 py-2 text-xs font-bold transition",
              isActive
                ? "bg-slate-900 text-white shadow dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
            )}
          >
            {tab.label}
          </a>
        );
      })}
    </div>
  );
}
