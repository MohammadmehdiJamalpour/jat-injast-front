import { expect, test } from "@playwright/test";
import http from "node:http";

const BACKEND_PORT = Number(process.env.E2E_BACKEND_PORT || 8000);

const house = {
  uuid: "HOUSE-MOBILE-PAYMENT",
  id: "HOUSE-MOBILE-PAYMENT",
  name: "Mobile Payment Transition House",
  title: "Mobile Payment Transition House",
  image: "/assets/favorite-1.jpg",
  galleries: [{ media: "/assets/favorite-2.jpg", title: "Yard" }],
  is_rent_room: false,
  instant_booking: false,
  room: [],
  description: "Fixture for mobile reservation payment modal transition checks.",
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

const user = {
  uuid: "USER-1",
  first_name: "Test",
  last_name: "User",
  phone_number: "09120000000",
};

const reservation = {
  uuid: "RES-MOBILE-PAYMENT",
  status: { key: "pending", title: "Pending" },
  total_price: 5000000,
  invoice: { total: 5000000 },
  payment_status: { key: "created", title: "Created" },
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

function ok(data) {
  return JSON.stringify({ success: true, data });
}

function readJsonBody(request) {
  return new Promise((resolve) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function makePayment(scenario, uuid = "PAY-MOBILE-PAYMENT") {
  const statusMap = {
    success: { key: "success", label: "Paid", color: "22, 163, 74" },
    failed: { key: "failed", label: "Failed", color: "220, 38, 38" },
    pending: { key: "pending", label: "Pending", color: "217, 119, 6" },
    created: { key: "created", label: "Created", color: "107, 114, 128" },
  };

  return {
    uuid,
    reservation_uuid: reservation.uuid,
    tracking_code: `TRACK-${scenario.toUpperCase()}`,
    method: "sandbox_card",
    method_label: "Sandbox card",
    amount: reservation.total_price,
    status: statusMap[scenario] || statusMap.created,
    failure_reason: scenario === "failed" ? "Sandbox failure reason" : "",
  };
}

function startBackendMock() {
  let currentPayment = null;
  let paymentCounter = 0;

  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url || "/", `http://127.0.0.1:${BACKEND_PORT}`);

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
        ok({
          nav_columns: [],
          locations: [],
          downloads: [],
          socials: [],
          trust_badges: [],
        }),
      );
      return;
    }

    if (url.pathname === "/client/profile") {
      response.end(ok(user));
      return;
    }

    if (url.pathname === "/house/HOUSE-MOBILE-PAYMENT") {
      response.end(ok(house));
      return;
    }

    if (url.pathname === "/house/HOUSE-MOBILE-PAYMENT/similar") {
      response.end(ok([]));
      return;
    }

    if (url.pathname === "/house/HOUSE-MOBILE-PAYMENT/comments") {
      response.end(ok([]));
      return;
    }

    if (url.pathname === "/house/HOUSE-MOBILE-PAYMENT/calendar") {
      const requestedMonth = Number(url.searchParams.get("month") || 3);
      response.end(ok(makeCalendarMonth(requestedMonth)));
      return;
    }

    if (url.pathname === "/reserve/pre-invoice") {
      response.end(ok({ total: 5000000, nights: 2 }));
      return;
    }

    if (url.pathname === "/client/reserve" && request.method === "POST") {
      response.end(ok(reservation));
      return;
    }

    if (url.pathname === "/client/reserve/RES-MOBILE-PAYMENT/payment") {
      response.end(ok(currentPayment));
      return;
    }

    if (
      url.pathname === "/client/reserve/RES-MOBILE-PAYMENT/payment/start" &&
      request.method === "POST"
    ) {
      paymentCounter += 1;
      currentPayment = makePayment("created", `PAY-MOBILE-PAYMENT-${paymentCounter}`);
      response.end(ok(currentPayment));
      return;
    }

    if (
      url.pathname === "/client/reserve/RES-MOBILE-PAYMENT/payment/confirm" &&
      request.method === "POST"
    ) {
      const body = await readJsonBody(request);
      currentPayment = makePayment(
        body.scenario || "pending",
        body.payment_uuid || `PAY-MOBILE-PAYMENT-${paymentCounter}`,
      );
      response.end(ok(currentPayment));
      return;
    }

    response.writeHead(404);
    response.end(ok(null));
  });

  return new Promise((resolve, reject) => {
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        resolve(null);
        return;
      }
      reject(error);
    });
    server.listen(BACKEND_PORT, "127.0.0.1", () => {
      resolve(server);
    });
  });
}

