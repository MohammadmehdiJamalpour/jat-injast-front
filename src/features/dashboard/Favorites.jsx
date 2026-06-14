import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import SearchHouseCard from "../search/components/SearchHouseCard";
import { getFavoriteHouses } from "../../services/houseService";
import Loading from "./../../ui/Loading";
import { normalizeHouseCardData } from "../../utils/houseCardData";

function Favorites() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loading message="در حال بارگذاری علاقه‌مندی‌ها..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-5 text-center text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
        مشکلی در دریافت لیست علاقه‌مندی‌ها پیش آمده است!
        <br />
        {error?.message && <p className="text-red-500">Error: {error.message}</p>}
      </div>
    );
  }

  const publishedHouses = (favoriteHouses || []).filter((house) => {
    const statusKey = String(house.status?.key || "").toLowerCase();
    return statusKey === "publish" || statusKey === "published";
  });

  if (publishedHouses.length === 0) {
    return <div>هیچ اقامتگاه منتشر‌شده‌ای در لیست علاقه‌مندی‌ها وجود ندارد.</div>;
  }

  const matchesSearch = (house, term) => {
    const lowerTerm = term.toLowerCase();

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

  const filteredHouses = publishedHouses.filter((house) =>
    matchesSearch(house, searchTerm)
  );

  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev);
  };

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-col gap-3 px-1 md:px-0 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold pt-2 truncate">لیست علاقه‌مندی‌ها</h2>

        <div className="flex min-w-0 items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleSearchToggle}
            className="rounded-full bg-primary-500 px-3 py-1 text-white transition-all hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
          >
            جستجو
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 
                        border border-primary-500 rounded-full 
                        ${showSearch ? "max-w-xs px-2" : "max-w-0 px-0"}`}
          >
            <input
              type="text"
              placeholder="جستجو..."
              className="w-full min-w-0 bg-transparent py-1 focus:outline-none"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredHouses.length === 0 ? (
        <div>هیچ اقامتگاهی با عبارت وارد‌شده یافت نشد.</div>
      ) : (
        <div className="mx-auto grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] gap-4">
          {filteredHouses.map((house) => (
            <SearchHouseCard
              key={house.uuid ?? house.id}
              house={normalizeHouseCardData(house)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
