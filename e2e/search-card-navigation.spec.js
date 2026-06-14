import { expect, test } from "@playwright/test";

const searchHouse = {
  uuid: "LUT01",
  name: "Kerman desert stay",
  image: "/images/houses/lut-house.jpg",
  galleries: [{ media: "/images/houses/lut-house-2.jpg" }],
  price: { initial: 2_400_000, final: 2_400_000 },
  vote: { total_vote: 4.8 },
  structure: { key: "traditional", label: "Traditional house" },
  address: {
    address: "Kerman, near Lut desert",
    city: {
      name: "Kerman",
      latitude: 30.5962,
      longitude: 57.8175,
      province: { name: "Kerman" },
    },
    geography: {
      latitude: 30.5962,
      longitude: 57.8175,
    },
  },
};

async function stubSearchApi(page) {
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

  await page.route("**/house", (route) =>
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
}

test.describe("search house card navigation", () => {
  test.beforeEach(async ({ page }) => {
    await stubSearchApi(page);
  });

  test("details use client navigation while gallery clicks stay on search", async ({
    page,
  }) => {
    await page.goto("/search?city=Kerman", { waitUntil: "domcontentloaded" });

    const card = page.getByTestId("search-house-card").first();
    await expect(card).toBeVisible();

    const gallery = card.getByTestId("search-house-card-gallery");
    const searchUrl = page.url();
    const beforeTransform = await gallery.evaluate((node) => node.style.transform);

    await gallery.click();

    await expect(page).toHaveURL(searchUrl);
    await expect
      .poll(() => gallery.evaluate((node) => node.style.transform))
      .not.toBe(beforeTransform);

    const houseDocumentRequests = [];
    page.on("request", (request) => {
      if (
        request.isNavigationRequest() &&
        request.resourceType() === "document" &&
        new URL(request.url()).pathname.startsWith("/house/")
      ) {
        houseDocumentRequests.push(request.url());
      }
    });

    await card.getByTestId("search-house-card-details-link").click();

    await expect(page).toHaveURL(/\/house\/LUT01$/);
    expect(houseDocumentRequests).toEqual([]);

    await page.goBack({ waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/search\?city=Kerman$/);
  });
});
