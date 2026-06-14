import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import toPersianNumber from "../../utils/toPersianNumber";
import { toPersian } from "../../utils/toPersianDigits";
import { canUseHoverPreview } from "./calendarUtils";

const formatPrice = (n) =>
  n == null ? "" : toPersianNumber(Math.round(n / 1_000).toLocaleString());
const formatCalendarYear = (year) => toPersian(year ?? "");
const isSame = (a, b) =>
  a && b && a.year === b.year && a.month === b.month && +a.day === +b.day;
const isBefore = (a, b) => {
  if (!b) return false;
  if (a.year !== b.year) return a.year < b.year;
  if (a.month !== b.month) return a.month < b.month;
  return +a.day < +b.day;
};
const isBetween = (d, s, e) => {
  const D = new Date(d.year, d.month - 1, d.day);
  return (
    D > new Date(s.year, s.month - 1, s.day) &&
    D < new Date(e.year, e.month - 1, e.day)
  );
};
const selectedDayCls =
  "!border-primary-action !bg-primary-action !text-white shadow-lg shadow-primary-200/60 ring-2 ring-primary-200 ring-offset-2 ring-offset-white dark:!border-sky-300 dark:!bg-sky-300 dark:!text-slate-950 dark:shadow-sky-950/30 dark:ring-sky-200/70 dark:ring-offset-slate-950";
const previewEdgeDayCls =
  "!border-primary-500 !bg-primary-200 !text-primary-900 shadow-md shadow-primary-100/70 ring-2 ring-primary-300 ring-offset-1 ring-offset-white dark:!border-sky-300 dark:!bg-sky-400/35 dark:!text-white dark:shadow-sky-950/25 dark:ring-sky-300/50 dark:ring-offset-slate-950";
const rangeDayCls =
  "!border-primary-300 !bg-primary-100 !text-primary-900 shadow-inner ring-1 ring-primary-300/70 dark:!border-sky-400/70 dark:!bg-sky-400/20 dark:!text-sky-50 dark:ring-sky-300/35";
const baseDayCls = (day) => {
  const arr = [];
  if (day.isBlank) return "invisible";
  if (day.isDisable || day.isLock) {
    arr.push("bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500");
    if (day.isDisable) arr.push("diagonal-stripes");
  }
  if (day.isToDay) arr.push("border-2 border-primary-600 dark:border-primary-300");
  if (day.isHoliday) arr.push("text-red-600 dark:text-red-300");
  return arr.join(" ");
};

