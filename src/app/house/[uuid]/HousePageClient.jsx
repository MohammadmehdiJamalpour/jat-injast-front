"use client";

import HouseContainer from "@/features/house/HouseContainer";
import useShowHouse from "@/features/house/useShowHouse";
import Loading from "@/ui/Loading";
import NotFound from "@/components/NotFound";
import { OutletContextProvider } from "@/lib/router-compat";
import Footer from "@/components/Footer";

export default function HousePageClient({
  uuid,
  initialHouseData,
  initialSimilarHouses,
  initialFooterContent,
}) {
  const {
    data: houseData,
    isLoading,
    isError,
    refetch,
  } = useShowHouse(uuid, { initialData: initialHouseData });

  let content;

  if (isLoading) {
    content = (
      <div className="flex flex-1 items-center justify-center pt-[calc(var(--header-height,4.5rem)+0.75rem)]">
        <Loading />
      </div>
    );
  } else if (isError || !houseData) {
    content = (
      <div className="flex flex-1 items-center justify-center pt-[calc(var(--header-height,4.5rem)+0.75rem)]">
        <NotFound
          title="اقامتگاه پیدا نشد"
          message="اقامتگاه مورد نظر پیدا نشد یا امکان بارگذاری آن وجود ندارد."
          showRetry
          onRetry={refetch}
        />
      </div>
    );
  } else {
    content = (
      <div className="house-page-container mx-3 w-auto flex-1 pt-[calc(var(--header-height,4.5rem)+0.75rem)] md:container md:mx-auto md:w-full md:px-0 md:pt-[calc(var(--header-height,4.5rem)+2rem)] xl:max-w-8xl">
        <OutletContextProvider
          value={{ houseData, uuid, initialSimilarHouses }}
        >
          <HouseContainer />
        </OutletContextProvider>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {content}
      <Footer mode="static" initialInfo={initialFooterContent} />
    </div>
  );
}
