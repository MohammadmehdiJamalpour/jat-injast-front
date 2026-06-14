import { useMemo, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  BuildingOffice2Icon,
  ChevronRightIcon,
  HomeModernIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

import { Link } from "@/lib/router-compat";
import toPersianNumber from "./../../../utils/toPersianNumber";
import Vote from "./../../../ui/Vote";

const cleanNumber = (val) => Number(val?.toString().replace(/[^0-9]/g, ""));
const CARD_IMAGE_SIZES =
  "(min-width: 1536px) 28rem, (min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw";
const CARD_SIZE_CLASSES = {
  default: {
    image: "h-52 xs:h-60 sm:h-60 lg:h-72 xl:h-60 3xl:h-72",
    link: "gap-3 p-3 md:p-4",
    content: "gap-3",
    header: "gap-3",
    details: "gap-x-3 gap-y-2",
    button: "min-h-9 min-w-24 px-4 py-2 text-sm",
  },
  compact: {
    image:
      "h-[11.05rem] xs:h-[12.75rem] sm:h-[12.75rem] lg:h-[15.3rem] xl:h-[12.75rem] 3xl:h-[15.3rem]",
    link: "gap-2 p-2.5 md:p-3",
    content: "gap-2",
    header: "gap-2",
    details: "gap-x-2 gap-y-1.5",
    button: "min-h-8 min-w-20 px-3 py-1.5 text-xs",
  },
};
const formatPrice = (value) => `${toPersianNumber(value)} تومان / شب`;

function PriceBlock({ house, className = "" }) {
  return (
    <div className={`flex min-w-0 max-w-full flex-col items-end gap-0.5 ${className}`}>
      {house.originalPrice && (
        <span className="max-w-full truncate text-[10px] leading-tight text-primary-500 line-through dark:text-sky-200/70">
          {formatPrice(house.originalPrice)}
        </span>
      )}
      <span className="max-w-full truncate text-xs font-bold leading-snug text-primary-800 dark:text-sky-100 lg:text-sm">
        {formatPrice(house.price)}
      </span>
    </div>
  );
}

function DetailChip({ icon: Icon, label, title }) {
  return (
    <span
      className="inline-flex h-7 max-w-full min-w-0 items-center gap-1 rounded-full border border-primary-100 bg-white/80 px-2 text-[11px] font-medium leading-none text-primary-800 shadow-sm shadow-primary-50/50 dark:border-primary-400/20 dark:bg-slate-950/55 dark:text-sky-100 dark:shadow-black/20"
      title={title || label}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary-600 dark:text-sky-200" />
      <span className="min-w-0 truncate">{label}</span>
    </span>
  );
}

function SearchHouseCard({ house, size = "default" }) {
  const safeHouse = house ?? {};
  const sizeClasses = CARD_SIZE_CLASSES[size] ?? CARD_SIZE_CLASSES.default;

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

  const images = useMemo(() => {
    if (Array.isArray(safeHouse.images) && safeHouse.images.length) return safeHouse.images;
    return safeHouse.avatar ? [safeHouse.avatar] : [];
  }, [safeHouse.images, safeHouse.avatar]);

  const [activeIndex, setActiveIndex] = useState(0);
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < images.length - 1;

  const prevImg = useCallback(() => {
    if (canGoPrev) setActiveIndex((idx) => idx - 1);
  }, [canGoPrev]);

  const nextImg = useCallback(() => {
    if (canGoNext) setActiveIndex((idx) => idx + 1);
  }, [canGoNext]);

  const dragThreshold = 50;
  const hasDraggedRef = useRef(false);
  const [startX, setStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (e) => {
    if (e.touches || e.button === 0) {
      hasDraggedRef.current = false;
      setIsDragging(true);
      setStartX(e.touches ? e.touches[0].clientX : e.clientX);
    }
  };

  const handleMove = (e) => {
    if (!isDragging || startX === null) return;

    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startX;

    if (e.touches && Math.abs(diff) > 10) e.preventDefault();
    if (Math.abs(diff) > 10) hasDraggedRef.current = true;

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

  const cycleImage = useCallback(() => {
    if (images.length <= 1) return;
    setActiveIndex((idx) => (idx + 1) % images.length);
  }, [images.length]);

  const handleImageClick = () => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }

    cycleImage();
  };

  const handlePrevClick = (event) => {
    event.stopPropagation();
    prevImg();
  };

  const handleNextClick = (event) => {
    event.stopPropagation();
    nextImg();
  };


  const [isSliderHovered, setIsSliderHovered] = useState(false);

  const translateX = -((images.length - 1 - activeIndex) * 100);

  if (!house) return null;

  const houseHref = `/house/${house.uuid || house.id}`;
  const locationParts = [house.city, house.province].filter(Boolean);
  const locationLabel =
    locationParts.length === 2 && locationParts[0] === locationParts[1]
      ? locationParts[0]
      : locationParts.join("، ");
  const detailChips = [
    house.rooms !== null &&
      house.rooms !== undefined && {
        key: "rooms",
        icon: HomeModernIcon,
        label: `${toPersianNumber(house.rooms)} اتاق`,
      },
    house.structure && {
      key: "structure",
      icon: BuildingOffice2Icon,
      label: house.structure,
    },
    locationLabel && {
      key: "location",
      icon: MapPinIcon,
      label: locationLabel,
    },
  ].filter(Boolean);

  return (
    <div
      data-testid="search-house-card"
      className="relative flex h-full min-w-0 select-none flex-col overflow-hidden rounded-3xl border border-primary-600 bg-primary-50/30 shadow-centered shadow-primary-50 transition-transform duration-500 hover:scale-[1.02] hover:shadow-primary-100 dark:border-primary-400/40 dark:bg-slate-900 dark:shadow-black/25"
    >
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

      <div
        className={`relative w-full overflow-hidden ${sizeClasses.image}`}
        onMouseEnter={() => setIsSliderHovered(true)}
        onMouseLeave={() => setIsSliderHovered(false)}
      >
        {/* slides container */}
        <div
          data-testid="search-house-card-gallery"
          className="flex h-full cursor-pointer flex-row-reverse transition-transform duration-500 active:cursor-grabbing"
          style={{ transform: `translateX(${translateX}%)` }}
          onClick={handleImageClick}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative h-full min-w-full flex-none overflow-hidden">
              <Image
                src={src}
                alt={house.name || "House image"}
                fill
                sizes={CARD_IMAGE_SIZES}
                draggable={false}
                className="pointer-events-none object-cover"
              />
            </div>
          ))}
        </div>

        {/* LEFT chevron – NEXT image */}
        {images.length > 1 && (
          <button
            aria-label="Next image"
            onClick={handleNextClick}
            disabled={!canGoNext}
            className={`absolute left-2 top-1/2 z-50 -translate-y-1/2
              rounded-full bg-primary-50/80 backdrop-blur-lg
              p-1 sm:p-2 text-primary-800 hover:scale-110
              transition-opacity duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:bg-slate-950/80 dark:text-sky-100
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
            onClick={handlePrevClick}
            disabled={!canGoPrev}
            className={`absolute right-2 top-1/2 -translate-y-1/2
              rounded-full bg-primary-50/80 backdrop-blur-lg
              p-1 sm:p-2 text-primary-800 hover:scale-110
              transition-opacity duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:bg-slate-950/80 dark:text-sky-100
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

    

      <Link
        href={houseHref}
        data-testid="search-house-card-details-link"
        aria-label={`View details for ${house.name || "house"}`}
        className={`group flex min-w-0 flex-1 flex-col outline-none transition-colors hover:bg-primary-50/80 focus-visible:bg-primary-50/80 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-300 dark:hover:bg-slate-800/70 dark:focus-visible:bg-slate-800/70 ${sizeClasses.link}`}
      >
        <div className={`flex min-w-0 flex-1 flex-col ${sizeClasses.content}`}>
          <div className={`flex min-w-0 items-start justify-between md:items-center ${sizeClasses.header}`}>
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-primary-900 dark:text-sky-50 md:text-base">
                {house.name}
              </h3>
              <span className="shrink-0">
                <Vote vote={house.score} />
              </span>
            </div>
            <PriceBlock house={house} className="hidden shrink-0 md:flex md:max-w-[45%]" />
          </div>

          <div className={`flex min-w-0 flex-wrap items-start justify-between ${sizeClasses.details}`}>
            {detailChips.length > 0 && (
              <div className="flex min-w-0 flex-1 basis-[9rem] flex-wrap items-center gap-1.5">
                {detailChips.map((chip) => (
                  <DetailChip
                    key={chip.key}
                    icon={chip.icon}
                    label={chip.label}
                    title={chip.label}
                  />
                ))}
              </div>
            )}
            <PriceBlock house={house} className="shrink-0 md:hidden" />
          </div>
        </div>

        {}
        <div className="flex shrink-0 items-center justify-end">
          <span
            className={`btn-press inline-flex items-center justify-center rounded-3xl bg-primary-action text-center font-bold leading-tight text-primary-contrast shadow-centered shadow-primary-200/90 transition-transform duration-400 group-hover:bg-primary-action-hover group-hover:shadow-primary-300 dark:bg-primary-600 dark:text-white dark:shadow-black/30 ${sizeClasses.button}`}
          >
            مشاهده
          </span>
        </div>
      </Link>

    </div>
  );
}

export default SearchHouseCard;