const ReserveCalendarSwiper = forwardRef(
  (
    {
      calendarData,
      isRentRoom,
      selectedRoomUuid,
      reserveDateFrom,
      setReserveDateFrom,
      reserveDateTo,
      setReserveDateTo,
      onIndexChange,
      onRangeComplete,
      instantBooking = false,
      readOnly = false,
      monthsPerViewOverride,
    },
    ref
  ) => {
    const loading =
      !Array.isArray(calendarData) || calendarData.length === 0;

    const displayedData = useMemo(() => {
      if (loading) return [];
      return isRentRoom
        ? calendarData.find((r) => r.roomUuid === selectedRoomUuid)
            ?.calendar ?? []
        : calendarData;
    }, [loading, calendarData, isRentRoom, selectedRoomUuid]);

    const getResponsiveMonthsPerView = useCallback(
      () =>
        monthsPerViewOverride ??
        (typeof window !== "undefined" && window.innerWidth < 1024 ? 1 : 2),
      [monthsPerViewOverride]
    );

    const [monthsPerView, setMonthsPerView] = useState(
      getResponsiveMonthsPerView
    );
    const [index, setIndex] = useState(0);
    const [hoverDate, setHoverDate] = useState(null);

    /* reset index when room changes */
    useEffect(() => setIndex(0), [selectedRoomUuid, isRentRoom]);

    useEffect(() => {
      const onResize = () => {
        const m = getResponsiveMonthsPerView();
        setMonthsPerView((prev) => {
          if (prev !== m)
            setIndex((old) =>
              Math.min(old, Math.max(0, displayedData.length - m))
            );
          return m;
        });
      };
      window.addEventListener("resize", onResize);
      onResize();
      return () => window.removeEventListener("resize", onResize);
    }, [displayedData.length, getResponsiveMonthsPerView]);

    const maxIndex = Math.max(0, displayedData.length - monthsPerView);

    useImperativeHandle(ref, () => ({
      prev: () => {
        if (loading) return;
        setIndex((i) => Math.max(i - 1, 0));
      },
      next: () => {
        if (loading) return;
        setIndex((i) => Math.min(i + 1, maxIndex));
      },
    }));

    /* notify parent */
    useEffect(() => {
      onIndexChange && onIndexChange(index, maxIndex);
    }, [index, maxIndex, onIndexChange]);

    const pick = (day, monthMeta) => {
      if (readOnly || loading || day.isDisable || day.isLock || day.isBlank) return;
      const dateObj = {
        year: monthMeta.year,
        month: monthMeta.month,
        day: day.day,
        date: day.date_info?.gregorian || day.date || day.gregorianDate,
        gregorianDate: day.date_info?.gregorian || day.gregorianDate || day.date,
        jalaliDate: day.date_info?.jalali || day.jalaliDate,
        readAbleDate: day.date_info?.label || day.readAbleDate,
        pricing: day.pricing,
        availability: day.availability,
      };
      setHoverDate(null);
      if (!reserveDateFrom || (reserveDateFrom && reserveDateTo)) {
        setReserveDateFrom(dateObj);
        setReserveDateTo(null);
        return;
      }
      if (isBefore(dateObj, reserveDateFrom)) return;
      setReserveDateTo(dateObj);
      onRangeComplete?.(dateObj);
    };

    const handleDayPointerEnter = (event, date, day) => {
      if (
        !canUseHoverPreview(event) ||
        readOnly ||
        !reserveDateFrom ||
        reserveDateTo ||
        day.isDisable ||
        day.isLock ||
        day.isBlank
      ) {
        return;
      }
      setHoverDate(date);
    };

    const handleDayPointerLeave = (event) => {
      if (canUseHoverPreview(event) && hoverDate) setHoverDate(null);
    };

    const translateX =
      monthsPerView === 1
        ? index * 100
        : (index * 100) / monthsPerView;
    const monthWidthClass = monthsPerView === 1 ? "w-full" : "w-1/2";

    if (loading) {
      return (
        <div className="w-full flex">
          {Array.from({ length: monthsPerView }).map((_, mi) => (
            <div key={mi} className={`${monthWidthClass} px-2`}>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: 35 }).map((__, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="w-full">
        {/* months */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(${translateX}%)` }}
          >
            {displayedData.map((month, mi) => (
              <div key={mi} className={`flex-shrink-0 ${monthWidthClass} px-2`}>
                <h4 className="text-center font-bold mb-2">
                  {month.month_name} {formatCalendarYear(month.year)}
                </h4>

                <div className="grid grid-cols-7 text-center font-semibold mb-2">
                  {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-0.5">
                  {(month.days || []).map((day, di) => {
                    const date = {
                      year: month.year,
                      month: month.month,
                      day: day.day,
                    };
                    const isBlocked = day.isBlank || day.isDisable || day.isLock;
                    let cls = baseDayCls(day);

                    const selStart =
                      !readOnly && reserveDateFrom && isSame(date, reserveDateFrom);
                    const selEnd =
                      !readOnly && reserveDateTo && isSame(date, reserveDateTo);
                    const hoverEdge =
                      !readOnly &&
                      reserveDateFrom &&
                      !reserveDateTo &&
                      hoverDate &&
                      isSame(date, hoverDate);

                    let between = false;
                    if (!readOnly && reserveDateFrom && reserveDateTo)
                      between = isBetween(
                        date,
                        reserveDateFrom,
                        reserveDateTo
                      );
                    else if (!readOnly && reserveDateFrom && hoverDate) {
                      let s = reserveDateFrom,
                        e = hoverDate;
                      if (isBefore(e, s)) [s, e] = [e, s];
                      between =
                        isBetween(date, s, e) ||
                        isSame(date, s) ||
                        isSame(date, e);
                    }

                    if (selStart || selEnd) cls += ` ${selectedDayCls}`;
                    else if (hoverEdge) cls += ` ${previewEdgeDayCls}`;
                    else if (between) cls += ` ${rangeDayCls}`;

                    return (
                      <button
                        type="button"
                        key={di}
                        onClick={() => pick(day, month)}
                        onPointerEnter={(event) =>
                          handleDayPointerEnter(event, date, day)
                        }
                        onPointerLeave={handleDayPointerLeave}
                        aria-disabled={readOnly || isBlocked}
                        className={`relative border border-gray-200 bg-white text-gray-800 transition-all duration-200 ease-out dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 rounded-2xl flex flex-col justify-center aspect-square overflow-hidden text-2xs sm:text-xs ${cls} ${
                          readOnly || day.isBlank ? "cursor-default" : isBlocked ? "" : "cursor-pointer"
                        }`}
                      >
                        {instantBooking && !day.isBlank && !day.isDisable && !day.isLock && (
                          <span className="absolute -right-1 -top-3 h-8 w-8" aria-hidden="true">
                            <span className="block h-full w-1/2 -rotate-45 bg-primary-action" />
                          </span>
                        )}
                        {!day.isBlank && (
                          <>
                            <span className="font-bold relative">
                              {day.has_discount &&
                                !day.isLock &&
                                !day.isDisable && (
                                    <span className="absolute -left-1 text-primary-700 text-xs dark:text-primary-200">
                                    %
                                  </span>
                                )}
                              {toPersianNumber(day.day)}
                            </span>
                            {!day.isDisable && !day.isLock && (
                              <>
                                {day.has_discount ? (
                                  <span className="relative text-[12px] mt-0.5">
                                    <span className="line-through text-gray-300 absolute -top-2 right-0 text-[10px] dark:text-slate-500">
                                      {formatPrice(day.original_price)}
                                    </span>
                                    {formatPrice(day.effective_price)}
                                  </span>
                                ) : (
                                  <span className="text-[14px] mt-0.5">
                                    {formatPrice(day.effective_price)}
                                  </span>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default ReserveCalendarSwiper;
