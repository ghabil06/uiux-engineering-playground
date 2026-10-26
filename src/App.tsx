import React from "react";
import { Shell, useHashRoute, useTheme, useRecent } from "./components/shell";
import { DEMOS } from "./lib/core";
import Explorer from "./pages/Explorer";
import { MarketingDemo, MobileDemo, DashboardDemo } from "./pages/productsA";
import { EcommerceDemo, AnalyticsDemo, AimlDemo, DesignSystemDemo } from "./pages/productsB";
import TokenExplorerPage from "./design-system/token-explorer";
import FoundationsPage from "./design-system/foundations";
import ComponentCataloguePage from "./design-system/component-catalogue";
import ComponentPlaygroundPage from "./design-system/playground";
import GuidelinesPage from "./design-system/guidelines";
import StatesMatrixPage from "./design-system/states-matrix";
import TokenAuditPage from "./design-system/audit";
import StylesGallery from "./styles/gallery";
import StylesCompare from "./styles/compare";
import MinimalismDemo from "./styles/minimalism";
import LightUIDemo from "./styles/light-ui";
import DarkUIDemo from "./styles/dark-ui";
import BentoDemo from "./styles/bento-grid";
import GlassDemo from "./styles/glassmorphism";
import NeoDemo from "./styles/neumorphism";
import SwissDemo from "./styles/swiss-grid";
import BrutalDemo from "./styles/brutalism";
import EditorialDemo from "./styles/editorial";
import FlatDemo from "./styles/flat-design";
import MaterialDemo from "./styles/material-inspired";
import DenseDemo from "./styles/data-dense";
import PatternsGallery from "./patterns/gallery";
import NavigationDemo from "./patterns/navigation";
import SearchFilterDemo from "./patterns/search-and-filter";
import DataTableDemo from "./patterns/data-table";
import FormsDemo from "./patterns/forms";
import MultiStepDemo from "./patterns/multi-step-form";
import ModalDemo from "./patterns/modal-and-dialog";
import MenusDemo from "./patterns/menus-and-popovers";
import TabsAccordionDemo from "./patterns/tabs-and-accordion";
import NotificationsDemo from "./patterns/notifications";
import PaletteDemo from "./patterns/command-palette";
import UploadDemo from "./patterns/file-upload";
import DndDemo from "./patterns/drag-and-drop";
import ProgressDemo from "./patterns/progress-and-feedback";
import PaginationDemo from "./patterns/pagination";
import TooltipsDemo from "./patterns/tooltips";
import EmptyErrorDemo from "./patterns/empty-error-states";
import UndoDemo from "./patterns/undo-and-confirmation";
import PrinciplesOverview from "./ux/principles";
import HeuristicsLab from "./ux/heuristics";
import CognitiveLoad from "./ux/cognitive-load";
import FeedbackDemo from "./ux/feedback";
import ConsistencyDemo from "./ux/consistency";
import ErrorPrevention from "./ux/error-prevention";
import ResearchOverview from "./ux/research";
import PersonasDemo from "./ux/personas";
import JourneyDemo from "./ux/journey";
import MethodSelector from "./ux/method-selector";
import UsabilityTesting from "./ux/usability-testing";
import IAOverview from "./ux/ia";
import SitemapDemo from "./ux/sitemap";
import CardSortDemo from "./ux/cardsort";
import FlowsHub from "./ux/flows";
import FlowRegistration from "./ux/flow-registration";
import FlowCheckout from "./ux/flow-checkout";
import FlowOnboarding from "./ux/flow-onboarding";
import FlowErrorRecovery from "./ux/flow-error-recovery";
import MetricsLab from "./ux/metrics";
import A11yOverview from "./a11y/overview";
import SemanticDemo from "./a11y/semantic";
import KeyboardDemo from "./a11y/keyboard";
import FocusDemo from "./a11y/focus";
import ScreenReadersDemo from "./a11y/screenreaders";
import ContrastDemo from "./a11y/contrast";
import A11yFormsDemo from "./a11y/forms";
import A11yDialogsDemo from "./a11y/dialogs";
import MotionDemo from "./a11y/motion";
import ChecklistDemo from "./a11y/checklist";
import AuditDemo from "./a11y/audit";
import ResponsiveOverview from "./responsive/overview";
import BreakpointsDemo from "./responsive/breakpoints";
import LayoutsDemo from "./responsive/layouts";
import TypographyDemo from "./responsive/typography";
import RespNavDemo from "./responsive/navigation";
import RespTablesDemo from "./responsive/tables";
import RespFormsDemo from "./responsive/forms";
import DevicePreview from "./responsive/device-preview";
import StatesOverview from "./states/overview";
import LoadingDemo from "./states/loading";
import EmptyDemo from "./states/empty";
import ErrorsDemo from "./states/errors";
import SuccessDemo from "./states/success";
import OfflineDemo from "./states/offline";
import PermissionsDemo from "./states/permissions";
import SessionDemo from "./states/session";
import PartialDemo from "./states/partial-failure";
import StaleDemo from "./states/stale-data";
import RecoveryDemo from "./states/recovery";
import { UxLab, AiStudio, TokensLab, TestingLab } from "./pages/labsB";
import { SectionHead } from "./components/ui";
import { iconFor } from "./components/shell";
import { ROUTES, NOT_FOUND_TITLE } from "./lib/routes";

