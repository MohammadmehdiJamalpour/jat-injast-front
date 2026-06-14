import http from "./httpService";
import { buildHouseSearchPayload } from "./houseSearchPayload";
import type {
  HouseSearchApiItem,
  HouseSearchFilters,
  HouseSearchOptions,
  HouseSearchResult,
} from "../types/api";

export { buildHouseSearchPayload };

export async function searchHouses(
  filters: HouseSearchFilters = {},
  options: HouseSearchOptions = {},
): Promise<HouseSearchApiItem[]> {
  const payload = buildHouseSearchPayload(filters, options);

  const config: { signal?: AbortSignal } = {};
  if (options.signal) config.signal = options.signal;

  const { data } = await http.post("/house", payload, config);
  return Array.isArray(data?.data) ? data.data : [];
}

export async function searchHousesWithMeta(
  filters: HouseSearchFilters = {},
  options: HouseSearchOptions = {},
): Promise<HouseSearchResult> {
  const payload = buildHouseSearchPayload(filters, options);
  const config: { signal?: AbortSignal } = {};
  if (options.signal) config.signal = options.signal;

  const { data } = await http.post("/house", payload, config);
  return {
    items: Array.isArray(data?.data) ? data.data : [],
    meta : data?.meta,
    links: data?.links,
  };
}
