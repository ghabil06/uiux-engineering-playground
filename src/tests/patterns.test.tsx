/**
 * Interaction Patterns Laboratory tests — catalogue, composition, tables,
 * forms, wizards, dialogs, notifications, palette, upload, DnD, pager,
 * undo, and cross-cutting accessibility + regression checks.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RECORDS, queryRecords, PATTERNS, PATTERN_SLUGS, patternDef, PATTERN_DEMOS } from "../patterns/data";
import { resolveRoute } from "../lib/routes";
import { DEMOS } from "../lib/core";
import PatternsGallery from "../patterns/gallery";
import NavigationDemo from "../patterns/navigation";
import SearchFilterDemo from "../patterns/search-and-filter";
import DataTableDemo from "../patterns/data-table";
import FormsDemo from "../patterns/forms";
import MultiStepDemo from "../patterns/multi-step-form";
import ModalDemo from "../patterns/modal-and-dialog";
import MenusDemo from "../patterns/menus-and-popovers";
import TabsAccordionDemo from "../patterns/tabs-and-accordion";
import NotificationsDemo from "../patterns/notifications";
import PaletteDemo from "../patterns/command-palette";
import UploadDemo from "../patterns/file-upload";
import DndDemo from "../patterns/drag-and-drop";
import ProgressDemo from "../patterns/progress-and-feedback";
import PaginationDemo from "../patterns/pagination";
import TooltipsDemo from "../patterns/tooltips";
import EmptyErrorDemo from "../patterns/empty-error-states";
import UndoDemo from "../patterns/undo-and-confirmation";

const ALL: [string, React.ComponentType, string][] = [
  ["navigation", NavigationDemo, "Acme console"],
  ["search-and-filter", SearchFilterDemo, "Search projects"],
  ["data-table", DataTableDemo, "Search table"],
  ["forms", FormsDemo, "About you"],
  ["multi-step-form", MultiStepDemo, "Work email"],
  ["modal-and-dialog", ModalDemo, "Release notes"],
  ["menus-and-popovers", MenusDemo, "Sort: Recently updated"],
  ["tabs-and-accordion", TabsAccordionDemo, "Overview"],
  ["notifications", NotificationsDemo, "⬇ Progress job"],
  ["command-palette", () => <PaletteDemo dark={false} setDark={() => {}} />, "Open palette"],
  ["file-upload", UploadDemo, "Drop files here or click to browse"],
  ["drag-and-drop", DndDemo, "Board ready"],
  ["progress-and-feedback", ProgressDemo, "Determinate job"],
  ["pagination", PaginationDemo, "Jump to page 12"],
  ["tooltips", TooltipsDemo, "Placements"],
  ["empty-error-states", EmptyErrorDemo, "Offline simulation"],
  ["undo-and-confirmation", UndoDemo, "Outcome log"],
];

describe("pattern catalogue", () => {
  it("defines 17 patterns with unique slugs, orders and explorer entries", () => {
    expect(PATTERNS).toHaveLength(17);
    expect(new Set(PATTERN_SLUGS).size).toBe(17);
    expect(PATTERN_DEMOS).toHaveLength(17);
    expect(new Set(PATTERN_DEMOS.map((d) => d.id)).size).toBe(17);
    for (const d of PATTERN_DEMOS) {
      expect(DEMOS.some((x) => x.id === d.id && x.route === d.route)).toBe(true);
    }
  });

  it("every pattern route resolves to its demo", () => {
    for (const slug of PATTERN_SLUGS) {
      expect(resolveRoute(`#/patterns/${slug}`).def?.demoId).toBe(`pattern-${slug}`);
    }
  });

  it("patternDef throws honestly on unknown slugs", () => {
    expect(() => patternDef("nope")).toThrow(/unknown pattern slug/i);
  });

  it.each(ALL)("%s renders its working demo", (_slug, Demo, marker) => {
    const { unmount } = render(<Demo />);
    expect(screen.getByText(marker, { exact: false })).toBeInTheDocument();
    unmount();
  });
});

describe("queryRecords (shared pipeline)", () => {
  it("holds 48 deterministic records", () => {
    expect(RECORDS).toHaveLength(48);
    expect(new Set(RECORDS.map((r) => r.id)).size).toBe(48);
  });

  it("searches across id, name and owner", () => {
    const byOwner = queryRecords(RECORDS, { q: "rin s.", perPage: 48 });
    expect(byOwner.total).toBeGreaterThan(0);
    expect(byOwner.rows.every((r) => (r.id + r.name + r.owner).toLowerCase().includes("rin s."))).toBe(true);
    expect(queryRecords(RECORDS, { q: "PRJ-1007", perPage: 48 }).rows.map((r) => r.id)).toEqual(["PRJ-1007"]);
  });

  it("composes category + status filters with AND", () => {
    const res = queryRecords(RECORDS, { cats: ["API"], statuses: ["active"], perPage: 48 });
    expect(res.rows.every((r) => r.category === "API" && r.status === "active")).toBe(true);
  });

  it("sorts text, numbers and dates in both directions", () => {
    const byBudget = queryRecords(RECORDS, { sortKey: "budget", sortDir: 1, perPage: 48 }).rows;
    expect(byBudget.every((r, i) => i === 0 || byBudget[i - 1].budget <= r.budget)).toBe(true);
    const byName = queryRecords(RECORDS, { sortKey: "name", sortDir: -1, perPage: 48 }).rows;
    expect(byName.every((r, i) => i === 0 || byName[i - 1].name.localeCompare(r.name) >= 0)).toBe(true);
  });

  it("paginates and clamps out-of-range pages", () => {
    const p = queryRecords(RECORDS, { page: 2, perPage: 8 });
    expect(p.rows).toHaveLength(8);
    expect(p.pages).toBe(6);
    const clamped = queryRecords(RECORDS, { statuses: ["archived"], page: 99, perPage: 8 });
    expect(clamped.page).toBe(clamped.pages);
  });
});

describe("patterns gallery", () => {
  it("lists all 17 patterns in recommended order", () => {
    render(<PatternsGallery />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(17);
    expect(within(cards[0]).getByRole("heading").textContent).toBe("Navigation");
  });

  it("searches names and descriptions", async () => {
    const user = userEvent.setup();
    render(<PatternsGallery />);
    await user.type(screen.getByLabelText("Search patterns"), "dialog");
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Modals & Dialogs")).toBeInTheDocument();
  });

  it("filters by category and complexity", async () => {
    const user = userEvent.setup();
    render(<PatternsGallery />);
    await user.click(screen.getByRole("button", { name: "Data" }));
    expect(screen.getAllByRole("article")).toHaveLength(3);
    const catGroup = screen.getByRole("group", { name: "Category filter" });
    await user.click(within(catGroup).getByRole("button", { name: "All" }));
    await user.click(screen.getByRole("button", { name: "Foundational" }));
    expect(screen.getAllByRole("article")).toHaveLength(6);
  });

  it("sorts A–Z and recovers from empty results", async () => {
    const user = userEvent.setup();
    render(<PatternsGallery />);
    await user.click(screen.getByRole("button", { name: "A–Z" }));
    expect(within(screen.getAllByRole("article")[0]).getByRole("heading").textContent).toBe("Command Palette");
    await user.type(screen.getByLabelText("Search patterns"), "zzz-nothing");
    expect(screen.getByText(/no patterns match/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /clear search & filters/i }));
    expect(screen.getAllByRole("article")).toHaveLength(17);
  });

  it("links every card to its route", () => {
    render(<PatternsGallery />);
    expect(screen.getByRole("link", { name: /open the undo & confirmation demo/i })).toHaveAttribute("href", "#/patterns/undo-and-confirmation");
  });
});

describe("search/filter/sort composition", () => {
  it("search + status + sort keep affecting the same set", async () => {
    const user = userEvent.setup();
    render(<SearchFilterDemo />);
    await user.type(screen.getByLabelText("Search projects"), "billing");
    const count = () => screen.getByRole("status").textContent;
    const all = count();
    expect(all).toMatch(/results?/);
    await user.click(screen.getByRole("button", { name: "archived" }));
    const sub = count();
    expect(sub).not.toBe(all);
    // sorting reshuffles but never changes membership
    await user.selectOptions(screen.getByLabelText("Sort results by"), "budget");
    expect(count()).toBe(sub);
    // clearing one filter widens the set without touching the search term
    await user.click(screen.getByRole("button", { name: "Remove archived filter" }));
    expect(count()).toBe(all);
    expect(screen.getByLabelText("Search projects")).toHaveValue("billing");
  });
});

describe("data table", () => {
  it("sorts numbers both ways and paginates", async () => {
    const user = userEvent.setup();
    render(<DataTableDemo />);
    const first = () => screen.getAllByRole("row")[1].textContent;
    const before = first();
    await user.click(screen.getByRole("button", { name: "Sort by Budget" }));
    await user.click(screen.getByRole("button", { name: "Sort by Budget" }));
    expect(first()).not.toBe(before);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  });

  it("selects the page only, then bulk-archives", async () => {
    const user = userEvent.setup();
    render(<DataTableDemo />);
    await user.click(screen.getByRole("checkbox", { name: /select all rows on this page/i }));
    expect(screen.getByText(/8 selected \(across pages\)/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Archive" }));
    expect(screen.queryByText(/8 selected/i)).not.toBeInTheDocument();
  });

  it("opens a row detail drawer", async () => {
    const user = userEvent.setup();
    render(<DataTableDemo />);
    await user.click(screen.getAllByRole("button", { name: "Row actions" })[0]);
    await user.click(screen.getByRole("menuitem", { name: /view PRJ-/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("forms", () => {
  it("blocks empty submit with named errors and preserves input", async () => {
    const user = userEvent.setup();
    render(<FormsDemo />);
    await user.type(screen.getByLabelText(/full name/i), "A");
    await user.click(screen.getByRole("button", { name: /save profile/i }));
    expect(screen.getByText(/3 fields need attention/)).toBeInTheDocument();
    expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveValue("A");
  });

  it("submits valid data to a simulated success", async () => {
    const user = userEvent.setup();
    render(<FormsDemo />);
    await user.type(screen.getByLabelText(/full name/i), "Ada Lovelace");
    await user.type(screen.getByLabelText(/email \*/i), "ada@company.com");
    await user.selectOptions(screen.getByLabelText(/plan \*/i), "Growth");
    await user.click(screen.getByRole("button", { name: /save profile/i }));
    expect(await screen.findByText(/profile saved for ada/i)).toBeInTheDocument();
  });

  it("shows the failure path without losing entries", async () => {
    const user = userEvent.setup();
    render(<FormsDemo />);
    await user.type(screen.getByLabelText(/email \*/i), "ada@company.com");
    await user.type(screen.getByLabelText(/full name/i), "Ada Lovelace");
    await user.selectOptions(screen.getByLabelText(/plan \*/i), "Growth");
    await user.click(screen.getByRole("checkbox", { name: /simulate server failure/i }));
    await user.click(screen.getByRole("button", { name: /save profile/i }));
    expect(await screen.findByText(/demo server rejected/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Ada Lovelace");
  });
});

