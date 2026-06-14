import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useSearchParams } from "@/lib/router-compat";
import { fa } from "@/i18n/fa";
import ViewportLazyBoundary from "@/ui/ViewportLazyBoundary";
import NavBar from "./components/NavBar";
import ListingsSection from "./components/ListingSection";
import {
  buildSearchFilters,
  buildSelectedPlace,
  parseDestination,
  useDefaultSearchData,
} from "./searchData";

function MapLoading() {
  return (
    <div className="h-full w-full animate-pulse rounded-3xl bg-gradient-to-b from-gray-100 to-gray-200 dark:from-slate-900 dark:to-slate-800" />
  );
}

const MapSection = dynamic(() => import("./components/MapSection"), {
  ssr: false,
  loading: () => <MapLoading />,
});

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
        data-testid="desktop-map-toggle"
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

  const barBg = mapExpanded ? "bg-primary-action/95" : "bg-primary-action";
  const barText = mapExpanded
    ? "bottom-0 text-primary-contrast"
    : "text-primary-contrast bottom-0 rounded-3xl";

  return (
    <button
      onClick={onToggle}
      data-testid="mobile-map-toggle"
      className={`absolute left-0 z-[1600] flex w-full items-center justify-center gap-2 rounded-b-3xl py-2.5 shadow-centered backdrop-blur-sm transition-all duration-500 md:hidden ${barBg} ${barText}`}
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

function SearchContainer({ initialSearchData }) {
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
  const { items: houses, loading } = useDefaultSearchData(
    searchFilters,
    initialSearchData,
  );
  const [mapExpanded, setMapExpanded] = useState(true);
  const isDesktop = useDesktopViewport();

  useDesktopScrollLock();

  const wrapperH = mapExpanded ? "h-128" : "h-12";
  const mapW = mapExpanded ? "md:w-6/12 lg:w-7/12 xl:w-8/12" : "md:w-12";
  const toggleMap = () => setMapExpanded((previous) => !previous);

  return (
    <div
      id="search-page"
      data-testid="search-page"
      className="flex min-h-screen flex-col pt-14 md:mt-20 md:h-screen md:overflow-hidden md:pt-0"
    >
      <div className="relative flex w-full min-w-0 flex-col md:h-full md:w-[90vw] md:max-w-3xl 850:max-w-4xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-8xl 3xl:max-w-9xl">
        <NavBar />

        <div className="relative z-0 flex min-w-0 flex-1 flex-col px-1.5 md:flex-row-reverse md:pl-2.5 md:pr-1.5">
          <div
            data-testid="search-map-pane"
            className={`relative z-0 mt-2 flex w-full min-w-0 items-center justify-center overflow-hidden rounded-3xl bg-gray-200 shadow-centered shadow-primary-100 transition-all duration-500 ease-in-out dark:bg-slate-900 dark:shadow-black/25 md:mt-1 md:h-auto md:max-h-[85vh] ${mapW} ${wrapperH}`}
          >
            {(mapExpanded || isDesktop) && (
              <ViewportLazyBoundary
                className="h-full w-full"
                fallback={<MapLoading />}
                rootMargin="300px"
              >
                <MapSection
                  houses={houses}
                  loading={loading}
                  selectedPlace={selectedPlace}
                />
              </ViewportLazyBoundary>
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
