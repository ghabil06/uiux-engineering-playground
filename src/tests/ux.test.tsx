/**
 * UX Engineering Laboratory tests — routes, comparisons, checklist,
 * recommendations, editors, IA exercises, flows + validation, metrics,
 * findings register, resets, and regression coverage.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PRINCIPLES, HEURISTICS, METHODS, recommendMethods, calcMetrics, susScore, validateFlow, findingsToCSV, FLOW_REGISTRATION, DEFAULT_STAGES, SEED_FINDINGS, type Finding } from "../ux/data";
import { resolveRoute } from "../lib/routes";
import { DEMOS } from "../lib/core";
import PrinciplesOverview from "../ux/principles";
import HeuristicsLab from "../ux/heuristics";
import CognitiveLoad from "../ux/cognitive-load";
import FeedbackDemo from "../ux/feedback";
import ConsistencyDemo from "../ux/consistency";
import ErrorPrevention from "../ux/error-prevention";
import ResearchOverview from "../ux/research";
import PersonasDemo from "../ux/personas";
import JourneyDemo from "../ux/journey";
import MethodSelector from "../ux/method-selector";
import UsabilityTesting from "../ux/usability-testing";
import IAOverview from "../ux/ia";
import SitemapDemo from "../ux/sitemap";
import CardSortDemo from "../ux/cardsort";
import FlowsHub from "../ux/flows";
import FlowRegistration from "../ux/flow-registration";
import FlowCheckout from "../ux/flow-checkout";
import FlowOnboarding from "../ux/flow-onboarding";
import FlowErrorRecovery from "../ux/flow-error-recovery";
import MetricsLab from "../ux/metrics";

beforeEach(() => localStorage.clear());

const ALL: [string, React.ComponentType, string][] = [
  ["ux-principles", PrinciplesOverview, "Workflow selector"],
  ["ux-heuristics", HeuristicsLab, "Heuristic checklist"],
  ["ux-cognitive-load", CognitiveLoad, "Overloaded: everything at once"],
  ["ux-feedback", FeedbackDemo, "Poor feedback"],
  ["ux-consistency", ConsistencyDemo, "Chaotic: same style"],
  ["ux-error-prevention", ErrorPrevention, "Free-text expiry"],
  ["ux-research", ResearchOverview, "Method selector — answer three questions"],
  ["ux-personas", PersonasDemo, "Persona builder"],
  ["ux-journey", JourneyDemo, "Evidence confidence"],
  ["ux-method-selector", MethodSelector, "Run this first"],
  ["ux-usability-testing", UsabilityTesting, "Log an observation"],
  ["ux-ia", IAOverview, "IA rules of thumb"],
  ["ux-sitemap", SitemapDemo, "Tree test: where would you find"],
  ["ux-cardsort", CardSortDemo, "Reset exercise"],
  ["ux-flows", FlowsHub, "Run: registration"],
  ["ux-flow-registration", FlowRegistration, "About this journey:"],
  ["ux-flow-checkout", FlowCheckout, "No real payment exists"],
  ["ux-flow-onboarding", FlowOnboarding, "shame-free"],
  ["ux-flow-error", FlowErrorRecovery, "Started: Sync invoices"],
  ["ux-metrics", MetricsLab, "System Usability Scale"],
];

const ROUTES: [string, string][] = [
  ["#/ux-principles", "ux-principles"],
  ["#/ux-principles/usability-heuristics", "ux-heuristics"],
  ["#/ux-principles/cognitive-load", "ux-cognitive-load"],
  ["#/ux-principles/feedback-and-affordances", "ux-feedback"],
  ["#/ux-principles/consistency", "ux-consistency"],
  ["#/ux-principles/error-prevention", "ux-error-prevention"],
  ["#/ux-research", "ux-research"],
  ["#/ux-research/personas", "ux-personas"],
  ["#/ux-research/journey-mapping", "ux-journey"],
  ["#/ux-research/method-selector", "ux-method-selector"],
  ["#/ux-research/usability-testing", "ux-usability-testing"],
  ["#/information-architecture", "ux-ia"],
  ["#/information-architecture/sitemaps", "ux-sitemap"],
  ["#/information-architecture/card-sorting", "ux-cardsort"],
  ["#/user-flows", "ux-flows"],
  ["#/user-flows/registration", "ux-flow-registration"],
  ["#/user-flows/ecommerce-checkout", "ux-flow-checkout"],
  ["#/user-flows/saas-onboarding", "ux-flow-onboarding"],
  ["#/user-flows/error-recovery", "ux-flow-error"],
  ["#/ux-metrics", "ux-metrics"],
];

describe("ux catalogue and routes", () => {
  it("registers all 20 routes with demo bindings", () => {
    for (const [path, id] of ROUTES) {
      expect(resolveRoute(path).def?.demoId).toBe(id);
    }
  });

  it("covers 15 principles, 6 heuristic demos and 13 methods", () => {
    expect(PRINCIPLES).toHaveLength(15);
    expect(HEURISTICS).toHaveLength(6);
    expect(METHODS).toHaveLength(13);
  });

  it("exports findings to escaped CSV", () => {
    const row: Finding = { ...SEED_FINDINGS[0], title: 'A "quoted" title' };
    const csv = findingsToCSV([row]);
    expect(csv.split("\n")[0]).toBe("id,title,where,problem,evidence,severity,impact,proposal,status");
    expect(csv).toMatch(/"A ""quoted"" title"/);
  });

  it.each(ALL)("%s renders its working demo", (_slug, Demo, marker) => {
    const { unmount } = render(<Demo />);
    expect(screen.getByText(marker, { exact: false })).toBeInTheDocument();
    unmount();
  });
});

describe("principles overview", () => {
  it("filters principles and clears", async () => {
    const user = userEvent.setup();
    render(<PrinciplesOverview />);
    await user.type(screen.getByLabelText("Filter principles"), "jargon");
    expect(screen.getByText("Match with the real world")).toBeInTheDocument();
    expect(screen.queryByText("Visibility of system status")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Filter principles"), { target: { value: "" } });
    expect(screen.getByText("Visibility of system status")).toBeInTheDocument();
  });

  it("recommends a different workflow per challenge", async () => {
    const user = userEvent.setup();
    render(<PrinciplesOverview />);
    expect(screen.getByText("Design Thinking")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /ship onboarding improvements weekly/i }));
    expect(screen.getByText("Lean UX")).toBeInTheDocument();
  });
});

describe("heuristics lab", () => {
  it("poor and improved buttons produce different announced outcomes", async () => {
    const user = userEvent.setup();
    render(<HeuristicsLab />);
    await user.click(screen.getByRole("button", { name: /submit \(dead\)/i }));
    expect(screen.getByText(/this silence is the violation/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /submit \(honest\)/i }));
    expect(await screen.findByText(/confirmed, not assumed/i, undefined, { timeout: 2500 })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /force error/i }));
    expect(await screen.findByRole("button", { name: /^retry$/i })).toBeInTheDocument();
  });

  it("switches heuristics and logs checklist findings with severity", async () => {
    const user = userEvent.setup();
    render(<HeuristicsLab />);
    await user.click(screen.getByRole("button", { name: /error prevention/i }));
    expect(screen.getByText(/free-text expiry/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/observation for/i), "Expiry accepts nonsense");
    await user.click(screen.getByRole("radio", { name: "Severity 4" }));
    await user.click(screen.getByRole("button", { name: /log finding/i }));
    expect(screen.getByText("S4")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /remove finding 1/i }));
    expect(screen.queryByText("S4")).not.toBeInTheDocument();
  });
});

describe("cognitive load and feedback", () => {
  it("chaos toggles count up; staged wizard completes in three", async () => {
    const user = userEvent.setup();
    render(<CognitiveLoad />);
    await user.click(screen.getByRole("button", { name: /○ name/i }));
    expect(screen.getByText(/1\/12 decided/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /my team/i }));
    await user.click(screen.getByRole("button", { name: /^5$/i }));
    await user.click(screen.getByRole("button", { name: /weekly digest/i }));
    expect(screen.getByText(/configured in 3 decisions/i)).toBeInTheDocument();
  });

  it("improved like-button responds; poor one stays silent", async () => {
    const user = userEvent.setup();
    render(<FeedbackDemo />);
    await user.click(screen.getByRole("button", { name: /like this proposal/i }));
    expect(await screen.findByText("129")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /like \(unresponsive demo\)/i })).toBeInTheDocument();
  });

  it("chaotic labels confuse; systematic ranks stay stable", async () => {
    const user = userEvent.setup();
    render(<ConsistencyDemo />);
    await user.click(screen.getByRole("button", { name: /^ok$/i }));
    expect(screen.getByText(/see the problem/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^submit$/i }));
    expect(screen.getByText(/took you 1 try/i)).toBeInTheDocument();
  });

  it("guarded expiry names the fix; free text does not", async () => {
    const user = userEvent.setup();
    render(<ErrorPrevention />);
    const freeCard = screen.getByText(/free-text expiry/i).closest("div")!;
    await user.type(within(freeCard).getByLabelText(/any format/i), "blah");
    await user.click(within(freeCard).getByRole("button", { name: /^pay$/i }));
    expect(screen.getByText(/expensive error/i)).toBeInTheDocument();
    const guardCard = screen.getByText(/guarded expiry/i).closest("div")!;
    await user.selectOptions(within(guardCard).getByLabelText("Expiry month"), "01");
    await user.selectOptions(within(guardCard).getByLabelText("Expiry year"), "24");
    await user.click(within(guardCard).getByRole("button", { name: /^pay$/i }));
    expect(screen.getByText(/try a current card/i)).toBeInTheDocument();
  });
});

describe("research and personas", () => {
  it("method ranking responds to the goal", () => {
    const a = recommendMethods({ goal: "Evaluate usability", time: "Days", evidence: "Any" });
    const b = recommendMethods({ goal: "Measure at scale", time: "Days", evidence: "Any" });
    expect(a[0].score).toBeGreaterThanOrEqual(a[1].score);
    expect(a[0].reasons.join(" ")).toMatch(/strong fit/i);
    expect(a[0].method.name).not.toBe(b[0].method.name);
  });

  it("overview selector surfaces reasons and updates", async () => {
    const user = userEvent.setup();
    render(<ResearchOverview />);
    expect(screen.getAllByText(/strong fit/i).length).toBeGreaterThan(0);
    await user.selectOptions(screen.getByLabelText(/research goal/i), "Fix findability");
    const ranked = screen.getByRole("list", { name: /recommended methods/i });
    expect(within(ranked).getByText("Tree testing")).toBeInTheDocument();
  });

  it("route-level selector adds risk reasoning", async () => {
    const user = userEvent.setup();
    render(<MethodSelector />);
    expect(screen.getByText(/run this first/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Low" }));
    expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
  });

  it("persona builder refuses evidence-free personas, then builds", async () => {
    const user = userEvent.setup();
    render(<PersonasDemo />);
    await user.type(screen.getByLabelText(/name \*/i), "Sam");
    await user.click(screen.getByRole("button", { name: /build persona card/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/evidence is required/i);
    await user.type(screen.getByLabelText(/evidence \*/i), "3 interviews (fictional for this demo)");
    await user.click(screen.getByRole("button", { name: /build persona card/i }));
    expect(screen.getByText(/built by you/i)).toBeInTheDocument();
  });
});

