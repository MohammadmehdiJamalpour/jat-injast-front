import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/about",
  "/terms-of-service",
  "/how-become-host",
  "/search",
  "/login",
];

const destination = {
  id: 10,
  slug: "lut-desert",
  name: "کویر لوت",
  avatar: "/images/destinations/lut.jpg",
  city: {
    id: 20,
    name: "کرمان",
    latitude: 30.5962,
    longitude: 57.8175,
    province: {
      id: 30,
      name: "کرمان",
    },
  },
};

const searchHouse = {
  uuid: "LUT01",
  name: "اقامتگاه کویری لوت",
  image: "/images/houses/lut-house.jpg",
  galleries: [],
  price: { initial: 2_400_000, final: 2_400_000 },
  vote: { total_vote: 4.8 },
  structure: { key: "traditional", label: "خانه سنتی" },
  address: {
    address: "کرمان، نزدیک کویر لوت",
    city: {
      name: "کرمان",
      latitude: 30.5962,
      longitude: 57.8175,
      province: { name: "کرمان" },
    },
    geography: {
      latitude: 30.5962,
      longitude: 57.8175,
    },
  },
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
      body: JSON.stringify({ success: true, data: [destination] }),
    }),
  );

  await page.route("**/house**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [searchHouse] }),
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
}

async function unnamedInteractiveElements(page) {
  return page
    .locator("button:visible, a[href]:visible")
    .evaluateAll((elements) =>
      elements
        .filter((element) => {
          const label = element.getAttribute("aria-label")?.trim();
          const title = element.getAttribute("title")?.trim();
          const text = element.textContent?.replace(/\s+/g, " ").trim();
          const labelledBy = element
            .getAttribute("aria-labelledby")
            ?.split(/\s+/)
            .map((id) => document.getElementById(id)?.textContent?.trim())
            .filter(Boolean)
            .join(" ");

          return !label && !title && !text && !labelledBy;
        })
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          href: element.getAttribute("href"),
          className: element.getAttribute("class"),
        })),
    );
}

async function imagesMissingAlt(page) {
  return page.locator("img:visible").evaluateAll((images) =>
    images
      .filter((image) => !image.hasAttribute("alt"))
      .map((image) => ({
        src: image.getAttribute("src"),
        className: image.getAttribute("class"),
      })),
  );
}

async function keyboardCanReachInteractiveElement(page) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element || element === document.body) return null;
      return {
        tag: element.tagName.toLowerCase(),
        role: element.getAttribute("role"),
        href: element.getAttribute("href"),
        type: element.getAttribute("type"),
      };
    });

    if (focused) return focused;
  }

  return null;
}

test.describe("public route accessibility smoke", () => {
  test.beforeEach(async ({ page }) => {
    await stubPublicApi(page);
  });

  for (const route of publicRoutes) {
    test(`${route} exposes core accessibility structure`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.locator("body").waitFor({ state: "visible" });
      await page.waitForTimeout(600);

      await expect(page.locator("html")).toHaveAttribute("lang", "fa");
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
      await expect(page.locator("main").first()).toBeVisible();

      expect(await unnamedInteractiveElements(page)).toEqual([]);
      expect(await imagesMissingAlt(page)).toEqual([]);
      expect(await keyboardCanReachInteractiveElement(page)).not.toBeNull();
    });
  }
});
