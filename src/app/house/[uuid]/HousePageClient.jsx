"use client";

import HouseContainer from "@/features/house/HouseContainer";
import useShowHouse from "@/features/house/useShowHouse";
import Loading from "@/ui/Loading";
import NotFound from "@/components/NotFound";
import { OutletContextProvider } from "@/lib/router-compat";
import Footer from "@/components/Footer";

export default function HousePageClient({ uuid }) {
  const {
    data: houseData,
    isLoading,
    isError,
    refetch,
  } = useShowHouse(uuid);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError || !houseData) {
    return (
      <NotFound
        title="اقامتگاه پیدا نشد"
        message="اقامتگاه مورد نظر پیدا نشد یا امکان بارگذاری آن وجود ندارد."
        showRetry
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <div className="house-page-container md:container pt-12 md:pt-8 xl:max-w-8xl">
        <OutletContextProvider value={{ houseData, uuid }}>
          <HouseContainer />
        </OutletContextProvider>
      </div>
      <Footer mode="static" />
    </>
  );
}
