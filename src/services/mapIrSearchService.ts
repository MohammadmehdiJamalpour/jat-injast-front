import axios from "axios";

const MAPIR_ENDPOINTS = {
  search: "/api/map-ir/search",
  autocomplete: "/api/map-ir/autocomplete",
};

const mapIrClient = axios.create({
  timeout: 12000,
});

type CoordinatePair = [number, number];

type MapIrOptions = {
  select?: string;
  filter?: string;
  polygon?: string;
  lat?: number | string;
  lon?: number | string;
  signal?: AbortSignal;
};

type MapIrPayload = {
  text: string;
  "$select"?: string;
  "$filter"?: string;
  polygon?: string;
  lat?: number;
  lon?: number;
};

export type MapIrResult = {
  id: string;
  title: string;
  address: string;
  province: string;
  city: string;
  type: string;
  fclass: string;
  lat: number;
  lon: number;
  lng: number;
  raw: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toNumber(value: unknown): number | null {
  const number = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(number) ? (number as number) : null;
}

function collectCoordinatePairs(
  value: unknown,
  pairs: CoordinatePair[] = [],
): CoordinatePair[] {
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

function getCenterPair(coordinates: unknown): CoordinatePair | null {
  const pairs = collectCoordinatePairs(coordinates);
  if (!pairs.length) return null;

  const totals = pairs.reduce(
    (sum, [lon, lat]) => ({ lon: sum.lon + lon, lat: sum.lat + lat }),
    { lon: 0, lat: 0 },
  );

  return [totals.lon / pairs.length, totals.lat / pairs.length];
}

function textValue(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function normalizeMapIrResults(data: unknown): MapIrResult[] {
  const source = isRecord(data) ? data : {};
  const rawItems =
    source.features ||
    source.value ||
    source.items ||
    source.results ||
    source.data ||
    (Array.isArray(data) ? data : []);

  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .map((item, index) => {
      const record = isRecord(item) ? item : {};
      const propertiesSource = record.properties || record;
      const properties = isRecord(propertiesSource) ? propertiesSource : {};
      const geometrySource = record.geom || record.geometry || properties.geom || {};
      const geometry = isRecord(geometrySource) ? geometrySource : {};
      const pair = getCenterPair(
        geometry.coordinates || properties.coordinates || record.coordinates,
      );
      const lon = toNumber(pair?.[0]);
      const lat = toNumber(pair?.[1]);
      const title = textValue(
        properties.title ||
          properties.Title ||
          record.title ||
          properties.name ||
          properties.address,
        "نتیجه",
      );

      return {
        id: String(properties.id || record.id || `${title}-${index}`),
        title,
        address: textValue(properties.address || properties.Address, title),
        province: textValue(properties.province || properties.Province),
        city: textValue(properties.city || properties.City),
        type: textValue(properties.type || geometry.type),
        fclass: textValue(properties.fclass || properties.Fclass),
        lat,
        lon,
        lng: lon,
        raw: item,
      };
    })
    .filter((item): item is MapIrResult => item.lat != null && item.lon != null);
}

function buildPayload(text: string, options: MapIrOptions = {}): MapIrPayload {
  const payload: MapIrPayload = { text };

  if (options.select) payload["$select"] = options.select;
  if (options.filter) payload["$filter"] = options.filter;
  if (options.polygon) payload.polygon = options.polygon;

  const lat = toNumber(options.lat);
  const lon = toNumber(options.lon);

  if (lat != null) payload.lat = lat;
  if (lon != null) payload.lon = lon;

  return payload;
}

async function requestMapIr(
  endpoint: string,
  text: string,
  options: MapIrOptions = {},
): Promise<MapIrResult[]> {
  const cleanText = String(text || "").trim();

  if (!cleanText) return [];

  const { data } = await mapIrClient.post(endpoint, buildPayload(cleanText, options), {
    signal: options.signal,
  });

  return normalizeMapIrResults(data);
}

export function searchMapIr(
  text: string,
  options: MapIrOptions = {},
): Promise<MapIrResult[]> {
  return requestMapIr(MAPIR_ENDPOINTS.search, text, options);
}

export function autocompleteMapIr(
  text: string,
  options: MapIrOptions = {},
): Promise<MapIrResult[]> {
  return requestMapIr(MAPIR_ENDPOINTS.autocomplete, text, options);
}
