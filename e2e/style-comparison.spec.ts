import { test, expect } from "@playwright/test";

test.describe("Style Comparison Behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/styles/compare");
    await expect(page.getByText("Compare up to 4 styles")).toBeVisible();
  });

  test("toggles styles in comparison picker and updates matrix", async ({ page }) => {
    // Default has Minimalism and Brutalism selected
    await expect(page.getByRole("button", { name: /Minimalism/i }).first()).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /Brutalism/i }).first()).toHaveAttribute("aria-pressed", "true");

    // Add Glassmorphism
    const glassBtn = page.getByRole("button", { name: /Glassmorphism/i }).first();
    await glassBtn.click();
    await expect(glassBtn).toHaveAttribute("aria-pressed", "true");

    // Check that criteria matrix renders
    await expect(page.getByText("Typography", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("Surfaces", { exact: false }).first()).toBeVisible();
  });

  test("clears all styles and displays empty state with recovery action", async ({ page }) => {
    const clearBtn = page.getByRole("button", { name: /clear all/i });
    await clearBtn.click();

    // Verify empty state
    await expect(page.getByText("Nothing to compare yet")).toBeVisible();

    // Verify link to gallery
    const galleryLink = page.getByRole("link", { name: /browse the gallery first/i });
    await expect(galleryLink).toBeVisible();
  });
});
