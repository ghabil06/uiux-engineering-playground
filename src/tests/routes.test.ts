/**
 * Route architecture tests — every explorer link must resolve to a real page.
 */
import { describe, it, expect } from "vitest";
import { ROUTES, NOT_FOUND_TITLE, resolveRoute, catalogueCoverage } from "../lib/routes";
import { DEMOS } from "../lib/core";

describe("ROUTES", () => {
  it("registers 101 routes (explorer + galleries + compare + 90 demos + 7 design system routes)", () => {
    expect(ROUTES).toHaveLength(101);
  });

  it("has unique paths", () => {
    expect(new Set(ROUTES.map((r) => r.path)).size).toBe(ROUTES.length);
  });

  it("gives every demo exactly one route (no broken explorer links)", () => {
    expect(catalogueCoverage().missing).toEqual([]);
    for (const d of DEMOS) {
      const matches = ROUTES.filter((r) => r.path === d.route);
      expect(matches).toHaveLength(1);
      expect(matches[0].demoId).toBe(d.id);
    }
  });

  it("has a title for every route", () => {
    for (const r of ROUTES) expect(r.title.length).toBeGreaterThan(0);
  });
});

describe("resolveRoute", () => {
  it("strips query strings so filtered explorer URLs still resolve", () => {
    expect(resolveRoute("#/?q=cart").def?.path).toBe("#/");
  });

  it("resolves a demo route", () => {
    const { def, path } = resolveRoute("#/product/dashboard");
    expect(path).toBe("#/product/dashboard");
    expect(def?.demoId).toBe("dashboard");
  });

  it("returns null for unknown routes (not-found page)", () => {
    const { def } = resolveRoute("#/nope-not-real");
    expect(def).toBeNull();
    expect(NOT_FOUND_TITLE).toMatch(/not found/i);
  });
});
