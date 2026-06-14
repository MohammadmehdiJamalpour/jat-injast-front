import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function CitySearchInput({ onSearch, size = "md", variant = "default" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);
  const isHeroPanel = variant === "hero-panel";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitCity = (city) => {
    if (!city) return;
    onSearch(city);
    setIsModalOpen(false);
    setSearchQuery("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) submitCity(trimmed);
  };

  const popularCities = ["تهران", "مشهد", "اصفهان", "تبریز"];
  const cityList = ["اهواز", "کرمان", "رشت", "ارومیه", "زنجان"];
  const allCities = [...new Set([...popularCities, ...cityList])];
  const filteredCities = searchQuery.trim()
    ? allCities.filter((city) => city.includes(searchQuery.trim()))
    : cityList;

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
  const dropdownClass = isHeroPanel
    ? `absolute left-0 z-[120] mt-2 w-full origin-top rounded-3xl border border-white/60 bg-white/95 p-2 text-right shadow-centered-lg shadow-slate-900/20 backdrop-blur-md transform transition-all duration-200 ${isModalOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`
    : `absolute left-0 z-[120] mt-2 w-full origin-top rounded-3xl border border-primary-100 bg-white/95 p-2 shadow-centered-lg shadow-primary-100/60 backdrop-blur-md transform transition-all duration-200 ${isModalOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`;

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className="relative z-[100]"
      data-testid={isHeroPanel ? "home-hero-city-search" : undefined}
      dir={isHeroPanel ? "rtl" : undefined}
      autoComplete="off"
    >
      {/* INPUT WRAPPER */}
      <div className={inputWrapperClass}>
        <input
          type="text"
          placeholder="میخوای کجا بری؟"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsModalOpen(true)}
          className={inputClass}
        />

        <button
          type="submit"
          className={buttonClass}
          aria-label="جستجو"
        >
          <MagnifyingGlassIcon className={iconClass} />
        </button>
      </div>

      {/* DROPDOWN */}
      <div
        data-testid={isHeroPanel ? "home-hero-city-dropdown" : undefined}
        className={dropdownClass}
      >
        <div className="space-y-3">
          {/* popular cities */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className="ml-1 text-xs font-medium text-gray-500">پر بازدید</span>
              {popularCities.map((city) => (
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

          {/* other cities */}
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
                شهری با این نام پیدا نشد
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default CitySearchInput;
