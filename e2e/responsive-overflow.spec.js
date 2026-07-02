import { expect, test } from "@playwright/test";

const responsiveRoutes = [
  { path: "/" },
  { path: "/about" },
  { path: "/terms-of-service" },
  { path: "/how-become-host" },
  { path: "/search" },
  { path: "/house/HOUSE-1" },
  { path: "/login" },
  { path: "/dashboard", auth: true },
];

const viewports = [
  { width: 320, height: 812 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
];

const user = {
  id: 1,
  name: "Test User",
  phone: "09120000000",
  type: "Vendor",
  wallet: { main: 1200000, blocked: 0 },
};

const house = {
  uuid: "HOUSE-1",
  id: "HOUSE-1",
  name: "Responsive Test House",
  title: "Responsive Test House",
  image: "/assets/favorite-1.jpg",
  galleries: [
    { media: "/assets/favorite-2.jpg", title: "Yard" },
    { media: "/assets/1.webp", title: "Bedroom" },
  ],
  is_rent_room: false,
  instant_booking: false,
  room: [
    {
      uuid: "ROOM-1",
      name: "Main room",
      number_double_beds: 1,
      number_single_beds: 1,
      number_sofa_beds: 0,
      number_floor_service: 0,
      facilities: [],
      airConditions: [],
    },
  ],
  description: "A compact fixture for responsive house detail checks.",
  address: {
    address: "Rasht",
    geography: { latitude: 37.2808, longitude: 49.5832 },
    city: {
      name: "Rasht",
      latitude: 37.2808,
      longitude: 49.5832,
      province: { name: "Gilan" },
    },
  },
  facilities: [],
  sanitaries: [],
  rules: [],
  cancellation_rule: {},
  comments: [],
  top_locations: [],
  vote: { total_vote: 4.7 },
  price: { initial: 2500000, final: 2500000 },
};

const vendorHouse = {
  uuid: "HOUSE-1",
  name: "Responsive Test House",
  image: "/assets/favorite-1.jpg",
  structure: { key: "villa", label: "Villa" },
  status: { key: "published", label: "Published" },
};

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

  await page.route("**/assets/types/structure/detail**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: [
          { key: "villa", label: "Villa" },
          { key: "apartment", label: "Apartment" },
        ],
      }),
    }),
  );

  await page.route("**/client/profile", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: user }),
    }),
  );

  await page.route("**/client/house", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [vendorHouse] }),
    }),
  );

  await page.route("**/client/wallet/**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.route("**/client/reserve/**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.route("**/client/ticket**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: route.request().url().includes("departments")
          ? {
              departments: [{ id: 1, title: "Support" }],
              priorities: [{ key: "normal", title: "Normal" }],
            }
          : [],
      }),
    }),
  );

  await page.route("**/search/v2**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ value: [] }),
    }),
  );

  await page.route("**/api/house**", (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;

    if (path.includes("/HOUSE-1/calendar") || path.includes("/HOUSE-1/comments") || path.includes("/HOUSE-1/similar")) {
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      });
    }

    if (path.endsWith("/HOUSE-1")) {
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: house }),
      });
    }

    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [house] }),
    });
  });
}

async function addAuthCookie(page, baseURL) {
  await page.context().addCookies([
    {
      name: "authToken",
      value: "test-token",
      url: baseURL || "http://127.0.0.1:3004",
    },
  ]);
}

async function clippedInteractiveElements(page) {
  return page
    .locator('button:visible, a[href]:visible, [role="button"]:visible, [role="tab"]:visible')
    .evaluateAll((elements) =>
      elements
        .filter((element) => {
          const label =
            element.getAttribute("aria-label") ||
            element.textContent?.replace(/\s+/g, " ").trim();
          if (label === "Open Next.js Dev Tools") return false;

          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          if (rect.width === 0 || rect.height === 0 || style.visibility === "hidden") {
            return false;
          }
          return (
            element.scrollWidth > element.clientWidth + 2 ||
            element.scrollHeight > element.clientHeight + 2
          );
        })
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          role: element.getAttribute("role"),
          label:
            element.getAttribute("aria-label") ||
            element.textContent?.replace(/\s+/g, " ").trim().slice(0, 80),
          className: element.getAttribute("class"),
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          clientHeight: element.clientHeight,
          scrollHeight: element.scrollHeight,
        })),
    );
}

