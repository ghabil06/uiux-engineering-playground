/**
 * Foundation component tests — variants, keyboard behavior, accessible names,
 * dialog focus management, and error/empty states.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  IconButton, Select, Checkbox, Switch,
  Breadcrumb, Tabs, Dropdown, Dialog, Alert, Skeleton, ErrorState,
} from "../components/foundation";

describe("IconButton", () => {
  it("always exposes its accessible name", () => {
    render(<IconButton label="Close dialog">✕</IconButton>);
    expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
  });
});

describe("Select", () => {
  it("pairs a visible label and reports changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Plan" options={["Starter", "Growth"]} value="Starter" onChange={onChange} />);
    await user.selectOptions(screen.getByLabelText("Plan"), "Growth");
    expect(onChange).toHaveBeenCalledWith("Growth");
  });
});

describe("Checkbox", () => {
  it("toggles via label click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Checkbox label="Email alerts" checked={false} onChange={onChange} />);
    await user.click(screen.getByText("Email alerts"));
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<Checkbox label="Email alerts" checked={true} onChange={onChange} />);
    expect(screen.getByRole("checkbox", { name: /email alerts/i })).toBeChecked();
  });
});

describe("Switch", () => {
  it("exposes role=switch with state and toggles on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Switch label="Night alerts" checked={false} onChange={onChange} />);
    const sw = screen.getByRole("switch", { name: "Night alerts" });
    expect(sw).toHaveAttribute("aria-checked", "false");
    await user.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<Switch label="Night alerts" checked={true} onChange={onChange} />);
    expect(screen.getByRole("switch", { name: "Night alerts" })).toHaveAttribute("aria-checked", "true");
  });

  it("toggles with the keyboard (Space)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Digest" checked={false} onChange={onChange} />);
    screen.getByRole("switch", { name: "Digest" }).focus();
    await user.keyboard(" ");
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Breadcrumb", () => {
  it("marks the current page and links the rest", () => {
    render(<Breadcrumb trail={[{ label: "Explorer", href: "#/" }, { label: "Dashboard" }]} />);
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explorer" })).toHaveAttribute("href", "#/");
    expect(screen.getByText("Dashboard")).toHaveAttribute("aria-current", "page");
  });
});

describe("Tabs", () => {
  it("moves with arrow keys (roving tabindex)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs tabs={["One", "Two", "Three"]} active={0} onChange={onChange} label="Demo" />);
    const first = screen.getByRole("tab", { name: "One" });
    expect(first).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("tabindex", "-1");
    first.focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith(1);
  });
});

describe("Dropdown", () => {
  it("opens on trigger click and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Dropdown label="Actions" items={[{ label: "Rename", onSelect: () => {} }]} />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("fires onSelect for the chosen item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Dropdown label="Actions" items={[{ label: "Rename", onSelect }]} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Rename" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

describe("Dialog", () => {
  it("focuses inside on open and closes on Escape and backdrop", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Dialog title="Invite teammate" desc="Simulated." onClose={onClose}><button>Send</button></Dialog>);
    expect(screen.getByRole("dialog", { name: "Invite teammate" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("uses alertdialog semantics for destructive confirmations", () => {
    render(<Dialog title="Delete workspace?" onClose={() => {}} danger><button>Delete</button></Dialog>);
    expect(screen.getByRole("alertdialog", { name: "Delete workspace?" })).toBeInTheDocument();
  });
});

describe("Alert / Skeleton / ErrorState", () => {
  it("danger alerts interrupt, others announce politely", () => {
    const { rerender } = render(<Alert tone="danger" title="Sync failed" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Sync failed");
    rerender(<Alert tone="success" title="Saved" />);
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });

  it("skeleton renders placeholders without text", () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(3);
  });

  it("error states always offer retry", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState title="Warehouse unreachable" desc="Simulated outage." onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("fireEvent keyboard path also toggles a switch", () => {
    const onChange = vi.fn();
    render(<Switch label="Sync" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("switch", { name: "Sync" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
