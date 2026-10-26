import { test, expect } from "@playwright/test";

test.describe("Form Validation", () => {
  test("validates required fields on marketing lead form", async ({ page }) => {
    await page.goto("/#/product/marketing");
    
    const submitBtn = page.getByRole("button", { name: /request demo/i });
    await expect(submitBtn).toBeVisible();

    // Submit empty form
    await submitBtn.click();

    // Verify inline errors
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Enter a valid work email.")).toBeVisible();
    await expect(page.getByText("Tell us a little more (10+ characters).")).toBeVisible();

    // Fill valid data
    await page.locator("#ld-name").fill("Ada Lovelace");
    await page.locator("#ld-email").fill("ada@analytical.org");
    await page.locator("#ld-msg").fill("We need to orchestrate our experiments and test our metrics reliably.");

    // Submit valid form
    await submitBtn.click();

    // Confirm success confirmation state
    await expect(page.getByText(/You're on the list/i)).toBeVisible();
  });

  test("validates step fields in multi-step wizard and preserves state on back-navigation", async ({ page }) => {
    await page.goto("/#/patterns/multi-step-form");
    
    // Look for wizard step progress
    await expect(page.getByRole("group", { name: /Step 1 of 3: Account/i })).toBeVisible();
    
    // Try to advance empty step
    const continueBtn = page.getByRole("button", { name: "Continue →" });
    await continueBtn.click();
    await expect(page.getByText("Enter a valid email — we'll send the invite there.")).toBeVisible();

    // Fill valid credentials for step 1
    await page.locator("#w-email").fill("lead@company.org");
    await page.locator("#w-pass").fill("supersecret123");
    await continueBtn.click();

    // Now on Step 2: Project
    await expect(page.getByRole("group", { name: /Step 2 of 3: Project/i })).toBeVisible();

    // Navigate back and verify state preservation
    const backBtn = page.getByRole("button", { name: "← Back" });
    await backBtn.click();
    await expect(page.locator("#w-email")).toHaveValue("lead@company.org");
  });
});
