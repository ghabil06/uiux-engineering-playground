import { test, expect } from "@playwright/test";

test.describe("Data Table Behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/product/dashboard");
    await expect(page.getByRole("table")).toBeVisible();
  });

  test("sorts columns ascending and descending", async ({ page }) => {
    const mrrBtn = page.getByRole("button", { name: /MRR/i });
    await expect(mrrBtn).toBeVisible();

    // Initial click or toggle sort
    await mrrBtn.click();
    await expect(mrrBtn).toHaveAttribute("aria-sort", /(ascending|descending)/);

    // Toggle again
    await mrrBtn.click();
    await expect(mrrBtn).toHaveAttribute("aria-sort", /(ascending|descending)/);
  });

  test("filters rows by search query", async ({ page }) => {
    const searchInput = page.getByLabel("Search orders");
    await searchInput.fill("ORD-2400");

    // Table rows should filter
    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible();
    await expect(page.getByText("ORD-2400")).toBeVisible();

    // Non-matching search shows empty state
    await searchInput.fill("nonexistentquery999");
    await expect(page.getByText("No accounts match these filters")).toBeVisible();
  });

  test("selects row and opens detail drawer", async ({ page }) => {
    const firstRowCheckbox = page.locator("tbody tr input[type='checkbox']").first();
    await firstRowCheckbox.check();
    await expect(page.getByRole("status")).toContainText("1 selected");

    const viewButton = page.locator("tbody tr button[aria-label^='View']").first();
    await viewButton.click();

    // Drawer dialog opens
    const drawer = page.getByRole("dialog", { name: /Account/i });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("button", { name: /close detail/i })).toBeVisible();

    // Close drawer
    await drawer.getByRole("button", { name: /close detail/i }).click();
    await expect(drawer).not.toBeVisible();
  });
});
