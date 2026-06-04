import React from "react";
import { Transition } from "@headlessui/react";
import { MinusIcon, TrashIcon } from "@heroicons/react/24/outline";
import CalendarContainer from "../../calendar/CalendarContainer";

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
      className="fixed bottom-0 z-30 flex w-full"
      style={{ zIndex: 1000 }}
    >
      <div
        ref={calendarModalRef}
        dir="rtl"
        className="modal-rtl flex h-[80vh] w-full flex-col overflow-auto rounded-t-3xl bg-gray-50 text-right shadow-centered-lg dark:bg-slate-900 dark:text-slate-100 md:hidden"
      >
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setShowCalendarModal(false)}>
            <MinusIcon className="mb-1 h-7 w-7 text-gray-700" />
          </button>
          <button
            onClick={() => {
              setReserveDateFrom(null);
              setReserveDateTo(null);
            }}
            className="flex items-center rounded-2xl border border-red-600 px-3 py-1.5"
          >
            <TrashIcon className="ml-2 h-5 w-5 text-red-600" />
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
