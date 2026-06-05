import { describe, expect, it } from "vitest";

import { persianToEnglishDigits } from "./numberHelpers";
import { toLatin, toPersian } from "./toPersianDigits";
import toPersianNumber from "./toPersianNumber";

describe("Persian number utilities", () => {
  it("formats plain numeric values with Persian digits and separators", () => {
    expect(toPersianNumber(1234567)).toBe("۱,۲۳۴,۵۶۷");
  });

  it("preserves non-digit separators while localizing digits", () => {
    expect(toPersianNumber("1405/03/14")).toBe("۱۴۰۵/۰۳/۱۴");
    expect(toPersianNumber("IR-1234-56")).toBe("IR-۱۲۳۴-۵۶");
  });

  it("converts Latin, Persian, and Arabic digits at the text boundary", () => {
    expect(toPersian("room 204")).toBe("room ۲۰۴");
    expect(toLatin("واحد ۲۰۴")).toBe("واحد 204");
    expect(persianToEnglishDigits("قیمت ۱۲۳ و ٤٥")).toBe("قیمت 123 و 45");
  });

  it("keeps empty values predictable", () => {
    expect(toPersianNumber(null)).toBe("");
    expect(toPersianNumber(undefined)).toBe("");
    expect(persianToEnglishDigits(null)).toBeNull();
    expect(persianToEnglishDigits(undefined)).toBeUndefined();
  });
});
