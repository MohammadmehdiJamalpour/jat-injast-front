import React, { Fragment, useMemo, useRef, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Loading from "../../ui/Loading";
import ReserveCalendarSwiper from "./ReserveCalendarSwiper";

function CalendarContainer({
  reserveDateFrom,
  setReserveDateFrom,
  reserveDateTo,
  setReserveDateTo,
  closeModal,
  instantBooking,
  calendarData,
  loadingCalendar,
  isRentRoom = false,
  roomOptions = [],
  selectedRoomUuid,
  setSelectedRoomUuid,
  dropdown = "true",
}) {
  const swiperRef = useRef(null);
  const [calendarIndex, setCalendarIndex] = useState(0);
  const [calendarMaxIndex, setCalendarMaxIndex] = useState(0);
  const showDropdown = dropdown !== "false";

  const selectedRoom = useMemo(
    () => roomOptions.find((room) => room.uuid === selectedRoomUuid) || null,
    [roomOptions, selectedRoomUuid],
  );

  const totalMonthCount = useMemo(() => {
    if (!Array.isArray(calendarData)) return 0;
    if (!isRentRoom) return calendarData.length;
    return calendarData.reduce((count, room) => count + (room?.calendar?.length || 0), 0);
  }, [calendarData, isRentRoom]);

  if (loadingCalendar) {
    return (
      <div className="flex min-h-96 w-full items-center justify-center bg-gray-50 py-8 dark:bg-slate-900">
        <Loading type="beat" color="primary" size={20} />
      </div>
    );
  }

  if (!Array.isArray(calendarData) || totalMonthCount === 0) {
    return (
      <div className="w-full bg-white py-8 text-center text-gray-700 dark:bg-slate-900 dark:text-slate-300">
        هیچ داده‌ای موجود نیست
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl bg-gray-50 p-4 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {showDropdown && isRentRoom && roomOptions.length > 0 && (
          <div className="w-56">
            <Listbox
              value={selectedRoom}
              onChange={(room) => {
                setSelectedRoomUuid?.(room.uuid);
                setCalendarIndex(0);
              }}
            >
              {({ open }) => (
                <div className="relative rounded-xl bg-white dark:bg-slate-950">
                  <Listbox.Button className="listbox__button rounded-xl border-primary-600 text-right text-gray-700 dark:text-slate-100">
                    <span>{selectedRoom ? selectedRoom.name : "انتخاب اتاق"}</span>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
                      aria-hidden="true"
                    />
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Listbox.Options className="absolute z-[1800] mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg focus:outline-none dark:border-slate-700 dark:bg-slate-900">
                      {roomOptions.map((room) => (
                        <Listbox.Option
                          key={room.uuid}
                          value={room}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-primary-action text-primary-contrast dark:bg-primary-600 dark:text-white"
                                : "text-gray-900 dark:text-slate-200"
                            }`
                          }
                        >
                          <span className="block truncate font-normal">{room.name}</span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              )}
            </Listbox>
          </div>
        )}

        <div className="ms-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => swiperRef.current?.prev()}
            disabled={calendarIndex === 0}
            className="btn-press rounded-full bg-primary-action p-2 text-primary-contrast shadow hover:bg-primary-action-hover disabled:bg-primary-50 disabled:text-primary-600 disabled:opacity-70 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
            aria-label="ماه قبلی"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.next()}
            disabled={calendarIndex === calendarMaxIndex}
            className="btn-press rounded-full bg-primary-action p-2 text-primary-contrast shadow hover:bg-primary-action-hover disabled:bg-primary-50 disabled:text-primary-600 disabled:opacity-70 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
            aria-label="ماه بعدی"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ReserveCalendarSwiper
        ref={swiperRef}
        reserveDateFrom={reserveDateFrom}
        setReserveDateFrom={setReserveDateFrom}
        reserveDateTo={reserveDateTo}
        setReserveDateTo={setReserveDateTo}
        calendarData={calendarData}
        isRentRoom={isRentRoom}
        selectedRoomUuid={selectedRoomUuid}
        instantBooking={instantBooking}
        onRangeComplete={closeModal}
        onIndexChange={(index, maxIndex) => {
          setCalendarIndex(index);
          setCalendarMaxIndex(maxIndex);
        }}
      />
    </div>
  );
}

export default CalendarContainer;