function stopBackendMock(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

test.describe("mobile reservation payment modal transition", () => {
  let backendServer;

  test.beforeEach(async () => {
    backendServer = await startBackendMock();
  });

  test.afterEach(async () => {
    if (backendServer) await stopBackendMock(backendServer);
  });

  test("collapses the mobile reservation sheet before opening payment above it", async ({
    page,
  }) => {
    test.skip(!backendServer, `Port ${BACKEND_PORT} is already in use by another backend.`);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/house/HOUSE-MOBILE-PAYMENT", {
      waitUntil: "domcontentloaded",
    });

    const sheet = page.getByTestId("mobile-reservation-sheet");
    await expect(sheet).toBeVisible();
    await sheet.locator("button").first().click();
    await expect(sheet).toHaveAttribute("data-expanded", "true");

    await page.getByTestId("mobile-reservation-date-trigger").click();
    const calendarSheet = page.getByTestId("mobile-reservation-calendar-sheet");
    await expect(calendarSheet).toBeVisible();

    const selectableDays = calendarSheet.locator('button[aria-disabled="false"]');
    await selectableDays.nth(2).click();
    await selectableDays.nth(4).click();
    await expect(calendarSheet).toBeHidden();
    await expect(sheet).toHaveAttribute("data-expanded", "true");

    await page.getByTestId("mobile-reservation-submit").click();

    await expect
      .poll(() =>
        page.evaluate(() => {
          const reservationSheet = document.querySelector(
            '[data-testid="mobile-reservation-sheet"]',
          );
          return {
            expanded: reservationSheet?.getAttribute("data-expanded"),
            paymentMounted: Boolean(
              document.querySelector('[data-testid="payment-simulator-modal"]'),
            ),
          };
        }),
      )
      .toEqual({ expanded: "false", paymentMounted: false });

    const paymentModal = page.getByTestId("payment-simulator-modal");
    const paymentPanel = page.getByTestId("payment-simulator-modal-panel");
    await expect(paymentPanel).toBeVisible();

    const compactMetrics = await page.evaluate(() => {
      const panel = document.querySelector('[data-testid="payment-simulator-modal-panel"]');
      const successButton = document.querySelector('[data-testid="payment-scenario-success"]');
      const failedButton = document.querySelector('[data-testid="payment-scenario-failed"]');
      const pendingButton = document.querySelector('[data-testid="payment-scenario-pending"]');
      const panelRect = panel.getBoundingClientRect();
      const buttonRects = [successButton, failedButton, pendingButton].map((button) => {
        const rect = button.getBoundingClientRect();
        return { height: rect.height, width: rect.width };
      });

      return {
        panelTop: panelRect.top,
        panelBottom: panelRect.bottom,
        panelHeight: panelRect.height,
        viewportHeight: window.innerHeight,
        buttonRects,
      };
    });

    expect(compactMetrics.panelTop).toBeGreaterThanOrEqual(76);
    expect(compactMetrics.panelBottom).toBeLessThanOrEqual(
      compactMetrics.viewportHeight - 8,
    );
    expect(compactMetrics.panelHeight).toBeLessThan(620);
    for (const rect of compactMetrics.buttonRects) {
      expect(rect.height).toBeGreaterThanOrEqual(52);
      expect(rect.height).toBeLessThanOrEqual(76);
      expect(rect.width).toBeGreaterThan(300);
    }

    const layers = await page.evaluate(() => {
      const reservationSheet = document.querySelector(
        '[data-testid="mobile-reservation-sheet"]',
      );
      const payment = document.querySelector(
        '[data-testid="payment-simulator-modal"]',
      );
      return {
        sheet: Number(getComputedStyle(reservationSheet).zIndex),
        payment: Number(getComputedStyle(payment).zIndex),
      };
    });

    expect(layers.payment).toBeGreaterThan(layers.sheet);

    for (const scenario of ["success", "failed", "pending"]) {
      await page.getByTestId(`payment-scenario-${scenario}`).click();
      await expect(page.getByTestId("payment-receipt")).toBeVisible();
      await expect(page.getByText(`TRACK-${scenario.toUpperCase()}`)).toBeVisible();
    }

    const receiptHeight = await page
      .getByTestId("payment-receipt")
      .evaluate((element) => element.getBoundingClientRect().height);
    expect(receiptHeight).toBeLessThan(360);

    await paymentModal.locator("button").first().click();
    await expect(paymentPanel).toBeHidden();
    await expect(sheet).toHaveAttribute("data-expanded", "false");
  });
});
