import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearClientAuthState,
  hasReadableAuthToken,
} from "./httpService";

function installCookieDocument(initialCookie, protocol = "https:") {
  let cookie = initialCookie;

  vi.stubGlobal("document", {
    get cookie() {
      return cookie;
    },
    set cookie(value) {
      cookie = value;
    },
  });
  vi.stubGlobal("window", {
    location: { protocol },
  });

  return () => cookie;
}

describe("legacy auth cookie handling", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("clears the legacy auth cookie with secure attributes on logout", () => {
    const getCookie = installCookieDocument("authToken=legacy-token");

    expect(hasReadableAuthToken()).toBe(true);

    clearClientAuthState();

    expect(getCookie()).toContain("authToken=;");
    expect(getCookie()).toContain("Max-Age=0");
    expect(getCookie()).toContain("path=/");
    expect(getCookie()).toContain("SameSite=Strict");
    expect(getCookie()).toContain("Secure");
    expect(hasReadableAuthToken()).toBe(false);
  });
});
