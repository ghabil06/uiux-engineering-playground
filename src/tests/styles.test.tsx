/**
 * Style Laboratory tests — 12 routes render, gallery search/filter/sort,
 * comparison select/remove/replace, density control, working controls,
 * keyboard/focus behavior, and overflow guards.
 */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { resolveRoute } from "../lib/routes";
import { STYLE_DEFS, STYLE_SLUGS, styleDef } from "../styles/defs";
import StylesGallery from "../styles/gallery";
import StylesCompare from "../styles/compare";
import MinimalismDemo from "../styles/minimalism";
import LightUIDemo from "../styles/light-ui";
import DarkUIDemo from "../styles/dark-ui";
import BentoDemo from "../styles/bento-grid";
import GlassDemo from "../styles/glassmorphism";
import NeoDemo from "../styles/neumorphism";
import SwissDemo from "../styles/swiss-grid";
import BrutalDemo from "../styles/brutalism";
import EditorialDemo from "../styles/editorial";
import FlatDemo from "../styles/flat-design";
import MaterialDemo from "../styles/material-inspired";
import DenseDemo from "../styles/data-dense";

const ALL_DEMOS: [string, React.ComponentType][] = [
  ["minimalism", MinimalismDemo],
  ["light-ui", LightUIDemo],
  ["dark-ui", DarkUIDemo],
  ["bento-grid", BentoDemo],
  ["glassmorphism", GlassDemo],
  ["neumorphism", NeoDemo],
  ["swiss-grid", SwissDemo],
  ["brutalism", BrutalDemo],
  ["editorial", EditorialDemo],
  ["flat-design", FlatDemo],
  ["material-inspired", MaterialDemo],
  ["data-dense", DenseDemo],
];

describe("style routes", () => {
  it("registers all 12 slugs with metadata and resolvable routes", () => {
    expect(STYLE_SLUGS).toHaveLength(12);
    expect(STYLE_DEFS).toHaveLength(12);
    for (const slug of STYLE_SLUGS) {
      const { def } = resolveRoute(`#/styles/${slug}`);
      expect(def?.demoId).toBe(`style-${slug}`);
    }
    expect(resolveRoute("#/styles").def?.title).toMatch(/gallery/i);
    expect(resolveRoute("#/styles/compare").def?.path).toBe("#/styles/compare");
  });

  it("styleDef throws honestly on unknown slugs", () => {
    expect(() => styleDef("nope")).toThrow(/unknown style slug/i);
  });

  it.each(ALL_DEMOS)("%s renders the workspace scenario with working actions", (slug, Demo) => {
    const { unmount } = render(<Demo />);
    // Same scenario everywhere: editable project name + primary action + tabs
    expect(screen.getByLabelText("Project name")).toHaveDisplayValue("Atlas Website Redesign");
    expect(screen.getByRole("button", { name: /new task/i })).toBeInTheDocument();
    expect(screen.getByRole("tablist", { name: /workspace views/i })).toBeInTheDocument();
    // Progress is exposed with real semantics
    expect(screen.getByRole("progressbar", { name: /project progress/i })).toBeInTheDocument();
    expect(slug).toBeTruthy();
    unmount();
  });
});

describe("gallery", () => {
  it("lists all 12 styles in recommended order by default", () => {
    render(<StylesGallery />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(12);
    expect(within(cards[0]).getByRole("heading").textContent).toBe("Minimalism");
  });

  it("searches by name, tagline and traits", async () => {
    const user = userEvent.setup();
    render(<StylesGallery />);
    await user.type(screen.getByLabelText("Search styles"), "glass");
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(1);
    expect(within(cards[0]).getByRole("heading").textContent).toBe("Glassmorphism");
  });

  it("filters by family", async () => {
    const user = userEvent.setup();
    render(<StylesGallery />);
    await user.click(screen.getByRole("button", { name: "Expressive" }));
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });

  it("sorts alphabetically on demand", async () => {
    const user = userEvent.setup();
    render(<StylesGallery />);
    await user.click(screen.getByRole("button", { name: "A–Z" }));
    const cards = screen.getAllByRole("article");
    expect(within(cards[0]).getByRole("heading").textContent).toBe("Bento Grid");
  });

  it("shows an empty state with reset and recovers", async () => {
    const user = userEvent.setup();
    render(<StylesGallery />);
    await user.type(screen.getByLabelText("Search styles"), "zzz-no-such-style");
    expect(screen.getByText(/no styles match/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /reset search & filters/i }));
    expect(screen.getAllByRole("article")).toHaveLength(12);
  });

  it("links every card to its independent route", () => {
    render(<StylesGallery />);
    const link = screen.getByRole("link", { name: /explore the brutalism style demo/i });
    expect(link).toHaveAttribute("href", "#/styles/brutalism");
  });
});

