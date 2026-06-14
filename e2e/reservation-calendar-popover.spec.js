import { expect, test } from "@playwright/test";
import http from "node:http";

const house = {
  uuid: "HOUSE-1",
  id: "HOUSE-1",
  name: "Calendar Popover Test House",
  title: "Calendar Popover Test House",
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
  description: "A compact fixture for reservation calendar popover checks.",
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

function makeCalendarMonth(month) {
  return {
    year: 1405,
    month,
    month_name: `Month ${month}`,
    days: Array.from({ length: 31 }, (_, index) => {
      const day = index + 1;
      return {
        day,
        date: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        gregorianDate: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        isBlank: false,
        isDisable: false,
        isLock: false,
        isToDay: day === 1,
        isHoliday: false,
        effective_price: 2500000,
        original_price: 2500000,
        has_discount: false,
        date_info: {
          gregorian: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          jalali: `1405/${month}/${day}`,
          label: `1405/${month}/${day}`,
        },
      };
    }),
  };
}

function backendPayload(data) {
  return JSON.stringify({ success: true, data });
}

function startBackendMock() {
  const server = http.createServer((request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1:8000");

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    response.setHeader("Content-Type", "application/json");

    if (url.pathname === "/content/footer") {
      response.end(
        backendPayload({
          nav_columns: [],
          locations: [],
          downloads: [],
          socials: [],
          trust_badges: [],
        }),
      );
      return;
    }

    if (url.pathname === "/house/HOUSE-1") {
      response.end(backendPayload(house));
      return;
    }

    if (url.pathname === "/house/HOUSE-1/similar") {
      response.end(backendPayload([]));
      return;
    }

    if (url.pathname === "/house/HOUSE-1/calendar") {
      const requestedMonth = Number(url.searchParams.get("month") || 3);
      response.end(backendPayload(makeCalendarMonth(requestedMonth)));
      return;
    }

    if (url.pathname === "/house/HOUSE-1/comments") {
      response.end(backendPayload([]));
      return;
    }

    response.writeHead(404);
    response.end(backendPayload(null));
  });

  return new Promise((resolve, reject) => {
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        resolve(null);
        return;
      }
      reject(error);
    });
    server.listen(8000, "127.0.0.1", () => {
      resolve(server);
    });
  });
}

function stopBackendMock(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function stubHouseApi(page, houseId = "HOUSE-1") {
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

  await page.route(`**/house/${houseId}/calendar**`, (route) => {
    const url = new URL(route.request().url());
    const requestedMonth = Number(url.searchParams.get("month") || 3);
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: makeCalendarMonth(requestedMonth),
      }),
    });
  });

  await page.route(`**/house/${houseId}/comments**`, (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.route(`**/house/${houseId}/similar**`, (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.route(`**/house/${houseId}**`, (route) => {
    const url = route.request().url();
    if (route.request().resourceType() === "document") {
      return route.fallback();
    }
    if (
      url.includes("/calendar") ||
      url.includes("/comments") ||
      url.includes("/similar")
    ) {
      return route.fallback();
    }

    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: house }),
    });
  });
}

test.describe("desktop reservation calendar popover", () => {
  let backendServer;

  test.beforeEach(async () => {
    backendServer = await startBackendMock();
  });

  test.afterEach(async () => {
    if (backendServer) await stopBackendMock(backendServer);
  });

  test("opens below the date inputs as a larger two-month popover without internal scroll", async ({
    page,
  }) => {
    const houseId = backendServer ? "HOUSE-1" : "9ZWQS";
    if (backendServer) await stubHouseApi(page, houseId);
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto(`/house/${houseId}`, { waitUntil: "domcontentloaded" });

    const dateButton = page.getByTestId("reservation-date-button");
    await expect(dateButton).toBeVisible();
    await dateButton.evaluate((element) =>
      element.scrollIntoView({ block: "center", inline: "nearest" }),
    );
    await dateButton.click();

    const popover = page.getByTestId("desktop-reservation-calendar-popover");
    await expect(popover).toBeVisible();

    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const panel = document.querySelector(
              '[data-testid="desktop-reservation-calendar-popover"]',
            );
            const panelRect = panel.getBoundingClientRect();
            return [...panel.querySelectorAll("h4")].filter((heading) => {
              const rect = heading.getBoundingClientRect();
              return (
                rect.width > 0 &&
                rect.height > 0 &&
                rect.left >= panelRect.left &&
                rect.right <= panelRect.right &&
                rect.bottom > panelRect.top &&
                rect.top < panelRect.bottom
              );
            }).length;
          }),
        { timeout: 10_000 },
      )
      .toBe(2);

    const geometry = await page.evaluate(() => {
      const dateButton = document.querySelector(
        '[data-testid="reservation-date-button"]',
      );
      const panel = document.querySelector(
        '[data-testid="desktop-reservation-calendar-popover"]',
      );
      const dateRect = dateButton.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const panelStyle = getComputedStyle(panel);
      const visibleMonthHeadings = [...panel.querySelectorAll("h4")].filter(
        (heading) => {
          const rect = heading.getBoundingClientRect();
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.left >= panelRect.left &&
            rect.right <= panelRect.right &&
            rect.bottom > panelRect.top &&
            rect.top < panelRect.bottom
          );
        },
      );

      return {
        dateButton: {
          bottom: dateRect.bottom,
        },
        panel: {
          left: panelRect.left,
          right: panelRect.right,
          top: panelRect.top,
          bottom: panelRect.bottom,
          width: panelRect.width,
          clientHeight: panel.clientHeight,
          scrollHeight: panel.scrollHeight,
          overflowY: panelStyle.overflowY,
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          scrollWidth: document.documentElement.scrollWidth,
        },
        visibleMonthCount: visibleMonthHeadings.length,
      };
    });

    expect(geometry.panel.width).toBeGreaterThanOrEqual(650);
    expect(geometry.panel.width).toBeLessThanOrEqual(760);
    expect(geometry.panel.left).toBeGreaterThanOrEqual(0);
    expect(geometry.panel.right).toBeLessThanOrEqual(geometry.viewport.width);
    expect(geometry.panel.top).toBeGreaterThanOrEqual(
      geometry.dateButton.bottom,
    );
    expect(geometry.panel.overflowY).toBe("visible");
    expect(geometry.panel.scrollHeight).toBe(geometry.panel.clientHeight);
    expect(geometry.viewport.scrollWidth).toBeLessThanOrEqual(
      geometry.viewport.width,
    );
    expect(geometry.visibleMonthCount).toBe(2);

    const selectableDays = popover.locator('button[aria-disabled="false"]');
    const selectableDayCount = await selectableDays.count();
    expect(selectableDayCount).toBeGreaterThan(36);
    await selectableDays.nth(2).click();
    await selectableDays.nth(35).click();
    await expect(popover).toBeHidden();
  });
});
