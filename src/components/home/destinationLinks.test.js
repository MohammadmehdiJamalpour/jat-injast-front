import { describe, expect, it } from "vitest";
import { buildDestinationHref } from "./destinationLinks";

describe("buildDestinationHref", () => {
  it("builds search query params from a popular destination", () => {
    const href = buildDestinationHref({
      id: 9,
      slug: "lut-desert",
      name: "کویر لوت",
      city: {
        id: 3,
        name: "کرمان",
        slug: "kerman",
        province: { id: 1, name: "کرمان" },
      },
    });

    const url = new URL(href, "http://localhost");

    expect(url.pathname).toBe("/search");
    expect(url.searchParams.get("destination")).toBe("lut-desert");
    expect(url.searchParams.get("q")).toBe("کویر لوت");
    expect(url.searchParams.get("place")).toBe("کویر لوت");
    expect(url.searchParams.get("city")).toBe("کرمان");
    expect(url.searchParams.get("lat")).toBe("30.5962");
    expect(url.searchParams.get("lng")).toBe("57.8175");
  });

  it("falls back to city coordinates when destination coordinates are not predefined", () => {
    const href = buildDestinationHref({
      name: "ماسال",
      city: {
        id: 7,
        name: "ماسال",
        slug: "masal",
        latitude: 37.3621,
        longitude: 49.1329,
      },
    });

    const url = new URL(href, "http://localhost");

    expect(url.searchParams.get("destination")).toBe("masal");
    expect(url.searchParams.get("lat")).toBe("37.3621");
    expect(url.searchParams.get("lng")).toBe("49.1329");
  });
});
