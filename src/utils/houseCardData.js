export const toFiniteNumber = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();
    if (!normalized) return null;
    const number = Number(normalized);
    return Number.isFinite(number) ? number : null;
  }
  return null;
};

export function getHouseRatingValue(source) {
  const vote = source?.vote;

  if (vote && typeof vote === "object") {
    return (
      toFiniteNumber(vote.total_vote) ??
      toFiniteNumber(vote.average) ??
      toFiniteNumber(vote.score) ??
      null
    );
  }

  return (
    toFiniteNumber(source?.score) ??
    toFiniteNumber(source?.rating) ??
    toFiniteNumber(vote) ??
    null
  );
}

export function getHouseRatingCount(source) {
  const vote = source?.vote;
  if (vote && typeof vote === "object") {
    return toFiniteNumber(vote.count);
  }
  return toFiniteNumber(source?.ratingCount) ?? toFiniteNumber(source?.vote_count);
}

const imageOf = (item) => {
  if (typeof item === "string") return item;
  return item?.media || item?.image || item?.url || null;
};

export function getHouseImages(source) {
  const images = [
    source?.image,
    imageOf(source?.main_image),
    ...(Array.isArray(source?.images) ? source.images.map(imageOf) : []),
    ...(Array.isArray(source?.galleries) ? source.galleries.map(imageOf) : []),
    source?.avatar,
  ].filter(Boolean);

  return Array.from(new Set(images));
}

export function normalizeHouseCardData(source) {
  if (!source) return null;

  const images = getHouseImages(source);
  const price = source.price;
  const initialPrice =
    typeof price === "object" && price !== null
      ? toFiniteNumber(price.initial)
      : toFiniteNumber(source.originalPrice);
  const finalPrice =
    typeof price === "object" && price !== null
      ? toFiniteNumber(price.final) ?? initialPrice
      : toFiniteNumber(price);
  const address = source.address && typeof source.address === "object" ? source.address : {};
  const city = address.city && typeof address.city === "object" ? address.city : null;
  const province = city?.province && typeof city.province === "object" ? city.province : null;
  const structure = source.structure;
  const structureLabel =
    structure && typeof structure === "object"
      ? structure.label || structure.title || structure.name || structure.key
      : structure;
  const structureKey =
    structure && typeof structure === "object"
      ? structure.key || structure.value
      : source.structureKey;
  const rooms =
    toFiniteNumber(source.rooms) ??
    (Array.isArray(source.room) ? source.room.length : null);
  const score = getHouseRatingValue(source);

  return {
    ...source,
    id: source.uuid ?? source.id,
    uuid: source.uuid ?? source.id,
    name: source.name ?? source.title,
    avatar: images[0] || "/house.jpg",
    images: images.length ? images : ["/house.jpg"],
    image: images[0] || source.image || "/house.jpg",
    price: finalPrice ?? 0,
    originalPrice:
      initialPrice && finalPrice && initialPrice !== finalPrice ? initialPrice : null,
    rooms,
    score,
    ratingCount: getHouseRatingCount(source),
    featured: Boolean(source.is_special ?? source.featured),
    structure: structureLabel,
    structureKey,
    city: source.city?.name || source.city || city?.name,
    province: source.province?.name || source.province || province?.name,
    address: address.address || source.address?.text || source.address,
  };
}