describe("journey mapping", () => {
  it("edits, adds, removes, persists and resets stages", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<JourneyDemo />);
    const name = screen.getByLabelText("Stage name");
    fireEvent.change(name, { target: { value: "ZZZ Probe" } });
    await user.click(screen.getByRole("button", { name: /add stage/i }));
    expect(screen.getByLabelText("Stage name")).toHaveDisplayValue("Stage 6");
    unmount();
    render(<JourneyDemo />);
    // sel resets to stage 0, which we renamed: rename persisted, add persisted
    expect(screen.getByLabelText("Stage name")).toHaveDisplayValue("ZZZ Probe");
    const rail = screen.getByRole("list", { name: /journey stages/i });
    expect(within(rail).getAllByRole("button")).toHaveLength(6);
    await user.click(screen.getByRole("button", { name: /remove this stage/i }));
    await user.click(screen.getByRole("button", { name: /reset example/i }));
    expect(screen.getAllByText("Awareness").length).toBeGreaterThan(0);
    expect(screen.queryByText("ZZZ Probe")).not.toBeInTheDocument();
  });
});

describe("IA exercises", () => {
  it("expands the sitemap and shows page purpose", async () => {
    const user = userEvent.setup();
    render(<SitemapDemo />);
    await user.click(screen.getByRole("button", { name: "Collapse Product" }));
    expect(screen.queryByRole("button", { name: /invoices/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Expand Product" }));
    await user.click(screen.getByRole("button", { name: /invoices/i }));
    expect(screen.getByText(/clear the invoice queue fast/i)).toBeInTheDocument();
  });

  it("tree test succeeds on the right path and fails honestly elsewhere", async () => {
    const user = userEvent.setup();
    render(<SitemapDemo />);
    await user.click(screen.getByRole("button", { name: /^account$/i }));
    await user.click(screen.getByRole("button", { name: /^billing$/i }));
    expect(screen.getByText(/strong information scent/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /restart tree test/i }));
    await user.click(screen.getByRole("button", { name: /^product$/i }));
    await user.click(screen.getByRole("button", { name: /^invoices$/i }));
    expect(screen.getByText(/dead end at/i)).toBeInTheDocument();
  });

  it("IA overview counts clicks to billing", async () => {
    const user = userEvent.setup();
    render(<IAOverview />);
    await user.click(screen.getByRole("button", { name: /^account$/i }));
    await user.click(screen.getByRole("button", { name: /^billing$/i }));
    expect(screen.getByText(/optimal: 2/i)).toBeInTheDocument();
  });

  it("card sort moves, groups, and resets", async () => {
    const user = userEvent.setup();
    render(<CardSortDemo />);
    await user.selectOptions(screen.getByLabelText(/move reset password to/i), "ungrouped");
    expect(screen.getByText(/ungrouped \(1\)/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /new group/i }));
    expect(screen.getByDisplayValue("New group 4")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /reset exercise/i }));
    expect(screen.getByText(/starter sort/i)).toBeInTheDocument();
  });
});

