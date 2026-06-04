// Slice a nested `zones` array down to ≤20 cities total, max 5 per zone
export function buildCitiesByZone(zones = [], limit = 40, perZone = 16) {
  const out = [];
  let total = 0;

  for (const z of zones) {
    if (total >= limit) break;

    const slice = Array.isArray(z?.cities) ? z.cities.slice(0, perZone) : [];
    const remain = limit - total;
    const limited = slice.slice(0, remain);

    if (limited.length) {
      out.push({ id: z.id, cities: limited });
      total += limited.length;
    }
  }
  return out;
}
