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
  "flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors duration-200";
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
      <div className="relative mt-3">
        <div
          ref={calRef}
          data-testid="desktop-reservation-calendar-popover"
          className="absolute left-0 top-0 z-[9999] w-[calc(100vw-2rem)] max-w-[46rem] overflow-visible rounded-[1.75rem] border border-primary-100 bg-white p-3 text-gray-800 shadow-2xl shadow-slate-900/15 ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/35 dark:ring-white/10 md:w-[42rem] xl:w-[46rem]"
        >
          <div className="mb-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setReserveDateFrom(null);
                setReserveDateTo(null);
              }}
              className="flex min-h-9 items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors duration-300 hover:border-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:border-red-400/40 dark:bg-red-950/25 dark:text-red-200 dark:hover:bg-red-500 dark:hover:text-white"
            >
              <TrashIcon className="h-4 w-4" />
              پاک کردن
            </button>

            {isRentRoom && roomOptions.length > 0 && (
              <div className="w-36 min-w-0">
                <Listbox
                  value={roomOptions.find((room) => room.uuid === selectedRoomUuid)}
                  onChange={(room) => setSelectedRoomUuid(room.uuid)}
                >
                  {({ open }) => (
                    <div className="relative overflow-visible">
                      <Listbox.Button
                        static
                        className="flex h-9 w-full items-center justify-between rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs text-primary-800 dark:border-slate-700 dark:bg-slate-950 dark:text-primary-100"
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
                        className="scrollbar-thin scrollbar-thumb-primary-400/70 scrollbar-track-primary-100/40 scrollbar-no-arrows scrollbar-rounded absolute z-50 mt-1 max-h-60 w-full overflow-hidden overflow-y-auto rounded-2xl border border-primary-100 bg-white shadow-lg hover:scrollbar-thumb-primary-500 dark:border-slate-700 dark:bg-slate-900"
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
                                  : "text-gray-800 dark:text-slate-100",
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

            <div className="ms-auto flex items-center gap-1.5">
              <button
                type="button"
                aria-label={'\u062a\u0642\u0648\u06cc\u0645 \u0642\u0628\u0644\u06cc'}
                onClick={() => swiperRef.current?.prev()}
                disabled={calIndex === 0}
                className={`${arrowBase} ${
                  calIndex === 0 ? disabledArrow : activeArrow
                }`}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label={'\u062a\u0642\u0648\u06cc\u0645 \u0628\u0639\u062f\u06cc'}
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
              type="button"
              aria-label={'\u0628\u0633\u062a\u0646 \u062a\u0642\u0648\u06cc\u0645'}
              onClick={() => setShowCal(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-700 transition-colors duration-300 hover:bg-primary-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-primary-600"
            >
              <XMarkIcon className="h-5 w-5" />
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
            monthsPerViewOverride={2}
          />
        </div>
      </div>
    </Transition>
  );
}
