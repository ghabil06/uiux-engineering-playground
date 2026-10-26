import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { semantic, primitive, token } from "../design-system/tokens";
import { contrastRatio } from "../lib/core";
import { Btn, Badge, Field, inputCls } from "../components/ui";
import { Switch, Dialog, IconButton } from "../components/foundation";

describe("Design System Semantic Tokens & Contrast", () => {
  it("defines matching semantic token keys for light and dark themes", () => {
    const lightKeys = Object.keys(semantic.light).sort();
    const darkKeys = Object.keys(semantic.dark).sort();
    expect(lightKeys).toEqual(darkKeys);
  });

  it("exceeds WCAG 2.2 AA contrast for primary body text in light mode", () => {
    const ratio = contrastRatio(semantic.light.text, semantic.light.surface);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("exceeds WCAG 2.2 AA contrast for primary body text in dark mode", () => {
    const ratio = contrastRatio(semantic.dark.text, "#0a0a12");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("token() helper accurately reads active theme tokens", () => {
    expect(token("action", "light")).toBe(primitive.violet[600]);
    expect(token("action", "dark")).toBe(primitive.cyan[400]);
  });
});

describe("Component Variants & Interaction States", () => {
  describe("Btn", () => {
    it("renders primary variant with semantic styling", () => {
      render(<Btn variant="primary">Submit</Btn>);
      const btn = screen.getByRole("button", { name: "Submit" });
      expect(btn).toHaveClass("bg-violet-600");
    });

    it("renders danger variant with semantic rose styling", () => {
      render(<Btn variant="danger">Delete</Btn>);
      const btn = screen.getByRole("button", { name: "Delete" });
      expect(btn).toHaveClass("bg-rose-600");
    });

    it("respects disabled state and prevents click handler invocation", () => {
      const handleClick = vi.fn();
      render(<Btn disabled onClick={handleClick}>Disabled Action</Btn>);
      const btn = screen.getByRole("button", { name: "Disabled Action" });
      expect(btn).toBeDisabled();
      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("applies size classes accurately", () => {
      const { rerender } = render(<Btn size="sm">Small</Btn>);
      expect(screen.getByRole("button", { name: "Small" })).toHaveClass("h-8");

      rerender(<Btn size="lg">Large</Btn>);
      expect(screen.getByRole("button", { name: "Large" })).toHaveClass("h-12");
    });
  });

  describe("IconButton", () => {
    it("requires and applies accessible aria-label", () => {
      render(<IconButton label="Close panel">✕</IconButton>);
      const btn = screen.getByRole("button", { name: "Close panel" });
      expect(btn).toBeInTheDocument();
    });
  });

  describe("Badge", () => {
    it("renders tone styling for status indicators", () => {
      const { rerender } = render(<Badge tone="emerald">Active</Badge>);
      expect(screen.getByText("Active")).toHaveClass("bg-emerald-100");

      rerender(<Badge tone="rose">Critical</Badge>);
      expect(screen.getByText("Critical")).toHaveClass("bg-rose-100");
    });
  });

  describe("Switch", () => {
    it("manages role=switch and toggles aria-checked", () => {
      let isChecked = false;
      const handleChange = vi.fn((val) => { isChecked = val; });

      const { rerender } = render(
        <Switch label="Dark mode" checked={isChecked} onChange={handleChange} />
      );

      const toggle = screen.getByRole("switch", { name: "Dark mode" });
      expect(toggle).toHaveAttribute("aria-checked", "false");

      fireEvent.click(toggle);
      expect(handleChange).toHaveBeenCalledWith(true);

      rerender(<Switch label="Dark mode" checked={true} onChange={handleChange} />);
      expect(toggle).toHaveAttribute("aria-checked", "true");
    });
  });

  describe("Field & Validation", () => {
    it("renders label, input, and accessible error message with role=alert", () => {
      render(
        <Field label="Email Address" error="Please enter a valid email" htmlFor="test-email">
          <input id="test-email" className={inputCls("Please enter a valid email")} />
        </Field>
      );

      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Please enter a valid email");
    });
  });

  describe("Dialog", () => {
    it("sets role=dialog, aria-modal, and responds to Escape key", () => {
      const handleClose = vi.fn();
      render(
        <Dialog title="Discard draft?" desc="Unsaved changes will be lost." onClose={handleClose}>
          <button onClick={handleClose}>Cancel</button>
        </Dialog>
      );

      const dialog = screen.getByRole("dialog", { name: "Discard draft?" });
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-modal", "true");

      // Press Escape
      fireEvent.keyDown(document, { key: "Escape" });
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
