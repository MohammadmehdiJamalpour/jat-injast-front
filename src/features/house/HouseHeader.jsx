// HouseHeader.jsx
import React, { useEffect, useState } from "react";
import { HeartIcon as HeartIconSolid, ShareIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import Loading from "../../ui/Loading";
import toPersianNumber from "../../utils/toPersianNumber";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import HouseVendorBadge from "./houseComponents/HouseVendorBadge";
import HouseInformation from "./houseComponents/HouseInformation";
import HouseViews from "./houseComponents/HouseViews";
import HouseAreas from "./houseComponents/HouseAreas";
import { favoriteHouse } from "../../services/houseService";
import { useUserContext } from "../../contexts/UserContext";
import { reportClientError } from "../../utils/reportClientError";

function HouseHeader({ houseData }) {
  const { userData } = useUserContext();
  const queryClient = useQueryClient();
  const [isFavorited, setIsFavorited] = useState(Boolean(houseData?.is_favorite));
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    setIsFavorited(Boolean(houseData?.is_favorite));
  }, [houseData?.is_favorite, houseData?.uuid]);

  const syncFavoriteCache = (value) => {
    if (!houseData?.uuid) return;

    queryClient.setQueryData(["show-house", houseData.uuid], (oldData) =>
      oldData ? { ...oldData, is_favorite: value } : oldData,
    );
    queryClient.invalidateQueries({ queryKey: ["favorite-houses"] });
  };

  const handleFavoriteClick = async () => {
    if (!userData) {
      toast.error("لطفا برای اضافه کردن به علاقه‌مندی‌ها ابتدا وارد شوید");
      return;
    }

    if (!houseData?.uuid || isFavoriting) return;

    const previousValue = isFavorited;
    const optimisticValue = !previousValue;

    try {
      setIsFavoriting(true);
      setIsFavorited(optimisticValue);
      syncFavoriteCache(optimisticValue);

      const response = await favoriteHouse(houseData.uuid);
      const nextValue =
        typeof response?.is_favorite === "boolean"
          ? response.is_favorite
          : response?.type === "Liked";

      setIsFavorited(nextValue);
      syncFavoriteCache(nextValue);

      if (nextValue) {
        toast.success("به علاقه‌مندی‌ها اضافه شد");
      } else {
        toast("از علاقه‌مندی‌ها حذف شد");
      }
    } catch (error) {
      reportClientError("Toggle house favorite", error);
      setIsFavorited(previousValue);
      syncFavoriteCache(previousValue);
      toast.error("مشکلی در ثبت علاقه‌مندی رخ داد");
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(window.location.href);
      toast.success("لینک اقامتگاه کپی شد");
    } catch (error) {
      reportClientError("Copy house link", error);
      toast.error("مشکلی در کپی لینک رخ داد");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="mb-2 flex flex-col items-start justify-center gap-1 px-3 lg:gap-2">
      <div className="flex w-full items-center justify-between gap-1 p-1 550:justify-start">
        <h1 className="mb-1.5 w-full text-xl font-bold sm:text-2xl md:w-auto">
          {houseData?.name ?? "نام اقامتگاه مشخص نشده است"}
        </h1>

        <p className="mb-1 flex items-center justify-center rounded-2xl bg-primary-50 px-2 pt-1 text-sm">
          {toPersianNumber(houseData.uuid)}
        </p>

        <button
          type="button"
          className="flex min-h-8 min-w-8 cursor-pointer items-center justify-center rounded-xl border border-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleFavoriteClick}
          disabled={isFavoriting}
          aria-pressed={isFavorited}
          aria-label={isFavorited ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        >
          {isFavoriting ? (
            <Loading size={20} />
          ) : isFavorited ? (
            <HeartIconSolid className="h-6 w-6 text-primary-600" />
          ) : (
            <HeartIconOutline className="h-6 w-6 text-primary-600" />
          )}
        </button>

        <button
          type="button"
          className="flex min-h-8 min-w-8 cursor-pointer items-center justify-center rounded-xl border border-primary-500"
          onClick={handleCopyLink}
          aria-label="کپی لینک اقامتگاه"
        >
          {isCopying ? (
            <Loading size={20} />
          ) : (
            <ShareIcon className="h-6 w-6 text-primary-600" />
          )}
        </button>
      </div>

      <div className="flex w-full flex-col items-start justify-start gap-1.5 sm:flex-row lg:flex-col">
        <div className="flex flex-col gap-1.5 xs:flex-row lg:flex-col xl:flex-row">
          <HouseVendorBadge hostInfo={houseData.vendor || houseData.owner} />
          <HouseInformation houseData={houseData} />
        </div>
        <div className="w-full" />
      </div>

      <div className="flex w-full flex-col gap-2 md:gap-3">
        <HouseViews houseViews={houseData.views?.types} />
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 lg:gap-6">
          <HouseAreas
            areas={houseData.areas}
            tip={houseData.tip}
            structure={houseData.structure}
          />
        </div>
      </div>
    </div>
  );
}

export default HouseHeader;
