import { Card, SectionHead, Badge } from "../components/ui";
import { DesignSystemNavTabs } from "./nav-tabs";

export default function StatesMatrixPage() {
  const components = [
    { name: "Button (Btn)", default: true, hover: true, focus: true, active: true, disabled: true, loading: true, error: false, empty: false },
    { name: "Icon Button (IconButton)", default: true, hover: true, focus: true, active: true, disabled: true, loading: false, error: false, empty: false },
    { name: "Text Input (Field)", default: true, hover: true, focus: true, active: false, disabled: true, loading: false, error: true, empty: true },
    { name: "Select Dropdown", default: true, hover: true, focus: true, active: true, disabled: true, loading: false, error: true, empty: false },
    { name: "Toggle Switch (Switch)", default: true, hover: true, focus: true, active: true, disabled: true, loading: false, error: false, empty: false },
    { name: "Checkbox", default: true, hover: true, focus: true, active: true, disabled: true, loading: false, error: false, empty: false },
    { name: "Modal (Dialog)", default: true, hover: false, focus: true, active: false, disabled: false, loading: true, error: false, empty: false },
    { name: "Tabs", default: true, hover: true, focus: true, active: true, disabled: true, loading: false, error: false, empty: false },
    { name: "Table Row", default: true, hover: true, focus: true, active: false, disabled: false, loading: true, error: true, empty: true },
    { name: "Empty State Card", default: true, hover: false, focus: false, active: false, disabled: false, loading: false, error: false, empty: true },
  ];

  return (
    <div className="space-y-6">
      <SectionHead
        kicker="Design System · State Coverage"
        title="Comprehensive Component State Coverage"
        desc="Audit matrix tracking state implementations across all PRISM foundation components — ensuring every component handles interaction, validation, and async lifecycle gracefully."
      />

      <DesignSystemNavTabs activePath="#/design-system/states" />

      {/* State Definitions Overview */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <Badge tone="violet">Focus-Visible</Badge>
          <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-200">2px Ring & Offset</p>
          <p className="mt-1 text-[11px] text-slate-500">Global focus ring activates on keyboard navigation; suppressed on pointer click.</p>
        </Card>
        <Card className="p-4">
          <Badge tone="amber">Loading & Busy</Badge>
          <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-200">aria-busy=&ldquo;true&rdquo;</p>
          <p className="mt-1 text-[11px] text-slate-500">Prevents double-submission and displays spinner or fixed skeleton placeholder.</p>
        </Card>
        <Card className="p-4">
          <Badge tone="rose">Invalid / Error</Badge>
          <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-200">aria-invalid=&ldquo;true&rdquo;</p>
          <p className="mt-1 text-[11px] text-slate-500">High-contrast error border with accessible inline text linking via aria-describedby.</p>
        </Card>
        <Card className="p-4">
          <Badge tone="slate">Disabled State</Badge>
          <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-200">Opacity 40% & No Pointer</p>
          <p className="mt-1 text-[11px] text-slate-500">Inert to pointer and keyboard events; marked with disabled or aria-disabled.</p>
        </Card>
      </div>

      {/* Matrix Table */}
      <Card className="overflow-x-auto p-5">
        <h3 className="text-sm font-extrabold">Component State Implementation Matrix</h3>
        <p className="text-xs text-slate-500">Cross-reference showing implemented states across component families.</p>

        <table className="mt-4 w-full min-w-[700px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 dark:border-white/10">
              <th className="pb-3 font-bold uppercase tracking-wider">Component</th>
              <th className="pb-3 text-center font-bold uppercase tracking-wider">Default</th>
              <th className="pb-3 text-center font-bold uppercase tracking-wider">Hover</th>
              <th className="pb-3 text-center font-bold uppercase tracking-wider">Focus-Vis</th>
              <th className="pb-3 text-center font-bold uppercase tracking-wider">Active</th>
              <th className="pb-3 text-center font-bold uppercase tracking-wider">Disabled</th>
              <th className="pb-3 text-center font-bold uppercase tracking-wider">Loading</th>
              <th className="pb-3 text-center font-bold uppercase tracking-wider">Error</th>
              <th className="pb-3 text-center font-bold uppercase tracking-wider">Empty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {components.map((c) => (
              <tr key={c.name} className="hover:bg-slate-50/50 dark:hover:bg-white/[.02]">
                <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{c.name}</td>
                <td className="py-3 text-center text-emerald-600 dark:text-emerald-400">✓</td>
                <td className="py-3 text-center">{c.hover ? <span className="text-emerald-600 dark:text-emerald-400">✓</span> : <span className="text-slate-300 dark:text-white/20">—</span>}</td>
                <td className="py-3 text-center">{c.focus ? <span className="text-emerald-600 dark:text-emerald-400">✓</span> : <span className="text-slate-300 dark:text-white/20">—</span>}</td>
                <td className="py-3 text-center">{c.active ? <span className="text-emerald-600 dark:text-emerald-400">✓</span> : <span className="text-slate-300 dark:text-white/20">—</span>}</td>
                <td className="py-3 text-center">{c.disabled ? <span className="text-emerald-600 dark:text-emerald-400">✓</span> : <span className="text-slate-300 dark:text-white/20">—</span>}</td>
                <td className="py-3 text-center">{c.loading ? <span className="text-emerald-600 dark:text-emerald-400">✓</span> : <span className="text-slate-300 dark:text-white/20">—</span>}</td>
                <td className="py-3 text-center">{c.error ? <span className="text-emerald-600 dark:text-emerald-400">✓</span> : <span className="text-slate-300 dark:text-white/20">—</span>}</td>
                <td className="py-3 text-center">{c.empty ? <span className="text-emerald-600 dark:text-emerald-400">✓</span> : <span className="text-slate-300 dark:text-white/20">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
