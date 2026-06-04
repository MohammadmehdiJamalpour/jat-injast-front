import http from "./httpService";

const isPlainObj = (v) => v && typeof v === "object" && !Array.isArray(v);

const cleanObject = (obj) => {
  const out = {};
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v) && v.length === 0) return;
    if (typeof v === "string" && v.trim() === "") return;
    if (isPlainObj(v)) {
      const cleaned = cleanObject(v);
      if (Object.keys(cleaned).length === 0) return;
      out[k] = cleaned;
      return;
    }
    out[k] = v;
  });
  return out;
};

const toISODate = (d) => {
  if (!d) return undefined;
  if (d.gregorianDate instanceof Date) {
    return d.gregorianDate.toISOString().slice(0, 10);
  }
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  if (typeof d === "string") return d.slice(0, 10);
  if (typeof d === "object" && d.year && d.month && d.day) {
    const date = new Date(Date.UTC(d.year, (d.month || 1) - 1, d.day || 1));
    return date.toISOString().slice(0, 10);
  }
  return undefined;
};

export function buildHouseSearchPayload(filters = {}, options = {}) {
  const { dateRange, people, price, bedsRooms } = filters || {};

  let check_in = toISODate(dateRange?.from);
  let check_out = toISODate(dateRange?.to);
  if (check_in && check_out && check_in > check_out) {
    [check_in, check_out] = [check_out, check_in];
  }

  const payload = {
    check_in,
    check_out,
    guests: Number.isFinite(people) ? people : undefined,

    price_min: Array.isArray(price) ? price[0] : undefined,
    price_max: Array.isArray(price) ? price[1] : undefined,

    bedrooms : bedsRooms?.bedrooms,
    beds     : bedsRooms?.beds,
    rooms    : bedsRooms?.rooms,
    bathrooms: bedsRooms?.bathrooms,

    views          : filters.propertyViews,
    structure_type : filters.structureType,
    region         : filters.region,
    ownership_type : filters.ownershipType,
    amenities      : filters.amenities,
    rules          : filters.rules,
    property_type  : filters.propertyType,

    sort: options.sort,

    city_id    : filters.city_id ?? filters.cityId,
    province_id: filters.province_id ?? filters.provinceId,
    zone_id    : filters.zone_id ?? filters.zoneId,
  };

  const page = Number.isFinite(options.page) ? options.page : 1;
  const per_page = Number.isFinite(options.perPage) ? options.perPage : 20;

  return cleanObject({ ...payload, page, per_page });
}

export async function searchHouses(filters = {}, options = {}) {
  const payload = buildHouseSearchPayload(filters, options);

  const config = {};
  if (options.signal) config.signal = options.signal;

  const { data } = await http.post("/house", payload, config);
  return data?.data;
}

export async function searchHousesWithMeta(filters = {}, options = {}) {
  const payload = buildHouseSearchPayload(filters, options);
  const config = {};
  if (options.signal) config.signal = options.signal;

  const { data } = await http.post("/house", payload, config);
  return {
    items: data?.data,
    meta : data?.meta,
    links: data?.links,
  };
}
