import { reportClientWarning } from "../utils/reportClientError";

const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export function getMapIrBaseUrl() {
  return (process.env.NEXT_PUBLIC_MAPIR_BASE_URL || "https://map.ir").replace(
    /\/+$/,
    "",
  );
}

export function getMapIrAttribution() {
  return '&copy; <a href="https://map.ir" target="_blank" rel="noreferrer">Map.ir</a>';
}

function createFallbackTileLayer(L, options = {}) {
  return L.tileLayer(OSM_TILE_URL, {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    ...options,
  });
}

function createTemplateTileLayer(L, options = {}) {
  const template = process.env.NEXT_PUBLIC_MAPIR_TILE_URL;

  if (!template) {
    return null;
  }

  if (template.includes("{apiKey}")) {
    reportClientWarning(
      "[Map.ir] Public tile URL cannot contain API key placeholders. Falling back to OpenStreetMap tiles.",
    );
    return null;
  }

  return L.tileLayer(template, {
    attribution: getMapIrAttribution(),
    ...options,
  });
}

export function createMapIrTileLayer(L, options = {}) {
  const templateTileLayer = createTemplateTileLayer(L, options);

  if (templateTileLayer) {
    return templateTileLayer;
  }

  reportClientWarning(
    "[Map.ir] No public tile template configured. Falling back to OpenStreetMap tiles.",
  );
  return createFallbackTileLayer(L, options);
}
