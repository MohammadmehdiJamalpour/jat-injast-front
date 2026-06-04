import { expect, test } from "@playwright/test";

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
  await page.route("**/assets/zone", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [destination] }),
    }),
  );

  await page.route("**/content/homepage", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: { homepage_sections: [] },
      }),
    }),
  );

  await page.route("**/content/footer", (route) =>
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

test.describe("destination search flow", () => {
  test.beforeEach(async ({ page }) => {
    await stubPublicApi(page);
  });

  test("opens search from a popular destination and preserves destination context", async ({
    page,
  }) => {
    await page.goto("/");

    const destinationCard = page.getByTestId("destination-card-lut-desert");
    await expect(destinationCard).toBeVisible();
    await destinationCard.click();

    await expect(page).toHaveURL(/\/search\?/);
    await expect(page).toHaveURL(/destination=lut-desert/);

    await expect(page.getByTestId("search-page")).toBeVisible();
    await expect(page.getByTestId("map-place-input")).toHaveValue("کویر لوت");
    await expect(page.getByTestId("search-listing-title")).toContainText(
      "کویر لوت",
    );
  });

  test("hydrates search page directly from destination query parameters", async ({
    page,
  }) => {
    await page.goto(
      "/search?destination=lut-desert&q=%DA%A9%D9%88%DB%8C%D8%B1%20%D9%84%D9%88%D8%AA&place=%DA%A9%D9%88%DB%8C%D8%B1%20%D9%84%D9%88%D8%AA&lat=30.5962&lng=57.8175",
    );

    await expect(page.getByTestId("search-page")).toBeVisible();
    await expect(page.getByTestId("map-place-input")).toHaveValue("کویر لوت");
    await expect(page.getByTestId("search-listing-title")).toContainText(
      "کویر لوت",
    );
  });
});
