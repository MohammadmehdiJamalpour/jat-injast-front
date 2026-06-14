import { useEffect } from "react";
import { useSearchParams, useNavigate } from "@/lib/router-compat";
import {
  clearClientAuthState,
  setAuthTokenInCookie,
} from "../../services/httpService";

import { useUserContext } from "../../contexts/UserContext";
import { reportClientError } from "../../utils/reportClientError";

function LoginWithToken() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  
  const { refetch } = useUserContext();

  useEffect(() => {
    if (!token) {
      reportClientError("Login token missing");
      navigate("/");
      return;
    }

    clearClientAuthState();
    setAuthTokenInCookie(token);
    refetch();
    navigate("/dashboard");
  }, [token, navigate, refetch]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>در حال ورود ...</p>
    </div>
  );
}

export default LoginWithToken;
