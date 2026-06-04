import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import toPersianNumber from "../../utils/toPersianNumber";
import Loading from "../../ui/Loading";
import {
  canSelectCalendarDay,
  getDayDateValue,
  getTodayMidnight,
  getVendorDayStyles,
  parseDayString,
} from "./calendarUtils";

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
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [monthsPerView, setMonthsPerView] = useState(1);

  const [hoverDate, setHoverDate] = useState(null);

  useEffect(() => {
    function updateMonthsPerView() {
      setMonthsPerView(window.innerWidth >= 1024 ? 2 : 1);
    }
    updateMonthsPerView();
    window.addEventListener("resize", updateMonthsPerView);
    return () => window.removeEventListener("resize", updateMonthsPerView);
  }, []);

  const formatPrice = (price) =>
    price == null ? "" : toPersianNumber(price.toLocaleString());

  function getDayStyles(day) {
    return getVendorDayStyles({
      day,
      reserveDateFrom,
      reserveDateTo,
      hoverDate,
    });
  }

  function handleDayMouseEnter(day) {
    if (!reserveDateFrom || reserveDateTo) return;
    if (day.isDisable || day.isBlank || day.isLock || day.isCurrentMonth) return;
    setHoverDate(day);
  }
  function handleDayMouseLeave() {
    if (hoverDate) setHoverDate(null);
  }

  const displayedData = useMemo(() => {
    if (!calendarData?.length) return [];
    if (isRentRoom && !selectedRoomUuid) return [];
    return calendarData;
  }, [calendarData, isRentRoom, selectedRoomUuid]);

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

  const totalMonths = displayedData.length;
  const maxIndex = Math.max(0, totalMonths - monthsPerView);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = async () => {
    if (currentIndex === maxIndex && fetchNextMonth) {
      await fetchNextMonth();
    }
    setCurrentIndex((prev) => Math.min(prev + 1, displayedData.length - monthsPerView));
  };

  const translatePercentage = 100 / monthsPerView;
  const translateX = currentIndex * translatePercentage;

  return (
    <div dir="rtl" className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl px-1 sm:px-2">
      <div className="mb-1.5 flex items-center justify-between rounded-xl border border-primary-100 bg-white/90 px-2 py-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`btn-press grid h-7 w-7 place-items-center rounded-full border border-primary-100 bg-white text-primary-800 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-primary-100 ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>

        {monthsPerView === 1 && displayedData[currentIndex] && (
          <h3 className="text-xs font-bold text-gray-800 dark:text-slate-100 sm:text-sm">
            {displayedData[currentIndex].month_name}{" "}
            {toPersianNumber(displayedData[currentIndex].year)}
          </h3>
        )}

        <button
          onClick={handleNext}
          className={`btn-press grid h-7 w-7 place-items-center rounded-full border border-primary-100 bg-white text-primary-800 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-primary-100 ${
            currentIndex === displayedData.length - monthsPerView
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
      </div>

      <div
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(${translateX}%)` }}
      >
        {displayedData.map((monthData, dataIndex) => (
          <div
            key={dataIndex}
            className="w-full flex-shrink-0 px-1 lg:w-1/2 lg:px-1.5"
          >
            {monthsPerView === 2 && (
              <div className="mb-1 text-center text-xs font-bold text-gray-800 dark:text-slate-100 sm:text-sm">
                {monthData.month_name} {toPersianNumber(monthData.year)}
              </div>
            )}

            <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-semibold text-gray-500 dark:text-slate-400">
              <div>ش</div>
              <div>ی</div>
              <div>د</div>
              <div>س</div>
              <div>چ</div>
              <div>پ</div>
              <div>ج</div>
            </div>

            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {(monthData.days || []).map((day, dayIndex) => {
                const dayClass = getDayStyles(day);
                const selectable = canSelectCalendarDay(day);
                const showPrice = !day.isBookingOffSite;
                const actualPrice = day.specialPrice ?? day.price;
                const showOriginalPrice = day.specialPrice != null && day.price != null;

                const handleClick = () => {
                  if (selectable && onDayClick) onDayClick(day);
                };

                const handleMouseEnter = () => handleDayMouseEnter(day);
                const handleMouseLeave = () => handleDayMouseLeave();

                const dayDateObj = parseDayString(getDayDateValue(day));
                const isFutureOrToday = dayDateObj ? dayDateObj >= getTodayMidnight() : false;

                return (
                  <div
                    key={dayIndex}
                    className={`relative aspect-square overflow-hidden rounded-2xl p-0.5 transition ${dayClass}`}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {!day.isLock &&
                      !day.isDisable &&
                      day.isPeakDay &&
                      isFutureOrToday && (
                        <div
                          className="absolute top-0 left-0 w-full h-full z-0 opacity-90"
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
                            viewOnly && day.isHoliday ? "text-red-600" : ""
                          }`}
                        >
                          {toPersianNumber(day.day)}
                        </div>
                      )}

                      {selectable && showPrice && actualPrice != null && (
                        <div className="mt-0.5 hidden text-[8px] leading-3 text-gray-600 dark:text-slate-300 lg:block">
                          {showOriginalPrice ? (
                            <div className="relative xs:static">
                              <div className="hidden text-[8px] text-gray-400 line-through xl:block">
                                {formatPrice(day.price)}
                              </div>
                              <div className="text-[8px] xl:text-[9px]">
                                {formatPrice(actualPrice)}
                              </div>
                            </div>
                          ) : (
                            <div>{formatPrice(actualPrice)}</div>
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
        ))}
      </div>
    </div>
  );
}
