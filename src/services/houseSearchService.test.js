import { describe, expect, it } from "vitest";

import { buildHouseSearchPayload } from "./houseSearchService";

describe("buildHouseSearchPayload", () => {
  it("normalizes date ranges and swaps inverted ranges", () => {
    const payload = buildHouseSearchPayload({
      dateRange: {
        from: "2026-06-20T00:00:00.000Z",
        to: "2026-06-14T00:00:00.000Z",
      },
    });

    expect(payload.check_in).toBe("2026-06-14");
    expect(payload.check_out).toBe("2026-06-20");
  });

  it("supports calendar objects, Date objects, and gregorianDate values", () => {
    expect(
      buildHouseSearchPayload({
        dateRange: {
          from: { year: 2026, month: 6, day: 14 },
          to: { gregorianDate: new Date(Date.UTC(2026, 5, 16)) },
        },
      }),
    ).toMatchObject({
      check_in: "2026-06-14",
      check_out: "2026-06-16",
    });

    expect(
      buildHouseSearchPayload({
        dateRange: {
          from: new Date(Date.UTC(2026, 5, 18)),
          to: new Date(Date.UTC(2026, 5, 19)),
        },
      }),
    ).toMatchObject({
      check_in: "2026-06-18",
      check_out: "2026-06-19",
    });
  });

  it("removes empty filters and keeps explicit numeric values", () => {
    const payload = buildHouseSearchPayload({
      people: 0,
      price: [],
      amenities: [],
      region: "",
      bedsRooms: {
        bedrooms: 2,
        rooms: undefined,
      },
    });

    expect(payload).toMatchObject({ guests: 0, bedrooms: 2, page: 1, per_page: 20 });
    expect(payload).not.toHaveProperty("price_min");
    expect(payload).not.toHaveProperty("amenities");
    expect(payload).not.toHaveProperty("region");
    expect(payload).not.toHaveProperty("rooms");
  });

  it("maps search filters, destination ids, sort, and pagination consistently", () => {
    const payload = buildHouseSearchPayload(
      {
        propertyViews: ["sea"],
        propertyType: ["villa"],
        ownershipType: "private",
        cityId: 12,
        province_id: 4,
        zoneId: "kish",
        bedsRooms: {
          beds: 3,
          bathrooms: 2,
        },
        price: [1000, 9000],
      },
      { page: 3, perPage: 12, sort: "price" },
    );

    expect(payload).toEqual({
      bathrooms: 2,
      beds: 3,
      city_id: 12,
      ownership_type: "private",
      page: 3,
      per_page: 12,
      price_max: 9000,
      price_min: 1000,
      property_type: ["villa"],
      province_id: 4,
      sort: "price",
      views: ["sea"],
      zone_id: "kish",
    });
  });
});
