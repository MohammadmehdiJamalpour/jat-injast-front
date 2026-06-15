import { absoluteUrl, siteName } from "../../seo";
import { getPublicHouseData } from "../../../components/public/publicDataServer";
import { getHouseRatingCount, getHouseRatingValue } from "../../../utils/houseCardData";

export const HOUSE_TITLE_FALLBACK = "اقامتگاه";

export async function getHouseData(uuid) {
  return getPublicHouseData(uuid);
}

export function textValue(value, fallback = "") {
  if (!value) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  return value.label || value.name || value.title || value.value || fallback;
}

function firstTextValue(...values) {
  return values
    .map((value) => textValue(value).trim())
    .find(Boolean);
}

export function getHouseTitle(house, fallback = HOUSE_TITLE_FALLBACK) {
  return (
    firstTextValue(
      house?.name,
      house?.title,
      house?.display_name,
      house?.headline,
      house?.seo_title,
      house?.meta?.title,
      house?.metadata?.title,
    ) || fallback
  );
}

export function getHouseLocation(house) {
  const city =
    house?.address?.city?.name ||
    house?.city ||
    house?.address?.city ||
    "";
  const province =
    house?.address?.city?.province?.name ||
    house?.province ||
    "";
  const address = house?.address?.address || house?.address?.description || "";
  const parts = [province, city, address].filter(Boolean);
  return {
    city,
    province,
    address,
    label: parts.length ? parts.join("، ") : "موقعیت اقامتگاه مشخص نشده است",
    latitude:
      house?.address?.geography?.latitude ||
      house?.address?.city?.latitude ||
      house?.location?.lat ||
      house?.location?.latitude,
    longitude:
      house?.address?.geography?.longitude ||
      house?.address?.city?.longitude ||
      house?.location?.lng ||
      house?.location?.longitude,
  };
}

export function getHouseImages(house) {
  const mainImage = house?.image
    ? [{ url: house.image, alt: house.title || house.name || "تصویر اقامتگاه" }]
    : [];
  const galleryImages = Array.isArray(house?.galleries)
    ? house.galleries.map((item, index) => ({
        url: item.media || item.image || item.url,
        alt: item.title || item.alt || `تصویر ${index + 1} اقامتگاه`,
      }))
    : [];
  const typedImages = Array.isArray(house?.images)
    ? house.images.map((item, index) => ({
        url: item.media || item.image || item.url,
        alt: item.title || item.alt || `تصویر ${index + 1} اقامتگاه`,
      }))
    : [];

  return [...mainImage, ...galleryImages, ...typedImages]
    .filter((image) => image.url)
    .filter((image, index, items) => items.findIndex((item) => item.url === image.url) === index);
}

export function getHousePrice(house) {
  const price = house?.price;
  if (typeof price === "number") return price;
  return price?.final || price?.initial || house?.min_price || house?.base_price || null;
}

export function getHouseAmenities(house) {
  const facilities = Array.isArray(house?.facilities) ? house.facilities : [];
  return facilities
    .map((item) => textValue(item))
    .filter(Boolean)
    .slice(0, 12);
}

export function getHouseRules(house) {
  const ruleTypes = Array.isArray(house?.rules?.types) ? house.rules.types : [];
  const typedRules = ruleTypes.map((rule) => {
    const status = textValue(rule?.status);
    const description = rule?.description ? ` (${rule.description})` : "";
    return `${textValue(rule)} ${status}${description}`.trim();
  });
  const extraRules =
    typeof house?.rules?.description === "string"
      ? house.rules.description.split("\n").filter(Boolean)
      : [];
  return [...typedRules, ...extraRules].filter(Boolean).slice(0, 8);
}

export function getHouseMetadataFields(house, uuid) {
  const title = getHouseTitle(house);
  const location = getHouseLocation(house);
  const description =
    house?.description ||
    `${title} در ${location.label}. مشاهده امکانات، قوانین و مسیر رزرو در ${siteName}.`;
  const images = getHouseImages(house);

  return {
    title,
    description,
    location,
    images,
    path: `/house/${uuid}`,
  };
}

export function createHouseJsonLd(house, uuid) {
  const fields = getHouseMetadataFields(house, uuid);
  const price = getHousePrice(house);
  const amenities = getHouseAmenities(house);
  const data = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: fields.title,
    description: fields.description,
    url: absoluteUrl(`/house/${uuid}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: fields.location.city || undefined,
      addressRegion: fields.location.province || undefined,
      streetAddress: fields.location.address || undefined,
      addressCountry: "IR",
    },
    amenityFeature: amenities.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
  };

  if (fields.images.length) data.image = fields.images.map((image) => image.url);
  if (fields.location.latitude && fields.location.longitude) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: fields.location.latitude,
      longitude: fields.location.longitude,
    };
  }
  if (price) {
    data.priceRange = `${price} IRR`;
  }
  const ratingValue = getHouseRatingValue(house);
  const ratingCount = getHouseRatingCount(house);
  if (ratingValue !== null && ratingCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount: ratingCount,
    };
  }

  return data;
}
