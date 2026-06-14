import { expect, test } from "@playwright/test";

const publicRoutes = [
  { path: "/", selector: "h1" },
  { path: "/about", selector: "main" },
  { path: "/terms-of-service", selector: "main" },
  { path: "/how-become-host", selector: "main article" },
  { path: "/search", selector: "[data-testid='search-page']" },
];

async function stubPublicApi(page) {
  await page.route("**/content/footer**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          nav_columns: [],
          locations: [],
          downloads: [],
          socials: [],
          trust_badges: [],
        },
      }),
    }),
  );

  await page.route("**/content/homepage**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: { homepage_sections: [] } }),
    }),
  );

  await page.route("**/assets/zone**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.route("**/house**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.route("**/client/profile", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: false, data: null }),
    }),
  );
}

test.describe("public performance smoke", () => {
  for (const route of publicRoutes) {
    test(`${route.path} first paint is stable`, async ({ page }) => {
      const browserErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") browserErrors.push(message.text());
      });
      page.on("pageerror", (error) => browserErrors.push(error.message));

      await stubPublicApi(page);
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      await expect(page.locator(route.selector).first()).toBeVisible();

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(hasHorizontalOverflow).toBe(false);
      expect(browserErrors).toEqual([]);
    });
  }
});