describe("user flows", () => {
  it("registration walks the happy path with a trail", async () => {
    const user = userEvent.setup();
    render(<FlowRegistration />);
    await user.click(screen.getByRole("button", { name: /continue → enter details/i }));
    await user.click(screen.getByRole("button", { name: /continue → details valid\?/i }));
    await user.click(screen.getByRole("button", { name: /valid → review information/i }));
    await user.click(screen.getByRole("button", { name: /confirm → workspace created/i }));
    expect(screen.getByText(/end of path/i)).toBeInTheDocument();
    expect(screen.getByText(/trail:/i).textContent).toMatch(/Start.*Enter details.*Review information.*Workspace created/);
  });

  it("checkout explores the declined branch then recovers", async () => {
    const user = userEvent.setup();
    render(<FlowCheckout />);
    for (const label of [/continue → delivery details/i, /continue → payment \(simulated\)/i, /continue → payment approved\?/i]) {
      await user.click(screen.getByRole("button", { name: label }));
    }
    await user.click(screen.getByRole("button", { name: /declined → card declined/i }));
    const endCard = screen.getByText(/end of path/i).closest("div")!;
    expect(within(endCard).getByText(/entries preserved/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /retry \/ change → payment \(simulated\)/i }));
    // back at the payment step: walk through the gateway decision again, then approve
    await user.click(screen.getByRole("button", { name: /continue → payment approved\?/i }));
    await user.click(screen.getByRole("button", { name: /approved → review order/i }));
    await user.click(screen.getByRole("button", { name: /place order → order confirmed/i }));
    const doneCard = screen.getByText(/end of path/i).closest("div")!;
    expect(within(doneCard).getByText(/fictional/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /run this journey again/i }));
    expect(screen.getByText(/started: review cart/i)).toBeInTheDocument();
  });

  it("editor validation flags and clears problems", async () => {
    const user = userEvent.setup();
    render(<FlowsHub />);
    await user.click(screen.getByRole("tab", { name: /edit the flow/i }));
    expect(screen.getByText(/flow valid/i)).toBeInTheDocument();
    const label = screen.getByLabelText("Label for node start");
    fireEvent.change(label, { target: { value: "" } });
    expect(screen.getByText(/has no label/i)).toBeInTheDocument();
    fireEvent.change(label, { target: { value: "Start" } });
    expect(screen.getByText(/flow valid/i)).toBeInTheDocument();
  });

  it("validateFlow catches structural problems", () => {
    expect(validateFlow(FLOW_REGISTRATION)).toEqual([]);
    const bad = {
      start: "a",
      nodes: [
        { id: "a", label: "", kind: "step" as const },
        { id: "b", label: "Pick?", kind: "decision" as const },
        { id: "c", label: "Lost", kind: "step" as const },
      ],
      edges: [{ from: "a", to: "b" }],
    };
    const issues = validateFlow(bad).join(" | ");
    expect(issues).toMatch(/no label/i);
    expect(issues).toMatch(/dead end/i);
    expect(issues).toMatch(/two branches/i);
    expect(issues).toMatch(/unreachable/i);
    expect(issues).toMatch(/success end-state/i);
  });
});

