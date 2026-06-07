import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import "swiper/css";
import "swiper/css/navigation";

function DynamicSwiperList({
  title,
  items,
  renderItem,
  spaceBetween = 16,
  slideClassName = "!w-4/5 sm:!w-2/3 md:!w-2/5 lg:!w-4/12 xl:!w-3/12",
  className = "",
}) {
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);

  return (
    <div
      className={`group justify-center overflow-visible p-5 pt-4 text-primary-800 xs:mb-3 xs:max-w-sm xs:p-0 small:max-w-md 550:max-w-lg sm:max-w-xl md:max-w-2xl 850:max-w-4xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-7xl 3xl:max-w-8xl ${className}`}
    >
      <h2 className="mx-2 mb-3 font-bold sm:text-lg md:text-xl">{title}</h2>

      <div className="relative overflow-visible">
        <button
          ref={leftArrowRef}
          aria-label="Next"
          className="absolute -left-6 top-1/2 z-30 ml-1 hidden -translate-y-1/2 rounded-full bg-primary-50/80 p-2 opacity-0 shadow-lg backdrop-blur-lg transition-opacity duration-300 hover:scale-105 active:scale-95 group-hover:opacity-100 sm:-left-10 md:-left-12 md:flex"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <button
          ref={rightArrowRef}
          aria-label="Previous"
          className="absolute -right-6 top-1/2 z-30 mr-1 hidden -translate-y-1/2 rounded-full bg-primary-50/80 p-2 opacity-0 shadow-lg backdrop-blur-lg transition-opacity duration-300 hover:scale-105 active:scale-95 group-hover:opacity-100 sm:-right-10 md:-right-12 md:flex"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>

        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: rightArrowRef.current, nextEl: leftArrowRef.current }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = rightArrowRef.current;
            swiper.params.navigation.nextEl = leftArrowRef.current;
          }}
          slidesPerView="auto"
          spaceBetween={spaceBetween}
          centeredSlides={false}
          centerInsufficientSlides={false}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id} className={slideClassName}>
              {renderItem(item)}
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="pointer-events-none absolute top-0 -left-1 z-10 h-full w-12 bg-gradient-to-r from-secondary-50 to-transparent" />
      </div>
    </div>
  );
}

export default DynamicSwiperList;
