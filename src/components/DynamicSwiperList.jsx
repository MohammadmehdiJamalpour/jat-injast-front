import React, { useRef } from "react";
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
    <div className={`group overflow-visible p-5 xs:p-0 pt-4 xs:mb-3 justify-center xs:max-w-sm small:max-w-md 550:max-w-lg sm:max-w-xl md:max-w-2xl 850:max-w-4xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-7xl 3xl:max-w-8xl text-primary-800 ${className}`}>
      <h2 className="mb-3 mx-2 font-bold sm:text-lg md:text-xl">{title}</h2>

      <div className="relative overflow-visible">
        <button
          ref={leftArrowRef}
          aria-label="Next"
          className="hidden md:flex absolute -left-6 sm:-left-10 md:-left-12  ml-1 top-1/2 z-30 -translate-y-1/2 rounded-full bg-primary-50/80 p-2 shadow-lg backdrop-blur-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:scale-105 active:scale-95"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <button
          ref={rightArrowRef}
          aria-label="Previous"
          className="hidden md:flex absolute -right-6 sm:-right-10 md:-right-12  top-1/2 z-30 mr-1 -translate-y-1/2 rounded-full bg-primary-50/80 p-2 shadow-lg backdrop-blur-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:scale-105 active:scale-95"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>

        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: rightArrowRef.current, nextEl: leftArrowRef.current }}
          onBeforeInit={(swiper) => {
            // eslint-disable-next-line no-param-reassign
            swiper.params.navigation.prevEl = rightArrowRef.current;
            // eslint-disable-next-line no-param-reassign
            swiper.params.navigation.nextEl = leftArrowRef.current;
          }}
          slidesPerView="auto"
          spaceBetween={spaceBetween}
          centeredSlides={false}
          centerInsufficientSlides={false}
        >
          {items.map((item) => (
            <SwiperSlide
              key={item.id}
              className={slideClassName}
            >
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
