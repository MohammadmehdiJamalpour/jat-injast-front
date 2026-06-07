import { describe, expect, it } from "vitest";

import { normalizeMapIrResults } from "./mapIrSearchService";

describe("normalizeMapIrResults", () => {
  it("normalizes feature geometry into map results", () => {
    const results = normalizeMapIrResults({
      features: [
        {
          id: "place-1",
          properties: {
            title: "تهران",
            address: "میدان آزادی",
            province: "تهران",
            city: "تهران",
          },
          geometry: {
            coordinates: [51.337, 35.699],
          },
        },
      ],
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "place-1",
        title: "تهران",
        address: "میدان آزادی",
        lat: 35.699,
        lon: 51.337,
        lng: 51.337,
      }),
    ]);
  });

  it("drops results without usable coordinates", () => {
    expect(normalizeMapIrResults({ value: [{ title: "بدون مختصات" }] })).toEqual(
      [],
    );
  });
});
