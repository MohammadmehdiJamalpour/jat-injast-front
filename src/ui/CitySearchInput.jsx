import React, { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function CitySearchInput({ onSearch, size = "md" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);

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

  /* ───────── responsive classes ───────── */

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className="relative z-[100]"
      autoComplete="off"
    >
      {/* INPUT WRAPPER */}
      <div
        className={`
          flex items-center justify-between gap-2 rounded-full border border-primary-200
          bg-white/95 px-1.5 shadow-sm shadow-primary-100/50 backdrop-blur
          transition duration-200 focus-within:border-primary-500
          focus-within:ring-4 focus-within:ring-primary-100
        `}
      >
        <input
          type="text"
          placeholder="میخوای کجا بری؟"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsModalOpen(true)}
          className={`${currentSize.input} min-w-0 flex-1 bg-transparent pr-3 text-gray-800 placeholder:text-gray-400 focus:outline-none`}
        />

        <button
          type="submit"
          className={`${currentSize.button} btn-press flex shrink-0 items-center justify-center rounded-full bg-primary-action text-primary-contrast shadow-sm transition hover:bg-primary-action-hover focus:outline-none focus:ring-4 focus:ring-primary-100`}
          aria-label="جستجو"
        >
          <MagnifyingGlassIcon className={currentSize.icon} />
        </button>
      </div>

      {/* DROPDOWN */}
      <div
        className={`absolute left-0 z-[120] mt-2 w-full origin-top rounded-3xl border border-primary-100 bg-white/95 p-2 shadow-centered-lg shadow-primary-100/60 backdrop-blur-md
                    transform transition-all duration-200
                    ${isModalOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
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
