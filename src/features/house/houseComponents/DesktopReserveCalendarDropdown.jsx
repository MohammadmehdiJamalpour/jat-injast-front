import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ReserveCalendarSwiper from "@/components/calendar/ReserveCalendarSwiper";

const arrowBase =
  "p-1 lg:p-1.5 xl:p-2 rounded-full shadow transition-colors duration-200";
const activeArrow = "bg-primary-500 text-secondary-50 hover:bg-primary-600";
const disabledArrow =
  "bg-primary-50 text-primary-600 opacity-80 cursor-not-allowed";

export default function DesktopReserveCalendarDropdown({
  calendarData,
  calIndex,
  calMaxIndex,
  calRef,
  houseData,
  isRentRoom,
  onIndexChange,
  reserveDateFrom,
  reserveDateTo,
  roomOptions,
  selectedRoomUuid,
  setReserveDateFrom,
  setReserveDateTo,
  setSelectedRoomUuid,
  setShowCal,
  showCal,
  swiperRef,
}) {
  return (
    <Transition
      show={showCal}
      as={Fragment}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0 translate-y-4"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-4"
    >
      <div className="relative mt-4">
        <div
          ref={calRef}
          className="absolute -left-6 z-[9999] w-110 overflow-visible rounded-3xl border border-primary-600 bg-white p-3 shadow-centered shadow-primary-50 lg:w-[52rem] xl:w-[56rem]"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setReserveDateFrom(null);
                setReserveDateTo(null);
              }}
              className="flex items-center gap-1 rounded-2xl border border-red-600 px-2 py-1.5 text-sm text-red-600 transition-colors duration-300 hover:bg-red-600 hover:text-white lg:text-md xl:text-lg"
            >
              <TrashIcon className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7" />
              پاک کردن
            </button>

            {isRentRoom && roomOptions.length > 0 && (
              <div className="w-48">
                <Listbox
                  value={roomOptions.find((room) => room.uuid === selectedRoomUuid)}
                  onChange={(room) => setSelectedRoomUuid(room.uuid)}
                >
                  {({ open }) => (
                    <div className="relative overflow-visible">
                      <Listbox.Button
                        static
                        className="flex w-full items-center justify-between rounded-3xl border border-primary-600 px-3 py-1 text-primary-800"
                      >
                        <span className="truncate">
                          {roomOptions.find(
                            (room) => room.uuid === selectedRoomUuid
                          )?.name || "انتخاب اتاق"}
                        </span>
                        <ChevronDownIcon
                          className={`h-5 w-5 text-primary-600 transition ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </Listbox.Button>
                      <Listbox.Options
                        modal={false}
                        className="scrollbar-thin scrollbar-thumb-primary-400/70 scrollbar-track-primary-100/40 scrollbar-no-arrows scrollbar-rounded absolute z-50 mt-1 max-h-60 w-full overflow-hidden overflow-y-auto rounded-3xl border border-primary-500 bg-white shadow-lg hover:scrollbar-thumb-primary-500"
                      >
                        {roomOptions.map((room) => (
                          <Listbox.Option
                            key={room.uuid}
                            value={room}
                            className={({ active }) =>
                              [
                                "cursor-pointer border-b border-primary-100 px-4 py-2 last:border-b-0",
                                active
                                  ? "bg-primary-action text-primary-contrast"
                                  : "text-gray-800",
                              ].join(" ")
                            }
                          >
                            {room.name}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  )}
                </Listbox>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2 lg:mr-24 2xl:mr-28">
              <button
                onClick={() => swiperRef.current?.prev()}
                disabled={calIndex === 0}
                className={`${arrowBase} ${
                  calIndex === 0 ? disabledArrow : activeArrow
                }`}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>

              <button
                onClick={() => swiperRef.current?.next()}
                disabled={calIndex === calMaxIndex}
                className={`${arrowBase} ${
                  calIndex === calMaxIndex ? disabledArrow : activeArrow
                }`}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={() => setShowCal(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-700 transition-colors duration-300 hover:bg-primary-600 hover:text-white lg:h-9 lg:w-9 xl:h-10 xl:w-10"
            >
              <XMarkIcon className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7" />
            </button>
          </div>

          <ReserveCalendarSwiper
            ref={swiperRef}
            calendarData={calendarData}
            isRentRoom={isRentRoom}
            roomOptions={roomOptions}
            selectedRoomUuid={selectedRoomUuid}
            setSelectedRoomUuid={setSelectedRoomUuid}
            instantBooking={houseData.instant_booking}
            reserveDateFrom={reserveDateFrom}
            setReserveDateFrom={setReserveDateFrom}
            reserveDateTo={reserveDateTo}
            setReserveDateTo={setReserveDateTo}
            onIndexChange={onIndexChange}
          />
        </div>
      </div>
    </Transition>
  );
}
