import { afterEach, describe, expect, it } from "vitest";

import {
  getDashboardAuthCookieNames,
  hasDashboardAuthCookie,
} from "./auth";

function createCookieStore(cookies) {
  return {
    get(name) {
      const value = cookies[name];
      return value ? { name, value } : undefined;
    },
  };
}

describe("dashboard auth cookie gate", () => {
  const originalAuthCookieName = process.env.AUTH_COOKIE_NAME;

  afterEach(() => {
    if (originalAuthCookieName == null) {
      delete process.env.AUTH_COOKIE_NAME;
    } else {
      process.env.AUTH_COOKIE_NAME = originalAuthCookieName;
    }
  });

  it("treats requests without an auth cookie as forbidden", () => {
    expect(hasDashboardAuthCookie(createCookieStore({}))).toBe(false);
  });

  it("accepts the configured HttpOnly cookie name", () => {
    process.env.AUTH_COOKIE_NAME = "__Host-custom_auth";

    expect(getDashboardAuthCookieNames()).toContain("__Host-custom_auth");
    expect(
      hasDashboardAuthCookie(
        createCookieStore({ "__Host-custom_auth": "session-id" }),
      ),
    ).toBe(true);
  });

  it("accepts the legacy readable auth cookie during migration", () => {
    expect(
      hasDashboardAuthCookie(createCookieStore({ authToken: "legacy-token" })),
    ).toBe(true);
  });
});
