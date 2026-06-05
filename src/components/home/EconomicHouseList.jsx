import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

function EconomicHouseList() {
  // Static house data
  const [houses] = useState([
    {
      id: 1,
      name: "خانه ویلایی ساحلی",
      avatar: "/main-mob.webp",
      price: "750,000 تومان / شب",
      rooms: 3,
      score: 4.5,
    },
    {
      id: 2,
      name: "آپارتمان دو خوابه",
      avatar: "/main-mob.webp",
      price: "480,000 تومان / شب",
      rooms: 2,
      score: 4.2,
    },
    {
      id: 3,
      name: "ویلا جنگلی لوکس",
      avatar: "/main-mob.webp",
      price: "1,200,000 تومان / شب",
      rooms: 4,
      score: 4.9,
    },
    {
      id: 4,
      name: "سوئیت نقلی کوهستانی",
      avatar: "/main-mob.webp",
      price: "300,000 تومان / شب",
      rooms: 1,
      score: 4.3,
    },
    {
      id: 5,
      name: "ویلای 3 طبقه",
      avatar: "/main-mob.webp",
      price: "900,000 تومان / شب",
      rooms: 5,
      score: 4.8,
    },
    {
      id: 6,
      name: "کلبه چوبی دنج",
      avatar: "/main-mob.webp",
      price: "550,000 تومان / شب",
      rooms: 2,
      score: 4.6,
    },
  ]);

  return (
    <div className="overflow-hidden pt-4 py-4 sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-8xl px-1 sm:px-2 md:px-3">
      <h2 className="mb-3 mx-2 font-bold sm:text-lg md:text-xl">
        اقامتگاه‌های اقتصادی
      </h2>

      {/* 
        Wrap the Swiper in a relative container, so we can place 
        the left gradient fade overlay.
      */}
      <div className="relative overflow-hidden">
        <Swiper
          slidesPerView="auto"
          spaceBetween={16}
          centeredSlides={false}
          centerInsufficientSlides={false}
          className="w-full"
        >
          {houses.map((house) => (
            <SwiperSlide
              key={house.id}
              className="!w-3/5 sm:!w-1/2 md:!w-1/3 lg:!w-1/5"
            >
              <div className="relative flex flex-col items-center justify-center rounded-3xl shadow overflow-hidden">
                {/* House avatar */}
                {house.avatar && (
                  <img
                    src={house.avatar}
                    alt={house.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* House details overlay (optional styling and positioning) */}
                <div className="absolute bottom-0 w-full bg-white bg-opacity-80 p-3">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800">
                    {house.name}
                  </h3>
                  <p className="text-xs text-gray-600">قیمت: {house.price}</p>
                  <div className="flex ">
                  <p className="text-xs text-gray-600">اتاق‌ها: {house.rooms}</p>
                  <p className="text-xs text-gray-600">
                    امتیاز: {house.score} / 5
                  </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 
          Left Fade Overlay:
          - Absolutely positioned over the left edge
          - pointer-events-none so Swiper remains interactive
          - Fades from white (or any color) to transparent
        */}
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-12 bg-gradient-to-r from-primary-50 to-transparent" />
      </div>
    </div>
  );
}

export default EconomicHouseList;
