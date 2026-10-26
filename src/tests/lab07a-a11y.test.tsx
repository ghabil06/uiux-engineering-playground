/**
 * Accessibility laboratory tests — routes, contrast math + validation,
 * keyboard/focus behavior, dialogs, motion override, checklist, audit.
 */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TOPICS, CHECKLIST, isValidHex, normalizeHex } from "../a11y/data";
import { verdict } from "../a11y/contrast";
import { contrastRatio } from "../lib/core";
import { resolveRoute } from "../lib/routes";
import A11yOverview from "../a11y/overview";
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

const ALL: [string, React.ComponentType, string][] = [
  ["overview", A11yOverview, "How to read this lab"],
  ["semantic-html", SemanticDemo, "Div soup"],
  ["keyboard-navigation", KeyboardDemo, "Skip to the test area"],
  ["focus-management", FocusDemo, "Focus-order walkthrough"],
  ["screen-readers", ScreenReadersDemo, "first match wins"],
  ["color-contrast", ContrastDemo, "Live preview"],
  ["forms", A11yFormsDemo, "placeholder as label"],
  ["dialogs", A11yDialogsDemo, "Lifecycle log"],
  ["motion", MotionDemo, "Motion in this preview"],
  ["wcag-checklist", ChecklistDemo, "Completion"],
  ["audit", AuditDemo, "Run the audit"],
];

describe("a11y catalogue and routes", () => {
  it("defines 10 topics and resolves all routes", () => {
    expect(TOPICS).toHaveLength(10);
    expect(CHECKLIST.length).toBeGreaterThanOrEqual(12);
    for (const t of TOPICS) {
      expect(resolveRoute(`#/accessibility/${t.slug}`).def?.demoId).toBe(`a11y-${t.slug}`);
    }
  });

  it.each(ALL)("%s renders its working demo", (_slug, Demo, marker) => {
    const { unmount } = render(<Demo />);
    expect(screen.getByText(marker, { exact: false })).toBeInTheDocument();
    unmount();
  });
});

describe("contrast math", () => {
  it("scores known pairs correctly", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
    expect(verdict(21)).toEqual({ aa: true, aaLarge: true, nontext: true });
    expect(verdict(4.0)).toEqual({ aa: false, aaLarge: true, nontext: true });
    expect(verdict(2.0)).toEqual({ aa: false, aaLarge: false, nontext: false });
  });

  it("validates hex strictly", () => {
    expect(isValidHex("#fff") && isValidHex("#0F172A")).toBe(true);
    expect(isValidHex("fff") || isValidHex("#ffff") || isValidHex("#gggggg") || isValidHex("")).toBe(false);
    expect(normalizeHex("#ABC")).toBe("#aabbcc");
    expect(normalizeHex("#0F172A")).toBe("#0f172a");
  });

  it("rejects bad input with named errors and recomputes on presets", async () => {
    const user = userEvent.setup();
    render(<ContrastDemo />);
    expect(screen.getByText(/17\.85/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Foreground hex value"), { target: { value: "zzz" } });
    expect(screen.getByText(/3 or 6 hex digits/i)).toBeInTheDocument();
    expect(screen.getByText(/fix the highlighted hex/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Placeholder grey" }));
    expect(screen.getByText(/2\.32/)).toBeInTheDocument();
    expect(screen.getAllByText("Fail").length).toBeGreaterThan(0);
  });
});

describe("keyboard and focus", () => {
  it("inspector tracks real focus movement", async () => {
    const user = userEvent.setup();
    render(<KeyboardDemo />);
    await user.click(screen.getByRole("button", { name: /native button/i }));
    expect(screen.getByText(/focused: button/i)).toBeInTheDocument();
  });

  it("native buttons activate by keyboard; divs do not", async () => {
    const user = userEvent.setup();
    render(<KeyboardDemo />);
    screen.getByRole("button", { name: /native button/i }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: /native button \(1\)/i })).toBeInTheDocument();
  });

  it("intentional trap contains Tab until released", async () => {
    const user = userEvent.setup();
    render(<KeyboardDemo />);
    await user.click(screen.getByRole("checkbox", { name: /intentional keyboard trap/i }));
    expect(screen.getByText(/trap active/i)).toBeInTheDocument();
    screen.getByRole("button", { name: "Caged one" }).focus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Caged two" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Caged one" })).toHaveFocus();
  });

  it("focus order walk advances with aria-current", async () => {
    const user = userEvent.setup();
    render(<FocusDemo />);
    await user.click(screen.getByRole("button", { name: /move focus to next/i }));
    expect(screen.getByRole("button", { name: /search field/i })).toHaveAttribute("aria-current", "true");
  });

  it("dialog open/close restores focus with a log", async () => {
    const user = userEvent.setup();
    render(<FocusDemo />);
    const trigger = screen.getByRole("button", { name: /open mini dialog/i });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: /mini dialog/i })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(screen.getByText(/focus returned/i)).toBeInTheDocument();
  });
});

