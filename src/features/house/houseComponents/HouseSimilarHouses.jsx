import React from "react";
import { useNavigate } from "@/lib/router-compat";
import useShowSimilarHouses from "../useShowSimilarHouses";
import SimilarHouseCard from './SimilarHouseCard';

function HouseSimilarHouses({ houseUuid }) {
  const navigate = useNavigate();

  const useMock = false;

  const mockSimilarHouses = [
    {
      uuid: "1",
      name: "ویلای ساحلی در شمال",
      address: { city: { name: "چالوس" } },
      price: 950000,
      originalPrice: 1200000,
      discountPercent: 20,
      score: 4.5,
      featured: true,
      avatar: "https://via.placeholder.com/400x300",
      rooms: 3,
    },
    {
      uuid: "2",
      name: "کلبه جنگلی",
      address: { village: "ماسال" },
      price: 650000,
      originalPrice: 650000,
      discountPercent: 0,
      score: 4.8,
      featured: false,
      avatar: "https://via.placeholder.com/400x300",
      rooms: 2,
    },
  ];

  const similarQuery = useShowSimilarHouses(houseUuid);
  const {
    data: similarHouses = [],
    isLoading,
    isError,
    error,
  } = useMock
    ? { data: mockSimilarHouses, isLoading: false, isError: false, error: null }
    : similarQuery;

  if (!houseUuid) return null;

  if (isLoading) {
    return (
      <div className="px-2 my-3">
        <h3 className="text-lg font-bold text-gray-800 mb-2">اقامتگاه های مشابه</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="border rounded-2xl p-2 flex flex-col gap-2 animate-pulse"
            >
              <div className="w-full h-48 bg-gray-100 rounded-2xl" />
              <div className="w-3/4 h-4 bg-gray-100 rounded-2xl" />
              <div className="w-1/2 h-4 bg-gray-100 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-2 my-3">
        <h3 className="text-lg font-bold text-gray-800 mb-2">اقامتگاه های مشابه</h3>
        <p className="text-red-600">
          خطا در بارگذاری اقامتگاه‌های مشابه: {error?.message}
        </p>
      </div>
    );
  }

  if (!similarHouses.length) return null;

  return (
    <div className="px-2 my-3 mb-24">
      <h3 className="text-lg font-bold text-gray-800 mb-2">اقامتگاه های مشابه</h3>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-primary-100 scrollbar-thumb-rounded-full">
        <div className="flex gap-4 w-full">
          {similarHouses.map((house) => (
            <div
              key={house.uuid}
              className="flex-shrink-0 min-w-[75%] sm:min-w-[48%] lg:min-w-[30%]"
              onClick={() => navigate(`/house/${house.uuid}`)}
            >
              <SimilarHouseCard house={house} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HouseSimilarHouses;
