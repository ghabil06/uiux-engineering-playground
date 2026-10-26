/**
 * Responsive laboratory tests — routes, breakpoint logic, width-driven
 * layouts, device presets, tables, forms, and width safety sweeps.
 */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VIEWPORTS } from "../responsive/data";
import { layoutFor } from "../responsive/breakpoints";
import { resolveRoute } from "../lib/routes";
import ResponsiveOverview from "../responsive/overview";
import BreakpointsDemo from "../responsive/breakpoints";
import LayoutsDemo from "../responsive/layouts";
import TypographyDemo from "../responsive/typography";
import RespNavDemo from "../responsive/navigation";
import RespTablesDemo from "../responsive/tables";
import RespFormsDemo from "../responsive/forms";
import DevicePreview from "../responsive/device-preview";

const ALL: [string, React.ComponentType, string][] = [
  ["overview", ResponsiveOverview, "Mobile-first in one control"],
  ["breakpoints", BreakpointsDemo, "Preview width"],
  ["layouts", LayoutsDemo, "Fluid spacing & type"],
  ["typography", TypographyDemo, "Fluid scale"],
  ["navigation", RespNavDemo, "Navigation preview"],
  ["tables", RespTablesDemo, "Scroll region"],
  ["forms", RespFormsDemo, "Form preview (try 320)"],
  ["device-preview", DevicePreview, "viewport:"],
];

describe("responsive catalogue and routes", () => {
  it("defines five viewports and resolves all routes", () => {
    expect(VIEWPORTS).toHaveLength(5);
    for (const slug of ["breakpoints", "layouts", "typography", "navigation", "tables", "forms", "device-preview"]) {
      expect(resolveRoute(`#/responsive/${slug}`).def?.demoId).toBe(`resp-${slug}`);
    }
  });

  it.each(ALL)("%s renders its working demo", (_slug, Demo, marker) => {
    const { unmount } = render(<Demo />);
    expect(screen.getByText(marker, { exact: false })).toBeInTheDocument();
    unmount();
  });
});

describe("breakpoint logic", () => {
  it("bins widths at content-driven points", () => {
    expect(layoutFor(320)).toBe("single");
    expect(layoutFor(479)).toBe("single");
    expect(layoutFor(480)).toBe("double");
    expect(layoutFor(768)).toBe("double");
    expect(layoutFor(900)).toBe("quad");
    expect(layoutFor(1440)).toBe("quad");
  });

  it("preset changes the live readout and layout", async () => {
    const user = userEvent.setup();
    render(<BreakpointsDemo />);
    await user.click(screen.getByRole("button", { name: "320px" }));
    expect(screen.getByText(/320px → single column/i)).toBeInTheDocument();
    expect(screen.getByText(/\(measured\)|\(target\)/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "1024px" }));
    expect(screen.getByText(/1024px → four columns/i)).toBeInTheDocument();
  });

  it("slider drag updates the readout", () => {
    render(<BreakpointsDemo />);
    fireEvent.change(screen.getByLabelText("Preview width width in pixels"), { target: { value: "390" } });
    expect(screen.getByText(/390px → single column/i)).toBeInTheDocument();
  });
});

describe("device preview", () => {
  it("presets, custom sizes and reset all update dimensions", async () => {
    const user = userEvent.setup();
    render(<DevicePreview />);
    expect(screen.getByText("viewport: 360 × 640px")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Tablet" }));
    expect(screen.getByText("viewport: 768 × 1024px")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Custom width"), { target: { value: "500" } });
    expect(screen.getByText("viewport: 500 × 640px")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /reset 360×640/i }));
    expect(screen.getByText("viewport: 360 × 640px")).toBeInTheDocument();
  });

  it("preview content stays interactive at any size", async () => {
    const user = userEvent.setup();
    render(<DevicePreview />);
    await user.click(screen.getByRole("button", { name: "Laptop" }));
    await user.click(screen.getByRole("button", { name: /review queue/i }));
    expect(screen.getByRole("button", { name: /review queue/i })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("responsive patterns", () => {
  it("navigation collapses to a drawer under 560px", async () => {
    const user = userEvent.setup();
    render(<RespNavDemo />);
    expect(screen.getByRole("navigation", { name: "Demo" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Navigation preview width in pixels"), { target: { value: "360" } });
    const open = screen.getByRole("button", { name: "Open menu" });
    await user.click(open);
    expect(screen.getByRole("dialog", { name: /demo menu/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
  });

  it("tables switch strategies with semantics kept", async () => {
    const user = userEvent.setup();
    render(<RespTablesDemo />);
    expect(screen.getByRole("region", { name: /scroll horizontally/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /card list/i }));
    expect(screen.queryByRole("region", { name: /scroll horizontally/i })).not.toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /priority columns/i }));
    // owner folded into the row, not discarded
    expect(screen.getByText(/amara k\./i)).toBeInTheDocument();
  });

  it("forms validate with wrapping errors", async () => {
    const user = userEvent.setup();
    render(<RespFormsDemo />);
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(screen.getByText(/enter your full name/i)).toBeInTheDocument();
  });

  it("overview columns respond to control and viewport", async () => {
    const user = userEvent.setup();
    render(<ResponsiveOverview />);
    await user.click(screen.getByRole("button", { name: /4 cols/i }));
    expect(screen.getByRole("button", { name: /4 cols/i })).toHaveAttribute("aria-pressed", "true");
  });
});
