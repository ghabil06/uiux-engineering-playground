import { test, expect } from "@playwright/test";

test.describe("Route Navigation", () => {
  test("deep links directly to valid routes", async ({ page }) => {
    await page.goto("/#/product/marketing");
    await expect(page.locator("h1, h2").first()).toBeVisible();
    await expect(page).toHaveURL(/#\/product\/marketing/);

    await page.goto("/#/product/dashboard");
    await expect(page).toHaveURL(/#\/product\/dashboard/);
    await expect(page.getByRole("heading", { name: "Enterprise Dashboard" })).toBeVisible();

    await page.goto("/#/styles");
    await expect(page).toHaveURL(/#\/styles/);
    await expect(page.getByText("Visual styles", { exact: false }).first()).toBeVisible();
  });

  test("supports browser back and forward navigation", async ({ page }) => {
    await page.goto("/#/");
    await expect(page).toHaveURL(/#\//);

    await page.goto("/#/product/ecommerce");
    await expect(page).toHaveURL(/#\/product\/ecommerce/);

    await page.goBack();
    await expect(page).toHaveURL(/#\//);

    await page.goForward();
    await expect(page).toHaveURL(/#\/product\/ecommerce/);
  });

  test("handles unknown route with 404 page and return button", async ({ page }) => {
    await page.goto("/#/non-existent-route-xyz");
    await expect(page.getByText("Lost in the playground?")).toBeVisible();
    
    const returnLink = page.getByRole("link", { name: "← Back to explorer" });
    await expect(returnLink).toBeVisible();
    await returnLink.click();
    await expect(page).toHaveURL(/#\//);
  });
});
