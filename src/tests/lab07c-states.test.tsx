/**
 * Interface-states laboratory tests — machine rules, explorer, all ten
 * demos, recovery flows, matrix links, and width safety.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { transition, PERMITTED, MATRIX, type ReqState } from "../states/data";
import { resolveRoute } from "../lib/routes";
import { DEMOS } from "../lib/core";
import SemanticDemo from "../a11y/semantic";
import KeyboardDemo from "../a11y/keyboard";
import FocusDemo from "../a11y/focus";
import ScreenReadersDemo from "../a11y/screenreaders";
import ContrastDemo from "../a11y/contrast";
import A11yFormsDemo from "../a11y/forms";
import A11yDialogsDemo from "../a11y/dialogs";
import MotionDemo from "../a11y/motion";
import ChecklistDemo from "../a11y/checklist";
import AuditDemo from "../a11y/audit";
import ResponsiveOverview from "../responsive/overview";
import BreakpointsDemo from "../responsive/breakpoints";
import LayoutsDemo from "../responsive/layouts";
import TypographyDemo from "../responsive/typography";
import RespNavDemo from "../responsive/navigation";
import RespTablesDemo from "../responsive/tables";
import RespFormsDemo from "../responsive/forms";
import DevicePreview from "../responsive/device-preview";
import StatesOverview from "../states/overview";
import LoadingDemo from "../states/loading";
import EmptyDemo from "../states/empty";
import ErrorsDemo from "../states/errors";
import SuccessDemo from "../states/success";
import OfflineDemo from "../states/offline";
import PermissionsDemo from "../states/permissions";
import SessionDemo from "../states/session";
import PartialDemo from "../states/partial-failure";
import StaleDemo from "../states/stale-data";
import RecoveryDemo from "../states/recovery";

afterEach(() => {
  vi.useRealTimers();
  localStorage.clear();
});

const ALL: [string, React.ComponentType, string][] = [
  ["overview", StatesOverview, "Transition explorer"],
  ["loading", LoadingDemo, "Skeleton (content-shaped)"],
  ["empty", EmptyDemo, "First use (pristine)"],
  ["errors", ErrorsDemo, "Field-level validation"],
  ["success", SuccessDemo, "Inline success + saved indicator"],
  ["offline", OfflineDemo, "Go offline (simulated)"],
  ["permissions", PermissionsDemo, "Acting as:"],
  ["session", SessionDemo, "Simulate 30s warning"],
  ["partial-failure", PartialDemo, "Break section C (simulated)"],
  ["stale-data", StaleDemo, "Last updated:"],
  ["recovery", RecoveryDemo, "idempotent ops only"],
];

describe("state machine", () => {
  it("follows the happy path idle → loading → success → idle", () => {
    let s: ReqState = { status: "idle" };
    s = transition(s, { type: "start" }).next;
    expect(s.status).toBe("loading");
    s = transition(s, { type: "resolve" }).next;
    expect(s.status).toBe("success");
    expect(transition(s, { type: "reset" }).next.status).toBe("idle");
  });

  it("walks error → retrying → success with attempts", () => {
    let s: ReqState = { status: "loading" };
    s = transition(s, { type: "fail", message: "500" }).next;
    expect(s).toEqual({ status: "error", message: "500" });
    s = transition(s, { type: "retry" }).next;
    expect(s).toEqual({ status: "retrying", attempt: 1 });
    s = transition(s, { type: "resolve" }).next;
    expect(s.status).toBe("success");
  });

  it("rejects impossible transitions without changing state", () => {
    const cases: [ReqState, { type: "start" } | { type: "resolve" }][] = [
      [{ status: "idle" }, { type: "resolve" }],
      [{ status: "loading" }, { type: "start" }],
      [{ status: "success", at: "t" }, { type: "start" }],
      [{ status: "error", message: "x" }, { type: "resolve" }],
    ];
    for (const [s, e] of cases) {
      const r = transition(s, e);
      expect(r.ok).toBe(false);
      expect(r.next).toBe(s);
    }
  });

  it("documents permitted transitions per state", () => {
    expect(PERMITTED.idle).toEqual(["start"]);
    expect(PERMITTED.success).toEqual(["reset"]);
    expect(MATRIX).toHaveLength(10);
    expect(MATRIX.every((r) => r.states.length > 0)).toBe(true);
  });
});

describe("state catalogue and routes", () => {
  it("resolves all ten state routes and covers the matrix", () => {
    for (const slug of ["loading", "empty", "errors", "success", "offline", "permissions", "session", "partial-failure", "stale-data", "recovery"]) {
      expect(resolveRoute(`#/interface-states/${slug}`).def?.demoId).toBe(`state-${slug}`);
    }
  });

  it.each(ALL)("%s renders its working demo", (_slug, Demo, marker) => {
    const { unmount } = render(<Demo />);
    expect(screen.getByText(marker, { exact: false })).toBeInTheDocument();
    unmount();
  });
});

describe("transition explorer", () => {
  it("fires valid transitions, rejects invalid ones with reasons, resets", async () => {
    const user = userEvent.setup();
    render(<StatesOverview />);
    expect(screen.getByText("Idle")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^resolve$/i }));
    expect(screen.getByText(/not permitted from idle/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^start$/i }));
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^resolve$/i }));
    expect(screen.getByText(/success \(/i)).toBeInTheDocument();
    expect(screen.getByText(/idle --start--> loading/i)).toBeInTheDocument();
  });

  it("matrix links point at real demos", () => {
    render(<StatesOverview />);
    const table = screen.getByRole("table");
    const [link] = within(table).getAllByRole("link", { name: /open →/i });
    expect(link.getAttribute("href")).toMatch(/^#\//);
    expect(link.getAttribute("href")).toBe("#/interface-states/loading");
  });

  it("gallery searches and clears", async () => {
    const user = userEvent.setup();
    render(<StatesOverview />);
    await user.type(screen.getByLabelText("Search interface states"), "offline");
    expect(screen.getByText("Offline States")).toBeInTheDocument();
    expect(screen.queryByText("Loading States")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /clear search/i }));
    expect(screen.getByText("Loading States")).toBeInTheDocument();
  });
});

describe("state demos", () => {
  it("loading resolves fast and slow with reassurance", async () => {
    const user = userEvent.setup();
    render(<LoadingDemo />);
    await user.click(screen.getByRole("button", { name: /load panel \(slow/i }));
    expect(screen.getByLabelText(/loading panel/i)).toBeInTheDocument();
    expect(await screen.findByText(/thanks for waiting/i, undefined, { timeout: 2500 })).toBeInTheDocument();
    expect(await screen.findByText(/panel loaded/i, undefined, { timeout: 3500 })).toBeInTheDocument();
  });

  it("empty collection restores and search recovers", async () => {
    const user = userEvent.setup();
    render(<EmptyDemo />);
    expect(screen.getByText(/no results for “zzz”/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /clear all \(demo\)/i }));
    expect(screen.getByText(/collection cleared/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /restore starters/i }));
    expect(screen.getByText(/3 of 3 shown/i)).toBeInTheDocument();
  });

  it("field error names the fix and moves focus; retry succeeds on third try", async () => {
    const user = userEvent.setup();
    render(<ErrorsDemo />);
    await user.type(screen.getByLabelText(/invite code/i), "abc");
    await user.click(screen.getByRole("button", { name: /^apply$/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/abc-1234/i);
    expect(screen.getByLabelText(/invite code/i)).toHaveFocus();
    await user.click(screen.getByRole("button", { name: /try again/i }));
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(await screen.findByText(/loaded on attempt 3/i)).toBeInTheDocument();
  });

  it("success tracks dirty/saved and completes workflows", async () => {
    const user = userEvent.setup();
    render(<SuccessDemo />);
    fireEvent.change(screen.getByLabelText(/project name/i), { target: { value: "Atlas v2" } });
    expect(screen.getByText(/unsaved changes/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^save \(simulated\)/i }));
    expect(screen.getByText(/all changes saved/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /fire toast success/i }));
    expect(screen.getByText(/export queued/i)).toBeInTheDocument();
  });

  it("offline queues and flushes on reconnect", async () => {
    const user = userEvent.setup();
    render(<OfflineDemo />);
    await user.click(screen.getByRole("button", { name: /go offline/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/simulated/i);
    await user.click(screen.getByRole("button", { name: /save edit/i }));
    expect(screen.getByText(/queued locally \(1 waiting\)/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /reconnect \+ flush/i }));
    expect(screen.getByText(/1 queued edits? synced/i)).toBeInTheDocument();
  });

  it("denied roles get reasons and alternatives; admin deletes", async () => {
    const user = userEvent.setup();
    render(<PermissionsDemo />);
    await user.click(screen.getByRole("button", { name: /delete atlas website/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/needs the admin role/i);
    await user.click(screen.getByRole("button", { name: /request admin access/i }));
    expect(screen.getByText(/request sent/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Admin" }));
    await user.click(screen.getByRole("button", { name: /delete billing api/i }));
    expect(screen.queryByText("Billing API")).not.toBeInTheDocument();
  });

  it("session warns, expires, preserves the draft and resumes", async () => {
    const user = userEvent.setup();
    render(<SessionDemo />);
    await user.type(screen.getByLabelText(/draft \(safe input/i), "My important draft");
    await user.click(screen.getByRole("button", { name: /30s warning/i }));
    expect(screen.getByText(/expires in 30s/i)).toBeInTheDocument();
    // Exercise the real 1s tick once (honest), then take the demo shortcut.
    expect(await screen.findByText(/expires in 29s/i, undefined, { timeout: 2500 })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /expire now/i }));
    expect(screen.getByText(/signed out \(simulated\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preserved draft/i)).toHaveDisplayValue("Quarterly report intro…My important draft");
    await user.click(screen.getByRole("button", { name: /sign back in/i }));
    expect(screen.getByText(/draft intact/i)).toBeInTheDocument();
  });

  it("partial failure isolates the blast radius", async () => {
    const user = userEvent.setup();
    render(<PartialDemo />);
    await user.click(screen.getByRole("button", { name: /break section c/i }));
    expect(screen.getByText(/1\/3 sections failed/i)).toBeInTheDocument();
    expect(screen.getByText(/48\.2k mrr/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /retry this section only/i }));
    expect(await screen.findByText(/3\/3 sections healthy/i, undefined, { timeout: 2500 })).toBeInTheDocument();
  });

  it("stale data labels, refreshes and survives a dead API", async () => {
    const user = userEvent.setup();
    render(<StaleDemo />);
    expect(screen.getByText(/sample snapshot/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /refresh now/i }));
    expect(await screen.findByText(/refreshed demonstration data/i, undefined, { timeout: 2500 })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /dead api/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/clearly-labelled/i);
    await user.click(screen.getByRole("button", { name: /restore api & retry/i }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("recovery toolkit: retry, save, undo with countdown", async () => {
    const user = userEvent.setup();
    render(<RecoveryDemo />);
    await user.click(screen.getByRole("button", { name: /retry sync/i }));
    await user.click(screen.getByRole("button", { name: /retry sync/i }));
    expect(screen.getByText(/synced on attempt 3/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /archive “atlas website”/i }));
    expect(screen.getByRole("button", { name: /undo \(8s\)/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /undo \(8s\)/i }));
    expect(screen.queryByText(/undo \(\ds\)/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /archive “atlas website”/i })).toBeInTheDocument();
  });
});

describe("width safety and regression", () => {
  it("new demos carry no viewport-threatening fixed widths", () => {
    const demos = [SemanticDemo, KeyboardDemo, FocusDemo, ScreenReadersDemo, ContrastDemo, A11yFormsDemo, A11yDialogsDemo, MotionDemo, ChecklistDemo, AuditDemo, ResponsiveOverview, BreakpointsDemo, LayoutsDemo, TypographyDemo, RespNavDemo, RespTablesDemo, RespFormsDemo, DevicePreview, StatesOverview, LoadingDemo, EmptyDemo, ErrorsDemo, SuccessDemo, OfflineDemo, PermissionsDemo, SessionDemo, PartialDemo, StaleDemo, RecoveryDemo];
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

  it("all prior laboratories still resolve", () => {
    expect(DEMOS).toHaveLength(90);
    expect(resolveRoute("#/product/dashboard").def?.demoId).toBe("dashboard");
    expect(resolveRoute("#/styles/dark-ui").def?.demoId).toBe("style-dark-ui");
    expect(resolveRoute("#/patterns/data-table").def?.demoId).toBe("pattern-data-table");
    expect(resolveRoute("#/ux-metrics").def?.demoId).toBe("ux-metrics");
    expect(resolveRoute("#/accessibility").def?.demoId).toBe("a11y");
    expect(resolveRoute("#/responsive").def?.demoId).toBe("responsive");
    expect(resolveRoute("#/states").def?.demoId).toBe("states");
  });
});
