
import { useMemo, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import ReserveCalendarSwiper from "@/components/calendar/ReserveCalendarSwiper";

function HouseCalendar({
  calendarData,
  isRentRoom,
  roomOptions = [],
  selectedRoomUuid,
  instantBooking = false,
}) {
  const swiperRef = useRef(null);
  const [calendarIndex, setCalendarIndex] = useState(0);
  const [calendarMaxIndex, setCalendarMaxIndex] = useState(0);

  const selectedRoom = useMemo(
    () => roomOptions.find((room) => room.uuid === selectedRoomUuid) || null,
    [roomOptions, selectedRoomUuid],
  );

  const hasCalendarData = useMemo(() => {
    if (!Array.isArray(calendarData) || calendarData.length === 0) return false;
    if (!isRentRoom) return calendarData.some((month) => Array.isArray(month?.days));
    return calendarData.some((room) => Array.isArray(room?.calendar) && room.calendar.length > 0);
  }, [calendarData, isRentRoom]);

  if (!hasCalendarData) {
    return <div className="py-8 text-center text-gray-700 dark:text-slate-300">داده‌ای برای تقویم موجود نیست</div>;
  }

  return (
    <section className="w-full rounded-3xl border border-primary-100 bg-gray-50 p-3 shadow-centered shadow-primary-50/40 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/25">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="me-auto text-lg font-bold text-gray-800 dark:text-slate-100">تقویم اقامتگاه</h3>

        {isRentRoom && selectedRoom && (
          <span className="rounded-2xl border border-primary-100 bg-white px-3 py-1.5 text-sm font-semibold text-primary-800 shadow-sm dark:border-sky-300/80 dark:bg-sky-300 dark:text-slate-950 dark:shadow-sky-950/30 dark:ring-2 dark:ring-sky-200/50">
            {selectedRoom.name}
          </span>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => swiperRef.current?.prev()}
            disabled={calendarIndex === 0}
            className={`rounded-full p-2 shadow transition-colors ${
              calendarIndex === 0
                ? "cursor-not-allowed bg-primary-50 text-primary-600 opacity-70 dark:bg-slate-800 dark:text-slate-500"
                : "bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500"
            }`}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.next()}
            disabled={calendarIndex === calendarMaxIndex}
            className={`rounded-full p-2 shadow transition-colors ${
              calendarIndex === calendarMaxIndex
                ? "cursor-not-allowed bg-primary-50 text-primary-600 opacity-70 dark:bg-slate-800 dark:text-slate-500"
                : "bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500"
            }`}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ReserveCalendarSwiper
        ref={swiperRef}
        calendarData={calendarData}
        isRentRoom={isRentRoom}
        selectedRoomUuid={selectedRoomUuid}
        instantBooking={instantBooking}
        readOnly
        onIndexChange={(index, maxIndex) => {
          setCalendarIndex(index);
          setCalendarMaxIndex(maxIndex);
        }}
      />
    </section>
  );
}

export default HouseCalendar;
