import { describe, expect, it } from "vitest";
import { listFrom, numberFrom, stringFrom, unwrapData } from "./normalizers";

describe("service normalizers", () => {
  it("unwraps API envelopes", () => {
    expect(unwrapData({ data: { success: true, message: "ok", data: { id: 1 } } })).toEqual({
      id: 1,
    });
  });

  it("returns raw response data when no envelope is present", () => {
    expect(unwrapData({ data: [{ id: 1 }] })).toEqual([{ id: 1 }]);
  });

  it("normalizes lists from unknown values", () => {
    expect(listFrom([1, 2])).toEqual([1, 2]);
    expect(listFrom(null)).toEqual([]);
  });

  it("normalizes primitive values with fallbacks", () => {
    expect(numberFrom("42")).toBe(42);
    expect(numberFrom("bad", 7)).toBe(7);
    expect(stringFrom("value")).toBe("value");
    expect(stringFrom(null, "fallback")).toBe("fallback");
  });
});
