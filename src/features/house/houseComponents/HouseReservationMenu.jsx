import React, { useState, useEffect, useRef, useMemo } from "react";
import toPersianNumber from "../../../utils/toPersianNumber";
import { MinusIcon } from "@heroicons/react/24/outline";
import PeopleDropdown from "./PeopleNumberDropDown";
import Loading from "../../../ui/Loading";
import { preInvoiceReserve, reserveHouse } from "../../../services/reserveService";
import PreInvoicePreview from "./PreInvoicePreview";
import PaymentSimulator from "../../payment/PaymentSimulator";
import { reportClientError } from "../../../utils/reportClientError";
import { toast } from "react-hot-toast";
import { useUserContext } from "../../../contexts/UserContext";
import MobileReservationCalendarSheet from "./MobileReservationCalendarSheet";
import MobileReservationSummaryBar from "./MobileReservationSummaryBar";

function HouseReservationMenu({
  houseData,
  reserveDateFrom,
  reserveDateTo,
  setReserveDateFrom,
  setReserveDateTo,
  uuid,
  calendarData,
  isRentRoom,
  roomOptions,
  selectedRoomUuid,
  setSelectedRoomUuid,
  selectedPeople,
  setSelectedPeople,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const reserveMenuRef = useRef(null);
  const calendarModalRef = useRef(null);

  const { userData } = useUserContext();

  const debounceTimer = useRef(null);

  const [preInvoiceLoading, setPreInvoiceLoading] = useState(false);
  const [preInvoiceData, setPreInvoiceData] = useState(null);
  const [preInvoiceError, setPreInvoiceError] = useState(null);

  const [isReserving, setIsReserving] = useState(false);
  const [reserveError, setReserveError] = useState(null);
  const [checkoutReservation, setCheckoutReservation] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const firstValidPrice = useMemo(() => {
    if (!calendarData || calendarData.length === 0) return null;
    if (isRentRoom) {
      for (const room of calendarData) {
        if (!Array.isArray(room.calendar)) continue;
        for (const month of room.calendar) {
          if (!month.days) continue;
          for (const day of month.days) {
            if (!day.isDisable && !day.isLock && !day.isBlank && day.effective_price > 0) {
              return day.effective_price;
            }
          }
        }
      }
    } else {
      for (const month of calendarData) {
        if (!month.days) continue;
        for (const day of month.days) {
          if (!day.isDisable && !day.isLock && !day.isBlank && day.effective_price > 0) {
            return day.effective_price;
          }
        }
      }
    }
    return null;
  }, [calendarData, isRentRoom]);

  useEffect(() => {
    if (reserveDateFrom?.gregorianDate && reserveDateTo?.gregorianDate) {
      setPreInvoiceLoading(true);
      setPreInvoiceError(null);
      setPreInvoiceData(null);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        callPreInvoice();
      }, 2000);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [reserveDateFrom, reserveDateTo, selectedPeople]);

  const callPreInvoice = async () => {
    const body = {
      house_uuid: houseData.uuid,
      check_in: reserveDateFrom.gregorianDate,
      check_out: reserveDateTo.gregorianDate,
      num_guests: selectedPeople,
    };
    if (isRentRoom && selectedRoomUuid) {
      body.room_uuid = selectedRoomUuid;
    }
    try {
      const response = await preInvoiceReserve(body);
      setPreInvoiceData(response);
      setPreInvoiceLoading(false);
    } catch (error) {
      reportClientError("Reservation pre-invoice", error);
      setPreInvoiceError(
        error.response &&
          error.response.data &&
          error.response.data.message
          ? error.response.data.message
          : "خطایی در دریافت اطلاعات پیش‌صورتحساب رخ داده است."
      );
      setPreInvoiceLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCalendarModal &&
        calendarModalRef.current &&
        !calendarModalRef.current.contains(event.target)
      ) {
        setShowCalendarModal(false);
      } else if (
        !showCalendarModal &&
        isExpanded &&
        reserveMenuRef.current &&
        !reserveMenuRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCalendarModal, isExpanded]);

  useEffect(() => {
    if (reserveDateFrom && reserveDateTo) {
      setShowCalendarModal(false);
      setIsExpanded(true);
    }
  }, [reserveDateFrom, reserveDateTo]);

  const handleToggle = () => setIsExpanded(!isExpanded);

  const handleReserve = async () => {
    if (!userData) {
      toast.error("ابتدا وارد حساب کاربری خود شوید.");
      return;
    }

    if (!reserveDateFrom?.gregorianDate || !reserveDateTo?.gregorianDate) {
      toast.error("ابتدا تاریخ ورود و خروج را انتخاب کنید.");
      return;
    }

    setIsReserving(true);
    setReserveError(null);

    try {
      const body = {
        house_uuid: houseData.uuid,
        check_in: reserveDateFrom.gregorianDate,
        check_out: reserveDateTo.gregorianDate,
        num_guests: selectedPeople,
      };
      if (isRentRoom && selectedRoomUuid) {
        body.room_uuid = selectedRoomUuid;
      }

      const createdReservation = await reserveHouse(body);
      setCheckoutReservation(createdReservation);
      setIsPaymentOpen(true);
      toast.success("رزرو ثبت شد؛ پرداخت آزمایشی را کامل کنید.");
    } catch (err) {
      reportClientError("Create reservation", err);
      const errMsg =
        err.response &&
        err.response.data &&
        err.response.data.message
          ? err.response.data.message
          : "خطایی در ثبت رزرو رخ داده است.";
      setReserveError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsReserving(false);
    }
  };

  const formatPrice = (price) => toPersianNumber(price?.toLocaleString() || "");

  return (
    <>
      {showCalendarModal && (
        <div
          className="fixed inset-0 opacity-50 z-30"
          onClick={() => setShowCalendarModal(false)}
        />
      )}

      {isExpanded && !showCalendarModal && (
        <div
          className="fixed inset-0 opacity-50 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <MobileReservationCalendarSheet
        calendarData={calendarData}
        calendarModalRef={calendarModalRef}
        houseData={houseData}
        isRentRoom={isRentRoom}
        reserveDateFrom={reserveDateFrom}
        reserveDateTo={reserveDateTo}
        roomOptions={roomOptions}
        selectedRoomUuid={selectedRoomUuid}
        setReserveDateFrom={setReserveDateFrom}
        setReserveDateTo={setReserveDateTo}
        setSelectedRoomUuid={setSelectedRoomUuid}
        setShowCalendarModal={setShowCalendarModal}
        showCalendarModal={showCalendarModal}
      />

      {/* Reservation Menu (Mobile) */}
      <div
        ref={reserveMenuRef}
        className={`z-30 px-4 pt-1 w-full shadow-centered flex flex-col bg-primary-50 rounded-t-3xl md:hidden fixed bottom-0 transition-all duration-300`}
        style={{ zIndex: 500, maxHeight: isExpanded ? "80vh" : "6rem" }}
      >
        <div className="flex w-full justify-center items-center px-4">
          <div
            className="flex justify-center w-full cursor-pointer"
            onClick={() => setIsExpanded((v) => !v)}
          >
            <MinusIcon className="w-7 h-7 text-primary-800 mb-1" />
          </div>
          <div className="w-7 h-7" />
        </div>

        <div className="overflow-hidden transition-all duration-300">
          {isExpanded ? (
            <div className="flex-1 overflow-y-auto px-4">
              <p className="text-sm">تاریخ رزرو</p>
              <div
                className="h-12 my-1.5 w-full flex items-center justify-between rounded-3xl shadow-sm bg-white px-4 border"
                onClick={() => setShowCalendarModal(true)}
              >
                <div className="flex-1 flex items-center justify-center w-full h-full text-gray-700 text-sm cursor-pointer">
                  {reserveDateFrom ? (
                    <div className="h-full flex flex-col items-center justify-center w-full">
                      <p>ورود</p>
                      <p>
                        {`${toPersianNumber(
                          reserveDateFrom.year
                        )}/${toPersianNumber(
                          reserveDateFrom.month
                        )}/${toPersianNumber(reserveDateFrom.day)}`}
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center w-full">
                      <p>تاریخ ورود</p>
                    </div>
                  )}
                </div>

                <div className="w-px h-6 bg-gray-400 mx-2"></div>

                <div className="flex-1 flex items-center justify-center w-full h-full text-gray-700 text-sm cursor-pointer">
                  {reserveDateTo ? (
                    <div className="h-full flex flex-col items-center justify-center w-full">
                      <p>خروج</p>
                      <p>
                        {`${toPersianNumber(
                          reserveDateTo.year
                        )}/${toPersianNumber(
                          reserveDateTo.month
                        )}/${toPersianNumber(reserveDateTo.day)}`}
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center w-full">
                      <p>تاریخ خروج</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm bg-gray-50 rounded-3xl flex justify-center w-full my-2 mt-4">
                <PeopleDropdown
                  selectedPeople={selectedPeople}
                  setSelectedPeople={setSelectedPeople}
                />
              </div>

              {reserveDateFrom?.gregorianDate && reserveDateTo?.gregorianDate && (
                <div className="mt-3">
                  <PreInvoicePreview
                    preInvoiceLoading={preInvoiceLoading}
                    preInvoiceError={preInvoiceError}
                    preInvoiceData={preInvoiceData}
                  />
                </div>
              )}

              <div className="w-full my-3 mt-6">
                <button
                  className="w-full btn rounded-3xl bg-primary-500 hover:bg-primary-600 transition-all duration-300 px-3 py-1.5 flex items-center justify-center gap-2"
                  onClick={handleReserve}
                  disabled={isReserving}
                >
                  {isReserving && <Loading type="beat" size={5} color="white" />}
                  رزرو
                </button>
                {reserveError && (
                  <p className="text-xs text-red-600 mt-1 text-center">
                    {reserveError}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <MobileReservationSummaryBar
              firstValidPrice={firstValidPrice}
              onToggle={handleToggle}
            />
          )}
        </div>
      </div>
      <PaymentSimulator
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        reservation={checkoutReservation}
        onCompleted={(payment) => {
          setCheckoutReservation((old) =>
            old ? { ...old, payment, payment_status: payment?.status } : old
          );
        }}
      />
    </>
  );
}

export default HouseReservationMenu;