describe("usability metrics", () => {
  it("computes honest metrics and updates on new observations", async () => {
    const user = userEvent.setup();
    render(<UsabilityTesting />);
    expect(screen.getByText(/median withheld/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/time in seconds/i), "100");
    await user.click(screen.getByRole("button", { name: /add observation/i }));
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getAllByText("100s")).toHaveLength(2);
  });

  it("withholds the median until three valid times exist", () => {
    expect(calcMetrics([]).caveat).toMatch(/no observations/i);
    expect(calcMetrics([
      { id: 1, task: "t", completed: true, help: false, errors: 0, seconds: 50, notes: "" },
      { id: 2, task: "t", completed: true, help: false, errors: 0, seconds: null, notes: "" },
    ]).medianSeconds).toBeNull();
  });
});

describe("ux metrics lab", () => {
  it("recalculates task success when data changes", async () => {
    render(<MetricsLab />);
    expect(screen.getByText(/79\.3%/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Bulk approve successes"), { target: { value: "10" } });
    expect(screen.getByText(/93\.1%/)).toBeInTheDocument();
  });

  it("scores SUS 100 for perfect answers and blocks incomplete sets", async () => {
    const user = userEvent.setup();
    render(<MetricsLab />);
    expect(screen.getByText(/0\/10 so far/i)).toBeInTheDocument();
    for (let i = 1; i <= 10; i++) {
      const group = screen.getByRole("radiogroup", { name: `SUS item ${i}` });
      await user.click(within(group).getByRole("radio", { name: i % 2 === 1 ? "5" : "1" }));
    }
    expect(screen.getByText("100", { exact: true })).toBeInTheDocument();
    expect(susScore([5, 1, 5, 1, 5, 1, 5, 1, 5, 1])).toBe(100);
    expect(susScore([5, 1, null, 1, 5, 1, 5, 1, 5, 1])).toBeNull();
  });

  it("funnel edits move abandonment", async () => {
    render(<MetricsLab />);
    expect(screen.getByText("95.9%")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Paid count"), { target: { value: "82" } });
    expect(screen.getByText("91.8%")).toBeInTheDocument();
  });
});

describe("findings register", () => {
  it("creates, filters, resolves, reopens, edits and deletes", async () => {
    const user = userEvent.setup();
    render(<MetricsLab />);
    await user.type(screen.getByLabelText("Finding title"), "ZZZ Probe finding");
    await user.click(screen.getByRole("button", { name: /log finding/i }));
    expect(screen.getByText("ZZZ Probe finding")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Filter by status"), "Resolved");
    expect(screen.queryByText("ZZZ Probe finding")).not.toBeInTheDocument();
    expect(screen.getByText(/palette shortcut undiscoverable/i)).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Filter by status"), "All");

    await user.click(screen.getAllByRole("button", { name: /resolve/i })[0]);
    expect(screen.getAllByText(/reopen/i).length).toBeGreaterThan(0);
    await user.click(screen.getAllByRole("button", { name: /reopen/i })[0]);
    expect(screen.getAllByText(/resolve/i).length).toBeGreaterThan(0);

    const probe = screen.getByText("ZZZ Probe finding");
    const item = probe.closest("li")!;
    await user.click(within(item).getByRole("button", { name: "Edit" }));
    // fireEvent (not user.type): in happy-dom the type-click does not move focus,
    // so a leading space would activate the focused Close button. Real browsers
    // focus the input on click; the controlled onChange path is identical.
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "ZZZ Probe finding v2" } });
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("ZZZ Probe finding v2")).toBeInTheDocument();

    const item2 = screen.getByText("ZZZ Probe finding v2").closest("li")!;
    await user.click(within(item2).getByRole("button", { name: /delete/i }));
    await user.click(within(item2).getByRole("button", { name: /yes, delete/i }));
    expect(screen.queryByText("ZZZ Probe finding v2")).not.toBeInTheDocument();
  });
});

