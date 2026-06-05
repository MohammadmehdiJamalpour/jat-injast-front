import { describe, expect, it } from "vitest";

import { getApiErrorMessage, normalizeApiError } from "./normalizeApiError";

describe("normalizeApiError", () => {
  it("normalizes DRF-style response errors", () => {
    const error = {
      response: {
        status: 422,
        data: {
          message: "اطلاعات وارد شده معتبر نیست.",
          errors: {
            fields: {
              phone: ["شماره تلفن معتبر نیست."],
            },
          },
        },
      },
    };

    const normalized = normalizeApiError(error);

    expect(normalized.status).toBe(422);
    expect(normalized.message).toBe("اطلاعات وارد شده معتبر نیست.");
    expect(normalized.errors).toEqual({
      fields: {
        phone: ["شماره تلفن معتبر نیست."],
      },
    });
    expect(normalized.fields.phone).toEqual(["شماره تلفن معتبر نیست."]);
  });

  it("normalizes flat field errors from backend envelopes", () => {
    const normalized = normalizeApiError({
      response: {
        status: 400,
        data: {
          message: "فرم کامل نیست.",
          fields: {
            title: ["عنوان الزامی است."],
          },
        },
      },
    });

    expect(normalized.status).toBe(400);
    expect(normalized.message).toBe("فرم کامل نیست.");
    expect(normalized.fields.title).toEqual(["عنوان الزامی است."]);
  });

  it("supports singular error payloads", () => {
    const normalized = normalizeApiError({
      response: {
        status: 409,
        data: {
          error: {
            code: "date_overlap",
            detail: "این بازه قبلا رزرو شده است.",
          },
        },
      },
    });

    expect(normalized.status).toBe(409);
    expect(normalized.message).toBe("خطای غیرمنتظره رخ داد.");
    expect(normalized.errors).toEqual({
      code: "date_overlap",
      detail: "این بازه قبلا رزرو شده است.",
    });
  });

  it("falls back to the thrown message for network errors", () => {
    const normalized = normalizeApiError(new Error("Network Error"));

    expect(normalized.status).toBeNull();
    expect(normalized.message).toBe("Network Error");
    expect(normalized.fields).toEqual({});
  });

  it("returns a stable fallback when no useful error message exists", () => {
    expect(getApiErrorMessage({}, "خطای ارتباط با سرور")).toBe("خطای غیرمنتظره رخ داد.");
  });
});
