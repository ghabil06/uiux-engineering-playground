import { test, expect } from "@playwright/test";

test.describe("Dialog Focus Behavior", () => {
  test("opens dialog, traps focus, and closes on Escape returning focus", async ({ page }) => {
    await page.goto("/#/accessibility/dialogs");

    const openBtn = page.getByRole("button", { name: "Confirm dialog" });
    await expect(openBtn).toBeVisible();
    await openBtn.click();

    // Verify dialog opened
    const dialog = page.getByRole("dialog", { name: "Publish 12 pages?" });
    await expect(dialog).toBeVisible();

    // Verify close button is focused on open
    const closeBtn = dialog.getByRole("button", { name: "Close dialog" });
    await expect(closeBtn).toBeFocused();

    // Press Escape to exit dialog
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();

    // Focus is returned to trigger
    await expect(openBtn).toBeFocused();
  });

  test("closes dialog using close button and returns focus to trigger", async ({ page }) => {
    await page.goto("/#/accessibility/dialogs");

    const openBtn = page.getByRole("button", { name: "Confirm dialog" });
    await openBtn.click();

    const dialog = page.getByRole("dialog", { name: "Publish 12 pages?" });
    await expect(dialog).toBeVisible();

    const closeBtn = dialog.getByRole("button", { name: "Close dialog" });
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();

    // Focus is returned to trigger
    await expect(openBtn).toBeFocused();
  });
});
