import { expect, test } from "@playwright/test";

const searchHouse = {
  uuid: "FILTER-LAYER-1",
  name: "Filter layer fixture",
  image: "/assets/favorite-1.jpg",
  galleries: [{ media: "/assets/favorite-2.jpg", title: "Gallery" }],
  price: { initial: 2_400_000, final: 2_400_000 },
  vote: { total_vote: 4.8 },
  structure: { key: "villa", label: "Villa" },
  address: {
    address: "Rasht",
    city: {
      name: "Rasht",
      latitude: 37.2808,
      longitude: 49.5832,
      province: { name: "Gilan" },
    },
    geography: {
      latitude: 37.2808,
      longitude: 49.5832,
    },
  },
};

async function stubSearchPage(page) {
  await page.route("https://*.tile.openstreetmap.org/**", (route) =>
    route.fulfill({ status: 204 }),
  );

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

  await page.route("**/assets/types/**/detail", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.route("**/house", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [searchHouse] }),
    }),
  );
}

async function filterLayerMetrics(page) {
  return page.evaluate(() => {
    const activePopover = document.querySelector('[data-active-filter="true"]');
    const inactivePopover = document.querySelector('[data-active-filter="false"]');
    const panel = activePopover?.querySelector(
      '[data-testid="desktop-filter-panel"]',
    );
    const mapPane = document.querySelector('[data-testid="search-map-pane"]');
    const listingsPane = document.querySelector(
      '[data-testid="search-listings-pane"]',
    );
    const mapToggle = document.querySelector('[data-testid="desktop-map-toggle"]');
    const nav = document.querySelector('[data-testid="search-filter-nav"]');

    const toRect = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      };
    };
    const toZ = (element) => {
      const parsed = Number.parseInt(window.getComputedStyle(element).zIndex, 10);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const panelRect = toRect(panel);
    const probe = {
      x: Math.min(
        Math.max(panelRect.left + panelRect.width / 2, 1),
        window.innerWidth - 1,
      ),
      y: Math.min(
        Math.max(panelRect.top + Math.min(24, panelRect.height / 2), 1),
        window.innerHeight - 1,
      ),
    };
    const topElement = document.elementFromPoint(probe.x, probe.y);

    return {
      activeZ: toZ(activePopover),
      inactiveZ: toZ(inactivePopover),
      innerWidth: window.innerWidth,
      isPanelOnTopAtProbe: panel.contains(topElement),
      listingsZ: toZ(listingsPane),
      mapToggleZ: toZ(mapToggle),
      mapZ: toZ(mapPane),
      navZ: toZ(nav),
      panelRect,
      panelZ: toZ(panel),
      scrollWidth: document.documentElement.scrollWidth,
      topTestId: topElement
        ?.closest("[data-testid]")
        ?.getAttribute("data-testid"),
    };
  });
}

async function expectEveryDesktopFilterAboveSearchContent(page) {
  const buttons = page.getByTestId("desktop-filter-button");
  const count = await buttons.count();
  expect(count).toBeGreaterThan(0);

  for (let index = 0; index < count; index += 1) {
    await buttons.nth(index).hover();

    const panel = page.locator(
      '[data-active-filter="true"] [data-testid="desktop-filter-panel"]',
    );
    await expect(panel).toBeVisible();

    const metrics = await filterLayerMetrics(page);

    expect(metrics.panelRect.left).toBeGreaterThanOrEqual(0);
    expect(metrics.panelRect.right).toBeLessThanOrEqual(metrics.innerWidth);
    expect(metrics.panelRect.width).toBeGreaterThan(0);
    expect(metrics.panelRect.height).toBeGreaterThan(0);
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);

    expect(metrics.isPanelOnTopAtProbe, metrics.topTestId).toBe(true);
    expect(metrics.activeZ).toBeGreaterThan(metrics.inactiveZ);
    expect(metrics.panelZ).toBeGreaterThan(metrics.mapToggleZ);
    expect(metrics.panelZ).toBeGreaterThan(metrics.mapZ);
    expect(metrics.panelZ).toBeGreaterThan(metrics.listingsZ);
    expect(metrics.navZ).toBeGreaterThan(metrics.mapToggleZ);
  }
}

test.describe("desktop search filter layering", () => {
  test.beforeEach(async ({ page }) => {
    await stubSearchPage(page);
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/search", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("desktop-filter-bar")).toBeVisible();
  });

  test("filter panels stay above map, toggle, and listings", async ({ page }) => {
    await expectEveryDesktopFilterAboveSearchContent(page);

    await page.getByTestId("desktop-map-toggle").click();
    await page.waitForFunction(() => {
      const mapPane = document.querySelector('[data-testid="search-map-pane"]');
      return mapPane?.getBoundingClientRect().width < 80;
    });

    await expectEveryDesktopFilterAboveSearchContent(page);
  });

  test("filter panel keeps its dark mode surface", async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
      document.documentElement.dataset.theme = "dark";
    });

    await page.getByTestId("desktop-filter-button").first().hover();
    const panel = page.locator(
      '[data-active-filter="true"] [data-testid="desktop-filter-panel"]',
    );
    await expect(panel).toBeVisible();

    const backgroundColor = await panel.evaluate(
      (element) => window.getComputedStyle(element).backgroundColor,
    );

    expect(backgroundColor).not.toBe("rgb(255, 255, 255)");
  });
});
