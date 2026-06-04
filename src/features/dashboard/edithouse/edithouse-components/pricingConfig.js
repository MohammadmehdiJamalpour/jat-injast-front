const seasons = [
  { key: "spring", label: "بهار" },
  { key: "summer", label: "تابستان" },
  { key: "autumn", label: "پاییز" },
  { key: "winter", label: "زمستان" },
];

const seasonPriceTypes = [
  { key: "normal", label: "روز های اول هفته" },
  { key: "weekend", label: "روز های آخر هفته" },
  { key: "holiday", label: "روز های تعطیل" },
  { key: "peak", label: "روز های ایام پیک" },
  { key: "extra_people", label: "به ازای هر نفر اضافه" },
];

export const pricingSections = [
  {
    id: "nowruz",
    title: "قیمت در تعطیلات نوروز",
    fields: [{ key: "nowruz", label: "تعطیلات نوروز" }],
  },
  ...seasons.map((season) => ({
    id: season.key,
    title: `قیمت در ${season.label}`,
    fields: seasonPriceTypes.map((type) => ({
      key: `${type.key}_${season.key}`,
      label: `${type.label} (${season.label})`,
    })),
  })),
];

export function formatPriceInput(value) {
  return value
    ?.toString()
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function makePriceForm(prices = {}) {
  const form = {
    nowruz: formatPriceInput(prices.nowruz || ""),
  };

  seasons.forEach((season) => {
    const seasonPrices = prices[season.key] || {};
    seasonPriceTypes.forEach((type) => {
      form[`${type.key}_${season.key}`] = formatPriceInput(seasonPrices[type.key] || "");
    });
  });

  return form;
}

export function buildInitialPricingForm(houseData) {
  if (houseData?.is_rent_room) {
    return (houseData.room || []).reduce((acc, room) => {
      if (!room.is_living_room) {
        acc[room.uuid] = makePriceForm(room.prices);
      }
      return acc;
    }, {});
  }

  return houseData?.prices ? makePriceForm(houseData.prices) : {};
}

export function normalizePricePayload(priceData = {}) {
  const formattedData = Object.fromEntries(
    Object.entries(priceData)
      .filter(([, value]) => value !== "")
      .map(([key, value]) => [key, value.replace(/,/g, "")]),
  );

  seasons.forEach((season) => {
    const extraPeopleKey = `extra_people_${season.key}`;
    if (!formattedData[extraPeopleKey]) {
      formattedData[extraPeopleKey] = "0";
    }
  });

  return formattedData;
}