function DemoFrame({ id, children }: { id: string; children: React.ReactNode }) {
  const meta = DEMOS.find((d) => d.id === id);
  if (!meta) return <>{children}</>;
  return (
    <div className="space-y-5">
      <SectionHead
        kicker={`${meta.category} · ${meta.difficulty} · ~${meta.estimatedMins} min`}
        title={meta.name}
        desc={`${meta.teaches}. Try: ${meta.interactions.join(" · ")}.`}
        right={<span className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> ● fully functional</span>}
      />
      {children}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-[13px] dark:border-white/10 dark:bg-white/[.03]">
        <span className="font-extrabold">Keep exploring:</span>
        {DEMOS.filter((d) => d.id !== id).slice(0, 4).map((d) => (
          <a key={d.id} href={d.route} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold hover:bg-slate-200 dark:bg-white/10">
            <span style={{ color: d.accent }}>{iconFor(d.icon)}</span> {d.name}
          </a>
        ))}
        <a href="#/" className="ml-auto font-bold text-violet-600 hover:underline">← All demos</a>
      </div>
    </div>
  );
}

export default function App() {
  const raw = useHashRoute();
  const route = raw.split("?")[0] || "#/";
  const { dark, setDark } = useTheme();
  useRecent(route);

  React.useEffect(() => {
    document.title = ROUTES.find((r) => r.path === route)?.title ?? NOT_FOUND_TITLE;
  }, [route]);

  let page: React.ReactNode = null;
  switch (route) {
    case "#/": page = <Explorer key={raw} />; break;
    case "#/product/marketing": page = <DemoFrame id="marketing"><MarketingDemo /></DemoFrame>; break;
    case "#/product/mobile": page = <DemoFrame id="mobile"><MobileDemo /></DemoFrame>; break;
    case "#/product/dashboard": page = <DemoFrame id="dashboard"><DashboardDemo /></DemoFrame>; break;
    case "#/product/ecommerce": page = <DemoFrame id="ecommerce"><EcommerceDemo /></DemoFrame>; break;
    case "#/product/analytics": page = <DemoFrame id="analytics"><AnalyticsDemo /></DemoFrame>; break;
    case "#/product/aiml": page = <DemoFrame id="aiml"><AimlDemo /></DemoFrame>; break;
    case "#/product/design-system": page = <DemoFrame id="design-system"><DesignSystemDemo /></DemoFrame>; break;
    case "#/design-system/tokens": page = <TokenExplorerPage />; break;
    case "#/design-system/foundations": page = <FoundationsPage />; break;
    case "#/design-system/components": page = <ComponentCataloguePage />; break;
    case "#/design-system/playground": page = <ComponentPlaygroundPage />; break;
    case "#/design-system/guidelines": page = <GuidelinesPage />; break;
    case "#/design-system/states": page = <StatesMatrixPage />; break;
    case "#/design-system/audit": page = <TokenAuditPage />; break;
    case "#/styles": page = <div className="space-y-5"><SectionHead kicker="Visual styles · gallery" title="Style Laboratory" desc="Twelve live treatments of the same project workspace. Search, filter, open any style — or compare them side by side." right={<a href="#/styles/compare" className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700">Compare styles →</a>} /><StylesGallery /></div>; break;
    case "#/styles/compare": page = <div className="space-y-5"><SectionHead kicker="Visual styles · comparison" title="Compare styles" desc="The same Atlas workspace rendered in each selected treatment — plus a criterion matrix for typography, surfaces, spacing, borders, elevation and color." /><StylesCompare /></div>; break;
    case "#/styles/minimalism": page = <DemoFrame id="style-minimalism"><MinimalismDemo /></DemoFrame>; break;
    case "#/styles/light-ui": page = <DemoFrame id="style-light-ui"><LightUIDemo /></DemoFrame>; break;
    case "#/styles/dark-ui": page = <DemoFrame id="style-dark-ui"><DarkUIDemo /></DemoFrame>; break;
    case "#/styles/bento-grid": page = <DemoFrame id="style-bento-grid"><BentoDemo /></DemoFrame>; break;
    case "#/styles/glassmorphism": page = <DemoFrame id="style-glassmorphism"><GlassDemo /></DemoFrame>; break;
    case "#/styles/neumorphism": page = <DemoFrame id="style-neumorphism"><NeoDemo /></DemoFrame>; break;
    case "#/styles/swiss-grid": page = <DemoFrame id="style-swiss-grid"><SwissDemo /></DemoFrame>; break;
    case "#/styles/brutalism": page = <DemoFrame id="style-brutalism"><BrutalDemo /></DemoFrame>; break;
    case "#/styles/editorial": page = <DemoFrame id="style-editorial"><EditorialDemo /></DemoFrame>; break;
    case "#/styles/flat-design": page = <DemoFrame id="style-flat-design"><FlatDemo /></DemoFrame>; break;
    case "#/styles/material-inspired": page = <DemoFrame id="style-material-inspired"><MaterialDemo /></DemoFrame>; break;
    case "#/styles/data-dense": page = <DemoFrame id="style-data-dense"><DenseDemo /></DemoFrame>; break;
    case "#/patterns": page = <div className="space-y-5"><SectionHead kicker="Patterns · gallery" title="Interaction Patterns Laboratory" desc="Seventeen working patterns — how interfaces behave, not just how they look. Search, filter, open any pattern; every control is wired and keyboard-operable." /><PatternsGallery /></div>; break;
    case "#/patterns/navigation": page = <DemoFrame id="pattern-navigation"><NavigationDemo /></DemoFrame>; break;
    case "#/patterns/search-and-filter": page = <DemoFrame id="pattern-search-and-filter"><SearchFilterDemo /></DemoFrame>; break;
    case "#/patterns/data-table": page = <DemoFrame id="pattern-data-table"><DataTableDemo /></DemoFrame>; break;
    case "#/patterns/forms": page = <DemoFrame id="pattern-forms"><FormsDemo /></DemoFrame>; break;
    case "#/patterns/multi-step-form": page = <DemoFrame id="pattern-multi-step-form"><MultiStepDemo /></DemoFrame>; break;
    case "#/patterns/modal-and-dialog": page = <DemoFrame id="pattern-modal-and-dialog"><ModalDemo /></DemoFrame>; break;
    case "#/patterns/menus-and-popovers": page = <DemoFrame id="pattern-menus-and-popovers"><MenusDemo /></DemoFrame>; break;
    case "#/patterns/tabs-and-accordion": page = <DemoFrame id="pattern-tabs-and-accordion"><TabsAccordionDemo /></DemoFrame>; break;
    case "#/patterns/notifications": page = <DemoFrame id="pattern-notifications"><NotificationsDemo /></DemoFrame>; break;
    case "#/patterns/command-palette": page = <DemoFrame id="pattern-command-palette"><PaletteDemo dark={dark} setDark={setDark} /></DemoFrame>; break;
    case "#/patterns/file-upload": page = <DemoFrame id="pattern-file-upload"><UploadDemo /></DemoFrame>; break;
    case "#/patterns/drag-and-drop": page = <DemoFrame id="pattern-drag-and-drop"><DndDemo /></DemoFrame>; break;
    case "#/patterns/progress-and-feedback": page = <DemoFrame id="pattern-progress-and-feedback"><ProgressDemo /></DemoFrame>; break;
    case "#/patterns/pagination": page = <DemoFrame id="pattern-pagination"><PaginationDemo /></DemoFrame>; break;
    case "#/patterns/tooltips": page = <DemoFrame id="pattern-tooltips"><TooltipsDemo /></DemoFrame>; break;
    case "#/patterns/empty-error-states": page = <DemoFrame id="pattern-empty-error-states"><EmptyErrorDemo /></DemoFrame>; break;
    case "#/patterns/undo-and-confirmation": page = <DemoFrame id="pattern-undo-and-confirmation"><UndoDemo /></DemoFrame>; break;
    case "#/ux": page = <DemoFrame id="ux"><UxLab /></DemoFrame>; break;
    case "#/ux-principles": page = <DemoFrame id="ux-principles"><PrinciplesOverview /></DemoFrame>; break;
    case "#/ux-principles/usability-heuristics": page = <DemoFrame id="ux-heuristics"><HeuristicsLab /></DemoFrame>; break;
    case "#/ux-principles/cognitive-load": page = <DemoFrame id="ux-cognitive-load"><CognitiveLoad /></DemoFrame>; break;
    case "#/ux-principles/feedback-and-affordances": page = <DemoFrame id="ux-feedback"><FeedbackDemo /></DemoFrame>; break;
    case "#/ux-principles/consistency": page = <DemoFrame id="ux-consistency"><ConsistencyDemo /></DemoFrame>; break;
    case "#/ux-principles/error-prevention": page = <DemoFrame id="ux-error-prevention"><ErrorPrevention /></DemoFrame>; break;
    case "#/ux-research": page = <DemoFrame id="ux-research"><ResearchOverview /></DemoFrame>; break;
    case "#/ux-research/personas": page = <DemoFrame id="ux-personas"><PersonasDemo /></DemoFrame>; break;
    case "#/ux-research/journey-mapping": page = <DemoFrame id="ux-journey"><JourneyDemo /></DemoFrame>; break;
    case "#/ux-research/method-selector": page = <DemoFrame id="ux-method-selector"><MethodSelector /></DemoFrame>; break;
    case "#/ux-research/usability-testing": page = <DemoFrame id="ux-usability-testing"><UsabilityTesting /></DemoFrame>; break;
    case "#/information-architecture": page = <DemoFrame id="ux-ia"><IAOverview /></DemoFrame>; break;
    case "#/information-architecture/sitemaps": page = <DemoFrame id="ux-sitemap"><SitemapDemo /></DemoFrame>; break;
    case "#/information-architecture/card-sorting": page = <DemoFrame id="ux-cardsort"><CardSortDemo /></DemoFrame>; break;
    case "#/user-flows": page = <DemoFrame id="ux-flows"><FlowsHub /></DemoFrame>; break;
    case "#/user-flows/registration": page = <DemoFrame id="ux-flow-registration"><FlowRegistration /></DemoFrame>; break;
    case "#/user-flows/ecommerce-checkout": page = <DemoFrame id="ux-flow-checkout"><FlowCheckout /></DemoFrame>; break;
    case "#/user-flows/saas-onboarding": page = <DemoFrame id="ux-flow-onboarding"><FlowOnboarding /></DemoFrame>; break;
    case "#/user-flows/error-recovery": page = <DemoFrame id="ux-flow-error"><FlowErrorRecovery /></DemoFrame>; break;
    case "#/ux-metrics": page = <DemoFrame id="ux-metrics"><MetricsLab /></DemoFrame>; break;
    case "#/states": page = <DemoFrame id="states"><StatesOverview /></DemoFrame>; break;
    case "#/interface-states/loading": page = <DemoFrame id="state-loading"><LoadingDemo /></DemoFrame>; break;
    case "#/interface-states/empty": page = <DemoFrame id="state-empty"><EmptyDemo /></DemoFrame>; break;
    case "#/interface-states/errors": page = <DemoFrame id="state-errors"><ErrorsDemo /></DemoFrame>; break;
    case "#/interface-states/success": page = <DemoFrame id="state-success"><SuccessDemo /></DemoFrame>; break;
    case "#/interface-states/offline": page = <DemoFrame id="state-offline"><OfflineDemo /></DemoFrame>; break;
    case "#/interface-states/permissions": page = <DemoFrame id="state-permissions"><PermissionsDemo /></DemoFrame>; break;
    case "#/interface-states/session": page = <DemoFrame id="state-session"><SessionDemo /></DemoFrame>; break;
    case "#/interface-states/partial-failure": page = <DemoFrame id="state-partial-failure"><PartialDemo /></DemoFrame>; break;
    case "#/interface-states/stale-data": page = <DemoFrame id="state-stale-data"><StaleDemo /></DemoFrame>; break;
    case "#/interface-states/recovery": page = <DemoFrame id="state-recovery"><RecoveryDemo /></DemoFrame>; break;
    case "#/ai": page = <DemoFrame id="ai"><AiStudio /></DemoFrame>; break;
    case "#/accessibility": page = <DemoFrame id="a11y"><A11yOverview /></DemoFrame>; break;
    case "#/accessibility/semantic-html": page = <DemoFrame id="a11y-semantic-html"><SemanticDemo /></DemoFrame>; break;
    case "#/accessibility/keyboard-navigation": page = <DemoFrame id="a11y-keyboard-navigation"><KeyboardDemo /></DemoFrame>; break;
    case "#/accessibility/focus-management": page = <DemoFrame id="a11y-focus-management"><FocusDemo /></DemoFrame>; break;
    case "#/accessibility/screen-readers": page = <DemoFrame id="a11y-screen-readers"><ScreenReadersDemo /></DemoFrame>; break;
    case "#/accessibility/color-contrast": page = <DemoFrame id="a11y-color-contrast"><ContrastDemo /></DemoFrame>; break;
    case "#/accessibility/forms": page = <DemoFrame id="a11y-forms"><A11yFormsDemo /></DemoFrame>; break;
    case "#/accessibility/dialogs": page = <DemoFrame id="a11y-dialogs"><A11yDialogsDemo /></DemoFrame>; break;
    case "#/accessibility/motion": page = <DemoFrame id="a11y-motion"><MotionDemo /></DemoFrame>; break;
    case "#/accessibility/wcag-checklist": page = <DemoFrame id="a11y-wcag-checklist"><ChecklistDemo /></DemoFrame>; break;
    case "#/accessibility/audit": page = <DemoFrame id="a11y-audit"><AuditDemo /></DemoFrame>; break;
    case "#/responsive": page = <DemoFrame id="responsive"><ResponsiveOverview /></DemoFrame>; break;
    case "#/responsive/breakpoints": page = <DemoFrame id="resp-breakpoints"><BreakpointsDemo /></DemoFrame>; break;
    case "#/responsive/layouts": page = <DemoFrame id="resp-layouts"><LayoutsDemo /></DemoFrame>; break;
    case "#/responsive/typography": page = <DemoFrame id="resp-typography"><TypographyDemo /></DemoFrame>; break;
    case "#/responsive/navigation": page = <DemoFrame id="resp-navigation"><RespNavDemo /></DemoFrame>; break;
    case "#/responsive/tables": page = <DemoFrame id="resp-tables"><RespTablesDemo /></DemoFrame>; break;
    case "#/responsive/forms": page = <DemoFrame id="resp-forms"><RespFormsDemo /></DemoFrame>; break;
    case "#/responsive/device-preview": page = <DemoFrame id="resp-device-preview"><DevicePreview /></DemoFrame>; break;
    case "#/tokens": page = <DemoFrame id="tokens"><TokensLab dark={dark} setDark={setDark} /></DemoFrame>; break;
    case "#/testing": page = <DemoFrame id="testing"><TestingLab /></DemoFrame>; break;
    default:
      page = (
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-white/5">
          <p className="text-5xl">🧭</p>
          <h1 className="mt-3 text-2xl font-black">Lost in the playground?</h1>
          <p className="mt-1 text-sm text-slate-500">“{route}” doesn't exist — but 63 working demos do. Good 404s always offer a way home:</p>
          <a href="#/" className="mt-4 inline-block rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white">← Back to explorer</a>
        </div>
      );
  }

  return (
    <Shell route={route} dark={dark} setDark={setDark}>
      <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
      {page}
    </Shell>
  );
}
