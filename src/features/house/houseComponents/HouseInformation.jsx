import { MapPinIcon } from "@heroicons/react/24/solid";

import Vote from "../../../ui/Vote";
import { getHouseRatingValue } from "../../../utils/houseCardData";

function HouseInformation({ houseData }) {
  const city = houseData?.address?.city?.name || "نامشخص";
  const province = houseData?.address?.city?.province?.name || "نامشخص";
  const vote = getHouseRatingValue(houseData);

  return (
    <div className="flex flex-col rounded-3xl px-3 py-1">
      <div className="flex flex-row items-center justify-self-end gap-1">
        <MapPinIcon className="h-5 w-5 text-primary-600 lg:h-6 lg:w-6" />
        <p className="truncate text-sm">
          {province}, <span>{city}</span>
        </p>
      </div>
      <Vote size="lg" vote={vote} />
    </div>
  );
}

export default HouseInformation;
