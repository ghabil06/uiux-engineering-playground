/**
 * Explorer tests — search, category/difficulty/style filters, empty state, reset.
 * Behavior-driven: what the user sees, not implementation details.
 */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Explorer from "../pages/Explorer";

const searchBox = () => screen.getByRole("textbox", { name: /search demo catalogue/i });

describe("Explorer", () => {
  it("renders the introduction, search and all 90 demo cards", () => {
    render(<Explorer />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/playground/i);
    expect(searchBox()).toBeInTheDocument();
    expect(screen.getAllByText(/open demo/i)).toHaveLength(90);
  });

  it("searches the catalogue as the user types", async () => {
    const user = userEvent.setup();
    render(<Explorer />);
    await user.type(searchBox(), "cart");
    expect(screen.getByText("E-commerce Store")).toBeInTheDocument();
    expect(screen.queryByText("Marketing Website")).not.toBeInTheDocument();
    expect(screen.getByText(/1 result/i)).toBeInTheDocument();
  });

  it("shows an actionable empty state with recovery for no matches", async () => {
    const user = userEvent.setup();
    render(<Explorer />);
    await user.type(searchBox(), "zzz-no-such-demo");
    expect(screen.getByText(/no demos match/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /clear search & filters/i }));
    expect(screen.getAllByText(/open demo/i)).toHaveLength(90);
  });

  it("filters by category with a loading state", async () => {
    const user = userEvent.setup();
    render(<Explorer />);
    await user.click(screen.getByRole("button", { name: "Product Types" }));
    expect(screen.getByLabelText(/loading demos/i)).toBeInTheDocument();
    expect(await screen.findByText("Enterprise Dashboard")).toBeInTheDocument();
    expect(screen.getAllByText(/open demo/i)).toHaveLength(7);
    expect(screen.queryByText("AI Interaction Studio")).not.toBeInTheDocument();
  });

  it("filters by difficulty", async () => {
    const user = userEvent.setup();
    render(<Explorer />);
    await user.click(screen.getByRole("button", { name: "Beginner" }));
    expect(await screen.findByText("Marketing Website")).toBeInTheDocument();
    expect(screen.getAllByText(/open demo/i)).toHaveLength(33);
  });

  it("filters by visual style", async () => {
    const user = userEvent.setup();
    render(<Explorer />);
    await user.click(screen.getByRole("button", { name: "Dense" }));
    expect(await screen.findByText("Enterprise Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Marketing Website")).not.toBeInTheDocument();
  });

  it("reset restores the full catalogue", async () => {
    const user = userEvent.setup();
    render(<Explorer />);
    fireEvent.change(searchBox(), { target: { value: "drift" } });
    expect(screen.getAllByText(/open demo/i)).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: /reset filters/i }));
    expect(screen.getAllByText(/open demo/i)).toHaveLength(90);
  });

  it("every card links to a real route and names its difficulty", () => {
    render(<Explorer />);
    const links = screen.getAllByText(/open demo/i).map((el) => el.closest("a")!);
    expect(links.every((a) => a.getAttribute("href")?.startsWith("#/"))).toBe(true);
    expect(screen.getAllByText("Beginner").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Advanced").length).toBeGreaterThan(0);
  });
});
