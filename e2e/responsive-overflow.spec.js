import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/about",
  "/terms-of-service",
  "/how-become-host",
  "/search",
];

const viewports = [
  { width: 320, height: 812 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
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
}

test.describe("public responsive overflow", () => {
  for (const viewport of viewports) {
    for (const route of publicRoutes) {
      test(`${route} fits ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await stubPublicApi(page);
        await page.setViewportSize(viewport);
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.locator("body").waitFor({ state: "visible" });
        await page.waitForTimeout(600);

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const innerWidth = await page.evaluate(() => window.innerWidth);

        expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
      });
    }
  }
});
