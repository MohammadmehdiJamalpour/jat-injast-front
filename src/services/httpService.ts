import axios, { type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
const DEFAULT_BACKEND_URL = "http://127.0.0.1:8000";
const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  DEFAULT_BACKEND_URL;
const LEGACY_STORAGE_PREFIX = process.env.NEXT_PUBLIC_API_STORAGE_PREFIX;
const LEGACY_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;
export const LEGACY_AUTH_COOKIE_NAME = "authToken";

const trimTrailingSlash = (value = ""): string => value.replace(/\/+$/, "");
const trimLeadingSlash = (value = ""): string => value.replace(/^\/+/, "");

const withProtocol = (value?: string): string => {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

const getClientCookieAttributes = (): string[] => {
  const attributes = ["path=/", "SameSite=Strict"];
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    attributes.push("Secure");
  }
  return attributes;
};

export const getAuthTokenFromCookie = () => getCookie(LEGACY_AUTH_COOKIE_NAME);

export const hasReadableAuthToken = (): boolean =>
  Boolean(getAuthTokenFromCookie());

export const setAuthTokenInCookie = (token: string, expiryDays = 30): void => {
  if (!token || typeof document === "undefined") return;
  const expiresAt = new Date();
  expiresAt.setTime(expiresAt.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  document.cookie = `${LEGACY_AUTH_COOKIE_NAME}=${encodeURIComponent(
    token,
  )}; expires=${expiresAt.toUTCString()}; ${getClientCookieAttributes().join(
    "; ",
  )}`;
};

export const deleteAuthTokenCookie = (): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${LEGACY_AUTH_COOKIE_NAME}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${getClientCookieAttributes().join(
    "; ",
  )}`;
};

export const clearClientAuthState = deleteAuthTokenCookie;

const resolveMediaUrl = (value: unknown): unknown => {
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
};

const normalizeResponseUrls = (data: unknown): unknown => {
  if (Array.isArray(data)) return data.map(normalizeResponseUrls);
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, normalizeResponseUrls(value)]),
    );
  }
  return resolveMediaUrl(data);
};

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = getAuthTokenFromCookie();
  if (token) {
    const headers = config.headers as InternalAxiosRequestConfig["headers"] &
      Record<string, string>;
    headers.Authorization = `Token ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    response.data = normalizeResponseUrls(response.data);

    const responseData = response.data as {
      data?: { token?: unknown };
      token?: unknown;
    };
    const token = responseData?.data?.token || responseData?.token;
    if (typeof token === "string") {
      setAuthTokenInCookie(token);
    }

    return response;
  },
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      clearClientAuthState();
    }
    return Promise.reject(error);
  },
);

export default http;
