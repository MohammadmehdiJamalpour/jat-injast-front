// UserContext.jsx
import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/userService";

const UserContext = createContext();

// Custom hook to access the user context
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Determine if an auth token exists (adjust based on your auth logic)
  const tokenExists =
    typeof document !== "undefined" && document.cookie.includes("authToken=");

  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserError,
    refetch,
  } = useQuery({
    queryKey: ["get-user"],
    queryFn: getUser,
    retry: false,
    staleTime: 600000, // 10 minutes
    cacheTime: 600000, // 10 minutes
    // When no token exists, assume no user data and avoid a loading state
    initialData: tokenExists ? undefined : null,
    enabled: tokenExists,
  });

  return (
    <UserContext.Provider
      value={{
        userData,
        isUserDataLoading,
        isUserError,
        refetch,
        // Expose more fields if needed
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
