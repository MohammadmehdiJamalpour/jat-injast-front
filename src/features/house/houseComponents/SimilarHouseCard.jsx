import { useMemo, useState, useCallback } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import toPersianNumber from "./../../../utils/toPersianNumber";

import Vote from './../../../ui/Vote';

const formatPrice = (value) =>
  value ? `${toPersianNumber(value)} تومان / شب` : "نامشخـص";

function SimilarHouseCard({ house }) {
  const safeHouse = house ?? {};

  const {
    /* names & ids */
    uuid,
    name = "بدون عنوان",
    /* images (many APIs use different keys) */
    images: rawImages = [],
    image,
    avatar,
    /* prices */
    price: priceObj,
    price: priceNumber,
    originalPrice,
    discountPercent,
    /* misc */
    score: scoreProp,
    vote: voteProp,
    featured = false,
  } = safeHouse;

  const currentPrice = priceObj?.final ?? priceNumber ?? 0;
  const oldPrice = priceObj?.initial ?? originalPrice ?? 0;

  const computedDiscount =
    discountPercent ??
    (oldPrice && currentPrice && oldPrice > currentPrice
      ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
      : 0);

  const images = useMemo(() => {
    if (Array.isArray(rawImages) && rawImages.length) return rawImages;
    if (avatar) return [avatar];
    if (image) return [image];
    return [];
  }, [rawImages, avatar, image]);

  /* slider state */
  const [active, setActive] = useState(0);
  const canPrev = active > 0;
  const canNext = active < images.length - 1;

  /* small helpers */
  const prevImg = useCallback(() => canPrev && setActive((i) => i - 1), [canPrev]);
  const nextImg = useCallback(() => canNext && setActive((i) => i + 1), [canNext]);

  /* swipe / drag (unchanged) */
  const [dragStart, setDragStart] = useState(null);
  const [dragging, setDragging] = useState(false);
  const DRAG_LIMIT = 50;

  const onDragStart = (e) => {
    if (e.touches || e.button === 0) {
      setDragging(true);
      setDragStart(e.touches ? e.touches[0].clientX : e.clientX);
    }
  };

  const onDragMove = (e) => {
    if (!dragging || dragStart == null) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = x - dragStart;
    if (Math.abs(diff) >= DRAG_LIMIT) {
      diff > 0 ? prevImg() : nextImg();
      setDragging(false);
      setDragStart(null);
    }
  };

  const onDragEnd = () => {
    setDragging(false);
    setDragStart(null);
  };

  /* hover state (for chevron fade-in) */
  const [hovered, setHovered] = useState(false);

  /* translate for slider */
  const translateX = -(images.length - 1 - active) * 100;

  if (!house) return null;

  return (
    <div
      key={uuid}
      className="relative m-2.5 flex flex-col overflow-hidden rounded-3xl
                 border border-primary-600 shadow-centered shadow-primary-50
                 transition-transform duration-500 hover:scale-105 hover:shadow-primary-100"
    >
      {featured && (
        <span className="absolute right-2 top-2 z-20 rounded-full bg-primary-500/95
                         px-3 py-1 text-sm font-medium text-secondary-50 shadow-lg backdrop-blur">
          ویژه
        </span>
      )}

      {computedDiscount > 0 && (
        <span className="absolute left-2 top-2 z-20 rounded-full bg-red-500/90
                         px-2 py-1 text-xs font-bold lg:text-sm text-secondary-50 shadow-lg backdrop-blur">
          {toPersianNumber(computedDiscount)}٪ تخفیف
        </span>
      )}

      <div
        className="group relative h-40 w-full overflow-hidden xs:h-48 sm:h-64
                   md:h-44 550:h-56 lg:h-50 3xl:h-52 select-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className="flex flex-row-reverse h-full cursor-grab active:cursor-grabbing
                     transition-transform duration-500"
          style={{ transform: `translateX(${translateX}%)` }}
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={name}
              loading="lazy"
              className="min-w-full flex-none object-cover"
            />
          ))}
        </div>

        {/* next / prev chevrons */}
        {images.length > 1 && (
          <>
            <button
              aria-label="next"
              onClick={nextImg}
              disabled={!canNext}
              className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full
                          bg-primary-50/80 backdrop-blur-lg p-1 sm:p-2
                          text-primary-800 hover:scale-110 transition
                          ${canNext ? (hovered ? "opacity-100" : "opacity-0")
                                     : "opacity-10 cursor-not-allowed"}`}
            >
              <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <button
              aria-label="prev"
              onClick={prevImg}
              disabled={!canPrev}
              className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full
                          bg-primary-50/80 backdrop-blur-lg p-1 sm:p-2
                          text-primary-800 hover:scale-110 transition
                          ${canPrev ? (hovered ? "opacity-100" : "opacity-0")
                                     : "opacity-10 cursor-not-allowed"}`}
            >
              <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2.5 bg-primary-50/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-primary-900 md:text-base">
            {name}
          </h3>
          <Vote vote={scoreProp ?? voteProp ?? 0} />
        </div>

        <div className="flex items-baseline gap-2">
          {oldPrice > currentPrice && (
            <span className="line-through text-[10px] text-primary-500 sm:text-xs">
              {formatPrice(oldPrice)}
            </span>
          )}
          <span className="text-xs font-bold text-primary-800 lg:text-sm">
            {formatPrice(currentPrice)}
          </span>
        </div>
{/* 
        <p className="text-xs text-primary-800">
          اتاق‌ها: {toPersianNumber(rooms)}
        </p> */}

        {/* structure label if provided safely */}
        {/* {structure?.label && (
          <span className="mt-1 rounded-xl bg-primary-100 px-2 py-0.5 text-[10px] text-primary-700">
            {structure.label}
          </span>
        )} */}
      </div>
    </div>
  );
}

export default SimilarHouseCard;
