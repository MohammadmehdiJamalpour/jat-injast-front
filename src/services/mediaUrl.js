const INTERNAL_HOST_PATTERNS = [
  /(^|\.)jatinjast-backend$/i,
  /^localhost$/i,
  /^127(?:\.\d{1,3}){3}$/i,
];

export const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
export const trimLeadingSlash = (value = "") => value.replace(/^\/+/, "");

export const withProtocol = (value = "") =>
  !value || /^https?:\/\//i.test(value) ? value : `https://${value}`;

export function isInternalMediaHost(value) {
  if (!value || value.startsWith("/")) return false;

  try {
    const { hostname } = new URL(withProtocol(value));
    return INTERNAL_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
  } catch {
    return false;
  }
}

export function getPublicMediaBaseUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL,
    process.env.NEXT_PUBLIC_CDN_URL,
  ];

  return (
    candidates
      .filter(Boolean)
      .map(withProtocol)
      .find((value) => !isInternalMediaHost(value)) || ""
  );
}

export function isBackendMediaPath(value) {
  if (typeof value !== "string") return false;

  if (value.startsWith("/media/") || value.startsWith("media/")) return true;

  if (!/^https?:\/\//i.test(value)) return false;

  try {
    return new URL(value).pathname.startsWith("/media/");
  } catch {
    return false;
  }
}

export function resolveBrowserMediaUrl(value, mediaBaseUrl = getPublicMediaBaseUrl()) {
  if (typeof value !== "string") return value;

  if (value.startsWith("/media/")) {
    return mediaBaseUrl ? `${trimTrailingSlash(mediaBaseUrl)}${value}` : value;
  }

  if (value.startsWith("media/")) {
    return mediaBaseUrl
      ? `${trimTrailingSlash(mediaBaseUrl)}/${trimLeadingSlash(value)}`
      : `/${trimLeadingSlash(value)}`;
  }

  if (/^https?:\/\//i.test(value) && isInternalMediaHost(value)) {
    try {
      const url = new URL(value);
      if (url.pathname.startsWith("/media/")) {
        return mediaBaseUrl
          ? `${trimTrailingSlash(mediaBaseUrl)}${url.pathname}${url.search}`
          : `${url.pathname}${url.search}`;
      }
    } catch {
      return value;
    }
  }

  return value;
}
