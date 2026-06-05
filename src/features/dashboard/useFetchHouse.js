import { useQuery } from "@tanstack/react-query";
import { getHouse } from "../../services/houseService";

/**
 * Custom hook to fetch a house by UUID.
 * 
 * @param {string} uuid - The unique ID of the house you want to fetch.
 * @returns {object} - React Query's query object, including:
 *   - data: The fetched house data
 *   - isLoading: Whether the query is currently loading
 *   - isError: Whether an error occurred
 *   - error: The error object if isError is true
 *   - refetch: A function to refetch the data on demand
 */
export default function useFetchHouse(uuid) {
  return useQuery({
    queryKey: ["get-house", uuid],
    queryFn: () => getHouse(uuid),
    enabled: !!uuid, 
    retry: false,

    /* 
      The length of time (in ms) during which React Query will consider 
      the data “fresh” and not refetch automatically.
      600,000 ms = 10 minutes.
    */
    staleTime: 10 * 60 * 1000,

    /*
      How long (in ms) inactive cache data stays in memory before 
      garbage collection. Also set to 10 minutes here.
    */
    cacheTime: 10 * 60 * 1000,

    // Additional optional configs:
    // refetchOnWindowFocus: false, 
    // refetchOnReconnect: false,
    // onSuccess: (data) => { /* do something with the data */ },
    // onError: (error) => { /* handle error logging or side effects */ },
  });
}
