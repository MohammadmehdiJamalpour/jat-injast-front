import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/router-compat"; 
import { getFavoriteHouses } from "../../services/houseService";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Vote from "../../ui/Vote";
import Loading from "./../../ui/Loading";

function Favorites() {
  // State to control showing search input
  const [showSearch, setShowSearch] = useState(false);
  // State for the current search term
  const [searchTerm, setSearchTerm] = useState("");

  // React Query
  const {
    data: favoriteHouses,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["favorite-houses"],
    queryFn: getFavoriteHouses,
    staleTime: 600000,
  });

  // Loading / Error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        مشکلی در دریافت لیست علاقه‌مندی‌ها پیش آمده است!
        <br />
        {error?.message && <p className="text-red-500">Error: {error.message}</p>}
      </div>
    );
  }

  // Filter only "published" houses
  const publishedHouses = (favoriteHouses || []).filter(
    (house) => house.status?.key === "Publish"
  );

  // If none are published
  if (publishedHouses.length === 0) {
    return <div>هیچ اقامتگاه منتشر‌شده‌ای در لیست علاقه‌مندی‌ها وجود ندارد.</div>;
  }

  // Function to match house fields against the searchTerm
  const matchesSearch = (house, term) => {
    const lowerTerm = term.toLowerCase();

    // Combine name, city name, province name, structure label
    const name = house.name?.toLowerCase() || "";
    const city = house.address?.city?.name?.toLowerCase() || "";
    const province = house.address?.city?.province?.name?.toLowerCase() || "";
    const structure = house.structure?.label?.toLowerCase() || "";

    return (
      name.includes(lowerTerm) ||
      city.includes(lowerTerm) ||
      province.includes(lowerTerm) ||
      structure.includes(lowerTerm)
    );
  };

  // Filter houses by search term
  const filteredHouses = publishedHouses.filter((house) =>
    matchesSearch(house, searchTerm)
  );

  // Toggle the search input visibility
  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev);
    // Optionally clear the searchTerm when closing:
    // if (showSearch) setSearchTerm("");
  };

  return (
    <div>
      {/* Header area with Search button and Title */}
      <div className="flex items-center justify-between mb-4 px-1 md:px-0">
        <h2 className="text-xl font-bold pt-2 truncate">لیست علاقه‌مندی‌ها</h2>

        <div className="flex pt-2 items-center gap-2">
          {/* The button that toggles the search input */}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="bg-primary-500 hover:bg-primary-600 text-white py-1 px-3 rounded-full transition-all"
          >
            جستجو
          </button>

          {/* Animated container for the search input */}
          <div
            className={`overflow-hidden transition-all duration-300 
                        border border-primary-500 rounded-full 
                        ${showSearch ? "max-w-xs px-2" : "max-w-0 px-0"}`}
          >
            <input
              type="text"
              placeholder="جستجو..."
              className="w-full py-1 focus:outline-none "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // If you want the text to be right-aligned for Persian, add:
              // dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Grid of Filtered Houses */}
      {filteredHouses.length === 0 ? (
        <div>هیچ اقامتگاهی با عبارت وارد‌شده یافت نشد.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredHouses.map((house) => {
            const {
              uuid,
              image,
              name,
              address,
              vote,
              structure,
            } = house;

            const cityName = address?.city?.name ?? "";
            const provinceName = address?.city?.province?.name ?? "";
            const locationText = [provinceName, cityName]
              .filter(Boolean)
              .join(" / ");

            return (
              <div
                key={uuid}
                className="flex flex-col mx-1 md:mx-0 border rounded-3xl border-primary-500 overflow-hidden bg-white shadow-sm"
              >
                <img
                  src={image}
                  alt={name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 flex flex-col gap-2">
                  {/* Name */}
                  <h3 className="font-semibold text-lg">{name}</h3>

                  <div className="flex flex-wrap gap-2 md:gap-1 lg:gap-1.5 xl:gap-3">
                    {/* Location */}
                    {locationText && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPinIcon className="h-5 w-5 text-primary-500 ml-0.5" />
                        <span className="truncate">{locationText}</span>
                      </div>
                    )}

                    {/* Structure (with icon) */}
                    {structure && (
                      <div className="flex items-center gap-0.5 text-sm text-gray-600">
                        <img
                          src={structure.icon}
                          alt={structure.label}
                          className="h-4 w-4"
                        />
                        <span>{structure.label}</span>
                      </div>
                    )}

                    {/* Vote */}
                    {vote != null && (
                      <div className="flex items-center">
                        <Vote vote={vote} size="sm" />
                      </div>
                    )}
                  </div>

                  {/* Button/Link to go to /house/:uuid */}
                  <div className="mt-2">
                    <Link
                      to={`/house/${uuid}`}
                      className="inline-block bg-primary-500 hover:bg-primary-600 text-white text-sm px-3 py-1.5 rounded-2xl transition"
                    >
                      مشاهده اقامتگاه
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Favorites;
