import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/userService";

export default function useUser() {
  return useQuery({
    queryKey: ["get-user"],
    queryFn: getUser,
    retry: false,
    staleTime: 600000,
    cacheTime: 600000,
  });
}
