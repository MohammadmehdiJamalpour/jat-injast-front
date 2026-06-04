import React from "react";
import toPersianNumber from "../../../utils/toPersianNumber";
import CustomInfoIcon from "../../../ui/CustomInfoIcon";

function HouseSpace({ houseData }) {
  const { structure, reservation, arrivals, areas } = houseData;

  return (
    <div className="w-full px-3 pt-2">
      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-2">فضای اقامتگاه :</h3>

      {/* Content Section */}
      <div className="flex flex-row gap-5 xs:gap-7 px-1">
        {/* Left Column */}
        <div className="flex flex-col w-1/2 lg:w-auto gap-2">
          {/* Standard Capacity */}
          <div className="flex items-center gap-3">
            <strong className="text-gray-700">ظرفیت استاندارد:</strong>
            <span>
              {toPersianNumber(reservation?.capacity?.normal) || "نامشخص"} نفر
            </span>
          </div>

          {/* Building Size */}
          <div className="flex items-center gap-3">
            <strong className="text-gray-700">متراژ زیربنا:</strong>
            <span>{toPersianNumber(structure?.size) || "نامشخص"} متر</span>
          </div>

          {/* Type of Accommodation */}
          <div className="flex items-center gap-3">
            <strong className="text-gray-700">نوع اقامتگاه:</strong>
            <span>{structure?.label || "نامشخص"}</span>
          </div>

          {/* Number of Stairs */}
          <div className="flex items-center gap-3">
            <strong className="text-gray-700">تعداد پله:</strong>
            <span>
              {structure?.number_stairs === 0
                ? "پله ندارد"
                : `${toPersianNumber(structure?.number_stairs)} پله`}
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-1/2 lg:w-auto gap-2">
          {/* Maximum Capacity */}
          <div className="flex items-center gap-3">
            <strong className="text-gray-700">حداکثر ظرفیت:</strong>
            <span>
              {toPersianNumber(reservation?.capacity?.maximum) || "نامشخص"} نفر
            </span>
          </div>

          {/* Land Size */}
          <div className="flex items-center gap-3">
            <strong className="text-gray-700">متراژ محوطه:</strong>
            <span>{toPersianNumber(structure?.land_size) || "نامشخص"} متر</span>
          </div>

          {/* Arrivals */}
          <div className="flex flex-wrap items-center gap-1">
            <strong className="text-gray-700">شیوه دسترسی به اقامتگاه:</strong>
            {arrivals?.types && arrivals.types.length > 0 ? (
              arrivals.types.map((item, index) => (
                <span key={index} className="flex items-center gap-1 font-medium">
                  {item.label}
                </span>
              ))
            ) : (
              <span className="text-gray-500">نامشخص</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HouseSpace;
