import React, { useCallback, useMemo } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@/lib/router-compat";

import Vote from "./../../ui/Vote";
import toPersianNumber from "./../../utils/toPersianNumber";

const imagesOf = (house) => {
  if (Array.isArray(house.images) && house.images.length) return house.images;
  if (house.image) return [house.image];
  if (house.avatar) return [house.avatar];
  return [];
};

function HouseCard({ house }) {
  const navigate = useNavigate();
  const safeHouse = house ?? {};
  const destination = `/house/${safeHouse.id}`;

  const imageSrc = useMemo(() => imagesOf(safeHouse)[0] ?? "", [safeHouse]);

  const addressParts = useMemo(() => {
    const address = safeHouse.address || {};
    const parts = [
      address.province?.name,
      address.city?.name !== address.province?.name ? address.city?.name : null,
      address.village !== address.city?.name ? address.village : null,
    ];

    return parts.filter(Boolean).filter((item, index, list) => list.indexOf(item) === index);
  }, [safeHouse]);

  const priceLabel = useMemo(() => {
    const finalPrice = safeHouse.price?.final;

    if (typeof finalPrice === "number") {
      return `${toPersianNumber(finalPrice.toLocaleString())} تومان هر شب`;
    }

    return "قیمت نامشخص";
  }, [safeHouse]);

  const openHouse = useCallback(() => {
    navigate(destination);
  }, [destination, navigate]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openHouse();
      }
    },
    [openHouse]
  );

  const handleActionClick = useCallback(
    (event) => {
      event.stopPropagation();
      openHouse();
    },
    [openHouse]
  );

  if (!house) return null;

  return (
    <article
      dir="rtl"
      role="link"
      tabIndex={0}
      onClick={openHouse}
      onKeyDown={handleKeyDown}
      aria-label={`مشاهده ${safeHouse.name ?? "اقامتگاه"}`}
      className="group relative m-2.5 flex min-h-[18rem] cursor-pointer select-none flex-col overflow-hidden rounded-[1.7rem] border border-primary-300/80 bg-surface text-right shadow-[0_14px_36px_rgb(0_111_140/0.10)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-primary-500/70 hover:shadow-[0_22px_54px_rgb(0_111_140/0.18)] focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300/40 dark:border-sky-400/30 dark:bg-slate-900 dark:shadow-black/25 dark:hover:border-sky-300/70"
    >
      <div className="relative h-40 w-full overflow-hidden xs:h-48 sm:h-64 md:h-44 550:h-56 lg:h-50 3xl:h-52">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={safeHouse.name ?? "اقامتگاه"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-50 text-sm font-bold text-primary-700 dark:bg-slate-800 dark:text-sky-100">
            بدون تصویر
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 bg-primary-50/55 px-4 pb-3 pt-3 dark:bg-slate-900">
        <h3 className="truncate text-right text-sm font-extrabold text-primary-900 transition-colors duration-300 group-hover:text-primary-700 md:text-base dark:text-sky-100 dark:group-hover:text-white">
          {safeHouse.name}
        </h3>

        <div className="flex flex-wrap items-center justify-start gap-1.5 text-[11px]">
          {safeHouse.structure?.label && (
            <span className="inline-flex h-6 items-center gap-1 rounded-full bg-white/70 px-2.5 font-semibold text-primary-800 ring-1 ring-primary-100/80 transition-colors duration-300 group-hover:bg-primary-50 dark:bg-slate-800 dark:text-sky-100 dark:ring-sky-300/15">
              {safeHouse.structure.icon && (
                <img
                  src={safeHouse.structure.icon}
                  alt={safeHouse.structure.label}
                  className="h-3.5 w-3.5 rounded-full object-contain"
                  loading="lazy"
                />
              )}
              <span className="max-w-24 truncate">{safeHouse.structure.label}</span>
            </span>
          )}

          {addressParts.length > 0 && (
            <span className="inline-flex h-6 max-w-28 items-center rounded-full bg-white/70 px-2.5 font-semibold text-primary-800 ring-1 ring-primary-100/80 transition-colors duration-300 group-hover:bg-primary-50 dark:bg-slate-800 dark:text-sky-100 dark:ring-sky-300/15">
              <span className="truncate">{addressParts.join(", ")}</span>
            </span>
          )}

          <Vote vote={safeHouse.vote} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1 text-[12px] font-bold text-primary-900 dark:text-sky-100">
          <span className="min-w-0 truncate">{priceLabel}</span>

          <button
            type="button"
            onClick={handleActionClick}
            className="btn-press inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-primary-action px-3.5 text-xs font-bold text-white shadow-[0_8px_20px_rgb(0_111_140/0.22)] transition-all duration-300 hover:bg-primary-action-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300/40 dark:bg-primary-600 dark:text-white dark:shadow-black/30"
          >
            <span>مشاهده</span>
            <ArrowLeftIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default HouseCard;