test.describe("responsive overflow", () => {
  for (const viewport of viewports) {
    for (const route of responsiveRoutes) {
      test(`${route.path} fits ${viewport.width}x${viewport.height}`, async ({ page, baseURL }) => {
        await stubPublicApi(page);
        if (route.auth) await addAuthCookie(page, baseURL);
        await page.setViewportSize(viewport);
        await page.goto(route.path, { waitUntil: "domcontentloaded" });
        await page.locator("body").waitFor({ state: "visible" });
        await page.waitForTimeout(route.path.startsWith("/house/") ? 1200 : 600);

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const innerWidth = await page.evaluate(() => window.innerWidth);

        expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
        expect(await clippedInteractiveElements(page)).toEqual([]);
      });
    }
  }

  test("home hero copy and search share a centered usable panel", async ({ page }) => {
    await stubPublicApi(page);

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1366, height: 768 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/", { waitUntil: "domcontentloaded" });

      const panel = page.getByTestId("home-hero-unified-panel");
      const copy = page.getByTestId("home-hero-copy");
      const search = page.getByTestId("home-hero-city-search");
      const dropdown = page.getByTestId("home-hero-city-dropdown");

      await expect(panel).toBeVisible();
      await expect(copy).toBeVisible();
      await expect(search).toBeVisible();

      await search.locator("input").click();
      await expect(dropdown).toHaveCSS("opacity", "1");

      const metrics = await page.evaluate(() => {
        const panelElement = document.querySelector(
          '[data-testid="home-hero-unified-panel"]',
        );
        const copyElement = document.querySelector('[data-testid="home-hero-copy"]');
        const searchElement = document.querySelector(
          '[data-testid="home-hero-city-search"]',
        );
        const dropdownElement = document.querySelector(
          '[data-testid="home-hero-city-dropdown"]',
        );
        const waveElement = document.querySelector(".home-wave-divider");
        const inputElement = searchElement.querySelector("input");
        const buttonElement = searchElement.querySelector("button");
        const panelRect = panelElement.getBoundingClientRect();
        const copyRect = copyElement.getBoundingClientRect();
        const searchRect = searchElement.getBoundingClientRect();
        const dropdownRect = dropdownElement.getBoundingClientRect();
        const waveRect = waveElement?.getBoundingClientRect();
        const inputRect = inputElement.getBoundingClientRect();
        const buttonRect = buttonElement.getBoundingClientRect();
        const panelStyle = window.getComputedStyle(panelElement);
        const parseZ = (element) => {
          if (!element) return null;
          const parsed = Number.parseInt(
            window.getComputedStyle(element).zIndex,
            10,
          );
          return Number.isFinite(parsed) ? parsed : 0;
        };
        const overlapTop = waveRect
          ? Math.max(dropdownRect.top, waveRect.top)
          : null;
        const overlapBottom = waveRect
          ? Math.min(dropdownRect.bottom, waveRect.bottom)
          : null;
        const hasWaveOverlap =
          overlapTop !== null && overlapBottom !== null && overlapBottom > overlapTop;
        const overlapProbe = hasWaveOverlap
          ? {
              x: Math.min(
                Math.max(dropdownRect.left + dropdownRect.width / 2, 1),
                window.innerWidth - 1,
              ),
              y: Math.min(
                Math.max(overlapTop + Math.min(24, (overlapBottom - overlapTop) / 2), 1),
                window.innerHeight - 1,
              ),
            }
          : null;
        const overlapTopElement = overlapProbe
          ? document.elementFromPoint(overlapProbe.x, overlapProbe.y)
          : null;

        return {
          buttonLeft: buttonRect.left,
          centerDelta: Math.abs(
            panelRect.left + panelRect.width / 2 - window.innerWidth / 2,
          ),
          copyBottom: copyRect.bottom,
          dropdownBottom: dropdownRect.bottom,
          dropdownContainsOverlapTop: overlapTopElement
            ? dropdownElement.contains(overlapTopElement)
            : null,
          dropdownTop: dropdownRect.top,
          dropdownZ: parseZ(dropdownElement),
          hasWaveOverlap,
          inputLeft: inputRect.left,
          innerWidth: window.innerWidth,
          panelBottom: panelRect.bottom,
          panelOverflow: panelStyle.overflow,
          scrollWidth: document.documentElement.scrollWidth,
          searchBottom: searchRect.bottom,
          searchBottomGap: panelRect.bottom - searchRect.bottom,
          searchTop: searchRect.top,
          waveBottom: waveRect?.bottom ?? null,
          waveTop: waveRect?.top ?? null,
          waveZ: parseZ(waveElement),
        };
      });

      expect(metrics.centerDelta).toBeLessThanOrEqual(4);
      expect(metrics.searchTop).toBeGreaterThan(metrics.copyBottom);
      expect(metrics.searchBottomGap).toBeLessThanOrEqual(14);
      expect(metrics.buttonLeft).toBeLessThan(metrics.inputLeft);
      expect(metrics.dropdownTop).toBeGreaterThan(metrics.searchBottom);
      if (metrics.hasWaveOverlap) {
        expect(metrics.dropdownZ).toBeGreaterThan(metrics.waveZ);
        expect(metrics.dropdownContainsOverlapTop).toBe(true);
      }
      expect(metrics.panelOverflow).toBe("visible");
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
    }
  });

  test("mobile house content is inset and section nav lands below fixed chrome", async ({ page }) => {
    await stubPublicApi(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/house/HOUSE-1", { waitUntil: "domcontentloaded" });
    await page.locator("body").waitFor({ state: "visible" });
    await page.waitForTimeout(1200);
    test.skip(
      (await page.getByTestId("mobile-reservation-sheet").count()) === 0,
      "House detail data is server-rendered and the fixture house is unavailable.",
    );
    await expect(page.getByTestId("mobile-reservation-sheet")).toBeVisible();

    const initialMetrics = await page.evaluate(() => {
      const shell = document.querySelector(".house-page-container");
      const reservationSheet = document.querySelector(
        '[data-testid="mobile-reservation-sheet"]',
      );
      const shellRect = shell.getBoundingClientRect();
      const sheetRect = reservationSheet.getBoundingClientRect();

      return {
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        sheetLeft: sheetRect.left,
        sheetRight: sheetRect.right,
        shellLeft: shellRect.left,
        shellRight: shellRect.right,
      };
    });

    expect(initialMetrics.scrollWidth).toBeLessThanOrEqual(initialMetrics.innerWidth);
    expect(initialMetrics.shellLeft).toBeGreaterThanOrEqual(10);
    expect(initialMetrics.innerWidth - initialMetrics.shellRight).toBeGreaterThanOrEqual(10);
    expect(initialMetrics.sheetLeft).toBeLessThanOrEqual(1);
    expect(initialMetrics.sheetRight).toBeGreaterThanOrEqual(initialMetrics.innerWidth - 1);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
    await expect(page.getByTestId("house-section-nav")).toHaveCSS("opacity", "1");

    const navMetrics = await page.evaluate(() => {
      const nav = document.querySelector('[data-testid="house-section-nav"]');
      const navRect = nav.getBoundingClientRect();
      const headerOffset =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-offset",
          ),
        ) || 0;

      return {
        innerWidth: window.innerWidth,
        navLeft: navRect.left,
        navRight: navRect.right,
        navTop: navRect.top,
        headerOffset,
      };
    });

    expect(navMetrics.navTop).toBeGreaterThanOrEqual(navMetrics.headerOffset + 8);
    expect(navMetrics.navLeft).toBeGreaterThanOrEqual(10);
    expect(navMetrics.navRight).toBeLessThanOrEqual(navMetrics.innerWidth - 10);

    await page.getByTestId("house-section-nav-rules").click();
    await page.waitForFunction(() => {
      const nav = document.querySelector('[data-testid="house-section-nav"]');
      const rules = document.querySelector('[data-testid="house-section-rules"]');
      if (!nav || !rules) return false;
      const navRect = nav.getBoundingClientRect();
      const rulesRect = rules.getBoundingClientRect();
      return rulesRect.top >= navRect.bottom + 8 && rulesRect.top <= navRect.bottom + 56;
    });
  });
});
