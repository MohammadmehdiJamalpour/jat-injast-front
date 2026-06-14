import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/userService";

const UserContext = createContext();

// Custom hook to access the user context
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const {
    data: userData,
    isLoading: isUserDataLoading,
    isError: isUserError,
    error: userError,
    refetch,
  } = useQuery({
    queryKey: ["get-user"],
    queryFn: getUser,
    retry: false,
    staleTime: 600000, // 10 minutes
    cacheTime: 600000, // 10 minutes
  });

  return (
    <UserContext.Provider
      value={{
        userData,
        isUserDataLoading,
        isUserError,
        userError,
        refetch,
        // Expose more fields if needed
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
