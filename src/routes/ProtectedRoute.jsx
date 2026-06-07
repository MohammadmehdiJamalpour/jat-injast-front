import { Navigate, Outlet, useLocation } from "@/lib/router-compat";
import { useUserContext } from "../contexts/UserContext";
import Loading from "../ui/Loading";

export default function ProtectedRoute({ children }) {
  const { isUserDataLoading, isUserError, userError } = useUserContext();
  const location = useLocation();

  // Still checking auth → show a loader
  if (isUserDataLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loading size={30} />
      </div>
    );
  }

  // If the profile request failed with 401/403 → not logged in → go to /login
  if (isUserError) {
    const status = userError?.response?.status;
    if (status === 401 || status === 403) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    // Other errors → show a friendly error (you can customize)
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-red-600">خطا در دریافت اطلاعات کاربر. لطفاً دوباره تلاش کنید.</p>
      </div>
    );
  }

  // Auth OK → render inner route
  return children ? children : <Outlet />;
}
