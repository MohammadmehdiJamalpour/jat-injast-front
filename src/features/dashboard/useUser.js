// useUser.js
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/userService";

export default function useUser() {
  // If there is no auth token in the cookies, assume the user is not logged in.
  const tokenExists = document.cookie.includes("authToken=");

  return useQuery({
    queryKey: ["get-user"],
    queryFn: getUser,
    retry: false,
    staleTime: 600000, // 10 minutes in milliseconds
    cacheTime: 600000, // keep in cache for 10 minutes (adjust as needed)
    // If no token exists, provide initialData as null so that we don’t show a loading state.
    initialData: tokenExists ? undefined : null,
    enabled: tokenExists,
  });
}
