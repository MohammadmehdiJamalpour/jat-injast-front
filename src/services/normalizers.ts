import type { ApiEnvelope } from "../types/api";

export type HttpResponse<T> = {
  data: ApiEnvelope<T> | T;
};

export function unwrapData<T>(response: HttpResponse<T>): T {
  const payload = response.data;

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

export function listFrom<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function numberFrom(value: unknown, fallback = 0): number {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : fallback;
}

export function stringFrom(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
