import { fa } from "../i18n/fa";

const DEFAULT_MESSAGE = fa.common.errors.unexpected;

export function normalizeApiError(error) {
  const response = error?.response;
  const data = response?.data;
  const errors = data?.errors || data?.error || null;

  return {
    status: response?.status ?? null,
    message: data?.message || error?.message || DEFAULT_MESSAGE,
    errors,
    fields: errors?.fields || data?.fields || {},
    raw: error,
  };
}

export function getApiErrorMessage(error, fallback = DEFAULT_MESSAGE) {
  return normalizeApiError(error).message || fallback;
}
