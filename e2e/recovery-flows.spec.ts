import { test, expect } from "@playwright/test";

test.describe("Recovery Flows", () => {
  test("recovers from cleared collection and empty search results", async ({ page }) => {
    await page.goto("/#/interface-states/empty");
    await expect(page.getByText("Searchable collection (live)")).toBeVisible();

    // Clear all projects to trigger empty state
    const clearBtn = page.getByRole("button", { name: /clear all/i });
    await clearBtn.click();
    await expect(page.getByText("Collection cleared")).toBeVisible();

    // Recover via "Restore starters"
    const restoreBtn = page.getByRole("button", { name: /restore starters/i });
    await expect(restoreBtn).toBeVisible();
    await restoreBtn.click();

    // Verify projects restored
    await expect(page.getByText("3 of 3 shown")).toBeVisible();
  });

  test("offline simulation queues writes and flushes upon reconnect", async ({ page }) => {
    await page.goto("/#/interface-states/offline");

    // Go offline
    const toggleBtn = page.getByRole("button", { name: /go offline/i });
    await toggleBtn.click();
    await expect(page.getByRole("alert")).toContainText("You're offline — simulated");

    // Save an edit while offline
    const saveBtn = page.getByRole("button", { name: /save edit/i });
    await saveBtn.click();
    await expect(page.getByRole("status")).toContainText("Queued locally");

    // Reconnect and flush queue
    const flushBtn = page.getByRole("button", { name: /reconnect \+ flush/i });
    await expect(flushBtn).toBeVisible();
    await flushBtn.click();

    // Verify reconnected and flushed
    await expect(page.getByRole("status")).toContainText("Reconnected — 1 queued edit synced in order");
  });
});
