import { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function DynamicSwiperList({
  title,
  items,
  renderItem,
  spaceBetween = 16,
  slideClassName = "!w-4/5 sm:!w-2/3 md:!w-2/5 lg:!w-4/12 xl:!w-3/12",
  className = "",
  scrollerOuterClassName = "overflow-visible sm:-mx-5",
  leftFadeClassName = "w-16 sm:w-20",
  showLeftFade = true,
}) {
  const scrollerRef = useRef(null);
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);
  const scrollSlides = (direction) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const distance = Math.max(scroller.clientWidth * 0.82, 240);
    const isRtl = getComputedStyle(scroller).direction === "rtl";
    const delta = direction === "next" ? distance : -distance;

    scroller.scrollBy({
      left: isRtl ? -delta : delta,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`group justify-center overflow-visible p-5 pt-4 text-primary-800 xs:mb-3 xs:max-w-sm xs:p-0 small:max-w-md 550:max-w-lg sm:max-w-xl md:max-w-2xl 850:max-w-4xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-7xl 3xl:max-w-8xl ${className}`}
    >
      <h2 className="mx-2 mb-3 font-bold sm:text-lg md:text-xl">{title}</h2>

      <div className="relative overflow-visible">
        <button
          ref={leftArrowRef}
          aria-label="Next"
          className="absolute -left-6 top-1/2 z-40 ml-1 hidden -translate-y-1/2 rounded-full bg-primary-50/80 p-2 opacity-0 shadow-lg backdrop-blur-lg transition-opacity duration-300 hover:scale-105 active:scale-95 group-hover:opacity-100 sm:-left-10 md:-left-12 md:flex"
          onClick={() => scrollSlides("next")}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <button
          ref={rightArrowRef}
          aria-label="Previous"
          className="absolute -right-6 top-1/2 z-40 mr-1 hidden -translate-y-1/2 rounded-full bg-primary-50/80 p-2 opacity-0 shadow-lg backdrop-blur-lg transition-opacity duration-300 hover:scale-105 active:scale-95 group-hover:opacity-100 sm:-right-10 md:-right-12 md:flex"
          onClick={() => scrollSlides("previous")}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>

        <div className={`relative isolate ${scrollerOuterClassName}`}>
          <div
            ref={scrollerRef}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth scroll-px-5 px-5 py-5"
            style={{ gap: `${spaceBetween}px` }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className={`relative z-0 shrink-0 snap-start transition-[z-index] duration-300 hover:z-20 focus-within:z-20 ${slideClassName}`}
              >
                {renderItem(item)}
              </div>
            ))}
          </div>

          {showLeftFade && (
            <div
              aria-hidden="true"
              className={`swiper-glass-fade-left pointer-events-none absolute inset-y-0 left-0 z-30 ${leftFadeClassName}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DynamicSwiperList;
