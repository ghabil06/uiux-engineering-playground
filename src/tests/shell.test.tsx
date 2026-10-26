/**
 * Shell tests — theme switching, mobile navigation, breadcrumbs, brand link.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Shell, useTheme } from "../components/shell";
import { THEME_STORAGE_KEY } from "../design-system/tokens";

function Probe() {
  const { dark, setDark } = useTheme();
  return (
    <button onClick={() => setDark(!dark)}>
      {dark ? "dark-on" : "dark-off"}
    </button>
  );
}

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });
  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("toggles the theme class on <html> and persists the choice", async () => {
    const user = userEvent.setup();
    render(<Probe />);
    const btn = screen.getByRole("button", { name: "dark-off" });
    await user.click(btn);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(screen.getByRole("button", { name: "dark-on" })).toBeInTheDocument();
  });

  it("initializes from storage (pre-paint script contract)", async () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    const user = userEvent.setup();
    render(<Probe />);
    // effect applies the class on mount, matching the index.html pre-paint script
    expect(await screen.findByRole("button", { name: "dark-on" })).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    await user.click(screen.getByRole("button", { name: "dark-on" }));
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });
});

describe("Shell", () => {
  it("exposes brand home navigation and a named theme control", async () => {
    const user = userEvent.setup();
    const setDark = vi.fn();
    render(<Shell route="#/" dark={false} setDark={setDark}><p>child</p></Shell>);
    const brand = screen.getByRole("link", { name: /prism/i });
    expect(brand).toHaveAttribute("href", "#/");
    await user.click(screen.getByRole("button", { name: /switch to dark theme/i }));
    expect(setDark).toHaveBeenCalledWith(true);
  });

  it("announces the dark-state theme control correctly", () => {
    render(<Shell route="#/" dark={true} setDark={() => {}}><p>child</p></Shell>);
    expect(screen.getByRole("button", { name: /switch to light theme/i })).toBeInTheDocument();
  });

  it("toggles the mobile navigation drawer", async () => {
    const user = userEvent.setup();
    render(<Shell route="#/" dark={false} setDark={() => {}}><p>child</p></Shell>);
    const aside = document.querySelector("aside")!;
    expect(aside.className).not.toMatch(/fixed/);
    await user.click(screen.getByRole("button", { name: /toggle navigation/i }));
    expect(document.querySelector("aside")!.className).toMatch(/fixed/);
  });

  it("shows breadcrumbs with aria-current on demo routes only", () => {
    const { unmount } = render(<Shell route="#/product/dashboard" dark={false} setDark={() => {}}><p>child</p></Shell>);
    const crumbs = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(crumbs).toBeInTheDocument();
    expect(within(crumbs).getByText("Enterprise Dashboard")).toHaveAttribute("aria-current", "page");
    unmount();
    render(<Shell route="#/" dark={false} setDark={() => {}}><p>child</p></Shell>);
    expect(screen.queryByRole("navigation", { name: /breadcrumb/i })).not.toBeInTheDocument();
  });
});