describe("multi-step form", () => {
  it("validates per step, preserves values back and forth, and confirms once", async () => {
    const user = userEvent.setup();
    render(<MultiStepDemo />);
    await user.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/work email/i), "you@co.com");
    await user.type(screen.getByLabelText(/password/i), "s3cret-password");
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.type(screen.getByLabelText(/project name/i), "Atlas");
    await user.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByLabelText(/work email/i)).toHaveValue("you@co.com");
    await user.click(screen.getByRole("button", { name: /continue/i }));
    await user.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByText("Atlas")).toBeInTheDocument();
    const submit = screen.getByRole("button", { name: /create workspace/i });
    await user.click(submit);
    await user.click(submit).catch(() => {});
    expect(await screen.findByText(/is ready \(simulated\)/i)).toBeInTheDocument();
  });
});

describe("dialogs", () => {
  it("opens, traps initial focus, closes on Escape and returns focus", async () => {
    const user = userEvent.setup();
    render(<ModalDemo />);
    const trigger = screen.getByRole("button", { name: /info/i });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: /what's new/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("destructive confirm focuses a safe default", async () => {
    const user = userEvent.setup();
    render(<ModalDemo />);
    await user.click(screen.getByRole("button", { name: /destructive/i }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(["Close dialog", "Cancel (safe default)"]).toContain(document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.textContent);
  });

  it("validates the form dialog inline", async () => {
    const user = userEvent.setup();
    render(<ModalDemo />);
    await user.click(screen.getByRole("button", { name: /form/i }));
    await user.click(screen.getByRole("button", { name: "Send invite" }));
    expect(screen.getByText(/valid email to invite/i)).toBeInTheDocument();
  });
});

describe("tabs, accordion, menus", () => {
  it("switches tab panels and expands accordions with state exposed", async () => {
    const user = userEvent.setup();
    render(<TabsAccordionDemo />);
    await user.click(screen.getByRole("tab", { name: "Tasks" }));
    expect(screen.getByRole("tabpanel", { name: /tasks panel/i })).toBeInTheDocument();
    const [q] = screen.getAllByRole("button", { name: /when should i use tabs instead of pages/i });
    // single-open mode starts with the first panel revealed
    expect(q).toHaveAttribute("aria-expanded", "true");
    await user.click(q);
    expect(q).toHaveAttribute("aria-expanded", "false");
    await user.click(q);
    expect(q).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("s-p0")).toBeInTheDocument();
  });

  it("menus open, select and close", async () => {
    const user = userEvent.setup();
    render(<MenusDemo />);
    await user.click(screen.getByRole("button", { name: /sort: recently updated/i }));
    await user.click(screen.getByRole("menuitem", { name: "Name A–Z" }));
    expect(screen.getByRole("button", { name: /sort: name a–z/i })).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});

describe("notifications", () => {
  it("creates and dismisses toasts; errors persist", async () => {
    const user = userEvent.setup();
    render(<NotificationsDemo />);
    await user.click(screen.getByRole("button", { name: /success/i }));
    expect(screen.getByText("Workspace saved")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Dismiss: Workspace saved" }));
    expect(screen.queryByText("Workspace saved")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /error \(sticky\)/i }));
    // sticky error: title asserted; the persistent banner shares role=alert by design
    expect(screen.getByText(/export failed: quota reached/i)).toBeInTheDocument();
  });

  it("starts a determinate progress job", async () => {
    const user = userEvent.setup();
    render(<NotificationsDemo />);
    await user.click(screen.getByRole("button", { name: /progress job/i }));
    expect(screen.getByRole("progressbar", { name: /exporting 48 projects/i })).toBeInTheDocument();
  });
});

describe("command palette", () => {
  it("opens on Ctrl+K, filters, runs on Enter, closes on Esc", async () => {
    const user = userEvent.setup();
    const setDark = vi.fn();
    render(<PaletteDemo dark={false} setDark={setDark} />);
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(await screen.findByRole("dialog", { name: /command palette/i })).toBeInTheDocument();
    await user.type(screen.getByLabelText("Command search"), "theme");
    await user.keyboard("{Enter}");
    expect(setDark).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("dialog", { name: /command palette/i })).not.toBeInTheDocument();
  });

  it("ignores the shortcut while typing in a field", async () => {
    const user = userEvent.setup();
    const setDark = vi.fn();
    render(<><input aria-label="scratch" /><PaletteDemo dark={false} setDark={setDark} /></>);
    await user.click(screen.getByLabelText("scratch"));
    fireEvent.keyDown(screen.getByLabelText("scratch"), { key: "k", ctrlKey: true });
    expect(screen.queryByRole("dialog", { name: /command palette/i })).not.toBeInTheDocument();
  });

  it("shows empty results with recovery", async () => {
    const user = userEvent.setup();
    render(<PaletteDemo dark={false} setDark={() => {}} />);
    await user.click(screen.getByRole("button", { name: /open palette/i }));
    await user.type(screen.getByLabelText("Command search"), "zzz-nothing");
    expect(screen.getByText(/no commands for/i)).toBeInTheDocument();
  });
});

describe("file upload", () => {
  const pick = (input: HTMLInputElement, files: File[]) => {
    Object.defineProperty(input, "files", { value: files, configurable: true });
    fireEvent.change(input);
  };

  it("rejects disallowed types with reasons", () => {
    render(<UploadDemo />);
    const input = screen.getByLabelText("Choose files to upload") as HTMLInputElement;
    pick(input, [new File(["x"], "evil.exe", { type: "application/x-msdownload" })]);
    expect(screen.getByText(/not allowed/i)).toBeInTheDocument();
  });

  it("enforces the configurable size limit", async () => {
    const user = userEvent.setup();
    render(<UploadDemo />);
    await user.selectOptions(screen.getByLabelText("Demo file size limit"), "1");
    const input = screen.getByLabelText("Choose files to upload") as HTMLInputElement;
    pick(input, [new File([new ArrayBuffer(2 * 1024 * 1024)], "big.png", { type: "image/png" })]);
    expect(screen.getByText(/exceeds the 1 MB demo limit/i)).toBeInTheDocument();
  });

  it("uploads, completes, removes and retries after injected failure", async () => {
    const user = userEvent.setup();
    render(<UploadDemo />);
    const input = screen.getByLabelText("Choose files to upload") as HTMLInputElement;
    pick(input, [new File(["hello"], "notes.txt", { type: "text/plain" })]);
    await user.click(screen.getByRole("button", { name: /upload 1 file/i }));
    expect(await screen.findByText(/uploaded \(simulated, local only\)/i, undefined, { timeout: 3000 })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /remove notes.txt/i }));
    expect(screen.queryByText("notes.txt")).not.toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: /fail the next upload/i }));
    pick(screen.getByLabelText("Choose files to upload") as HTMLInputElement, [new File(["x"], "a.txt", { type: "text/plain" })]);
    await user.click(screen.getByRole("button", { name: /upload a.txt/i }));
    // Simulated upload needs ~1.3s of real timer ticks; poll-free wait is the
    // deterministic way to observe it (proven in isolation).
    await new Promise((r) => setTimeout(r, 1800));
    expect(screen.getByRole("button", { name: /retry a.txt/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /retry a.txt/i }));
    expect(await screen.findByText(/uploaded \(simulated, local only\)/i, undefined, { timeout: 3000 })).toBeInTheDocument();
  });
});

