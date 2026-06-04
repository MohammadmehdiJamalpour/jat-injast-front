import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VendorHouseCalendarByHouse } from "../../services/houseCalendarOwnerService";

export function useVendorHouseCalendarData({ uuid, enabled }) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    ["vendor-house-calendar", uuid],
    async () => {
      const allMonths = [];
      const first = await VendorHouseCalendarByHouse(uuid);
      allMonths.push(first);

      if (first.next_month?.link) {
        const second = await VendorHouseCalendarByHouse(
          null,
          null,
          first.next_month.link
        );
        allMonths.push(second);
      }

      return allMonths;
    },
    {
      enabled: enabled && !!uuid,
      staleTime: 600000,
      cacheTime: 600000,
    }
  );

  async function fetchNextMonth() {
    if (!data || data.length === 0) return;
    const lastMonth = data[data.length - 1];
    if (lastMonth.next_month?.link) {
      const nextData = await VendorHouseCalendarByHouse(
        null,
        null,
        lastMonth.next_month.link
      );

      queryClient.setQueryData(["vendor-house-calendar", uuid], (oldArray) => {
        if (!oldArray) return [nextData];
        return [...oldArray, nextData];
      });
    }
  }

  return {
    data: data || [],
    isLoading,
    isError,
    error,
    fetchNextMonth,
    refetch,
  };
}
