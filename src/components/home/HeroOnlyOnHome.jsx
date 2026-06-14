import { useEffect, useState } from "react";
import Image from "next/image";
import { useNavigate } from "@/lib/router-compat";
import CitySearchInput from "../../ui/CitySearchInput";
import { getHomeContent } from "../../services/homeService";
import { reportClientError } from "../../utils/reportClientError";
import HomeHeroCopy from "./HomeHeroCopy";

const DEFAULT_HERO_BANNERS = [
  "/assets/hero-banner-coast.png",
  "/assets/hero-banner-courtyard.png",
  "/assets/hero-banner-forest.png",
];

function HeroOnlyOnHome({ initialContent }) {
  const navigate = useNavigate();
  const initialSlides =
    Array.isArray(initialContent?.sliders) && initialContent.sliders.length
      ? initialContent.sliders
      : DEFAULT_HERO_BANNERS;
  const [slides, setSlides] = useState(initialSlides);
  const [index, setIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    if (initialContent) return undefined;

    getHomeContent()
      .then((content) => {
        if (mounted && Array.isArray(content?.sliders) && content.sliders.length) {
          setSlides(content.sliders);
        }
      })
      .catch((err) => reportClientError("Home sliders fetch", err));

    return () => {
      mounted = false;
    };
  }, [initialContent]);

  useEffect(() => {
    if (slides.length < 2) return undefined;

    const id = setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 120_000);

    return () => clearInterval(id);
  }, [slides]);

  useEffect(() => {
    setImgLoaded(false);
  }, [index]);

  const handleNavigate = (city) => {
    navigate(`/search?city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="relative h-[80vh] w-full">
      {!imgLoaded && (
        <div className="absolute inset-0 h-full w-full animate-pulse bg-primary-50" />
      )}

      {slides.length > 0 && (
        <Image
          src={slides[index]}
          alt=""
          aria-hidden="true"
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
        />
      )}

      {imgLoaded && (
        <div className="pointer-events-none absolute inset-0 z-[90] flex -translate-y-[5vh] items-center justify-center px-4 md:translate-y-[2vh] lg:translate-y-[3vh]">
          <div
            data-testid="home-hero-unified-panel"
            className="pointer-events-auto relative w-[min(22rem,calc(100vw-2rem))] overflow-visible rounded-[2rem] border border-white/50 bg-white/35 p-2 text-[var(--color-primary-900)] shadow-[0_22px_60px_rgba(3,78,92,0.2)] ring-1 ring-white/35 backdrop-blur-md sm:w-[min(36rem,calc(100vw-3rem))] sm:rounded-[2.75rem] sm:p-3 md:w-[42rem] dark:border-white/10 dark:bg-slate-950/35 dark:shadow-black/25 dark:ring-white/10"
          >
            <div className="px-3 pb-3 pt-4 text-center drop-shadow-[0_2px_12px_rgba(255,255,255,0.7)] sm:px-5 sm:pb-4 sm:pt-5 md:px-7 md:pt-6">
              <HomeHeroCopy embedded />
            </div>

            <CitySearchInput onSearch={handleNavigate} variant="hero-panel" />
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroOnlyOnHome;
