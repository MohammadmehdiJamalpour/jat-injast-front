const ALLOWED_SUFFIXES = new Set(["", "/autocomplete"]);
const JSON_CONTENT_TYPE = "application/json; charset=utf-8";
const MAX_REQUEST_BODY_LENGTH = 32_000;
const MAX_TEXT_LENGTH = 256;
const MAX_STRING_FIELD_LENGTH = 2_000;

function getMapIrApiKey() {
  return (process.env.MAPIR_API_KEY || "").trim();
}

function getMapIrBaseUrl() {
  const rawBaseUrl = (process.env.MAPIR_BASE_URL || "https://map.ir")
    .trim()
    .replace(/\/+$/, "");

  try {
    const url = new URL(rawBaseUrl);
    return url.protocol === "https:" || url.protocol === "http:"
      ? rawBaseUrl
      : "";
  } catch {
    return "";
  }
}

function jsonError(detail, status) {
  return Response.json(
    { detail },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function readJsonPayload(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType && !contentType.toLowerCase().includes("application/json")) {
    return { error: jsonError("Request body must be JSON.", 415) };
  }

  let text;
  try {
    text = await request.text();
  } catch {
    return { error: jsonError("Unable to read request body.", 400) };
  }

  if (!text.trim()) {
    return { error: jsonError("JSON body is required.", 400) };
  }

  if (text.length > MAX_REQUEST_BODY_LENGTH) {
    return { error: jsonError("Request body is too large.", 413) };
  }

  try {
    return { payload: JSON.parse(text) };
  } catch {
    return { error: jsonError("Invalid JSON body.", 400) };
  }
}

function normalizeStringField(payload, sourceKey, targetKey, target) {
  const value = payload[sourceKey];
  if (value == null) return null;
  if (typeof value !== "string") {
    return `${sourceKey} must be a string.`;
  }

  const trimmed = value.trim();
  if (trimmed.length > MAX_STRING_FIELD_LENGTH) {
    return `${sourceKey} is too long.`;
  }

  if (trimmed) target[targetKey] = trimmed;
  return null;
}

function normalizeCoordinate(payload, key, target) {
  const value = payload[key];
  if (value == null || value === "") return null;

  const number = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(number)) {
    return `${key} must be a number.`;
  }

  target[key] = number;
  return null;
}

function validatePayload(payload) {
  if (!isPlainObject(payload)) {
    return { error: jsonError("JSON body must be an object.", 400) };
  }

  if (typeof payload.text !== "string") {
    return { error: jsonError("text is required.", 400) };
  }

  const text = payload.text.trim();
  if (!text) {
    return { error: jsonError("text is required.", 400) };
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return { error: jsonError("text is too long.", 400) };
  }

  const safePayload = { text };
  const stringFields = [
    ["$select", "$select"],
    ["$filter", "$filter"],
    ["polygon", "polygon"],
  ];

  for (const [sourceKey, targetKey] of stringFields) {
    const message = normalizeStringField(
      payload,
      sourceKey,
      targetKey,
      safePayload,
    );
    if (message) return { error: jsonError(message, 400) };
  }

  for (const key of ["lat", "lon"]) {
    const message = normalizeCoordinate(payload, key, safePayload);
    if (message) return { error: jsonError(message, 400) };
  }

  return { payload: safePayload };
}

export async function proxyMapIrSearch(request, suffix = "") {
  if (!ALLOWED_SUFFIXES.has(suffix)) {
    return jsonError("Unsupported Map.ir route.", 404);
  }

  const apiKey = getMapIrApiKey();

  if (!apiKey) {
    return jsonError("Map.ir API key is not configured.", 500);
  }

  const baseUrl = getMapIrBaseUrl();
  if (!baseUrl) {
    return jsonError("Map.ir base URL is not configured correctly.", 500);
  }

  const parsedBody = await readJsonPayload(request);
  if (parsedBody.error) return parsedBody.error;

  const validatedBody = validatePayload(parsedBody.payload);
  if (validatedBody.error) return validatedBody.error;

  let response;

  try {
    response = await fetch(`${baseUrl}/search/v2${suffix}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(validatedBody.payload),
      cache: "no-store",
    });
  } catch {
    return jsonError("Map.ir service is not reachable.", 502);
  }

  if (!response.ok) {
    const status =
      response.status >= 400 && response.status < 500 ? response.status : 502;
    return jsonError("Map.ir request failed.", status);
  }

  const text = await response.text();
  const contentType = response.headers.get("content-type") || JSON_CONTENT_TYPE;

  return new Response(text, {
    status: response.status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": contentType,
    },
  });
}
