import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

function LightboxImage({ src, alt, title }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
  }, [src]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {status === "loading" && (
        <div className="absolute h-40 w-64 animate-pulse rounded-3xl bg-white/10 sm:h-64 sm:w-96" />
      )}

      {status === "error" && (
        <div className="flex h-40 w-64 items-center justify-center rounded-3xl bg-white/10 text-sm text-white sm:h-64 sm:w-96">
          خطا در بارگذاری تصویر
        </div>
      )}

      {src && (
        <img
          src={src}
          alt={alt}
          title={title}
          loading="lazy"
          className={`max-h-full max-w-full rounded-[1.5rem] object-contain transition-opacity duration-300 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      )}
    </div>
  );
}

function GalleryLightbox({
  images = [],
  open,
  initialIndex = 0,
  onClose,
  dir = "rtl",
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const mainSwiperRef = useRef(null);
  const thumbSwiperRef = useRef(null);
  const count = images.length;
  const activeImage = images[activeIndex] || {};

  const setSlide = useCallback((nextIndex, speed = 520) => {
    const normalized = Math.min(Math.max(nextIndex, 0), count - 1);
    setActiveIndex(normalized);
    mainSwiperRef.current?.slideTo(normalized, speed);
    thumbSwiperRef.current?.slideTo(Math.max(normalized - 2, 0), speed);
  }, [count]);

  const goPrevious = useCallback(() => setSlide(activeIndex - 1), [activeIndex, setSlide]);
  const goNext = useCallback(() => setSlide(activeIndex + 1), [activeIndex, setSlide]);

  useEffect(() => {
    if (!open) return;

    const nextIndex = Math.min(Math.max(initialIndex, 0), Math.max(count - 1, 0));
    setActiveIndex(nextIndex);

    requestAnimationFrame(() => {
      mainSwiperRef.current?.slideTo(nextIndex, 0);
      thumbSwiperRef.current?.slideTo(Math.max(nextIndex - 2, 0), 0);
    });
  }, [count, initialIndex, open]);

  useEffect(() => {
    if (!open || count <= 1) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        dir === "rtl" ? goNext() : goPrevious();
      }
      if (event.key === "ArrowRight") {
        dir === "rtl" ? goPrevious() : goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [count, dir, goNext, goPrevious, open]);

  if (!count) return null;

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[20000]" dir={dir} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl dark:bg-slate-950/90"
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-4 scale-95"
          >
            <Dialog.Panel className="relative flex h-full max-h-[92vh] w-full max-w-7xl flex-col pt-14 sm:pt-12">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 text-white">
                <Dialog.Title className="pointer-events-auto max-w-[calc(100%-4rem)] truncate rounded-full bg-slate-950/65 px-4 py-2 text-sm font-semibold shadow-lg ring-1 ring-white/10 backdrop-blur-md sm:text-base">
                  {activeImage.title || "تصویر اقامتگاه"}
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="بستن"
                  className="btn-press pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 shadow-xl ring-1 ring-black/10 transition-colors duration-200 hover:bg-primary-action hover:text-primary-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="relative min-h-0 flex-1 px-12 sm:px-16 lg:px-20">
                <Swiper
                  dir={dir}
                  slidesPerView={1}
                  spaceBetween={18}
                  speed={560}
                  resistanceRatio={0.82}
                  grabCursor
                  initialSlide={activeIndex}
                  onSwiper={(swiper) => {
                    mainSwiperRef.current = swiper;
                  }}
                  onSlideChange={(swiper) => {
                    setActiveIndex(swiper.activeIndex);
                    thumbSwiperRef.current?.slideTo(Math.max(swiper.activeIndex - 2, 0), 360);
                  }}
                  className="h-full"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={`${image.media}-${index}`} className="h-full">
                      <LightboxImage
                        src={image.media}
                        alt={image.title || "تصویر اقامتگاه"}
                        title={image.title || "تصویر اقامتگاه"}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {count > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={activeIndex === count - 1}
                      aria-label="تصویر بعدی"
                      className="btn-press absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary-action text-primary-contrast shadow-lg disabled:bg-white/20 disabled:text-white/50 sm:h-11 sm:w-11 lg:left-2"
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>

                    <button
                      type="button"
                      onClick={goPrevious}
                      disabled={activeIndex === 0}
                      aria-label="تصویر قبلی"
                      className="btn-press absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary-action text-primary-contrast shadow-lg disabled:bg-white/20 disabled:text-white/50 sm:h-11 sm:w-11 lg:right-2"
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {count > 1 && (
                <div className="mt-4">
                  <Swiper
                    modules={[FreeMode]}
                    freeMode
                    spaceBetween={8}
                    slidesPerView="auto"
                    speed={420}
                    dir={dir}
                    onSwiper={(swiper) => {
                      thumbSwiperRef.current = swiper;
                    }}
                    className="!overflow-x-auto"
                  >
                    {images.map((image, index) => (
                      <SwiperSlide key={`${image.media}-${index}`} style={{ width: "5rem" }}>
                        <button
                          type="button"
                          onClick={() => setSlide(index)}
                          className={`h-20 w-20 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                            activeIndex === index
                              ? "border-primary-400 opacity-100 shadow-lg shadow-primary-900/15"
                              : "border-transparent opacity-70 hover:scale-[1.03] hover:opacity-100"
                          }`}
                          aria-label={`نمایش تصویر ${index + 1}`}
                        >
                          <img
                            src={image.media}
                            alt={image.title || "تصویر اقامتگاه"}
                            loading="lazy"
                            className="h-full w-full rounded-[0.9rem] object-cover"
                          />
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default GalleryLightbox;