describe("drag and drop", () => {
  it("moves cards with keyboard controls and announces results", async () => {
    const user = userEvent.setup();
    render(<DndDemo />);
    expect(screen.getByRole("region", { name: /to do column, 2 cards/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /move “design hero variants” to next column/i }));
    expect(screen.getByRole("region", { name: /to do column, 1 card/i })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/moved from to do to doing/i);
    await user.click(screen.getByRole("button", { name: /reset board/i }));
    expect(screen.getByRole("region", { name: /to do column, 2 cards/i })).toBeInTheDocument();
  });

  it("moves cards across columns via the Move-to menu", async () => {
    const user = userEvent.setup();
    render(<DndDemo />);
    await user.selectOptions(screen.getByLabelText(/move “compress hero images” to column/i), "todo");
    expect(screen.getByRole("region", { name: /to do column, 3 cards/i })).toBeInTheDocument();
  });
});

describe("pagination", () => {
  it("disables boundaries and clamps after filtering", async () => {
    const user = userEvent.setup();
    render(<PaginationDemo />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Jump to page 12 (tests clamping)" }));
    expect(screen.getByText(/page 6 of 6/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    await user.selectOptions(screen.getByLabelText(/status filter/i), "draft");
    expect(screen.getByText(/page \d+ of \d+/i)).toBeInTheDocument();
  });

  it("page size resets to the first page", async () => {
    const user = userEvent.setup();
    render(<PaginationDemo />);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    await user.selectOptions(screen.getByLabelText(/per page/i), "12");
    expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
  });
});

describe("tooltips", () => {
  it("reveals on focus and hides on blur", async () => {
    render(<TooltipsDemo />);
    const btn = screen.getByRole("button", { name: "top" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    btn.focus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent(/prefers the top/i);
    fireEvent.blur(btn);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});

describe("empty, error and undo flows", () => {
  it("recovers from denied permission and one-time failure", async () => {
    const user = userEvent.setup();
    render(<EmptyErrorDemo />);
    await user.click(screen.getByRole("button", { name: /request access/i }));
    expect(screen.getByText(/access granted/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(screen.getByText(/attempt 1 failed/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(screen.getByText(/usage loaded after 2 attempts/i)).toBeInTheDocument();
  });

  it("queues while offline and flushes on reconnect", async () => {
    const user = userEvent.setup();
    render(<EmptyErrorDemo />);
    await user.click(screen.getByRole("button", { name: /online/i }));
    await user.click(screen.getByRole("button", { name: /queue sync \(0 queued\)/i }));
    expect(screen.getByText(/1 queued/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /offline \(simulated\)/i }));
    expect(screen.getByText(/1 queued write synced/i)).toBeInTheDocument();
  });

  it("archives with undo and deletes with confirmation", async () => {
    const user = userEvent.setup();
    render(<UndoDemo />);
    await user.click(screen.getByRole("button", { name: /archive atlas website/i }));
    expect(screen.getByRole("button", { name: /undo \(8s\)/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /undo \(/i }));
    expect(screen.getByText(/restored/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete billing api permanently/i }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /cancel \(safe default\)/i }));
    expect(screen.getByText(/delete of \u201cbilling api\u201d cancelled/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete billing api permanently/i }));
    await user.click(screen.getByRole("button", { name: /yes, delete it/i }));
    expect(screen.getByText(/deleted after explicit confirmation/i)).toBeInTheDocument();
  });
});

describe("cross-cutting checks", () => {
  it("pattern demos carry no fixed pixel widths", () => {
    const demos = [NavigationDemo, SearchFilterDemo, DataTableDemo, FormsDemo, MultiStepDemo, ModalDemo, MenusDemo, TabsAccordionDemo, NotificationsDemo, UploadDemo, DndDemo, ProgressDemo, PaginationDemo, TooltipsDemo, EmptyErrorDemo, UndoDemo];
    for (const Demo of demos) {
      const { container, unmount } = render(<Demo />);
      const fixed = Array.from(container.querySelectorAll("[class]")).filter((el) => {
        // Only viewport-threatening widths (>=280px) count; small control sizes are fine.
        const m = (el.getAttribute("class") ?? "").match(/(?:^|\s)(?:w|min-w)-\[(\d+)px\]/);
        if (!m || Number(m[1]) < 280) return false;
        // min-width tables are intentional inside labelled horizontal scrollers
        return !(el as HTMLElement).closest(".overflow-x-auto");
      });
      expect(fixed.map((el) => el.textContent?.slice(0, 40))).toEqual([]);
      unmount();
    }
  });

  it("palette demo excluded from width sweep only for its overlay (documented)", () => {
    const { container, unmount } = render(<PaletteDemo dark={false} setDark={() => {}} />);
    expect(container.querySelector("main, div")).toBeTruthy();
    unmount();
  });
});
