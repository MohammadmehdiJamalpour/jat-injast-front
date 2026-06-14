import { expect, test } from "@playwright/test";

import { TOAST_LAYER_Z_INDEX } from "../src/ui/toastLayer";

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

  await page.route("**/search/v2**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ value: [] }),
    }),
  );

  await page.route("**/client/profile", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: false, data: null }),
    }),
  );

  await page.route("**/api/auth/login/password", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        success: false,
        message: "Invalid test credentials",
      }),
    }),
  );
}

async function getLayerState(page) {
  return page.evaluate(() => {
    const readLayer = (element) => {
      if (!element) return null;

      const zIndex = window.getComputedStyle(element).zIndex;
      return Number.parseInt(zIndex, 10);
    };

    const toaster = Array.from(document.querySelectorAll("body *")).find(
      (element) => {
        const style = window.getComputedStyle(element);
        return (
          style.position === "fixed" &&
          style.pointerEvents === "none" &&
          style.top === "16px" &&
          style.left === "16px" &&
          style.right === "16px" &&
          style.bottom === "16px"
        );
      },
    );
    const header = document.querySelector("nav")?.parentElement;
    const mobileMenu = document.getElementById("mobile-main-menu");

    return {
      toasterPosition: toaster
        ? window.getComputedStyle(toaster).position
        : null,
      toasterZIndex: readLayer(toaster),
      headerZIndex: readLayer(header),
      mobileMenuZIndex: readLayer(mobileMenu),
    };
  });
}

async function waitForToaster(page) {
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll("body *")).some((element) => {
      const style = window.getComputedStyle(element);
      return (
        style.position === "fixed" &&
        style.pointerEvents === "none" &&
        style.top === "16px" &&
        style.left === "16px" &&
        style.right === "16px" &&
        style.bottom === "16px"
      );
    }),
  );
}

async function waitForHotToast(page) {
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll('[role="status"], [role="alert"]')).some(
      (element) => String(element.className).startsWith("go"),
    ),
  );
}

async function waitForHotToastInViewport(page) {
  await page.waitForFunction(() => {
    const toastStatus = Array.from(
      document.querySelectorAll('[role="status"], [role="alert"]'),
    ).find((element) => String(element.className).startsWith("go"));
    const rect = toastStatus?.parentElement?.getBoundingClientRect();

    return Boolean(rect && rect.y >= 0 && rect.bottom <= window.innerHeight);
  });
}

async function getVisibleToastState(page) {
  return page.evaluate(() => {
    const toastStatus = Array.from(
      document.querySelectorAll('[role="status"], [role="alert"]'),
    ).find((element) => String(element.className).startsWith("go"));
    const toastRoot = toastStatus?.parentElement;
    const rect = toastRoot?.getBoundingClientRect();
    const centerX = rect ? rect.left + rect.width / 2 : null;
    const centerY = rect ? rect.top + rect.height / 2 : null;
    const topAtToast =
      centerX !== null && centerY !== null
        ? document.elementFromPoint(centerX, centerY)
        : null;

    return {
      text: toastStatus?.textContent?.trim() || null,
      rect: rect
        ? {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          }
        : null,
      topAtToastInToastRoot: Boolean(
        toastRoot && topAtToast && toastRoot.contains(topAtToast),
      ),
    };
  });
}

test.describe("toast layer", () => {
  test.beforeEach(async ({ page }) => {
    await stubPublicApi(page);
  });

  test("renders above the desktop header", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator("nav").first().waitFor({ state: "attached" });
    await waitForToaster(page);

    const layer = await getLayerState(page);

    expect(layer.toasterPosition).toBe("fixed");
    expect(layer.toasterZIndex).toBe(TOAST_LAYER_Z_INDEX);
    expect(layer.toasterZIndex).toBeGreaterThan(layer.headerZIndex);
  });

  test("stays above the mobile header menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator("nav").first().waitFor({ state: "attached" });
    await waitForToaster(page);

    await page.locator('[aria-controls="mobile-main-menu"]').click();
    await expect(page.locator("#mobile-main-menu")).toBeVisible();

    const layer = await getLayerState(page);

    expect(layer.toasterZIndex).toBe(TOAST_LAYER_Z_INDEX);
    expect(layer.toasterZIndex).toBeGreaterThan(layer.headerZIndex);
    expect(layer.toasterZIndex).toBeGreaterThan(layer.mobileMenuZIndex);
  });

  test("keeps a triggered toast above the open mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.locator("nav").first().waitFor({ state: "attached" });
    await waitForToaster(page);

    await page.locator('input[name="username"]').fill("bad-user");
    await page.locator('input[name="password"]').fill("bad-password");
    await page.locator('[aria-controls="mobile-main-menu"]').click();
    await expect(page.locator("#mobile-main-menu")).toBeVisible();

    await page.evaluate(() => document.querySelector("form")?.requestSubmit());
    await waitForHotToast(page);
    await waitForHotToastInViewport(page);

    const layer = await getLayerState(page);
    const toastState = await getVisibleToastState(page);

    expect(layer.toasterZIndex).toBe(TOAST_LAYER_Z_INDEX);
    expect(layer.toasterZIndex).toBeGreaterThan(layer.mobileMenuZIndex);
    expect(toastState.text).toBe("Invalid test credentials");
    expect(toastState.rect.y).toBeGreaterThanOrEqual(0);
    expect(toastState.topAtToastInToastRoot).toBe(true);
  });
});
