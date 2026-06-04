// src/pages/House.jsx
import React from "react";
import { useParams, Outlet } from "@/lib/router-compat";
import useShowHouse from "../features/house/useShowHouse"; // or the correct relative path
import Loading from "../ui/Loading";
import NotFound from "./NotFound";

function House() {
  const { uuid } = useParams();

  const {
    data: houseData,
    isLoading: loadingHouse,
    isError: isErrorHouse,
    error: errorHouse,
    refetch: refetchHouse,
  } = useShowHouse(uuid);

  // 1. Handle loading state
  if (loadingHouse) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loading />
      </div>
    );
  }

  // 2. Handle error/not found
  if (isErrorHouse || !houseData) {
    return (
      <NotFound
        title="خانه مورد نظر پیدا نشد!"
        message="خانه مورد نظر یافت نشد یا مشکلی در دریافت اطلاعات رخ داده است."
        showRetry={true}
        onRetry={refetchHouse}
      />
    );
  }

  // 3. Pass the `houseData` and `uuid` to nested routes via React Router’s Outlet
  return (
    <div className="md:container  pt-12 md:pt-8 xl:max-w-8xl house-page-container">
      <Outlet context={{ houseData, uuid }} />
    </div>
  );
}

export default House;
