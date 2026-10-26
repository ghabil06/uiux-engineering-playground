import { test, expect } from "@playwright/test";

test.describe("Theme Persistence", () => {
  test("toggles theme and persists across page reloads", async ({ page }) => {
    await page.goto("/#/");

    // Check initial state
    const html = page.locator("html");
    const themeBtn = page.getByRole("button", { name: /switch to (dark|light) theme/i });
    await expect(themeBtn).toBeVisible();

    // Read current theme and toggle it
    const isDarkInitially = await html.evaluate((el) => el.classList.contains("dark"));
    await themeBtn.click();

    // Verify DOM class updated
    if (isDarkInitially) {
      await expect(html).not.toHaveClass(/dark/);
      const savedTheme = await page.evaluate(() => localStorage.getItem("prism-theme"));
      expect(savedTheme).toBe("light");
    } else {
      await expect(html).toHaveClass(/dark/);
      const savedTheme = await page.evaluate(() => localStorage.getItem("prism-theme"));
      expect(savedTheme).toBe("dark");
    }

    // Reload the page
    await page.reload();

    // Verify persisted theme after reload
    if (isDarkInitially) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }
  });
});
