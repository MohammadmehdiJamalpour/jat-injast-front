// ReservationProcess.jsx
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";
import Loading from "../../../ui/Loading";
import { useUserContext } from "../../../contexts/UserContext";
import { reserveHouse } from "../../../services/reserveService";
import { reportClientError } from "../../../utils/reportClientError";

export default function ReservationProcess({
  isRentRoom,
  houseData,
  reserveDateFrom,
  reserveDateTo,
  selectedPeople,
  selectedRoomUuid,
}) {
  const { userData } = useUserContext();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [reserveError, setReserveError] = useState(null);

  const handleReserveClick = () => {
    if (!userData) {
      toast.error("ابتدا وارد حساب کاربری خود شوید.");
      return;
    }
    setShowConfirmModal(true);
  };

  async function handleConfirmReservation() {
    try {
      setShowConfirmModal(false);
      setIsReserving(true);
      setReserveError(null);

      // SENDING Gregorian DATES
      const body = {
        house_uuid: houseData.uuid,
        check_in: reserveDateFrom.gregorianDate,
        check_out: reserveDateTo.gregorianDate,
        num_guests: selectedPeople,
      };
      if (isRentRoom && selectedRoomUuid) {
        body.room_uuid = selectedRoomUuid;
      }

      await reserveHouse(body);

      toast.success(
        "رزرو شما با موفقیت ثبت شد. برای ادامه فرایند رزرو به قسمت پروفایل کاربری خود مراجعه کنید."
      );
    } catch (error) {
      reportClientError("Finalize reservation", error);
      setReserveError("خطایی در ثبت رزرو رخ داده است!");
      toast.error("خطایی در ثبت رزرو رخ داده است.");
    } finally {
      setIsReserving(false);
    }
  }

  return (
    <div className="w-full">
      {/* Reserve button */}
      <button
        className="w-full btn rounded-3xl bg-primary-500 hover:bg-primary-600 transition-all duration-300 px-3 py-1.5 flex items-center justify-center gap-2"
        onClick={handleReserveClick}
        disabled={isReserving}
      >
        {isReserving && <Loading type="beat" size={5} color="white" />}
        <span>رزرو</span>
      </button>

      {/* Show an inline error if final reservation fails */}
      {reserveError && (
        <p className="text-xs text-red-600 mt-1 text-center">{reserveError}</p>
      )}

      {/* Confirmation Modal */}
      <Transition appear show={showConfirmModal} as={Fragment}>
        <Dialog
          as="div"
          dir="rtl"
          className="fixed inset-0 z-[999999] text-right"
          onClose={() => setShowConfirmModal(false)}
        >
          <div className="min-h-screen flex items-center justify-center p-4">
            {/* Blurred overlay as sibling */}
            <div className="fixed inset-0 bg-white/15 backdrop-blur-md dark:bg-white/5" aria-hidden="true" />

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-2 w-full max-w-md rounded-2xl bg-white p-6 text-right dark:bg-slate-900 dark:text-slate-100">
                <Dialog.Title className="text-lg font-semibold mb-2">
                  تایید رزرو
                </Dialog.Title>

                <Dialog.Description className="text-sm text-gray-700 dark:text-slate-300">
                  آیا از ثبت رزرو در این تاریخ‌ها اطمینان دارید؟
                </Dialog.Description>

                <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-slate-300">
                  <p>
                    تاریخ ورود:
                    <span className="font-bold ml-1">
                      {reserveDateFrom?.jalaliDate ?? "—"} 
                      {/* Jalali date displayed here */}
                    </span>
                  </p>
                  <p>
                    تاریخ خروج:
                    <span className="font-bold ml-1">
                      {reserveDateTo?.jalaliDate ?? "—"}
                      {/* Jalali date displayed here */}
                    </span>
                  </p>
                  <p>
                    تعداد نفرات:
                    <span className="font-bold ml-1">{selectedPeople}</span>
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleConfirmReservation}
                    className="px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-white"
                  >
                    تایید
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
