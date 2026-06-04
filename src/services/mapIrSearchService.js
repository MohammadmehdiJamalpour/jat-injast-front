import axios from "axios";

const MAPIR_ENDPOINTS = {
  search: "/api/map-ir/search",
  autocomplete: "/api/map-ir/autocomplete",
};

const mapIrClient = axios.create({
  timeout: 12000,
});

function toNumber(value) {
  const number = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(number) ? number : null;
}

function collectCoordinatePairs(value, pairs = []) {
  if (!Array.isArray(value)) return pairs;

  const lon = toNumber(value[0]);
  const lat = toNumber(value[1]);

  if (lon != null && lat != null) {
    pairs.push([lon, lat]);
    return pairs;
  }

  value.forEach((item) => collectCoordinatePairs(item, pairs));
  return pairs;
}

function getCenterPair(coordinates) {
  const pairs = collectCoordinatePairs(coordinates);
  if (!pairs.length) return null;

  const totals = pairs.reduce(
    (sum, [lon, lat]) => ({ lon: sum.lon + lon, lat: sum.lat + lat }),
    { lon: 0, lat: 0 },
  );

  return [totals.lon / pairs.length, totals.lat / pairs.length];
}

export function normalizeMapIrResults(data) {
  const rawItems =
    data?.features ||
    data?.value ||
    data?.items ||
    data?.results ||
    data?.data ||
    (Array.isArray(data) ? data : []);

  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .map((item, index) => {
      const properties = item?.properties || item || {};
      const geometry = item?.geom || item?.geometry || properties?.geom || {};
      const pair = getCenterPair(
        geometry?.coordinates || properties?.coordinates || item?.coordinates,
      );
      const lon = toNumber(pair?.[0]);
      const lat = toNumber(pair?.[1]);
      const title =
        properties?.title ||
        properties?.Title ||
        item?.title ||
        properties?.name ||
        properties?.address ||
        "نتیجه";

      return {
        id: properties?.id || item?.id || `${title}-${index}`,
        title,
        address: properties?.address || properties?.Address || title,
        province: properties?.province || properties?.Province || "",
        city: properties?.city || properties?.City || "",
        type: properties?.type || geometry?.type || "",
        fclass: properties?.fclass || properties?.Fclass || "",
        lat,
        lon,
        lng: lon,
        raw: item,
      };
    })
    .filter((item) => item.lat != null && item.lon != null);
}

function buildPayload(text, options = {}) {
  const payload = { text };

  if (options.select) payload["$select"] = options.select;
  if (options.filter) payload["$filter"] = options.filter;
  if (options.polygon) payload.polygon = options.polygon;

  const lat = toNumber(options.lat);
  const lon = toNumber(options.lon);

  if (lat != null) payload.lat = lat;
  if (lon != null) payload.lon = lon;

  return payload;
}

async function requestMapIr(endpoint, text, options = {}) {
  const cleanText = String(text || "").trim();

  if (!cleanText) return [];

  const { data } = await mapIrClient.post(
    endpoint,
    buildPayload(cleanText, options),
    { signal: options.signal },
  );

  return normalizeMapIrResults(data);
}

export function searchMapIr(text, options = {}) {
  return requestMapIr(MAPIR_ENDPOINTS.search, text, options);
}

export function autocompleteMapIr(text, options = {}) {
  return requestMapIr(MAPIR_ENDPOINTS.autocomplete, text, options);
}
