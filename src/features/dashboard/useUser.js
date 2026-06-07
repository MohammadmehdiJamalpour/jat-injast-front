import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/userService";

export default function useUser() {
  const tokenExists = document.cookie.includes("authToken=");

  return useQuery({
    queryKey: ["get-user"],
    queryFn: getUser,
    retry: false,
    staleTime: 600000,
    cacheTime: 600000,
    initialData: tokenExists ? undefined : null,
    enabled: tokenExists,
  });
}
