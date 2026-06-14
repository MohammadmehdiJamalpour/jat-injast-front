import {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import dynamic from "next/dynamic";
import PeopleDropdown from "./PeopleNumberDropDown";
import toPersianNumber from "../../../utils/toPersianNumber";
import Loading from "../../../ui/Loading";
import { toast } from "react-hot-toast";
import { useUserContext } from "../../../contexts/UserContext";
import PreInvoicePreview from "./PreInvoicePreview";
import PaymentSimulator from "@/components/payment/PaymentSimulator";
import {
  preInvoiceReserve,
  reserveHouse,
} from "../../../services/reserveService";

const DesktopReserveCalendarDropdown = dynamic(
  () => import("./DesktopReserveCalendarDropdown"),
  {
    ssr: false,
    loading: () => null,
  },
);

function ReserveMenuDesktop({
  reserveDateFrom,
  reserveDateTo,
  setReserveDateFrom,
  setReserveDateTo,
  houseData,
  calendarData,
  isRentRoom,
  roomOptions,
  selectedRoomUuid,
  setSelectedRoomUuid,
  selectedPeople,
  setSelectedPeople,
}) {
  const [showCal, setShowCal] = useState(false);
  const [hasOpenedCalendar, setHasOpenedCalendar] = useState(false);
  const calRef   = useRef(null);
  const { userData } = useUserContext();
  const debounceRef = useRef(null);

  const swiperRef  = useRef(null);
  const [calIndex, setCalIndex]     = useState(0);
  const [calMaxIndex, setCalMaxIndex] = useState(0);

  const firstPrice = useMemo(() => {
    if (!calendarData) return null;
    const months = isRentRoom
      ? calendarData.flatMap((r) => r.calendar)
      : calendarData;
    for (const m of months) {
      for (const d of m.days || []) {
        if (
          !d.isDisable &&
          !d.isLock &&
          !d.isBlank &&
          d.effective_price > 0
        )
          return d.effective_price;
      }
    }
    return null;
  }, [calendarData, isRentRoom]);
  const fmt = (n) => toPersianNumber(n?.toLocaleString() || "");

  const [piLoad, setPiLoad] = useState(false);
  const [piErr,  setPiErr]  = useState(null);
  const [piData, setPiData] = useState(null);

  useEffect(() => {
    if (!reserveDateFrom?.gregorianDate || !reserveDateTo?.gregorianDate)
      return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setPiLoad(true);
      setPiErr(null);
      setPiData(null);
      try {
        const body = {
          house_uuid: houseData.uuid,
          check_in:  reserveDateFrom.gregorianDate,
          check_out: reserveDateTo.gregorianDate,
          num_guests: selectedPeople,
          ...(isRentRoom && selectedRoomUuid
            ? { room_uuid: selectedRoomUuid }
            : {}),
        };
        setPiData(await preInvoiceReserve(body));
      } catch (e) {
        setPiErr(
          e?.response?.data?.message ||
            "خطایی در دریافت پیش‌صورتحساب رخ داده است."
        );
      } finally {
        setPiLoad(false);
      }
    }, 600);

    return () => clearTimeout(debounceRef.current);
  }, [
    reserveDateFrom,
    reserveDateTo,
    selectedPeople,
    selectedRoomUuid,
    houseData.uuid,
    isRentRoom,
  ]);

  useEffect(() => {
    if (reserveDateFrom && reserveDateTo) setShowCal(false);
  }, [reserveDateFrom, reserveDateTo]);

  useEffect(() => {
    if (showCal) setHasOpenedCalendar(true);
  }, [showCal]);

  useEffect(() => {
    const h = (e) => {
      if (showCal && calRef.current && !calRef.current.contains(e.target))
        setShowCal(false);
    };
    window.addEventListener("mousedown", h);
    return () => window.removeEventListener("mousedown", h);
  }, [showCal]);

  const [resLoad, setResLoad] = useState(false);
  const [resErr,  setResErr]  = useState(null);
  const [checkoutReservation, setCheckoutReservation] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const reserve = async () => {
    if (!userData)
      return toast.error("ابتدا وارد حساب کاربری خود شوید.");
    if (!reserveDateFrom?.gregorianDate || !reserveDateTo?.gregorianDate)
      return toast.error("ابتدا تاریخ ورود و خروج را انتخاب کنید.");

    setResLoad(true);
    setResErr(null);
    try {
      const body = {
        house_uuid: houseData.uuid,
        check_in:  reserveDateFrom.gregorianDate,
        check_out: reserveDateTo.gregorianDate,
        num_guests: selectedPeople,
        ...(isRentRoom && selectedRoomUuid
          ? { room_uuid: selectedRoomUuid }
          : {}),
      };
      const createdReservation = await reserveHouse(body);
      setCheckoutReservation(createdReservation);
      setIsPaymentOpen(true);
      toast.success("رزرو ثبت شد؛ پرداخت آزمایشی را کامل کنید.");
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        "خطایی در ثبت رزرو رخ داده است.";
      setResErr(msg);
      toast.error(msg);
    } finally {
      setResLoad(false);
    }
  };

  const inpCls = (has, active) =>
    [
      "flex-1 flex flex-col items-center justify-center h-full text-sm transition-colors",
      has
        ? "bg-primary-500 text-white"
        : active
        ? "bg-primary-50 text-primary-800"
        : "bg-white text-primary-800",
    ].join(" ");

  return (
    <div className="relative w-full rounded-3xl border border-primary-100 bg-gray-50 pb-4 shadow-centered shadow-primary-50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/25">
      <div className="flex justify-between gap-3 rounded-t-3xl bg-primary-500 px-4 py-3">
        <span className="text-white text-sm lg:text-lg">قیمت هر شب از</span>
        {firstPrice ? (
          <span className="text-white text-sm lg:text-lg">
            {fmt(firstPrice)} تومان
          </span>
        ) : (
          <Loading type="beat" size={6} />
        )}
      </div>

      <div className="mx-4 mt-4">
        <p className="mb-1">تاریخ رزرو</p>
        <button
          type="button"
          onClick={() => setShowCal((s) => !s)}
          aria-expanded={showCal}
          data-testid="reservation-date-button"
          className="flex h-12 w-full min-w-0 items-center overflow-hidden rounded-3xl border bg-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:border-slate-700 dark:bg-slate-950"
        >
          <div
            className={inpCls(
              !!reserveDateFrom,
              showCal && !reserveDateFrom
            )}
          >
            {reserveDateFrom ? (
              <>
                <span className="text-sm">ورود</span>
                <span className="text-sm">
                  {fmt(reserveDateFrom.year)}/
                  {fmt(reserveDateFrom.month)}/
                  {fmt(reserveDateFrom.day)}
                </span>
              </>
            ) : (
              "تاریخ ورود"
            )}
          </div>

          <div className="w-px h-6 bg-gray-400 mx-2" />

          <div
            className={inpCls(
              !!reserveDateTo,
              showCal && !!reserveDateFrom && !reserveDateTo
            )}
          >
            {reserveDateTo ? (
              <>
                <span className="text-xs">خروج</span>
                <span className="text-xs">
                  {fmt(reserveDateTo.year)}/
                  {fmt(reserveDateTo.month)}/
                  {fmt(reserveDateTo.day)}
                </span>
              </>
            ) : (
              "تاریخ خروج"
            )}
          </div>
        </button>

        {hasOpenedCalendar && (
          <DesktopReserveCalendarDropdown
            calendarData={calendarData}
            calIndex={calIndex}
            calMaxIndex={calMaxIndex}
            calRef={calRef}
            houseData={houseData}
            isRentRoom={isRentRoom}
            onIndexChange={(i, m) => {
              setCalIndex(i);
              setCalMaxIndex(m);
            }}
            reserveDateFrom={reserveDateFrom}
            reserveDateTo={reserveDateTo}
            roomOptions={roomOptions}
            selectedRoomUuid={selectedRoomUuid}
            setReserveDateFrom={setReserveDateFrom}
            setReserveDateTo={setReserveDateTo}
            setSelectedRoomUuid={setSelectedRoomUuid}
            setShowCal={setShowCal}
            showCal={showCal}
            swiperRef={swiperRef}
          />
        )}
      </div>

      <div className="mx-4 mt-6">
        <p className="mb-1">تعداد نفرات :</p>
        <div className="rounded-3xl border bg-white dark:border-slate-700 dark:bg-slate-950">
          <PeopleDropdown
            selectedPeople={selectedPeople}
            setSelectedPeople={setSelectedPeople}
          />
        </div>
      </div>

      {reserveDateFrom?.gregorianDate && reserveDateTo?.gregorianDate && (
        <div className="mt-4 px-4">
          <PreInvoicePreview
            preInvoiceLoading={piLoad}
            preInvoiceError={piErr}
            preInvoiceData={piData}
          />
        </div>
      )}

      <div className="mx-4 mt-6">
        <button
          onClick={reserve}
          disabled={resLoad}
          aria-busy={resLoad}
          className="w-full btn bg-primary-500 shadow-centered shadow-primary-50 hover:shadow-centered-lg hover:shadow-primary-100 hover:bg-primary-600 rounded-3xl py-2 flex items-center justify-center gap-2 text-white"
        >
          {resLoad && <Loading type="beat" size={5} color="white" />} رزرو
        </button>
        {resErr && (
          <p className="text-xs text-red-600 mt-1 text-center">{resErr}</p>
        )}
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
    </div>
  );
}

export default ReserveMenuDesktop;
