import { expect, test } from "@playwright/test";

const user = {
  id: 1,
  name: "کاربر تست",
  phone: "09120000000",
  type: "Customer",
  wallet: { main: 1200000, blocked: 0 },
};

const house = {
  uuid: "HOUSE-1",
  name: "اقامتگاه ساحلی",
  title: "اقامتگاه ساحلی",
  image: "/assets/favorite-1.jpg",
  galleries: [],
  is_rent_room: false,
  instant_booking: false,
  room: [],
  description: "اقامتگاه مناسب سفر خانوادگی.",
  address: {
    address: "گیلان، رشت",
    geography: { latitude: 37.2808, longitude: 49.5832 },
    city: { name: "رشت", province: { name: "گیلان" } },
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

const payableReserve = {
  id: 11,
  uuid: "RES-1",
  nights: 2,
  status: { key: "accepted", label: "Accepted" },
  can_update_to: [{ key: "accepted", label: "Accepted", color: "0, 111, 140" }],
  can_replay: true,
  house: {
    uuid: "HOUSE-1",
    name: "House",
    address: { city: { name: "City" } },
  },
  guest: { name: "Guest" },
  vendor: { name: "Host" },
  reserve: {
    locale_format: "1403/01/01 - 1403/01/03",
  },
  invoice: {
    total: 2500000,
    links: { pay_available: true },
  },
};

const ticketDepartments = {
  departments: [{ id: 1, title: "Support" }],
  priorities: [{ key: "normal", title: "Normal" }],
};

async function addAuthCookie(page) {
  await page.context().addCookies([
    {
      name: "authToken",
      value: "test-token",
      url: "http://127.0.0.1:3004",
    },
  ]);
}

async function stubDashboardApi(page, options = {}) {
  const activeReserves = options.activeReserves ?? [];
  const previousReserves = options.previousReserves ?? [];
  const reserveDetail = options.reserveDetail ?? activeReserves[0] ?? null;

  await page.route("**/client/profile", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: user }),
    }),
  );

  await page.route("**/client/wallet/**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.route("**/client/ticket/departments", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: ticketDepartments }),
    }),
  );

  await page.route("**/client/ticket", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data:
          route.request().method() === "POST"
            ? { id: 77, subject: "Support request", messages: [] }
            : [],
      }),
    }),
  );

  await page.route("**/client/reserve/list/active", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: activeReserves }),
    }),
  );

  await page.route("**/client/reserve/list/previous", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: previousReserves }),
    }),
  );

  await page.route("**/client/reserve/*/message", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.route("**/client/reserve/*/payment/start", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { uuid: "PAY-1", amount: 2500000, method: "sandbox_card", status: "created" },
      }),
    }),
  );

  await page.route("**/client/reserve/*/payment/confirm", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          uuid: "PAY-1",
          amount: 2500000,
          method: "sandbox_card",
          status: "success",
          tracking_code: "TRACK-1",
        },
      }),
    }),
  );

  await page.route("**/client/reserve/*/payment", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: null }),
    }),
  );

  await page.route("**/client/reserve/*", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: reserveDetail }),
    }),
  );
}

async function stubHouseApi(page) {
  await page.route("**/content/footer**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: {} }),
    }),
  );

  await page.route("**/api/house/HOUSE-1/calendar**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.route("**/api/house/HOUSE-1/comments**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.route("**/api/house/HOUSE-1/similar**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );

  await page.route("**/api/house/HOUSE-1", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: house }),
    }),
  );
}

async function expectActiveElementInside(locator) {
  await expect
    .poll(() =>
      locator.evaluate((element) => element.contains(document.activeElement)),
    )
    .toBe(true);
}

async function expectFocusStaysInside(locator, page, presses = 4) {
  for (let index = 0; index < presses; index += 1) {
    await page.keyboard.press("Tab");
    await expectActiveElementInside(locator);
  }
}

