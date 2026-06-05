import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "@/lib/router-compat";
import { deleteAuthTokenCookie, setAuthTokenInCookie } from "../../services/httpService"; 

import { useUserContext } from "../../contexts/UserContext";
import { reportClientError } from "../../utils/reportClientError";

function LoginWithToken() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  
  const { refetch } = useUserContext();

  useEffect(() => {
    // 1) If no token is found in URL, go home or show error
    if (!token) {
      reportClientError("Login token missing");
      navigate("/");
      return;
    }

    // 2) Delete any old auth cookie
    deleteAuthTokenCookie();

    // 3) Set the new token
    setAuthTokenInCookie(token);

    // 4) Immediately refetch user data in your UserContext
    refetch();

    // 5) Navigate to the dashboard (or wherever you want)
    navigate("/dashboard");
  }, [token, navigate, refetch]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>در حال ورود ...</p>
    </div>
  );
}

export default LoginWithToken;
