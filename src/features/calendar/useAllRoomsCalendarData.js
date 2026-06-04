import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { getRoomCalendar, getRoomCalendarByMonth } from "../../services/houseService";

function getNextMonths(year, month, count) {
  const months = [];
  for (let i = 1; i <= count; i++) {
    let newMonth = month + i;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = newMonth % 12;
      newYear += Math.floor((month + i - 1) / 12);
    }
    months.push({ year: newYear, month: newMonth });
  }
  return months;
}

/**
 * useAllRoomsCalendarData:
 * Fetches initial month + subsequent months for ALL rooms when isRentRoom is true.
 * Returns a combined array of:
 * [
 *   {
 *     roomUuid: <string>,
 *     calendar: [month1, month2, ...]
 *   },
 *   ...
 * ]
 * Only returns data once all rooms and their subsequent months are fully loaded.
 */
export function useAllRoomsCalendarData({ uuid, isRentRoom, enabled, prefetchCount = 1, roomOptions }) {
  const shouldFetch = isRentRoom && roomOptions.length > 0 && enabled && !!uuid;


  // For each room, we first fetch initial month
  // Once initial is fetched, we know which subsequent months to fetch
  // We'll do a two-step process using `useQueries` for all rooms:
  
  // Step 1: Fetch initial month for all rooms
  const initialQueries = useQueries({
    queries: roomOptions.map(room => ({
      queryKey: ["get-room-calendar", uuid, room.uuid, "initial"],
      queryFn: async () => {
     
        const res = await getRoomCalendar(uuid, room.uuid);
       
        return { roomUuid: room.uuid, data: res };
      },
      enabled: shouldFetch,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
    }))
  });

  const allInitialSuccess = initialQueries.every(q => q.isSuccess);
  const anyInitialError = initialQueries.find(q => q.isError)?.error;

  // Compute subsequent month queries for all rooms that succeeded initial fetch
  const subsequentMonthsConfigs = useMemo(() => {
    if (!allInitialSuccess) return [];
    const configs = [];
    for (const q of initialQueries) {
      if (!q.data) continue; // no data yet
      const { roomUuid, data: initialData } = q.data;
      const { year, month } = initialData;
      const nextMonths = getNextMonths(year, month, prefetchCount);

      for (const { year: y, month: m } of nextMonths) {
        configs.push({
          queryKey: ["get-room-calendar", uuid, roomUuid, y, m],
          queryFn: async () => {
       
            const res = await getRoomCalendarByMonth(uuid, roomUuid, y, m);
         
            return { roomUuid, data: res, year: y, month: m };
          },
          enabled: allInitialSuccess,
          staleTime: 1000 * 60 * 5,
          cacheTime: 1000 * 60 * 30,
        });
      }
    }
    return configs;
  }, [allInitialSuccess, initialQueries, uuid, prefetchCount]);

  const subsequentQueries = useQueries({ queries: subsequentMonthsConfigs });

  const anySubsequentError = subsequentQueries.find(q => q.isError)?.error;
  const isError = !!anyInitialError || !!anySubsequentError;
  const error = anyInitialError || anySubsequentError;

  const isInitialLoading = initialQueries.some(q => q.isLoading);
  const isSubsequentLoading = subsequentQueries.some(q => q.isLoading);

  const isLoading = shouldFetch && (isInitialLoading || isSubsequentLoading);

  // Construct final data once all are ready
  const calendarData = useMemo(() => {
    if (!shouldFetch || isLoading || isError) {

      return [];
    }

    // Check if all rooms initial data present
    const initialMap = new Map();
    for (const q of initialQueries) {
      if (!q.isSuccess || !q.data) {
      
        return [];
      }
      initialMap.set(q.data.roomUuid, [q.data.data]); // start with initial month
    }

    // Insert subsequent months for each room
    for (const sq of subsequentQueries) {
      if (!sq.isSuccess || !sq.data) {
    
        return [];
      }
      const { roomUuid, data: monthData } = sq.data;
      const arr = initialMap.get(roomUuid);
      arr.push(monthData);
    }

    // Convert map to desired array format
    const result = [];
    for (const room of roomOptions) {
      const arr = initialMap.get(room.uuid);
      // Filter out null or undefined if any
      const finalMonths = arr.filter(m => m !== null && m !== undefined);
      result.push({
        roomUuid: room.uuid,
        name: room.name,
        calendar: finalMonths
      });
    }

   
    return result;
  }, [shouldFetch, isLoading, isError, initialQueries, subsequentQueries, roomOptions]);

  return {
    isLoading,
    isError,
    error,
    calendarData,
  };
}
