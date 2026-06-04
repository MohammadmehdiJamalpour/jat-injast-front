import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaBed } from "react-icons/fa";
import toPersianNumber from "../../../utils/toPersianNumber";
import ExpandableContent from "../../../ui/ExpandableContent";

function normalizeAmenity(item) {
  if (typeof item === "string") {
    return { key: item, label: item, icon: "" };
  }

  return {
    key: item?.key || item?.label || "",
    label: item?.label || item?.key || "",
    icon: item?.icon || "",
  };
}

function getBedInfo(room) {
  const bedInfo = [];

  if (room.number_double_beds > 0) {
    bedInfo.push(`${toPersianNumber(room.number_double_beds)} تخت دو نفره`);
  }
  if (room.number_single_beds > 0) {
    bedInfo.push(`${toPersianNumber(room.number_single_beds)} تخت یک نفره`);
  }
  if (room.number_sofa_beds > 0) {
    bedInfo.push(`${toPersianNumber(room.number_sofa_beds)} مبل تخت‌خواب‌شو`);
  }

  return bedInfo.join("، ");
}

function HouseRooms({ houseData }) {
  const rooms = Array.isArray(houseData?.room) ? houseData.room : [];
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  if (rooms.length === 0) {
    return null;
  }

  const activeRoom = rooms[Math.min(activeRoomIndex, rooms.length - 1)];
  const bedInfoStr = activeRoom ? getBedInfo(activeRoom) : "";
  const showBedSection =
    bedInfoStr || (activeRoom && activeRoom.number_floor_service > 0);

  return (
    <div className="my-3 px-2">
      <h3 className="mb-2 flex items-center text-lg font-bold text-gray-800">
        اتاق‌ها
        <div className="mr-2 rounded-full bg-gray-200 px-2 py-1 text-sm text-gray-800">
          {toPersianNumber(rooms.length)} اتاق خواب
        </div>
      </h3>

      <Swiper spaceBetween={10} slidesPerView="auto" className="my-4 z-0">
        {rooms.map((room, index) => (
          <SwiperSlide
            key={room.uuid || index}
            style={{ width: "auto" }}
            className={`flex max-h-16 flex-shrink-0 cursor-pointer flex-col items-center rounded-2xl border p-4 ${
              activeRoomIndex === index ? "bg-primary-50" : "bg-white"
            }`}
            onClick={() => setActiveRoomIndex(index)}
          >
            <div className="mb-2 flex items-center gap-2">
              <FaBed className="text-3xl text-primary-600" />
              <p className="font-semibold">{room.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {activeRoom && (
        <div className="mt-4 rounded-xl bg-gray-50 p-3">
          <h4 className="mb-2 text-md font-bold text-gray-800">اطلاعات اتاق</h4>

          {activeRoom.description && (
            <p className="mb-4 text-sm text-gray-700">{activeRoom.description}</p>
          )}

          {showBedSection && (
            <div className="mb-4">
              <h5 className="mb-1 text-sm font-semibold text-gray-700">فضای خواب</h5>
              <p className="text-sm text-gray-700">
                {bedInfoStr}
                {activeRoom.number_floor_service > 0 && (
                  <>
                    {bedInfoStr ? "، " : ""}
                    {toPersianNumber(activeRoom.number_floor_service)} سرویس کف‌خواب
                  </>
                )}
              </p>
            </div>
          )}

          {activeRoom.facilities?.length > 0 && (
            <div className="mb-4">
              <h5 className="mb-1 text-sm font-semibold text-gray-700">امکانات</h5>
              <ExpandableAmenityList items={activeRoom.facilities.map(normalizeAmenity)} />
            </div>
          )}

          {activeRoom.airConditions?.length > 0 && (
            <div>
              <h5 className="mb-1 text-sm font-semibold text-gray-700">
                سیستم سرمایش و گرمایش
              </h5>
              <ExpandableAmenityList items={activeRoom.airConditions.map(normalizeAmenity)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ExpandableAmenityList({ items = [] }) {
  return (
    <ExpandableContent
      collapsedHeight={112}
      contentClassName="grid grid-cols-1 gap-2 md:grid-cols-2"
      buttonClassName="text-sm text-primary-600 hover:underline focus:outline-none"
    >
      {items.map((item, index) => (
        <AmenityItem key={item.key || item.label || index} item={item} />
      ))}
    </ExpandableContent>
  );
}

function AmenityItem({ item }) {
  return (
    <div className="flex min-w-0 items-center">
      <div className="mr-2 h-6 w-6 flex-shrink-0">
        {item.icon ? (
          <img
            src={item.icon}
            alt={item.label}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="mt-2 block h-2 w-2 rounded-full bg-primary-500" aria-hidden="true" />
        )}
      </div>
      <span className="mr-1 min-w-0 text-sm text-gray-700">{item.label}</span>
    </div>
  );
}

export default HouseRooms;
