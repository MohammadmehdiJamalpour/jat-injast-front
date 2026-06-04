import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import GalleryLightbox from "../../../ui/GalleryLightbox";

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
}) {
  const [status, setStatus] = useState("loading");
  const imageSrc = src || "/assets/favorite-1.jpg";

  const handleClick = () => {
    if (status === "loaded" && typeof onClick === "function") onClick();
  };

  return (
    <button
      type="button"
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

      <img
        src={imageSrc}
        alt={alt}
        title={title}
        loading="lazy"
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

  const open = (index) => {
    setSelected(index);
    setIsOpen(true);
  };

  return (
    <div className="mx-auto w-full lg:mb-0" dir="rtl">
      <div className="block bg-gray-100 lg:hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          dir="rtl"
        >
          {displayImages.map((image, index) => (
            <SwiperSlide key={`${image.media}-${index}`}>
              <ImageWithSkeleton
                src={image.media}
                alt={image.title}
                title={image.title}
                wrapperClassName="h-64 w-full sm:h-80"
                imgClassName="h-full w-full rounded-3xl object-cover md:rounded-xl"
                onClick={() => open(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="hidden w-full lg:block">
        <div className="flex justify-center gap-4">
          <div className="flex w-1/4 flex-col space-y-8">
            {displayImages.slice(0, 2).map((image, index) => (
              <ImageWithSkeleton
                key={`${image.media}-${index}`}
                src={image.media}
                alt={image.title}
                title={image.title}
                wrapperClassName="h-60 w-full"
                imgClassName="h-full w-full rounded-xl object-cover"
                onClick={() => open(index)}
              />
            ))}
          </div>

          <div className="w-2/4">
            {displayImages[0] && (
              <ImageWithSkeleton
                src={displayImages[0].media}
                alt={displayImages[0].title}
                title={displayImages[0].title}
                wrapperClassName="h-128 w-full"
                imgClassName="h-full w-full rounded-xl object-cover"
                onClick={() => open(0)}
              />
            )}
          </div>

          <div className="flex w-1/4 flex-col space-y-8">
            {displayImages.slice(2, 4).map((image, index) => {
              const imageIndex = index + 2;
              return (
                <div key={`${image.media}-${imageIndex}`} className="relative">
                  <ImageWithSkeleton
                    src={image.media}
                    alt={image.title}
                    title={image.title}
                    wrapperClassName="h-60 w-full"
                    imgClassName="h-full w-full rounded-xl object-cover"
                    onClick={() => open(imageIndex)}
                  />
                  {index === 1 && displayImages.length > 4 && (
                    <button
                      type="button"
                      className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-900/45 text-sm text-white backdrop-blur-[1px] transition-colors duration-300 hover:bg-gray-900/55"
                      onClick={() => open(imageIndex)}
                    >
                      مشاهده بیشتر
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <GalleryLightbox
        images={displayImages}
        open={isOpen}
        initialIndex={selected}
        onClose={() => setIsOpen(false)}
        dir="rtl"
      />
    </div>
  );
}