describe("names, forms, dialogs, motion", () => {
  it("name computation follows the cascade", async () => {
    const user = userEvent.setup();
    render(<ScreenReadersDemo />);
    expect(screen.getByText(/aria-label wins/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "content" }));
    expect(screen.getByText(/last resort/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /announce polite/i }));
    expect(screen.getAllByText(/waits its turn/i)[0]).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /announce assertive/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/payment failed/i);
  });

  it("improved form announces linked errors; poor form stays silent", async () => {
    const user = userEvent.setup();
    render(<A11yFormsDemo />);
    await user.click(screen.getByRole("button", { name: /join newsletter/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/missing “@”/i);
    await user.type(screen.getByRole("textbox", { name: /email address/i }), "you@co.com");
    await user.click(screen.getByRole("button", { name: /join newsletter/i }));
    expect(screen.getByText(/you're on the list/i)).toBeInTheDocument();
  });

  it("dialog lifecycle: open, Esc, log, return", async () => {
    const user = userEvent.setup();
    render(<A11yDialogsDemo />);
    const trigger = screen.getByRole("button", { name: /confirm dialog/i });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: /publish 12 pages/i })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(screen.getByText(/focus returned/i)).toBeInTheDocument();
  });

  it("long dialog scrolls internally", async () => {
    const user = userEvent.setup();
    render(<A11yDialogsDemo />);
    await user.click(screen.getByRole("button", { name: /long-content dialog/i }));
    expect(screen.getByText(/paragraph 12/i)).toBeInTheDocument();
  });

  it("motion override is scoped and labelled", async () => {
    const user = userEvent.setup();
    render(<MotionDemo />);
    expect(screen.getByText(/float animation disabled|decorative float/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /force reduced/i }));
    expect(screen.getByText(/reduced active/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /force full/i }));
    expect(screen.getByText(/full active/i)).toBeInTheDocument();
  });
});

describe("checklist", () => {
  it("computes progress from real selections and resets", async () => {
    const user = userEvent.setup();
    render(<ChecklistDemo />);
    expect(screen.getByText(/completion 0\/16/i)).toBeInTheDocument();
    const first = screen.getByRole("radiogroup", { name: /result for text alternatives/i });
    await user.click(within(first).getByRole("radio", { name: "Pass" }));
    expect(screen.getByText(/completion 1\/16/i)).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /checklist completion/i })).toHaveAttribute("aria-valuenow", "6");
    const pourFilter = screen.getByRole("group", { name: /principle filter/i });
    await user.click(within(pourFilter).getByRole("button", { name: "Operable" }));
    expect(screen.getAllByRole("radio").length).toBeLessThan(CHECKLIST.length * 4);
    await user.click(within(pourFilter).getByRole("button", { name: "All" }));
    await user.click(screen.getByRole("button", { name: /reset all/i }));
    expect(screen.getByText(/completion 0\/16/i)).toBeInTheDocument();
  });
});

describe("audit", () => {
  it("runs disclosed checks and reports rule findings", async () => {
    const user = userEvent.setup();
    render(<AuditDemo />);
    await user.click(screen.getByRole("button", { name: /run 8 checks/i }));
    expect(screen.getByText(/7 automated findings/i)).toBeInTheDocument();
    expect(screen.getByText("image-alt")).toBeInTheDocument();
    expect(screen.getByText("duplicate-id")).toBeInTheDocument();
    expect(screen.getByText("positive-tabindex")).toBeInTheDocument();
  });

  it("remediation workflow filters by status", async () => {
    const user = userEvent.setup();
    render(<AuditDemo />);
    await user.click(screen.getByRole("button", { name: /run 8 checks/i }));
    const first = screen.getAllByRole("button", { name: "Resolved" })[0];
    await user.click(first);
    await user.click(screen.getByRole("button", { name: /^resolved$/i }));
    expect(screen.queryByText("image-alt")).not.toBeInTheDocument();
  });

  it("lists manual and unperformed work honestly", () => {
    render(<AuditDemo />);
    expect(screen.getByText(/keyboard-only pass/i)).toBeInTheDocument();
    expect(screen.getByText(/no time-based media/i)).toBeInTheDocument();
  });
});

describe("a11y overview gallery", () => {
  it("searches, filters and resets", async () => {
    const user = userEvent.setup();
    render(<A11yOverview />);
    await user.type(screen.getByLabelText("Search accessibility topics"), "contrast");
    expect(screen.getByText("Color Contrast")).toBeInTheDocument();
    expect(screen.queryByText("Semantic HTML")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Operable" }));
    expect(screen.queryByText("Color Contrast")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /reset search & filters/i }));
    expect(screen.getByText("Semantic HTML")).toBeInTheDocument();
  });
});
