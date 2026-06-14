import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VendorHouseCalendarByRoom } from "../../services/houseCalendarOwnerService";
import {
  preloadVendorCalendarMonths,
  VENDOR_CALENDAR_PRELOAD_MONTH_COUNT,
} from "./vendorCalendarMonthData";

export function useVendorRoomCalendarData({
  uuid,
  enabled,
  selectedRoomUuid,
}) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => ["vendor-room-calendar", uuid, selectedRoomUuid],
    [uuid, selectedRoomUuid]
  );
  const preloadingRef = useRef(false);
  const failedLinksRef = useRef(new Set());

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    queryKey,
    async () => {
      const first = await VendorHouseCalendarByRoom(uuid, selectedRoomUuid);
      return [first];
    },
    {
      enabled: enabled && !!uuid && !!selectedRoomUuid,
      staleTime: 600000,
      cacheTime: 600000,
    }
  );

  const fetchMonthByLink = useCallback(async (link) => {
    if (failedLinksRef.current.has(link)) {
      throw new Error("Calendar month link already failed.");
    }

    try {
      return await VendorHouseCalendarByRoom(null, null, null, link);
    } catch (error) {
      failedLinksRef.current.add(link);
      throw error;
    }
  }, []);

  const loadMonths = useCallback(
    (months, minimumMonths) =>
      preloadVendorCalendarMonths({
        months,
        fetchMonthByLink,
        minimumMonths,
      }),
    [fetchMonthByLink]
  );

  useEffect(() => {
    failedLinksRef.current = new Set();
  }, [uuid, selectedRoomUuid]);

  useEffect(() => {
    if (
      !enabled ||
      !data?.length ||
      data.length >= VENDOR_CALENDAR_PRELOAD_MONTH_COUNT ||
      preloadingRef.current
    ) {
      return;
    }

    let isCancelled = false;
    preloadingRef.current = true;

    loadMonths(data, VENDOR_CALENDAR_PRELOAD_MONTH_COUNT)
      .then((months) => {
        if (!isCancelled) queryClient.setQueryData(queryKey, months);
      })
      .finally(() => {
        preloadingRef.current = false;
      });

    return () => {
      isCancelled = true;
    };
  }, [data, enabled, loadMonths, queryClient, queryKey]);

  async function fetchNextMonth() {
    const currentMonths = queryClient.getQueryData(queryKey) || data || [];
    if (!currentMonths.length) return 0;

    const months = await loadMonths(currentMonths, currentMonths.length + 1);
    queryClient.setQueryData(queryKey, months);
    return months.length;
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
