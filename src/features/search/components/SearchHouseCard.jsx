import React, { useMemo, useState, useCallback } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

import toPersianNumber from "./../../../utils/toPersianNumber";
import Vote from "./../../../ui/Vote";

/* ---------------------------------- helpers --------------------------------- */
const cleanNumber = (val) => Number(val?.toString().replace(/[^0-9]/g, ""));
const formatPrice = (value) => `${toPersianNumber(value)} تومان / شب`;

/* --------------------------------------------------------------------------- */
function SearchHouseCard({ house }) {
  const safeHouse = house ?? {};

  /* ------------------------------ discount logic ------------------------------ */
  const discountPercent = useMemo(() => {
    if (safeHouse.discountPercent) return safeHouse.discountPercent;
    if (safeHouse.originalPrice) {
      const original = cleanNumber(safeHouse.originalPrice);
      const current = cleanNumber(safeHouse.price);
      if (original && current && original > current) {
        return Math.round(((original - current) / original) * 100);
      }
    }
    return 0;
  }, [safeHouse.discountPercent, safeHouse.originalPrice, safeHouse.price]);

  /* ------------------------------ images logic -------------------------------- */
  const images = useMemo(() => {
    if (Array.isArray(safeHouse.images) && safeHouse.images.length) return safeHouse.images;
    return safeHouse.avatar ? [safeHouse.avatar] : [];
  }, [safeHouse.images, safeHouse.avatar]);

  const [activeIndex, setActiveIndex] = useState(0);
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < images.length - 1;

  /* ---------------------------- navigation helpers --------------------------- */
  const prevImg = useCallback(() => {
    if (canGoPrev) setActiveIndex((idx) => idx - 1);
  }, [canGoPrev]);

  const nextImg = useCallback(() => {
    if (canGoNext) setActiveIndex((idx) => idx + 1);
  }, [canGoNext]);

  /* --------------------------- swipe / drag logic --------------------------- */
  const dragThreshold = 50;
  const [startX, setStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (e) => {
    if (e.touches || e.button === 0) {
      setIsDragging(true);
      setStartX(e.touches ? e.touches[0].clientX : e.clientX);
    }
  };

  const handleMove = (e) => {
    if (!isDragging || startX === null) return;

    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX;

    if (e.touches && Math.abs(diff) > 10) e.preventDefault();

    if (Math.abs(diff) >= dragThreshold) {
      diff > 0 ? prevImg() : nextImg();
      setIsDragging(false);
      setStartX(null);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setStartX(null);
  };


  const [isSliderHovered, setIsSliderHovered] = useState(false);

  /* --------------------------- compute transform ---------------------------- */
  const translateX = -((images.length - 1 - activeIndex) * 100);

  if (!house) return null;

  /* --------------------------------------------------------------------------- */
  return (
    <div className="relative m-2.5 flex select-none flex-col overflow-hidden rounded-3xl border border-primary-600 bg-primary-50/30 shadow-centered shadow-primary-50 transition-transform duration-500 hover:scale-[1.02] hover:shadow-primary-100">
      {/* Featured badge */}
      {house.featured && (
        <span className="absolute right-2 top-2 z-20 rounded-full bg-primary-action/95 px-3 py-1 text-sm font-medium text-primary-contrast shadow-lg backdrop-blur">
          ویژه
        </span>
      )}

      {/* Discount badge */}
      {discountPercent > 0 && (
        <span className="absolute left-2 top-2 z-20 rounded-full bg-red-500/90 px-2 py-1 text-xs font-bold lg:text-sm text-secondary-50 shadow-lg backdrop-blur">
          {toPersianNumber(discountPercent)}٪ تخفیف
        </span>
      )}

      {/* ----------------------------- image slider ------------------------------ */}
      <div
        className="relative h-52 w-full overflow-hidden xs:h-60 sm:h-60 550:sm-72 lg:h-72 xl:h-60 3xl:h-72"
        onMouseEnter={() => setIsSliderHovered(true)}
        onMouseLeave={() => setIsSliderHovered(false)}
      >
        {/* slides container */}
        <div
          className="flex flex-row-reverse h-full transition-transform duration-500 cursor-grab active:cursor-grabbing"
          style={{ transform: `translateX(${translateX}%)` }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={house.name}
              className="min-w-full h-full flex-none object-cover pointer-events-none"
              loading="lazy"
            />
          ))}
        </div>

        {/* LEFT chevron – NEXT image */}
        {images.length > 1 && (
          <button
            aria-label="Next image"
            onClick={nextImg}
            disabled={!canGoNext}
            className={`absolute left-2 top-1/2 z-50 -translate-y-1/2
              rounded-full bg-primary-50/80 backdrop-blur-lg
              p-1 sm:p-2 text-primary-800 hover:scale-110
              transition-opacity duration-300 ease-in-out
              ${
                canGoNext
                  ? isSliderHovered
                    ? "opacity-100"
                    : "opacity-0"
                  : "opacity-10 cursor-not-allowed"
              }`}
          >
            <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}

        {/* RIGHT chevron – PREVIOUS image */}
        {images.length > 1 && (
          <button
            aria-label="Previous image"
            onClick={prevImg}
            disabled={!canGoPrev}
            className={`absolute right-2 top-1/2 -translate-y-1/2
              rounded-full bg-primary-50/80 backdrop-blur-lg
              p-1 sm:p-2 text-primary-800 hover:scale-110
              transition-opacity duration-300 ease-in-out
              ${
                canGoPrev
                  ? isSliderHovered
                    ? "opacity-100"
                    : "opacity-0"
                  : "opacity-10 cursor-not-allowed bg-primary-400"
              }`}
          >
            <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}
      </div>

    

      {/* ----------------------------- house details ----------------------------- */}
      <div className="flex items-center ">
        {/* left-hand text block (unchanged) */}
        <div className="flex flex-col  gap-2.5 w-full pr-4 py-2">
          <div className="flex items-center gap-2">
            <h3 className="max-w-full truncate text-sm font-semibold text-primary-900 md:text-base">
              {house.name}
            </h3>
            <Vote vote={house.score} />
          </div>

          {/* price */}
          <div className="flex items-baseline gap-2 xl:gap-0 2xl:gap-2">
            {house.originalPrice && (
              <span className="text-[10px] text-primary-500 line-through sm:text-xs md:scale-95">
                {formatPrice(house.originalPrice)}
              </span>
            )}
            <span className="text-xs font-bold text-primary-800 lg:text-sm">
              {formatPrice(house.price)}
            </span>
          </div>

          <p className="text-xs text-primary-800">
            اتاق‌ها: {toPersianNumber(house.rooms)}
          </p>
        </div>

        {}
        <div className="w-1/2 h-20 flex items-center justify-center ">
          <a
            href={`/house/${house.uuid || house.id}`}
            className="btn-press w-10/12 rounded-3xl bg-primary-action py-2 text-center text-primary-contrast shadow-centered shadow-primary-200/90 transition-transform duration-400 hover:bg-primary-action-hover hover:shadow-primary-300"
          >
            مشاهده
          </a>
        </div>
      </div>

    </div>
  );
}

export default SearchHouseCard;

