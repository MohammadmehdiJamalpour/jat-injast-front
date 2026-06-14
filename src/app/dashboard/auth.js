const DEFAULT_HTTP_ONLY_AUTH_COOKIE_NAME = "__Host-jat_auth";
const LEGACY_AUTH_COOKIE_NAME = "authToken";

export function getDashboardAuthCookieNames() {
  return Array.from(
    new Set(
      [
        process.env.AUTH_COOKIE_NAME,
        DEFAULT_HTTP_ONLY_AUTH_COOKIE_NAME,
        "jat_auth",
        LEGACY_AUTH_COOKIE_NAME,
      ].filter(Boolean),
    ),
  );
}

export function hasDashboardAuthCookie(cookieStore) {
  return getDashboardAuthCookieNames().some((name) =>
    Boolean(cookieStore.get(name)?.value),
  );
}
