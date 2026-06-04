import { fa } from "@/i18n/fa";

const DESTINATION_COORDS = {
  coast: { lat: 26.5416, lng: 53.9903 },
  "coral-beach": { lat: 26.5218, lng: 54.0174 },
  waterfall: { lat: 36.8897, lng: 50.6264 },
  "lut-desert": { lat: 30.5962, lng: 57.8175 },
};

export function buildDestinationHref(zone) {
  const params = new URLSearchParams();
  const city = zone?.city;
  const province = city?.province;
  const destinationCoords = DESTINATION_COORDS[zone?.slug] || {};
  const lat = destinationCoords.lat ?? city?.latitude;
  const lng = destinationCoords.lng ?? city?.longitude;
  const label = zone?.name || city?.name || fa.search.place.fallbackDestination;

  params.set("destination", zone?.slug || city?.slug || String(zone?.id || city?.id || label));
  params.set("q", label);
  params.set("place", label);

  if (zone?.id) {
    params.set("zone_id", String(zone.id));
    params.set("zone_ref", String(zone.id));
  }
  if (city?.id) params.set("city_id", String(city.id));
  if (city?.name) params.set("city", city.name);
  if (province?.id) params.set("province_id", String(province.id));
  if (province?.name) params.set("province", province.name);
  if (lat) params.set("lat", String(lat));
  if (lng) params.set("lng", String(lng));

  return `/search?${params.toString()}`;
}
