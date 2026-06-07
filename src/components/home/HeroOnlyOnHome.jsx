import { useEffect, useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import CitySearchInput from "../../ui/CitySearchInput";
import { getHomeContent } from "../../services/homeService";
import { reportClientError } from "../../utils/reportClientError";

const DEFAULT_HERO_BANNERS = [
  "/assets/hero-banner-coast.png",
  "/assets/hero-banner-courtyard.png",
  "/assets/hero-banner-forest.png",
];

function HeroOnlyOnHome() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState(DEFAULT_HERO_BANNERS);
  const [index, setIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

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
  }, []);

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
        <img
          src={slides[index]}
          alt=""
          aria-hidden="true"
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
        />
      )}

      <div className="pointer-events-none absolute inset-0 z-[80] flex -translate-y-[6vh] items-center justify-center md:translate-y-[3vh] lg:translate-y-[4vh]">
        <div className="pointer-events-auto relative z-[90] w-80 xs:w-96 md:w-128">
          <CitySearchInput onSearch={handleNavigate} />
        </div>
      </div>
    </div>
  );
}

export default HeroOnlyOnHome;
