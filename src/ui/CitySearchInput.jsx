import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const POPULAR_CITIES = [
  "\u062a\u0647\u0631\u0627\u0646",
  "\u0645\u0634\u0647\u062f",
  "\u0627\u0635\u0641\u0647\u0627\u0646",
  "\u062a\u0628\u0631\u06cc\u0632",
];

const CITY_LIST = [
  "\u0627\u0647\u0648\u0627\u0632",
  "\u06a9\u0631\u0645\u0627\u0646",
  "\u0631\u0634\u062a",
  "\u0627\u0631\u0648\u0645\u06cc\u0647",
  "\u0632\u0646\u062c\u0627\u0646",
];

const COPY = {
  empty: "\u0634\u0647\u0631\u06cc \u0628\u0627 \u0627\u06cc\u0646 \u0646\u0627\u0645 \u067e\u06cc\u062f\u0627 \u0646\u0634\u062f",
  placeholder: "\u0645\u06cc\u062e\u0648\u0627\u06cc \u06a9\u062c\u0627 \u0628\u0631\u06cc\u061f",
  popular: "\u067e\u0631 \u0628\u0627\u0632\u062f\u06cc\u062f",
  search: "\u062c\u0633\u062a\u062c\u0648",
};

function CitySearchInput({ onSearch, size = "md", variant = "default" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const isHeroPanel = variant === "hero-panel";

  const updateHeroDropdownPosition = useCallback(() => {
    if (!isHeroPanel) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const viewportPadding = 12;
    const gap = 8;
    const width = Math.min(rect.width, window.innerWidth - viewportPadding * 2);
    const left = Math.min(
      Math.max(rect.left, viewportPadding),
      window.innerWidth - width - viewportPadding,
    );

    setDropdownStyle({
      left: `${left}px`,
      top: `${rect.bottom + gap}px`,
      width: `${width}px`,
    });
  }, [isHeroPanel]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedSearch = containerRef.current?.contains(event.target);
      const clickedDropdown = dropdownRef.current?.contains(event.target);

      if (!clickedSearch && !clickedDropdown) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isHeroPanel || !isModalOpen) return undefined;

    updateHeroDropdownPosition();
    window.addEventListener("resize", updateHeroDropdownPosition);
    window.addEventListener("scroll", updateHeroDropdownPosition, true);

    return () => {
      window.removeEventListener("resize", updateHeroDropdownPosition);
      window.removeEventListener("scroll", updateHeroDropdownPosition, true);
    };
  }, [isHeroPanel, isModalOpen, updateHeroDropdownPosition]);

  const submitCity = (city) => {
    if (!city) return;
    onSearch(city);
    setIsModalOpen(false);
    setSearchQuery("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) submitCity(trimmed);
  };

  const allCities = [...new Set([...POPULAR_CITIES, ...CITY_LIST])];
  const filteredCities = searchQuery.trim()
    ? allCities.filter((city) => city.includes(searchQuery.trim()))
    : CITY_LIST;

  const sizeClasses = {
    sm: {
      input: "h-9 text-xs",
      button: "h-7 w-7",
      icon: "h-3.5 w-3.5",
    },
    md: {
      input: "h-10 text-xs md:text-sm",
      button: "h-8 w-8",
      icon: "h-4 w-4",
    },
  };
  const currentSize = sizeClasses[size] || sizeClasses.md;
  const inputWrapperClass = isHeroPanel
    ? "flex h-12 items-center justify-between gap-2 rounded-[1.65rem] border border-white/80 bg-white/95 px-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_24px_rgba(15,23,42,0.16)] backdrop-blur transition duration-200 focus-within:border-primary-action/80 focus-within:ring-4 focus-within:ring-primary-action/20 dark:border-slate-950/15 dark:bg-slate-900/95 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_rgba(15,23,42,0.22)] sm:h-[3.25rem] sm:rounded-[2rem]"
    : "flex items-center justify-between gap-2 rounded-full border border-primary-200 bg-white/95 px-1.5 shadow-sm shadow-primary-100/50 backdrop-blur transition duration-200 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-100";
  const inputClass = isHeroPanel
    ? "h-11 min-w-0 flex-1 bg-transparent pl-2 pr-4 text-right text-sm font-medium text-primary-950 placeholder:text-slate-500 focus:outline-none dark:text-white dark:placeholder:text-slate-300 sm:h-12 md:text-base"
    : `${currentSize.input} min-w-0 flex-1 bg-transparent pr-3 text-gray-800 placeholder:text-gray-400 focus:outline-none`;
  const buttonClass = isHeroPanel
    ? "btn-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-action text-primary-contrast shadow-sm shadow-primary-action/30 transition hover:bg-primary-action-hover focus:outline-none focus:ring-4 focus:ring-primary-action/25 sm:h-11 sm:w-11"
    : `${currentSize.button} btn-press flex shrink-0 items-center justify-center rounded-full bg-primary-action text-primary-contrast shadow-sm transition hover:bg-primary-action-hover focus:outline-none focus:ring-4 focus:ring-primary-100`;
  const iconClass = isHeroPanel ? "h-5 w-5" : currentSize.icon;
  const formLayerClass = isModalOpen ? "z-[14000]" : "z-[100]";
  const dropdownLayerClass = isModalOpen ? "z-[99999]" : "z-[120]";
  const dropdownVisibilityClass = isModalOpen
    ? "opacity-100 scale-100"
    : "opacity-0 scale-95 pointer-events-none";
  const dropdownClass = isHeroPanel
    ? `fixed ${dropdownLayerClass} origin-top rounded-3xl border border-white/80 bg-white p-2 text-right shadow-2xl shadow-slate-950/30 transform transition-all duration-200 dark:border-slate-800 dark:bg-slate-950 ${dropdownVisibilityClass}`
    : `absolute left-0 ${dropdownLayerClass} mt-2 w-full origin-top rounded-3xl border border-primary-100 bg-white/95 p-2 shadow-centered-lg shadow-primary-100/60 backdrop-blur-md transform transition-all duration-200 group-focus-within:z-[14010] group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100 ${dropdownVisibilityClass}`;

  const dropdown = (
    <div
      ref={dropdownRef}
      data-testid={isHeroPanel ? "home-hero-city-dropdown" : undefined}
      className={dropdownClass}
      style={isHeroPanel ? dropdownStyle : undefined}
      dir={isHeroPanel ? "rtl" : undefined}
    >
      <div className="space-y-3">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="ml-1 text-xs font-medium text-gray-500">
              {COPY.popular}
            </span>
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => submitCity(city)}
                className="btn-press rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-800 transition hover:border-primary-300 hover:bg-primary-100 focus:outline-none focus:ring-4 focus:ring-primary-100"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => submitCity(city)}
                className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-right text-sm text-gray-700 transition hover:bg-primary-50 hover:text-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-100"
              >
                <span>{city}</span>
                <MagnifyingGlassIcon className="h-3.5 w-3.5 text-primary-500" />
              </button>
            ))
          ) : (
            <div className="rounded-2xl bg-gray-50 px-3 py-3 text-center text-xs text-gray-500">
              {COPY.empty}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className={`group relative ${formLayerClass} focus-within:z-[14000]`}
      data-testid={isHeroPanel ? "home-hero-city-search" : undefined}
      dir={isHeroPanel ? "rtl" : undefined}
      autoComplete="off"
    >
      <div className={inputWrapperClass}>
        <input
          type="text"
          placeholder={COPY.placeholder}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onFocus={() => {
            updateHeroDropdownPosition();
            setIsModalOpen(true);
          }}
          className={inputClass}
        />

        <button type="submit" className={buttonClass} aria-label={COPY.search}>
          <MagnifyingGlassIcon className={iconClass} />
        </button>
      </div>

      {isHeroPanel && isMounted ? createPortal(dropdown, document.body) : dropdown}
    </form>
  );
}

export default CitySearchInput;
