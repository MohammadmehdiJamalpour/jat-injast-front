import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

function restoreEnv() {
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGINAL_ENV)) {
      delete process.env[key];
    }
  }
  Object.assign(process.env, ORIGINAL_ENV);
}

async function getGlobalHeaders(env = {}) {
  restoreEnv();
  Object.assign(process.env, env);
  vi.resetModules();
  const { default: nextConfig } = await import("../../next.config.mjs");
  const routes = await nextConfig.headers();
  return Object.fromEntries(
    routes
      .find((route) => route.source === "/(.*)")
      .headers.map(({ key, value }) => [key, value]),
  );
}

describe("security headers", () => {
  afterEach(() => {
    restoreEnv();
    vi.resetModules();
  });

  it("configures the required production response hardening headers", async () => {
    const globalHeaders = await getGlobalHeaders();

    expect(globalHeaders["Content-Security-Policy"]).toContain(
      "default-src 'self'",
    );
    expect(globalHeaders["Content-Security-Policy"]).toContain(
      "frame-ancestors 'none'",
    );
    expect(globalHeaders["X-Frame-Options"]).toBe("DENY");
    expect(globalHeaders["X-Content-Type-Options"]).toBe("nosniff");
    expect(globalHeaders["Referrer-Policy"]).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(globalHeaders["Permissions-Policy"]).toContain("camera=()");
  });

  it("keeps required map and observability endpoints in connect-src", async () => {
    const globalHeaders = await getGlobalHeaders({
      NEXT_PUBLIC_WEB_VITALS_ENDPOINT:
        "https://metrics.jat-injast.local/vitals",
    });

    expect(globalHeaders["Content-Security-Policy"]).toContain("connect-src");
    expect(globalHeaders["Content-Security-Policy"]).toContain("https://map.ir");
    expect(globalHeaders["Content-Security-Policy"]).toContain("https://*.map.ir");
    expect(globalHeaders["Content-Security-Policy"]).toContain(
      "https://metrics.jat-injast.local",
    );
  });
});
