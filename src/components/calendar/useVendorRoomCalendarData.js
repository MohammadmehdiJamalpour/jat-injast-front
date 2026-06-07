import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VendorHouseCalendarByRoom } from "../../services/houseCalendarOwnerService";

export function useVendorRoomCalendarData({
  uuid,
  enabled,
  selectedRoomUuid,
}) {
  const queryClient = useQueryClient();

  const queryKey = ["vendor-room-calendar", uuid, selectedRoomUuid];

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    queryKey,
    async () => {
      const allMonths = [];
      const first = await VendorHouseCalendarByRoom(uuid, selectedRoomUuid);
      allMonths.push(first);

      if (first.next_month?.link) {
        const second = await VendorHouseCalendarByRoom(
          null,
          null,
          null,
          first.next_month.link
        );
        allMonths.push(second);
      }

      return allMonths;
    },
    {
      enabled: enabled && !!uuid && !!selectedRoomUuid,
      staleTime: 600000,
      cacheTime: 600000,
    }
  );

  async function fetchNextMonth() {
    if (!data || data.length === 0) return;
    const lastMonth = data[data.length - 1];
    if (lastMonth.next_month?.link) {
      const nextData = await VendorHouseCalendarByRoom(
        null,
        null,
        null,
        lastMonth.next_month.link
      );
      queryClient.setQueryData(queryKey, (oldArray) => {
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
