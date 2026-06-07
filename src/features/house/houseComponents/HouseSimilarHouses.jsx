import { useNavigate } from "@/lib/router-compat";
import useShowSimilarHouses from "../useShowSimilarHouses";
import EmptyState from "../../../ui/EmptyState";
import SimilarHouseCard from "./SimilarHouseCard";

const SECTION_TITLE = "اقامتگاه‌های مشابه";

function HouseSimilarHouses({ houseUuid }) {
  const navigate = useNavigate();

  const {
    data: similarHouses = [],
    isLoading,
    isError,
    error,
  } = useShowSimilarHouses(houseUuid);

  if (!houseUuid) return null;

  if (isLoading) {
    return (
      <div className="px-2 my-3">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{SECTION_TITLE}</h3>
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
        <h3 className="text-lg font-bold text-gray-800 mb-2">{SECTION_TITLE}</h3>
        <p className="text-red-600">
          خطا در بارگذاری اقامتگاه‌های مشابه: {error?.message}
        </p>
      </div>
    );
  }

  if (!similarHouses.length) {
    return (
      <div className="px-2 my-3 mb-24">
        <EmptyState
          title="اقامتگاه مشابهی برای این موقعیت پیدا نشد."
          description="وقتی اقامتگاه‌های نزدیک یا هم‌دسته آماده باشند، این بخش به‌روزرسانی می‌شود."
        />
      </div>
    );
  }

  return (
    <div className="px-2 my-3 mb-24">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{SECTION_TITLE}</h3>

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
