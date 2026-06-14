import { useState, useEffect, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import toPersianNumber from "../../utils/toPersianNumber";
import { toPersian } from "../../utils/toPersianDigits";
import Loading from "../../ui/Loading";
import {
  canUseHoverPreview,
  canSelectCalendarDay,
  getDayDateValue,
  getTodayMidnight,
  getVendorDayStyles,
  parseDayString,
} from "./calendarUtils";

export const TWO_MONTHS_BREAKPOINT_PX = 640;

function MonthNavButton({ direction, disabled, isLoading, onClick }) {
  const Icon = direction === "prev" ? ChevronRightIcon : ChevronLeftIcon;
  const label = direction === "prev" ? "ماه قبلی" : "ماه بعدی";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={label}
      title={label}
      className={`btn-press grid h-8 w-8 place-items-center rounded-full border border-primary-100 bg-white text-primary-800 shadow-sm transition dark:border-slate-700 dark:bg-slate-950 dark:text-primary-100 md:h-9 md:w-9 ${
        disabled || isLoading
          ? "cursor-not-allowed opacity-45"
          : "hover:border-primary-300 hover:bg-primary-50"
      }`}
    >
      <Icon className="h-4 w-4 md:h-5 md:w-5" />
    </button>
  );
}

export function formatCellPrice(price) {
  if (price == null) return "";

  const numericPrice =
    typeof price === "number" ? price : Number(String(price).replace(/,/g, ""));

  if (!Number.isFinite(numericPrice)) {
    return toPersianNumber(price);
  }

  return toPersianNumber(
    Math.round(numericPrice / 1000).toLocaleString("en-US"),
  );
}

