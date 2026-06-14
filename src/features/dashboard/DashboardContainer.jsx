import { useEffect, useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import DashboardSidebar from "./DashboardSidebar";
import DashboardContent from "./DashboardContent";
import { useUserContext } from "../../contexts/UserContext";
import Loading from "../../ui/Loading";
import { toast } from 'react-hot-toast';

function DashboardContainer() {
  const { userData, isUserDataLoading } = useUserContext();

  const [selectedTab, setSelectedTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserDataLoading && !userData) {
         toast("لطفا ابتدا وارد پروفایل کاربری خود شوید", { icon: "🔒" });
      navigate("/login", { replace: true });
    }
  }, [isUserDataLoading, userData, navigate]);

  if (isUserDataLoading) {
    return (
      <div className="flex min-h-[100vh] items-center justify-center">
        <Loading size={30} message={'\u062f\u0631 \u062d\u0627\u0644 \u0628\u0627\u0631\u06af\u0630\u0627\u0631\u06cc \u062f\u0627\u0634\u0628\u0648\u0631\u062f...'} />
      </div>
    );
  }

  // By the time we get here, either userData exists or we've already navigated away.
  return (
    <div className="dashboard-stage">
      <div className="dashboard-shell flex min-w-0 flex-col items-start gap-4 md:grid md:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[22rem_minmax(0,1fr)]">
        <aside className="w-full rounded-3xl border border-primary-100 bg-white p-2 shadow-sm shadow-primary-50/70 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20 md:h-full md:min-h-0 md:overflow-hidden md:p-4">
          <DashboardSidebar user={userData} setSelectedTab={setSelectedTab} />
        </aside>

        <main className="scrollbar-thin scrollbar-no-arrows w-full flex-grow rounded-3xl border border-primary-100 bg-white p-2 shadow-sm shadow-primary-50/70 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20 md:h-full md:min-h-0 md:overflow-y-auto md:overscroll-contain md:p-4">
          <DashboardContent
            selectedTab={selectedTab}
            initialUser={userData}
            onUpdateUser={() => {}} // no local copy, so no setter needed
          />
        </main>
      </div>
    </div>
  );
}

export default DashboardContainer;
