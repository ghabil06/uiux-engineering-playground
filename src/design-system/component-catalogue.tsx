import { useState } from "react";
import {
  Btn,
  Badge,
  Card,
  Field,
  inputCls,
  Kpi,
  SectionHead,
} from "../components/ui";
import {
  IconButton,
  Select,
  Checkbox,
  Switch,
  Breadcrumb,
  Tabs,
  Alert,
  Skeleton,
} from "../components/foundation";
import { DesignSystemNavTabs } from "./nav-tabs";
import { Bell, Trash2 } from "lucide-react";

export default function ComponentCataloguePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [switchVal, setSwitchVal] = useState(true);
  const [checkVal, setCheckVal] = useState(true);
  const [selectVal, setSelectVal] = useState("Growth");

  return (
    <div className="space-y-6">
      <SectionHead
        kicker="Design System · Catalogue"
        title="Component Catalogue & Variants"
        desc="Complete catalog of production-ready PRISM components. Built on semantic tokens, strict WCAG 2.2 AA accessibility, and native keyboard interaction."
      />

      <DesignSystemNavTabs activePath="#/design-system/components" />

      {/* Buttons */}
      <Card className="p-6">
        <h3 className="text-base font-extrabold">Buttons (Btn & IconButton)</h3>
        <p className="text-xs text-slate-500">Supports variants, sizes, disabled, and icon combinations with min 44px touch compliance.</p>
        
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Btn variant="primary">Primary</Btn>
          <Btn variant="secondary">Secondary</Btn>
          <Btn variant="outline">Outline</Btn>
          <Btn variant="ghost">Ghost</Btn>
          <Btn variant="danger">Danger</Btn>
          <Btn disabled>Disabled</Btn>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
          <span className="text-xs font-bold text-slate-400">Sizes:</span>
          <Btn size="sm">Small (32px)</Btn>
          <Btn size="md">Medium (40px)</Btn>
          <Btn size="lg">Large (48px)</Btn>
          <IconButton label="Notifications" className="ml-2">
            <Bell size={18} />
          </IconButton>
          <IconButton label="Delete item" className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">
            <Trash2 size={18} />
          </IconButton>
        </div>
      </Card>

      {/* Badges & Status Indicators */}
      <Card className="p-6">
        <h3 className="text-base font-extrabold">Badges & Indicators</h3>
        <p className="text-xs text-slate-500">Semantic tone pills for labels, statuses, and counts.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="violet">New Feature</Badge>
          <Badge tone="sky">In Progress</Badge>
          <Badge tone="emerald">Active</Badge>
          <Badge tone="amber">Pending Review</Badge>
          <Badge tone="rose">Critical Alert</Badge>
          <Badge tone="slate">Archived</Badge>
        </div>
      </Card>

      {/* Form Controls */}
      <Card className="p-6">
        <h3 className="text-base font-extrabold">Form Controls (Inputs, Select, Toggles)</h3>
        <p className="text-xs text-slate-500">Accessible form inputs paired with explicit labels, validation errors, and hints.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Text Input" hint="Required format: Full Name">
            <input className={inputCls()} placeholder="Grace Hopper" />
          </Field>
          <Field label="Validation Error" error="Please enter a valid work email.">
            <input className={inputCls("err")} defaultValue="grace@" aria-invalid="true" />
          </Field>
          <div>
            <Select
              label="Plan"
              options={["Starter", "Growth", "Enterprise"]}
              value={selectVal}
              onChange={setSelectVal}
            />
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Switch
              label="Enable Notifications"
              checked={switchVal}
              onChange={setSwitchVal}
              hint="Sound and toast alerts"
            />
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Checkbox
              label="Remember this device"
              checked={checkVal}
              onChange={setCheckVal}
              hint="Keep session active for 30 days"
            />
          </div>
        </div>
      </Card>

      {/* Navigation: Tabs & Breadcrumb */}
      <Card className="p-6">
        <h3 className="text-base font-extrabold">Navigation (Tabs & Breadcrumbs)</h3>
        <p className="text-xs text-slate-500">Roving tabindex keyboard navigation and responsive breadcrumb paths.</p>

        <div className="mt-4 space-y-4">
          <Breadcrumb
            trail={[
              { label: "Explorer", href: "#/" },
              { label: "Design System", href: "#/design-system/tokens" },
              { label: "Component Catalogue" },
            ]}
          />
          <Tabs
            tabs={["Overview", "API Reference", "Accessibility (WCAG)"]}
            active={activeTab}
            onChange={setActiveTab}
            label="Component catalogue preview tabs"
          />
        </div>
      </Card>

      {/* Feedback: Alerts & Skeletons */}
      <Card className="p-6">
        <h3 className="text-base font-extrabold">Feedback & Loading (Alerts & Skeletons)</h3>
        <p className="text-xs text-slate-500">Accessible inline alert banners and CLS-free skeleton loaders.</p>

        <div className="mt-4 space-y-3">
          <Alert tone="success" title="Changes saved successfully">
            All design tokens have been recompiled and synchronized to the workspace cache.
          </Alert>
          <Alert tone="warning" title="Deprecation warning">
            Direct use of raw hex codes will be flagged in automated token audits.
          </Alert>
          <Alert tone="danger" title="Validation failed">
            Could not save changes — please review 2 highlighted fields above.
          </Alert>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 dark:border-white/10">
          <p className="text-xs font-bold text-slate-400">Skeleton Loading States (Zero Layout Shift):</p>
          <div className="mt-2 space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </Card>

      {/* Data & Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Design Tokens" value="48" delta="all categories" tone="#7c3aed" spark={[12, 18, 24, 32, 40, 48]} />
        <Kpi label="Core Components" value="18" delta="accessible" tone="#06b6d4" spark={[6, 9, 12, 15, 18, 18]} />
        <Kpi label="WCAG 2.2 AA" value="100%" delta="contrast verified" tone="#10b981" spark={[85, 90, 95, 98, 100, 100]} />
        <Kpi label="Theme Modes" value="2" delta="light + dark" tone="#f59e0b" spark={[1, 1, 2, 2, 2, 2]} />
      </div>
    </div>
  );
}
