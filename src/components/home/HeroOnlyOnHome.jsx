import React, { useEffect, useState } from 'react';
import { useNavigate } from "@/lib/router-compat";
import CitySearchInput from '../../ui/CitySearchInput';       // adjust if needed
import { getHomeContent } from '../../services/homeService';  // adjust if needed
import { reportClientError } from '../../utils/reportClientError';

const DEFAULT_HERO_BANNERS = [
  "/assets/hero-banner-coast.png",
  "/assets/hero-banner-courtyard.png",
  "/assets/hero-banner-forest.png",
];

/**
 * HeroOnlyOnHome
 * --------------
 * • Fetches all `/content/homepage` slider URLs once.  
 * • Shows a full-width/height animated Skeleton immediately, so the layout never jumps.  
 * • If there’s only one slide it stays static; otherwise it swaps every 2 min.  
 * • Each new image fades in after it finishes loading.
 */
function HeroOnlyOnHome() {
  const navigate = useNavigate();

  const [slides, setSlides]       = useState(DEFAULT_HERO_BANNERS);  // all image URLs
  const [index,  setIndex]        = useState(0);   // currently visible slide
  const [imgLoaded, setImgLoaded] = useState(false);

  /* ---------------------------------------------------------------
   * 1 — Fetch sliders on mount
   * ------------------------------------------------------------- */
  useEffect(() => {
    let mounted = true;

    getHomeContent()
      .then((content) => {
        if (
          mounted &&
          Array.isArray(content?.sliders) &&
          content.sliders.length
        ) {
          setSlides(content.sliders);
        }
      })
      .catch((err) => reportClientError("Home sliders fetch", err));

    return () => { mounted = false; };
  }, []);

  /* ---------------------------------------------------------------
   * 2 — Rotate every 2 min when we have ≥ 2 slides
   * ------------------------------------------------------------- */
  useEffect(() => {
    if (slides.length < 2) return undefined;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 120_000); // 2 minutes

    return () => clearInterval(id);
  }, [slides]);

  /* ---------------------------------------------------------------
   * 3 — Reset imgLoaded whenever slide index changes
   * ------------------------------------------------------------- */
  useEffect(() => {
    setImgLoaded(false);
  }, [index]);

  /* ---------------------------------------------------------------
   * 4 — Handlers
   * ------------------------------------------------------------- */
  const handleNavigate = (city) => {
    navigate(`/search?city=${encodeURIComponent(city)}`);
  };

  /* ---------------------------------------------------------------
   * 5 — Derived flags
   * ------------------------------------------------------------- */
  const showSkeleton = !imgLoaded;

  /* ---------------------------------------------------------------
   * 6 — Render
   * ------------------------------------------------------------- */
  return (
    <div className="relative h-[80vh] w-full">
      {/* -------- Skeleton placeholder (shows while data OR image loads) -------- */}
      {showSkeleton && (
        <div className="absolute inset-0 w-full h-full bg-primary-50 animate-pulse" />
      )}

      {/* -------- Background image (only rendered once we know slides) -------- */}
      {slides.length > 0 && (
        <img
          src={slides[index]}
          alt={`Hero slide ${index + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImgLoaded(true)}
        />
      )}

      {/* -------- Overlay: city-search input -------- */}
      <div className="pointer-events-none absolute inset-0 z-[80] flex -translate-y-[6vh] items-center justify-center md:translate-y-[3vh] lg:translate-y-[4vh]">
        <div className="pointer-events-auto relative z-[90] w-80 xs:w-96 md:w-128">
          <CitySearchInput onSearch={handleNavigate} />
        </div>
      </div>
    </div>
  );
}

export default HeroOnlyOnHome;
