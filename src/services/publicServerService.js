import "server-only";

import { buildHouseSearchPayload } from "./houseSearchPayload";
import { resolveBrowserMediaUrl, trimTrailingSlash, withProtocol } from "./mediaUrl";

const API_REVALIDATE_SECONDS = 300;
const HOME_REVALIDATE_SECONDS = 600;
const ASSET_REVALIDATE_SECONDS = 3600;
const DEFAULT_BACKEND_URL = "http://127.0.0.1:8000";
const API_FETCH_TIMEOUT_MS = 8000;

const LEGACY_STORAGE_PREFIX = process.env.NEXT_PUBLIC_API_STORAGE_PREFIX;
const LEGACY_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

function getPublicSiteUrl() {
  const value =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (!value) return null;

  return trimTrailingSlash(withProtocol(value));
}

function resolveApiBaseUrl(value) {
  if (!value) return null;

  if (/^https?:\/\//i.test(value)) {
    return trimTrailingSlash(value);
  }

  if (value.startsWith("/")) {
    const siteUrl = getPublicSiteUrl();
    return siteUrl ? `${siteUrl}${trimTrailingSlash(value)}` : null;
  }

  return null;
}

function getPublicApiBaseUrls() {
  const candidates = [
    process.env.BACKEND_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    "/api",
    DEFAULT_BACKEND_URL,
  ]
    .map(resolveApiBaseUrl)
    .filter(Boolean);

  return Array.from(new Set(candidates));
}

function getFetchTimeoutSignal() {
  return typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
    ? AbortSignal.timeout(API_FETCH_TIMEOUT_MS)
    : undefined;
}

function resolveMediaUrl(value) {
  if (typeof value !== "string") return value;

  if (LEGACY_STORAGE_PREFIX && LEGACY_CDN_URL && value.includes(LEGACY_STORAGE_PREFIX)) {
    return value.replace(LEGACY_STORAGE_PREFIX, `${withProtocol(LEGACY_CDN_URL)}/storage`);
  }

  return resolveBrowserMediaUrl(value);
}

function normalizeResponseUrls(data) {
  if (Array.isArray(data)) return data.map(normalizeResponseUrls);
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, normalizeResponseUrls(value)]),
    );
  }
  return resolveMediaUrl(data);
}

async function publicApiFetch(path, { method = "GET", body, tags = [], revalidate } = {}) {
  for (const baseUrl of getPublicApiBaseUrls()) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        signal: getFetchTimeoutSignal(),
        next: {
          revalidate: revalidate ?? API_REVALIDATE_SECONDS,
          tags,
        },
      });

      if (!response.ok) continue;

      const payload = await response.json();
      return normalizeResponseUrls(payload?.data ?? payload);
    } catch {
      // Try the next configured base URL. Production can render via /api if
      // the internal compose host is temporarily unreachable.
    }
  }

  return null;
}

export async function getPublicHomeContent() {
  return publicApiFetch("/content/homepage", {
    tags: ["public:home"],
    revalidate: HOME_REVALIDATE_SECONDS,
  });
}

export async function getPublicFooterContent() {
  return publicApiFetch("/content/footer", {
    tags: ["public:footer"],
    revalidate: HOME_REVALIDATE_SECONDS,
  });
}

export async function getPublicZones() {
  return publicApiFetch("/assets/zone", {
    tags: ["public:zones"],
    revalidate: ASSET_REVALIDATE_SECONDS,
  });
}

export async function getPublicHouseData(uuid) {
  if (!uuid) return null;

  return publicApiFetch(`/house/${encodeURIComponent(uuid)}`, {
    tags: ["public:houses", `public:house:${uuid}`],
    revalidate: API_REVALIDATE_SECONDS,
  });
}

export async function getPublicSimilarHouses(uuid) {
  if (!uuid) return [];

  const data = await publicApiFetch(`/house/${encodeURIComponent(uuid)}/similar`, {
    tags: ["public:houses", `public:house:${uuid}:similar`],
    revalidate: API_REVALIDATE_SECONDS,
  });

  return Array.isArray(data) ? data : [];
}

export async function getPublicSearchHouses(filters = {}, options = {}) {
  const payload = buildHouseSearchPayload(filters, options);
  const data = await publicApiFetch("/house", {
    method: "POST",
    body: payload,
    tags: ["public:house-search"],
    revalidate: API_REVALIDATE_SECONDS,
  });

  return Array.isArray(data) ? data : [];
}

export async function getPublicHouseCalendar(uuid) {
  if (!uuid) return null;

  return publicApiFetch(`/house/${encodeURIComponent(uuid)}/calendar`, {
    tags: ["public:house-calendar", `public:house:${uuid}:calendar`],
    revalidate: API_REVALIDATE_SECONDS,
  });
}