describe("comparison", () => {
  it("starts with two styles and shows the criteria matrix", () => {
    render(<StylesCompare />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("Minimalism")).toBeInTheDocument();
    expect(within(table).getByText("Brutalism")).toBeInTheDocument();
    expect(within(table).getByText("Typography")).toBeInTheDocument();
  });

  it("removes a style and asks for a replacement", async () => {
    const user = userEvent.setup();
    render(<StylesCompare />);
    await user.click(screen.getByRole("button", { name: "Remove Brutalism from comparison" }));
    expect(screen.getByText(/is lonely/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("adds a replacement style", async () => {
    const user = userEvent.setup();
    render(<StylesCompare />);
    await user.click(screen.getByRole("button", { name: "Remove Brutalism from comparison" }));
    await user.click(screen.getByRole("button", { name: /glassmorphism/i }));
    const table = screen.getByRole("table");
    expect(within(table).getByText("Glassmorphism")).toBeInTheDocument();
  });

  it("offers an empty state before anything is selected", async () => {
    const user = userEvent.setup();
    render(<StylesCompare />);
    await user.click(screen.getByRole("button", { name: /clear all/i }));
    expect(screen.getByText(/nothing to compare yet/i)).toBeInTheDocument();
  });

  it("renders both live previews with the same underlying data", () => {
    const { container } = render(<StylesCompare />);
    // Both previews render the same deterministic task titles
    const hits = Array.from(container.querySelectorAll("li, button")).filter((el) =>
      el.textContent?.includes("Design homepage hero variants"),
    );
    expect(hits.length).toBeGreaterThanOrEqual(2);
  });
});

describe("density control (data-dense)", () => {
  it("switches Compact / Comfortable / Spacious visibly", async () => {
    const user = userEvent.setup();
    const { container } = render(<DenseDemo />);
    const root = container.querySelector("[data-density]")!;
    expect(root.getAttribute("data-density")).toBe("compact");
    await user.click(screen.getByRole("tab", { name: "tasks" }));
    await user.click(screen.getByRole("button", { name: /spacious density/i }));
    expect(root.getAttribute("data-density")).toBe("spacious");
    expect(container.querySelector("tbody td")!.className).toMatch(/py-3\.5/);
    await user.click(screen.getByRole("button", { name: /comfortable density/i }));
    expect(root.getAttribute("data-density")).toBe("comfortable");
  });

  it("sorts the dense table by due date with announced direction", async () => {
    const user = userEvent.setup();
    render(<DenseDemo />);
    await user.click(screen.getByRole("tab", { name: "tasks" }));
    const sort = screen.getByRole("button", { name: /due/i });
    expect(sort).toHaveAttribute("aria-sort", "ascending");
    await user.click(sort);
    expect(sort).toHaveAttribute("aria-sort", "descending");
  });
});

describe("workspace interactions (minimalism)", () => {
  it("toggles a task and announces success", async () => {
    const user = userEvent.setup();
    render(<MinimalismDemo />);
    await user.click(screen.getByRole("tab", { name: "tasks" }));
    const box = screen.getByRole("checkbox", { name: /migrate pricing page to cms/i });
    await user.click(box);
    expect(box).toBeChecked();
    expect(screen.getByRole("status")).toHaveTextContent(/marked done/i);
  });

  it("searches and filters tasks, with an honest empty state", async () => {
    const user = userEvent.setup();
    render(<MinimalismDemo />);
    await user.click(screen.getByRole("tab", { name: "tasks" }));
    await user.type(screen.getByLabelText("Search tasks"), "checkout");
    expect(screen.getByText(/fix checkout focus trap on mobile/i)).toBeInTheDocument();
    expect(screen.queryByText(/migrate pricing page/i)).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search tasks"), { target: { value: "zzz-nothing" } });
    expect(screen.getByText(/no tasks match/i)).toBeInTheDocument();
  });

  it("renames the project inline", () => {
    render(<MinimalismDemo />);
    const name = screen.getByLabelText("Project name");
    fireEvent.change(name, { target: { value: "New Horizon" } });
    expect(name).toHaveDisplayValue("New Horizon");
  });

  it("adds a task with feedback", async () => {
    const user = userEvent.setup();
    render(<MinimalismDemo />);
    await user.click(screen.getByRole("tab", { name: "tasks" }));
    await user.click(screen.getByRole("button", { name: /new task/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/added locally/i);
  });

  it("opens a labelled dialog with initial focus and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<MinimalismDemo />);
    await user.click(screen.getByRole("button", { name: /design homepage hero variants/i }));
    expect(screen.getByRole("dialog", { name: /design homepage hero variants/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("simulates loading and error with recovery", async () => {
    const user = userEvent.setup();
    render(<MinimalismDemo />);
    await user.click(screen.getByRole("tab", { name: "tasks" }));
    await user.click(screen.getByRole("button", { name: /refresh.*loading demo/i }));
    expect(screen.getByLabelText(/loading tasks/i)).toBeInTheDocument();
    expect(await screen.findByText(/reloaded from local demo data/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /simulate error/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/simulated 500/);
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByText(/reloaded from local demo data/i)).toBeInTheDocument();
  });
});

describe("responsive guards", () => {
  it("dense table scrolls horizontally instead of overflowing the page", async () => {
    const user = userEvent.setup();
    const { container } = render(<DenseDemo />);
    await user.click(screen.getByRole("tab", { name: "tasks" }));
    const table = container.querySelector("table")!;
    const scroller = table.parentElement!;
    expect(scroller.className).toMatch(/overflow-x-auto/);
  });

  it("every demo root stays fluid (no fixed pixel widths)", () => {
    for (const [, Demo] of ALL_DEMOS) {
      const { container, unmount } = render(<Demo />);
      const fixed = Array.from(container.querySelectorAll("[class]")).filter((el) =>
        /(^|\s)(w|min-w)-\[\d+px\]/.test(el.getAttribute("class") ?? ""),
      );
      expect(fixed.map((el) => el.textContent?.slice(0, 40))).toEqual([]);
      unmount();
    }
  });
});
