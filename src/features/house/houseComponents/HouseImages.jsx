import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { expandableButtonClassName } from "../../../ui/ExpandableContent";
import { isBackendMediaPath } from "../../../services/mediaUrl";

const GalleryLightbox = dynamic(() => import("../../../ui/GalleryLightbox"), {
  ssr: false,
  loading: () => null,
});

const FALLBACK_IMAGES = [
  { media: "/assets/favorite-1.jpg", title: "تصویر اقامتگاه" },
  { media: "/assets/favorite-2.jpg", title: "تصویر اقامتگاه" },
  { media: "/assets/1.webp", title: "تصویر اقامتگاه" },
  { media: "/assets/2.webp", title: "تصویر اقامتگاه" },
];

function ImageWithSkeleton({
  src,
  alt,
  title,
  wrapperClassName = "",
  imgClassName = "",
  onClick,
  sizes = "100vw",
}) {
  const [status, setStatus] = useState("loading");
  const imageSrc = src || "/assets/favorite-1.jpg";
  const shouldSkipOptimizer = isBackendMediaPath(imageSrc);

  const handleClick = () => {
    if (status === "loaded" && typeof onClick === "function") onClick();
  };

  return (
    <button
      type="button"
      aria-label={title || alt}
      className={`relative block ${wrapperClassName} cursor-pointer overflow-hidden text-right btn-press`}
      onClick={handleClick}
    >
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse rounded-3xl bg-gray-200" />
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-red-100/80">
          <span className="text-xs text-red-700 sm:text-sm">خطا در بارگذاری</span>
        </div>
      )}

      <Image
        src={imageSrc}
        alt={alt}
        title={title}
        fill
        sizes={sizes}
        unoptimized={shouldSkipOptimizer}
        className={`${imgClassName} transition-opacity duration-300 ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </button>
  );
}

export default function HouseImages({ houseData }) {
  const mainImage = houseData?.image
    ? { media: houseData.image, title: houseData.title || "تصویر اصلی" }
    : null;

  const galleryImages =
    houseData?.galleries?.map((gallery, index) => ({
      media: gallery.media,
      title: gallery.title || `تصویر ${index + 1}`,
    })) || [];

  const images = (mainImage ? [mainImage, ...galleryImages] : galleryImages)
    .filter((image) => image?.media)
    .filter(
      (image, index, items) =>
        items.findIndex((item) => item.media === image.media) === index,
    );
  const displayImages = images.length > 0 ? images : FALLBACK_IMAGES;

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileScrollerRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const hasMultipleImages = displayImages.length > 1;

  const open = (index) => {
    setSelected(index);
    setIsOpen(true);
  };

  const updateActiveMobileIndex = useCallback(() => {
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;

    const scrollerRect = scroller.getBoundingClientRect();
    const scrollerCenter = scrollerRect.left + scrollerRect.width / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    Array.from(scroller.children).forEach((slide, index) => {
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const distance = Math.abs(slideCenter - scrollerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveMobileIndex(closestIndex);
  }, []);

  const handleMobileScroll = useCallback(() => {
    if (scrollFrameRef.current) {
      cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = requestAnimationFrame(updateActiveMobileIndex);
  }, [updateActiveMobileIndex]);

  const scrollToMobileImage = useCallback(
    (index) => {
      const nextIndex = Math.min(Math.max(index, 0), displayImages.length - 1);
      const slide = mobileScrollerRef.current?.children[nextIndex];

      setActiveMobileIndex(nextIndex);
      slide?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    },
    [displayImages.length],
  );

  useEffect(() => {
    setActiveMobileIndex((currentIndex) =>
      Math.min(currentIndex, displayImages.length - 1),
    );
  }, [displayImages.length]);

  useEffect(
    () => () => {
      if (scrollFrameRef.current) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    },
    [],
  );

  return (
    <div className="mx-auto w-full lg:mb-0" dir="rtl">
      <div className="relative block overflow-hidden bg-gray-100 lg:hidden">
        <div
          ref={mobileScrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth"
          onScroll={handleMobileScroll}
        >
          {displayImages.map((image, index) => (
            <div
              key={`${image.media}-${index}`}
              className="w-full shrink-0 snap-center"
            >
              <ImageWithSkeleton
                src={image.media}
                alt={image.title}
                title={image.title}
                wrapperClassName="h-64 w-full sm:h-80"
                imgClassName="h-full w-full rounded-3xl object-cover md:rounded-xl"
                sizes="100vw"
                onClick={() => open(index)}
              />
            </div>
          ))}
        </div>

        {hasMultipleImages && (
          <>
            <button
              type="button"
              aria-label="تصویر بعدی"
              disabled={activeMobileIndex === displayImages.length - 1}
              className="btn-press absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/45 text-white shadow-lg ring-1 ring-white/35 backdrop-blur-md transition-opacity duration-200 hover:bg-slate-950/60 disabled:cursor-not-allowed disabled:opacity-35 dark:bg-white/15 dark:text-white dark:ring-white/25 dark:hover:bg-white/25"
              onClick={() => scrollToMobileImage(activeMobileIndex + 1)}
            >
              <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label="تصویر قبلی"
              disabled={activeMobileIndex === 0}
              className="btn-press absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/45 text-white shadow-lg ring-1 ring-white/35 backdrop-blur-md transition-opacity duration-200 hover:bg-slate-950/60 disabled:cursor-not-allowed disabled:opacity-35 dark:bg-white/15 dark:text-white dark:ring-white/25 dark:hover:bg-white/25"
              onClick={() => scrollToMobileImage(activeMobileIndex - 1)}
            >
              <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <div className="hidden w-full lg:block">
        <div className="grid max-h-[min(56vh,34rem)] min-h-[24rem] grid-cols-4 gap-4">
          <div className="grid min-h-0 grid-rows-2 gap-4">
            {displayImages.slice(0, 2).map((image, index) => (
              <ImageWithSkeleton
                key={`${image.media}-${index}`}
                src={image.media}
                alt={image.title}
                title={image.title}
                wrapperClassName="h-full min-h-0 w-full"
                imgClassName="h-full w-full rounded-xl object-cover"
                sizes="25vw"
                onClick={() => open(index)}
              />
            ))}
          </div>

          <div className="col-span-2 min-h-0">
            {displayImages[0] && (
              <ImageWithSkeleton
                src={displayImages[0].media}
                alt={displayImages[0].title}
                title={displayImages[0].title}
                wrapperClassName="h-full min-h-0 w-full"
                imgClassName="h-full w-full rounded-xl object-cover"
                sizes="50vw"
                onClick={() => open(0)}
              />
            )}
          </div>

          <div className="grid min-h-0 grid-rows-2 gap-4">
            {displayImages.slice(2, 4).map((image, index) => {
              const imageIndex = index + 2;
              return (
                <div key={`${image.media}-${imageIndex}`} className="relative min-h-0">
                  <ImageWithSkeleton
                    src={image.media}
                    alt={image.title}
                    title={image.title}
                    wrapperClassName="h-full min-h-0 w-full"
                    imgClassName="h-full w-full rounded-xl object-cover"
                    sizes="25vw"
                    onClick={() => open(imageIndex)}
                  />
                  {index === 1 && displayImages.length > 4 && (
                    <button
                      type="button"
                      className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-900/35 backdrop-blur-[1px] transition-colors duration-300 hover:bg-gray-900/45"
                      onClick={() => open(imageIndex)}
                    >
                      <span className={expandableButtonClassName}>مشاهده بیشتر...</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isOpen && (
        <GalleryLightbox
          images={displayImages}
          open={isOpen}
          initialIndex={selected}
          onClose={() => setIsOpen(false)}
          dir="rtl"
        />
      )}
    </div>
  );
}
