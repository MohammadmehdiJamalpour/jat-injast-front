import { describe, expect, it } from "vitest";

import { buildShowHouseQueryOptions } from "./useShowHouse";

describe("buildShowHouseQueryOptions", () => {
  it("does not cache null server data as initial house data", () => {
    const options = buildShowHouseQueryOptions("9ZWQS", { initialData: null });

    expect(options.initialData).toBeUndefined();
    expect(options.enabled).toBe(true);
  });

  it("uses valid server data as initial house data", () => {
    const house = { uuid: "9ZWQS", name: "Test house" };
    const options = buildShowHouseQueryOptions("9ZWQS", { initialData: house });

    expect(options.initialData).toBe(house);
  });
});