export default function VendorCalendarContainer({
  calendarData = [],
  isRentRoom = false,
  selectedRoomUuid,
  instantBooking = false,
  loadingCalendar = false,
  onDayClick,
  viewOnly = false,
  fetchNextMonth,
  reserveDateFrom,
  reserveDateTo,
  operationGroup,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [monthsPerView, setMonthsPerView] = useState(1);
  const [hoverDate, setHoverDate] = useState(null);
  const [isAdvancingMonth, setIsAdvancingMonth] = useState(false);

  useEffect(() => {
    function updateMonthsPerView() {
      setMonthsPerView(window.innerWidth >= TWO_MONTHS_BREAKPOINT_PX ? 2 : 1);
    }
    updateMonthsPerView();
    window.addEventListener("resize", updateMonthsPerView);
    return () => window.removeEventListener("resize", updateMonthsPerView);
  }, []);

  const formatCalendarYear = (year) => toPersian(year ?? "");

  function getDayStyles(day) {
    return getVendorDayStyles({
      day,
      reserveDateFrom,
      reserveDateTo,
      hoverDate,
    });
  }

  function handleDayPointerEnter(event, day) {
    if (!canUseHoverPreview(event)) return;
    if (!reserveDateFrom || reserveDateTo) return;
    if (
      !canSelectCalendarDay(day, {
        allowOffsiteBooking: operationGroup === "offsite",
      })
    ) {
      return;
    }
    setHoverDate(day);
  }

  function handleDayPointerLeave(event) {
    if (canUseHoverPreview(event) && hoverDate) setHoverDate(null);
  }

  const displayedData = useMemo(() => {
    if (!calendarData?.length) return [];
    if (isRentRoom && !selectedRoomUuid) return [];
    return calendarData;
  }, [calendarData, isRentRoom, selectedRoomUuid]);

  const totalMonths = displayedData.length;
  const maxIndex = Math.max(0, totalMonths - monthsPerView);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  if (loadingCalendar) {
    return (
      <div className="text-center w-full h-full bg-white py-6 dark:bg-slate-900">
        <Loading />
      </div>
    );
  }

  if (!displayedData.length) {
    return <div className="text-center py-8">هیچ داده‌ای موجود نیست</div>;
  }

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = async () => {
    if (isAdvancingMonth) return;

    if (currentIndex >= maxIndex) {
      if (!fetchNextMonth) return;

      setIsAdvancingMonth(true);
      try {
        const nextLength = await fetchNextMonth();
        const resolvedLength = Number.isFinite(Number(nextLength))
          ? Number(nextLength)
          : displayedData.length;
        setCurrentIndex((prev) =>
          Math.min(prev + 1, Math.max(0, resolvedLength - monthsPerView)),
        );
      } finally {
        setIsAdvancingMonth(false);
      }
      return;
    }

    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const translatePercentage = 100 / monthsPerView;
  const translateX = currentIndex * translatePercentage;
  const visibleEndIndex = Math.min(
    currentIndex + monthsPerView - 1,
    totalMonths - 1,
  );
  const isNextDisabled = currentIndex >= maxIndex && !fetchNextMonth;

  return (
    <div
      dir="rtl"
      className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl px-0 sm:px-1 xl:max-w-6xl"
    >
      <div
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(${translateX}%)` }}
      >
        {displayedData.map((monthData, dataIndex) => {
          const showPrevControl = dataIndex === currentIndex;
          const showNextControl = dataIndex === visibleEndIndex;

          return (
            <div
              key={dataIndex}
              className="w-full flex-shrink-0 px-1 sm:w-1/2 sm:px-2"
            >
              <div className="mb-1.5 flex items-center justify-between gap-2 rounded-xl border border-primary-100 bg-white/90 px-2 py-1 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:mb-2 md:px-2.5 md:py-1.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center md:h-9 md:w-9">
                  {showPrevControl && (
                    <MonthNavButton
                      direction="prev"
                      disabled={currentIndex === 0}
                      onClick={handlePrev}
                    />
                  )}
                </div>

                <h3 className="min-w-0 truncate text-center text-xs font-bold text-gray-800 dark:text-slate-100 sm:text-sm md:text-base">
                  {monthData.month_name} {formatCalendarYear(monthData.year)}
                </h3>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center md:h-9 md:w-9">
                  {showNextControl && (
                    <MonthNavButton
                      direction="next"
                      disabled={isNextDisabled}
                      isLoading={isAdvancingMonth}
                      onClick={handleNext}
                    />
                  )}
                </div>
              </div>

              <div className="mb-1.5 grid grid-cols-7 text-center text-[10px] font-semibold text-gray-500 dark:text-slate-400 md:mb-2 md:text-xs">
                <div>ش</div>
                <div>ی</div>
                <div>د</div>
                <div>س</div>
                <div>چ</div>
                <div>پ</div>
                <div>ج</div>
              </div>

              <div className="grid grid-cols-7 gap-1 md:gap-1.5 lg:justify-items-center">
                {(monthData.days || []).map((day, dayIndex) => {
                  const dayClass = getDayStyles(day);
                  const selectable = canSelectCalendarDay(day, {
                    allowOffsiteBooking: operationGroup === "offsite",
                  });
                  const showPrice = !day.isBookingOffSite;
                  const actualPrice = day.specialPrice ?? day.price;
                  const showOriginalPrice =
                    day.specialPrice != null && day.price != null;

                  const handleClick = () => {
                    if (!selectable || !onDayClick) return;
                    setHoverDate(null);
                    onDayClick(day);
                  };

                  const handlePointerEnter = (event) =>
                    handleDayPointerEnter(event, day);
                  const handlePointerLeave = (event) =>
                    handleDayPointerLeave(event);

                  const dayDateObj = parseDayString(getDayDateValue(day));
                  const isFutureOrToday = dayDateObj
                    ? dayDateObj >= getTodayMidnight()
                    : false;

                  return (
                    <div
                      key={dayIndex}
                      className={`relative aspect-square w-full overflow-hidden rounded-xl p-0.5 transition md:rounded-2xl lg:max-w-16 ${dayClass} ${
                        selectable ? "cursor-pointer" : ""
                      }`}
                      onClick={handleClick}
                      onPointerEnter={handlePointerEnter}
                      onPointerLeave={handlePointerLeave}
                    >
                      {!day.isLock &&
                        !day.isDisable &&
                        day.isPeakDay &&
                        isFutureOrToday && (
                          <div
                            className="absolute top-0 left-0 w-full h-full z-0 opacity-70"
                            style={{
                              clipPath: "polygon(0 0, 100% 0, 0 100%)",
                              backgroundColor: "var(--color-primary-400)",
                            }}
                          />
                        )}

                      {day.isBookingOffSite && isFutureOrToday && (
                        <div
                          className="absolute top-0 left-0 w-full h-full z-0"
                          style={{
                            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                            backgroundColor: "var(--color-secondary-200)",
                          }}
                        />
                      )}

                      {instantBooking && selectable && !viewOnly && (
                        <div className="absolute -top-3 -right-1 w-8 h-8 z-10">
                          <div className="w-1/2 h-full -rotate-45 bg-primary-600" />
                        </div>
                      )}

                      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                        {!day.isBlank && !day.isCurrentMonth && (
                          <div
                            className={`text-[10px] font-bold sm:text-[11px] md:text-xs ${
                              viewOnly && day.isHoliday ? "text-red-700" : ""
                            }`}
                          >
                            {toPersianNumber(day.day)}
                          </div>
                        )}

                        {selectable && showPrice && actualPrice != null && (
                          <div className="mt-0.5 hidden min-w-0 max-w-full text-[10px] font-semibold leading-3 text-current md:block lg:text-[11px]">
                            {showOriginalPrice ? (
                              <div className="flex min-w-0 flex-col items-center gap-0.5">
                                <div className="hidden max-w-full truncate text-[9px] font-medium leading-none opacity-60 line-through xl:block">
                                  {formatCellPrice(day.price)}
                                </div>
                                <div className="max-w-full truncate text-[10px] font-bold leading-none lg:text-[11px]">
                                  {formatCellPrice(actualPrice)}
                                </div>
                              </div>
                            ) : (
                              <div className="max-w-full truncate font-bold leading-none">
                                {formatCellPrice(actualPrice)}
                              </div>
                            )}
                          </div>
                        )}

                        {day.isPeakDayCreatedByAdmin && isFutureOrToday && (
                          <div className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