test.describe("authenticated accessibility workflows", () => {
  test("dashboard sidebar supports keyboard tab movement", async ({ page }) => {
    await stubDashboardApi(page);
    await addAuthCookie(page);

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.locator("body").waitFor({ state: "visible" });

    const tabs = page.getByRole("tab");
    await expect(tabs.first()).toBeVisible();

    await tabs.first().focus();
    await expect(tabs.first()).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThanOrEqual(6);

    await tabs.nth(tabCount - 1).focus();
    await expect(tabs.nth(tabCount - 1)).toBeFocused();
  });

  test("wallet modal traps focus and restores it after close", async ({ page }) => {
    await stubDashboardApi(page);
    await addAuthCookie(page);

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.locator("body").waitFor({ state: "visible" });

    await page.getByRole("tab").nth(2).click();
    const chargeTrigger = page.locator("main button").nth(2);
    await expect(chargeTrigger).toBeVisible();
    await chargeTrigger.focus();
    await chargeTrigger.click();

    const dialog = page.locator('[role="dialog"][data-open]').first();
    await expect(dialog).toBeAttached();
    await expectActiveElementInside(dialog);
    await expectFocusStaysInside(dialog, page);

    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"][data-open]')).toHaveCount(0);
    await expect(chargeTrigger).toBeFocused();
  });

  test("ticket creation exposes keyboard reachable required state", async ({ page }) => {
    await stubDashboardApi(page);
    await addAuthCookie(page);

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.locator("body").waitFor({ state: "visible" });

    await page.getByRole("tab").nth(6).click();
    await page.getByTestId("ticket-create-trigger").click();

    const form = page.locator("form").first();
    await expect(form).toBeVisible();

    const submit = page.getByTestId("ticket-submit");
    await expect(submit).toBeDisabled();

    const subject = form.locator("input").first();
    await subject.focus();
    await expect(subject).toBeFocused();
    await subject.fill("Reservation question");
    await expect(submit).toBeEnabled();
  });

  test("reservation payment modal keeps keyboard focus in dialog", async ({ page }) => {
    await stubDashboardApi(page, {
      activeReserves: [payableReserve],
      reserveDetail: payableReserve,
    });
    await addAuthCookie(page);

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await page.locator("body").waitFor({ state: "visible" });

    await page.getByRole("tab").nth(5).click();
    await page.locator("section button").last().click();

    const paymentTrigger = page.getByTestId("reservation-payment-trigger");
    await expect(paymentTrigger).toBeVisible();
    await paymentTrigger.focus();
    await paymentTrigger.click();

    const dialog = page.locator('[role="dialog"][data-open]').first();
    await expect(dialog).toBeAttached();
    await expectActiveElementInside(dialog);
    await expectFocusStaysInside(dialog, page);

    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"][data-open]')).toHaveCount(0);
    await expect(paymentTrigger).toBeFocused();
  });
});

test.describe("search accessibility workflow", () => {
  test("search controls are reachable by keyboard", async ({ page }) => {
    await page.route("**/house**", (route) =>
      route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [house] }),
      }),
    );
    await page.route("**/search/v2**", (route) =>
      route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ value: [] }),
      }),
    );

    await page.goto("/search", { waitUntil: "domcontentloaded" });
    await page.locator("body").waitFor({ state: "visible" });

    const firstControl = page
      .locator("button:visible, input:visible, select:visible, a[href]:visible")
      .first();
    await expect(firstControl).toBeVisible();
    await firstControl.focus();
    await expect(firstControl).toBeFocused();

    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element || element === document.body) return null;
      return {
        tag: element.tagName.toLowerCase(),
        role: element.getAttribute("role"),
        type: element.getAttribute("type"),
      };
    });

    expect(focused).not.toBeNull();
  });
});

test.describe("house detail accessibility workflow", () => {
  test("house detail exposes RTL document structure and named controls", async ({
    page,
  }) => {
    await stubHouseApi(page);
    await page.goto("/house/HOUSE-1", { waitUntil: "domcontentloaded" });
    await page.locator("body").waitFor({ state: "visible" });
    await page.waitForTimeout(600);

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("main").first()).toBeVisible();

    const unnamedControls = await page
      .locator("button:visible, a[href]:visible")
      .evaluateAll((elements) =>
        elements.filter((element) => {
          const label = element.getAttribute("aria-label")?.trim();
          const title = element.getAttribute("title")?.trim();
          const text = element.textContent?.replace(/\s+/g, " ").trim();
          return !label && !title && !text;
        }).length,
      );

    expect(unnamedControls).toBe(0);
  });
});
