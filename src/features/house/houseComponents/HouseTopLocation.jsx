import toPersianNumber from "../../../utils/toPersianNumber";
import CustomInfoIcon from "../../../ui/CustomInfoIcon";

function normalizeLocation(location) {
  if (typeof location === "string") {
    return {
      name: location,
      short_detail: location,
      distance: null,
      image: "",
      link: "",
    };
  }

  return {
    name: location?.name || "",
    short_detail: location?.short_detail || location?.name || "",
    distance: typeof location?.distance === "number" ? location.distance : null,
    image: location?.image || "",
    link: location?.link || "",
  };
}

function HouseTopLocation({ topLocations }) {
  const locations = (topLocations || [])
    .map(normalizeLocation)
    .filter((location) => location.name);

  if (locations.length === 0) return null;

  return (
    <div className="px-3 mb-2 pt-2">
      <h2 className="text-lg font-semibold mb-2">مکان‌های تفریحی نزدیک اقامتگاه:</h2>
      <div className="flex flex-wrap gap-4">
        {locations.map((location, index) => (
          <div
            key={`${location.name}-${index}`}
            className="flex items-center space-x-2 bg-primary-50 px-1.5 py-1 rounded-3xl cursor-pointer hover:bg-primary-75"
            onClick={() => location.link && window.open(location.link, "_blank")}
          >
            {location.image ? (
              <img
                src={location.image}
                alt={location.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span
                className="w-12 h-12 rounded-full bg-primary-100 flex-shrink-0"
                aria-hidden="true"
              />
            )}
            <div className="flex flex-col">
              <div className="flex items-center mr-2">
                <h3 className="text-base font-semibold">{location.name}</h3>
                <CustomInfoIcon
                  tooltipText={location.short_detail}
                  className="h-5 w-5 ml-2"
                />
              </div>
              {location.distance !== null && (
                <span className="text-sm text-gray-600 mr-2">
                  فاصله: {toPersianNumber(location.distance.toFixed(1))} کیلومتر
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HouseTopLocation;
