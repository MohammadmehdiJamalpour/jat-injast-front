import { reportClientWarning } from "../utils/reportClientError";

const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const EMPTY_TILE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export function getMapIrApiKey() {
  return (
    process.env.NEXT_PUBLIC_MAPIR_API_KEY ||
    process.env.MAPIR_API_KEY ||
    ""
  ).trim();
}

export function getMapIrBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_MAPIR_BASE_URL ||
    process.env.MAPIR_BASE_URL ||
    "https://map.ir"
  ).replace(/\/+$/, "");
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

function createHeaderWmsLayer(L, apiKey, options = {}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_MAPIR_WMS_URL ||
    `${getMapIrBaseUrl()}/shiveh`;
  const layers =
    process.env.NEXT_PUBLIC_MAPIR_WMS_LAYERS ||
    "Shiveh:Shiveh";

  const HeaderWmsLayer = L.TileLayer.WMS.extend({
    createTile(coords, done) {
      const tile = document.createElement("img");
      tile.alt = "";
      tile.setAttribute("role", "presentation");

      fetch(this.getTileUrl(coords), {
        headers: { "x-api-key": apiKey },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Map.ir tile failed with ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          tile.onload = () => {
            URL.revokeObjectURL(objectUrl);
            done(null, tile);
          };
          tile.onerror = (error) => {
            URL.revokeObjectURL(objectUrl);
            tile.onload = null;
            tile.onerror = null;
            tile.src = EMPTY_TILE;
            done(error, tile);
          };
          tile.src = objectUrl;
        })
        .catch((error) => {
          tile.src = EMPTY_TILE;
          done(error, tile);
        });

      return tile;
    },
  });

  return new HeaderWmsLayer(baseUrl, {
    layers,
    format: "image/png",
    transparent: false,
    version: "1.1.1",
    minZoom: 1,
    maxZoom: 20,
    tileSize: 128,
    attribution: getMapIrAttribution(),
    ...options,
  });
}

function createTemplateTileLayer(L, apiKey, options = {}) {
  const template = process.env.NEXT_PUBLIC_MAPIR_TILE_URL;

  if (!template) {
    return null;
  }

  return L.tileLayer(template.replaceAll("{apiKey}", apiKey), {
    attribution: getMapIrAttribution(),
    ...options,
  });
}

export function createMapIrTileLayer(L, options = {}) {
  const apiKey = getMapIrApiKey();

  if (!apiKey) {
    reportClientWarning("[Map.ir] Missing API key. Falling back to OpenStreetMap tiles.");
    return createFallbackTileLayer(L, options);
  }

  return (
    createTemplateTileLayer(L, apiKey, options) ||
    createHeaderWmsLayer(L, apiKey, options)
  );
}
