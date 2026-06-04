import { useEffect, useMemo, useState } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useSearchParams } from "@/lib/router-compat";
import { fa } from "@/i18n/fa";
import NavBar from "./components/NavBar";
import ListingsSection from "./components/ListingSection";
import MapSection from "./components/MapSection";
import {
  buildSearchFilters,
  buildSelectedPlace,
  parseDestination,
  useDefaultSearchData,
} from "./searchData";

function useDesktopViewport() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return isDesktop;
}

function useDesktopScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const lock = () => {
      const shouldLock = window.innerWidth >= 768;
      html.style.overflow = shouldLock ? "hidden" : "";
      body.style.overflow = shouldLock ? "hidden" : "";
    };

    lock();
    window.addEventListener("resize", lock);
    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      window.removeEventListener("resize", lock);
    };
  }, []);
}

function MapToggleButton({ mapExpanded, onToggle, desktop = false }) {
  if (desktop) {
    return (
      <button
        onClick={onToggle}
        className="absolute right-0 top-0 z-[1600] hidden h-full w-12 flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl bg-primary-action text-primary-contrast transition-all duration-300 md:flex"
        aria-label={mapExpanded ? fa.search.map.close : fa.search.map.open}
      >
        {mapExpanded ? (
          <div className="flex flex-col items-center gap-7">
            <ChevronLeftIcon className="h-5 w-5" />
            <span className="-rotate-90 whitespace-nowrap text-[11px] tracking-wider">
              {fa.search.map.close}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-9">
            <ChevronRightIcon className="h-5 w-5" />
            <span className="-rotate-90 whitespace-nowrap text-[11px] tracking-wider">
              {fa.search.map.open}
            </span>
          </div>
        )}
      </button>
    );
  }

  const barBg = mapExpanded ? "bg-primary-75" : "bg-primary-action";
  const barText = mapExpanded
    ? "text-primary-800 -bottom-6"
    : "text-primary-contrast bottom-0 rounded-3xl";

  return (
    <button
      onClick={onToggle}
      className={`absolute left-0 z-[1600] flex w-full items-center justify-center gap-2 rounded-b-3xl py-3 shadow-centered backdrop-blur-sm transition-all duration-500 md:hidden ${barBg} ${barText}`}
      aria-label={mapExpanded ? fa.search.map.close : fa.search.map.show}
    >
      <ChevronDownIcon
        className={`h-5 w-5 transition-transform duration-500 ${
          mapExpanded ? "rotate-180" : ""
        }`}
      />
      <span className="select-none font-medium">
        {mapExpanded ? fa.search.map.close : fa.search.map.show}
      </span>
    </button>
  );
}

function SearchContainer() {
  const [searchParams] = useSearchParams();
  const searchParamsKey = searchParams?.toString() || "";
  const destination = useMemo(
    () => parseDestination(searchParamsKey),
    [searchParamsKey],
  );
  const searchFilters = useMemo(
    () => buildSearchFilters(destination),
    [destination],
  );
  const selectedPlace = useMemo(
    () => buildSelectedPlace(destination),
    [destination],
  );
  const { items: houses, loading } = useDefaultSearchData(searchFilters);
  const [mapExpanded, setMapExpanded] = useState(true);
  const isDesktop = useDesktopViewport();

  useDesktopScrollLock();

  const wrapperH = mapExpanded ? "h-128" : "h-12";
  const mapW = mapExpanded ? "md:w-6/12 lg:w-7/12 xl:w-8/12" : "md:w-12";
  const toggleMap = () => setMapExpanded((previous) => !previous);

  return (
    <div
      data-testid="search-page"
      className="flex h-screen flex-col justify-center pt-32 md:mt-20 md:overflow-hidden md:pt-0"
    >
      <div className="relative flex min-h-screen flex-col md:w-[90vw] md:max-w-3xl 850:max-w-4xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl">
        <NavBar />

        <div className="flex flex-1 flex-col justify-center px-1.5 md:flex-row-reverse md:pl-2.5 md:pr-1.5">
          <div
            className={`relative mt-3 flex w-full items-center justify-center rounded-3xl bg-gray-200 shadow-centered shadow-primary-100 transition-all duration-500 ease-in-out md:mt-1 md:h-auto md:max-h-[85vh] md:overflow-hidden ${mapW} ${wrapperH}`}
          >
            {(mapExpanded || isDesktop) && (
              <MapSection
                houses={houses}
                loading={loading}
                selectedPlace={selectedPlace}
              />
            )}

            <MapToggleButton mapExpanded={mapExpanded} onToggle={toggleMap} />
            <MapToggleButton
              mapExpanded={mapExpanded}
              onToggle={toggleMap}
              desktop
            />
          </div>

          <ListingsSection
            houses={houses}
            mapExpanded={mapExpanded}
            loading={loading}
            locationLabel={destination.label}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchContainer;