describe("resets and regression", () => {
  it("resets restore predictable states", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<CardSortDemo />);
    await user.selectOptions(screen.getByLabelText(/move reset password to/i), "ungrouped");
    await user.click(screen.getByRole("button", { name: /reset exercise/i }));
    expect(screen.getByText(/starter sort/i)).toBeInTheDocument();
    unmount();

    render(<UsabilityTesting />);
    await user.click(screen.getByRole("button", { name: /reset to the 3 labeled sample rows/i }));
    expect(screen.getAllByText("sample").length).toBeGreaterThan(0);
  });

  it("existing catalogue, styles and patterns stay functional", () => {
    expect(DEMOS).toHaveLength(90);
    for (const slug of ["navigation", "search-and-filter", "data-table"]) {
      expect(resolveRoute(`#/patterns/${slug}`).def).toBeTruthy();
    }
    for (const slug of ["minimalism", "dark-ui", "data-dense"]) {
      expect(resolveRoute(`#/styles/${slug}`).def).toBeTruthy();
    }
    expect(resolveRoute("#/product/dashboard").def?.demoId).toBe("dashboard");
    expect(DEFAULT_STAGES).toHaveLength(5);
  });

  it("demos carry no viewport-threatening fixed widths", () => {
    const demos = [PrinciplesOverview, HeuristicsLab, CognitiveLoad, FeedbackDemo, ConsistencyDemo, ErrorPrevention, ResearchOverview, PersonasDemo, JourneyDemo, MethodSelector, UsabilityTesting, IAOverview, SitemapDemo, CardSortDemo, FlowsHub, FlowRegistration, FlowCheckout, FlowOnboarding, FlowErrorRecovery, MetricsLab];
    for (const Demo of demos) {
      const { container, unmount } = render(<Demo />);
      const fixed = Array.from(container.querySelectorAll("[class]")).filter((el) => {
        const m = (el.getAttribute("class") ?? "").match(/(?:^|\s)(?:w|min-w)-\[(\d+)px\]/);
        if (!m || Number(m[1]) < 280) return false;
        return !(el as HTMLElement).closest(".overflow-x-auto");
      });
      expect(fixed.map((el) => el.textContent?.slice(0, 40))).toEqual([]);
      unmount();
    }
  });
});
