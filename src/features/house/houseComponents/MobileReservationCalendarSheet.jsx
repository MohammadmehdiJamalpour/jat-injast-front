import { Transition } from "@headlessui/react";
import { MinusIcon, TrashIcon } from "@heroicons/react/24/outline";
import CalendarContainer from "@/components/calendar/CalendarContainer";

export default function MobileReservationCalendarSheet({
  calendarData,
  calendarModalRef,
  houseData,
  isRentRoom,
  reserveDateFrom,
  reserveDateTo,
  roomOptions,
  selectedRoomUuid,
  setReserveDateFrom,
  setReserveDateTo,
  setSelectedRoomUuid,
  setShowCalendarModal,
  showCalendarModal,
}) {
  return (
    <Transition
      show={showCalendarModal}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0 translate-y-full"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-full"
      className="fixed inset-x-0 bottom-0 z-30 flex w-full"
      style={{ zIndex: 1000 }}
    >
      <div
        ref={calendarModalRef}
        data-testid="mobile-reservation-calendar-sheet"
        dir="rtl"
        className="modal-rtl flex h-[80vh] w-full flex-col overflow-auto rounded-t-3xl bg-gray-50 text-right shadow-centered-lg dark:bg-slate-900 dark:text-slate-100 md:hidden"
      >
        <div className="flex items-center justify-between p-4">
          <button
            type="button"
            onClick={() => setShowCalendarModal(false)}
            aria-label={'\u0628\u0633\u062a\u0646 \u062a\u0642\u0648\u06cc\u0645'}
            className="rounded-full p-1 text-gray-700 transition hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:text-sky-100 dark:hover:bg-slate-800"
          >
            <MinusIcon className="mb-1 h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={() => {
              setReserveDateFrom(null);
              setReserveDateTo(null);
            }}
            className="flex items-center rounded-2xl border border-red-600 px-3 py-1.5 text-red-700 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:border-red-400 dark:text-red-200 dark:hover:bg-red-500/10"
          >
            <TrashIcon className="ml-2 h-5 w-5" />
            پاک کردن
          </button>
        </div>
        <CalendarContainer
          reserveDateFrom={reserveDateFrom}
          setReserveDateFrom={setReserveDateFrom}
          reserveDateTo={reserveDateTo}
          setReserveDateTo={setReserveDateTo}
          closeModal={() => setShowCalendarModal(false)}
          instantBooking={houseData.instant_booking}
          calendarData={calendarData}
          loadingCalendar={false}
          isRentRoom={isRentRoom}
          roomOptions={roomOptions}
          selectedRoomUuid={selectedRoomUuid}
          setSelectedRoomUuid={setSelectedRoomUuid}
        />
      </div>
    </Transition>
  );
}
