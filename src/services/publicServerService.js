import "server-only";

import { buildHouseSearchPayload } from "./houseSearchPayload";

const API_REVALIDATE_SECONDS = 300;
const HOME_REVALIDATE_SECONDS = 600;
const ASSET_REVALIDATE_SECONDS = 3600;
const DEFAULT_BACKEND_URL = "http://127.0.0.1:8000";

const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  DEFAULT_BACKEND_URL;
const LEGACY_STORAGE_PREFIX = process.env.NEXT_PUBLIC_API_STORAGE_PREFIX;
const LEGACY_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const trimLeadingSlash = (value = "") => value.replace(/^\/+/, "");
const withProtocol = (value = "") =>
  !value || /^https?:\/\//i.test(value) ? value : `https://${value}`;

function getPublicApiBaseUrl() {
  const explicit =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL;

  if (explicit && /^https?:\/\//i.test(explicit)) {
    return trimTrailingSlash(explicit);
  }

  return DEFAULT_BACKEND_URL;
}

function resolveMediaUrl(value) {
  if (typeof value !== "string") return value;

  if (value.startsWith("/media/") && MEDIA_BASE_URL) {
    return `${trimTrailingSlash(MEDIA_BASE_URL)}${value}`;
  }

  if (value.startsWith("media/") && MEDIA_BASE_URL) {
    return `${trimTrailingSlash(MEDIA_BASE_URL)}/${trimLeadingSlash(value)}`;
  }

  if (LEGACY_STORAGE_PREFIX && LEGACY_CDN_URL && value.includes(LEGACY_STORAGE_PREFIX)) {
    return value.replace(LEGACY_STORAGE_PREFIX, `${withProtocol(LEGACY_CDN_URL)}/storage`);
  }

  return value;
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
  try {
    const response = await fetch(`${getPublicApiBaseUrl()}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      next: {
        revalidate: revalidate ?? API_REVALIDATE_SECONDS,
        tags,
      },
    });

    if (!response.ok) return null;

    const payload = await response.json();
    return normalizeResponseUrls(payload?.data ?? payload);
  } catch {
    return null;
  }
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
