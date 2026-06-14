import { useEffect, useMemo, useState } from "react";
import { SEARCH_FALLBACK_HOUSES } from "../../fixtures/searchFallbackHouses";
import { fa } from "../../i18n/fa";
import { searchHouses } from "../../services/houseSearchService";
import { getHouseRatingValue } from "../../utils/houseCardData";
import { reportClientError } from "../../utils/reportClientError";

export const toNumber = (value) => {
  const number = typeof value === "string" ? parseFloat(value) : value;
  return Number.isFinite(number) ? number : null;
};

const buildImages = (item) => {
  const images = [
    item?.image,
    ...(Array.isArray(item?.galleries)
      ? item.galleries.map((gallery) => gallery?.media)
      : []),
  ].filter(Boolean);

  return Array.from(new Set(images));
};

const getLatLng = (item) => {
  const lat =
    toNumber(item?.address?.geography?.latitude) ??
    toNumber(item?.address?.city?.latitude);
  const lng =
    toNumber(item?.address?.geography?.longitude) ??
    toNumber(item?.address?.city?.longitude);

  return { lat, lng };
};

const mapApiHouseToUI = (item) => {
  const { lat, lng } = getLatLng(item);
  const images = buildImages(item);
  const initial = toNumber(item?.price?.initial);
  const final = toNumber(item?.price?.final);

  return {
    id: item?.uuid,
    uuid: item?.uuid,
    name: item?.name,
    avatar: images[0] || "/house.jpg",
    images: images.length ? images : ["/house.jpg"],
    price: final ?? initial ?? 0,
    originalPrice: initial && final && initial !== final ? initial : null,
    rooms: item?.rooms ?? null,
    score: getHouseRatingValue(item),
    featured: Boolean(item?.is_special),
    lat,
    lng,
    structure: item?.structure?.label,
    structureKey: item?.structure?.key,
    city: item?.address?.city?.name,
    province: item?.address?.city?.province?.name,
    address: item?.address?.address,
  };
};

const mapApiList = (list) =>
  (Array.isArray(list) ? list : [])
    .map(mapApiHouseToUI)
    .filter((house) => house.lat != null && house.lng != null);

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\u200c/g, "")
    .toLowerCase();

function filterFallbackHouses(items, filters) {
  const cityName = normalizeText(filters.city);
  const provinceName = normalizeText(filters.province);
  const placeName = normalizeText(filters.place);

  if (!cityName && !provinceName && !placeName) return items;

  return items.filter((house) => {
    const haystack = [
      house.name,
      house.city,
      house.province,
      house.structure,
      house.address,
    ]
      .map(normalizeText)
      .join(" ");

    return (
      (cityName && haystack.includes(cityName)) ||
      (provinceName && haystack.includes(provinceName)) ||
      (placeName && haystack.includes(placeName))
    );
  });
}

export function parseDestination(searchParamsKey) {
  const params = new URLSearchParams(searchParamsKey);
  const label =
    params.get("q") ||
    params.get("place") ||
    params.get("city") ||
    params.get("province") ||
    "";
  const city = params.get("city") || "";
  const province = params.get("province") || "";

  return {
    label,
    city,
    province,
    lat: toNumber(params.get("lat")),
    lng: toNumber(params.get("lng")),
    city_id: toNumber(params.get("city_id")),
    province_id: toNumber(params.get("province_id")),
    zone_id: toNumber(params.get("zone_id") || params.get("zone_ref")),
    subtitle: [city, province].filter(Boolean).join(fa.search.separators.location),
  };
}

export function buildSearchFilters(destination) {
  return {
    city_id: destination.city_id,
    province_id: destination.province_id,
    zone_id: destination.zone_id,
    city: destination.city,
    province: destination.province,
    place: destination.label,
  };
}

export function buildSelectedPlace(destination) {
  if (!destination.label) return null;

  return {
    label: destination.label,
    subtitle: destination.subtitle,
    lat: destination.lat,
    lng: destination.lng,
  };
}

export function useDefaultSearchData(filters = {}, initialSearchData = null) {
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);
  const initialMatches = initialSearchData?.filtersKey === filtersKey;
  const initialMappedItems = useMemo(
    () => (initialMatches ? mapApiList(initialSearchData.rawItems) : []),
    [initialMatches, initialSearchData],
  );
  const initialItems = useMemo(
    () =>
      initialMappedItems.length
        ? initialMappedItems
        : filterFallbackHouses(SEARCH_FALLBACK_HOUSES, filters),
    [filters, initialMappedItems],
  );
  const [data, setData] = useState({
    items: initialMatches ? initialItems : SEARCH_FALLBACK_HOUSES,
    loading: !initialMatches,
    error: null,
    usingFallback: !initialMatches || initialMappedItems.length === 0,
  });

  useEffect(() => {
    if (initialMatches) {
      setData({
        items: initialItems,
        loading: false,
        error: null,
        usingFallback: initialMappedItems.length === 0,
      });
      return undefined;
    }

    const controller = new AbortController();
    const activeFilters = JSON.parse(filtersKey || "{}");
    const fallbackItems = filterFallbackHouses(
      SEARCH_FALLBACK_HOUSES,
      activeFilters,
    );

    (async () => {
      try {
        const raw = await searchHouses(activeFilters, {
          signal: controller.signal,
        });
        const mapped = mapApiList(raw);
        const items = mapped.length ? mapped : fallbackItems;

        setData({
          items,
          loading: false,
          error: null,
          usingFallback: mapped.length === 0,
        });
      } catch (error) {
        if (
          error?.name === "CanceledError" ||
          error?.code === "ERR_CANCELED" ||
          error?.message === "canceled"
        ) {
          return;
        }

        reportClientError("Search results fetch; using fallback listings", error);
        setData({
          items: fallbackItems,
          loading: false,
          error,
          usingFallback: true,
        });
      }
    })();

    return () => controller.abort();
  }, [filtersKey, initialMatches, initialItems, initialMappedItems.length]);

  return data;
}
