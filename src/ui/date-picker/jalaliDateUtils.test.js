import { describe, expect, it } from "vitest";

import {
  buildJalaliMonth,
  createJalaliDate,
  gregorianIsoToJalaliDate,
  parseJalaliDate,
  toPersianDigits,
} from "./jalaliDateUtils";

describe("jalaliDateUtils", () => {
  it("creates Jalali dates with Gregorian ISO payloads", () => {
    const date = createJalaliDate(1404, 7, 20);

    expect(date.iso).toBe("1404-07-20");
    expect(date.gregorianIso).toBe("2025-10-12");
    expect(date.value).toBe(14040720);
    expect(date.display).toBe("\u06f2\u06f0 \u0645\u0647\u0631 \u06f1\u06f4\u06f0\u06f4");
  });

  it("converts existing Gregorian profile dates into Jalali picker values", () => {
    const date = gregorianIsoToJalaliDate("1990-05-12T00:00:00.000Z");

    expect(date).toEqual(
      expect.objectContaining({
        iso: "1369-02-22",
        gregorianIso: "1990-05-12",
        jy: 1369,
        jm: 2,
        jd: 22,
      }),
    );
  });

  it("keeps empty and invalid profile dates conservative", () => {
    expect(gregorianIsoToJalaliDate("")).toBeNull();
    expect(gregorianIsoToJalaliDate(null)).toBeNull();
    expect(gregorianIsoToJalaliDate("2025-02-30")).toBeNull();
  });

  it("rejects invalid Jalali input and builds calendar cells", () => {
    expect(parseJalaliDate("1404-01-01")?.gregorianIso).toBe("2025-03-21");
    expect(() => parseJalaliDate("1404/01/01")).toThrow(/YYYY-MM-DD/);
    expect(() => parseJalaliDate("1404-12-31")).toThrow(/Invalid Jalali date/);
    expect(buildJalaliMonth(1404, 1)[6].date?.iso).toBe("1404-01-01");
  });

  it("formats Persian digits", () => {
    expect(toPersianDigits("1404-07-20")).toBe("\u06f1\u06f4\u06f0\u06f4-\u06f0\u06f7-\u06f2\u06f0");
  });
});
