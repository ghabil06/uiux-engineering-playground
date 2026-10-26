/**
 * Unit tests — catalogue filtering, tokens-adjacent math, deterministic utils.
 * These cover the real functions the explorer and labs execute.
 */
import { describe, it, expect } from "vitest";
import {
  DEMOS, CATEGORIES, STYLE_FILTERS, filterDemos,
  contrastRatio, seeded, cx, formatNum, timeAgo,
} from "../lib/core";

describe("filterDemos", () => {
  it("returns the full catalogue with an empty filter", () => {
    expect(filterDemos(DEMOS, {})).toHaveLength(90);
    expect(filterDemos(DEMOS, { q: "   " }).length).toBe(90);
  });

  it("searches name, teaching, category and interactions (case-insensitive)", () => {
    expect(filterDemos(DEMOS, { q: "cart" }).map((d) => d.id)).toContain("ecommerce");
    expect(filterDemos(DEMOS, { q: "DRIFT" }).map((d) => d.id)).toContain("aiml");
    expect(filterDemos(DEMOS, { q: "palette" }).map((d) => d.id)).toContain("pattern-command-palette");
  });

  it("filters by category", () => {
    const rows = filterDemos(DEMOS, { category: "Product Types" });
    expect(rows).toHaveLength(7);
    expect(rows.every((d) => d.category === "Product Types")).toBe(true);
  });

  it("filters by difficulty", () => {
    const rows = filterDemos(DEMOS, { difficulty: "Beginner" });
    expect(rows.map((d) => d.id).sort()).toEqual([
      "a11y-color-contrast", "a11y-motion", "a11y-semantic-html",
      "marketing", "mobile",
      "pattern-forms", "pattern-notifications", "pattern-pagination",
      "pattern-progress-and-feedback", "pattern-tabs-and-accordion", "pattern-tooltips",
      "resp-breakpoints", "resp-device-preview", "resp-forms", "resp-typography",
      "responsive",
      "state-empty", "state-loading", "state-permissions", "state-recovery", "state-success",
      "states",
      "style-flat-design", "style-light-ui", "style-minimalism",
      "ux-cardsort", "ux-cognitive-load", "ux-consistency", "ux-feedback",
      "ux-flow-onboarding", "ux-flow-registration", "ux-ia", "ux-personas",
    ]);
  });

  it("filters by visual style", () => {
    expect(filterDemos(DEMOS, { style: "Dense" }).map((d) => d.id).sort())
      .toEqual(["aiml", "analytics", "dashboard", "pattern-data-table", "pattern-pagination", "pattern-search-and-filter", "style-data-dense", "testing", "ux-method-selector", "ux-metrics", "ux-sitemap", "ux-usability-testing"]);
    expect(filterDemos(DEMOS, { style: "Glass" }).map((d) => d.id).sort()).toEqual(["ai", "style-glassmorphism"]);
    expect(filterDemos(DEMOS, { style: "Swiss" }).map((d) => d.id).sort()).toEqual(["style-swiss-grid", "tokens", "ux-consistency", "ux-ia"]);
    expect(filterDemos(DEMOS, { style: "Bento" }).map((d) => d.id)).toEqual(["style-bento-grid"]);
  });

  it("combines search + category + difficulty + style with AND", () => {
    // "table" matches the dashboard ("data table") and analytics ("tables")
    // descriptions; both are Advanced, Dense product demos.
    const rows = filterDemos(DEMOS, { q: "table", category: "Product Types", difficulty: "Advanced", style: "Dense" });
    expect(rows.map((d) => d.id)).toEqual(["dashboard", "analytics"]);
  });

  it("returns empty for impossible combinations", () => {
    expect(filterDemos(DEMOS, { q: "zzz-no-such-demo" })).toHaveLength(0);
    expect(filterDemos(DEMOS, { category: "AI", style: "Swiss" })).toHaveLength(0);
  });
});

describe("catalogue integrity", () => {
  it("exposes every category in the filter list", () => {
    for (const d of DEMOS) expect(CATEGORIES).toContain(d.category);
  });

  it("uses only vocabulary styles on every demo", () => {
    for (const d of DEMOS) {
      expect(d.styles.length).toBeGreaterThan(0);
      for (const s of d.styles) expect(STYLE_FILTERS).toContain(s);
    }
  });

  it("the twelve style demos cover the full style vocabulary", () => {
    const slugs = DEMOS.filter((d) => d.category === "Visual Styles");
    expect(slugs).toHaveLength(12);
    expect(slugs.map((d) => d.styles[0]).sort()).toEqual([...STYLE_FILTERS].sort());
  });

  it("marks every demo accurately (functional only when implemented)", () => {
    for (const d of DEMOS) expect(d.status).toBe("functional");
  });

  it("has unique ids and routes", () => {
    expect(new Set(DEMOS.map((d) => d.id)).size).toBe(DEMOS.length);
    expect(new Set(DEMOS.map((d) => d.route)).size).toBe(DEMOS.length);
  });
});

describe("contrastRatio", () => {
  it("scores black on white at 21:1", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#0f172a", "#ffffff")).toBeCloseTo(contrastRatio("#ffffff", "#0f172a"), 6);
  });

  it("passes AA for the default body pair and fails for a weak pair", () => {
    expect(contrastRatio("#0f172a", "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#aaaaaa", "#ffffff")).toBeLessThan(4.5);
  });
});

describe("utilities", () => {
  it("seeded() is deterministic and bounded", () => {
    expect(seeded(7)).toBe(seeded(7));
    for (let i = 0; i < 50; i++) {
      const v = seeded(i);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("cx joins truthy parts only", () => {
    expect(cx("a", false, null, undefined, "b")).toBe("a b");
  });

  it("formatNum abbreviates thousands and millions", () => {
    expect(formatNum(999)).toBe("999");
    expect(formatNum(2400)).toBe("2.4k");
    expect(formatNum(2_400_000)).toBe("2.4M");
  });

  it("timeAgo buckets recency", () => {
    const now = Date.now();
    expect(timeAgo(now - 5_000)).toBe("just now");
    expect(timeAgo(now - 5 * 60_000)).toBe("5m ago");
    expect(timeAgo(now - 3 * 3_600_000)).toBe("3h ago");
  });
});
