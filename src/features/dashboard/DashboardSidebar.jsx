// src/features/dashboard/DashboardSidebar.jsx

import { useState } from "react";
import { Tab } from "@headlessui/react";
import {
  UserIcon,
  PencilSquareIcon,
  HomeIcon,
  CreditCardIcon,
  HeartIcon,
  UsersIcon,
  CalendarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
TicketIcon ,
} from "@heroicons/react/24/solid";
import Loading from "../../ui/Loading";
import { logOutUser } from "../../services/userService";
import { useQueryClient } from "@tanstack/react-query";
import { reportClientError } from "../../utils/reportClientError";

const ADMIN_DEMO_PHONE = "09123456789";

function DashboardSidebar({ setSelectedTab, user }) {
  const svgClasses = "ml-1 w-5 h-5 text-current";
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const displayedPhone =
    user?.type === "Admin"
      ? ADMIN_DEMO_PHONE
      : user?.phone || "شماره ثبت نشده";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logOutUser();
      document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      queryClient.setQueryData(["get-user"], null);
      queryClient.invalidateQueries(["get-user"]);
    } catch (error) {
      reportClientError("Dashboard logout", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-full max-h-full min-h-0 w-full flex-col items-center justify-start gap-y-2 overflow-hidden rounded-3xl py-2 lg:gap-y-2.5">
      <div
        dir="rtl"
        className="w-full shrink-0 rounded-3xl border border-primary-100 bg-white/70 p-2.5 shadow-sm shadow-primary-50/60 dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20"
      >
        <div className="flex items-center gap-3">
          <img
            className="h-16 w-16 shrink-0 rounded-full border border-primary-100 object-cover shadow-sm dark:border-slate-700"
            src={user?.avatar || "/pwa-icon.webp"}
            alt="Profile"
          />

          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
              {user?.name || "نام کاربر"}
            </p>

            <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-slate-300">
              <span>شماره تلفن:</span>
              <span>{displayedPhone}</span>
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={handleLogout}
                className="min-h-8 flex-1 rounded-full border border-gray-200 px-4 text-xs text-gray-700 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-white dark:hover:border-red-500/50 dark:hover:bg-red-500/10 dark:hover:text-red-200"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? <Loading size={18} /> : "خروج"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 w-full flex-1">
        <Tab.Group as="div" className="h-full min-h-0">
        <Tab.List className="scrollbar-thin scrollbar-no-arrows flex h-full max-h-[42vh] flex-col items-center justify-start gap-y-1.5 overflow-y-auto overscroll-contain rounded-3xl bg-gray-50/80 p-1.5 pr-1 dark:bg-slate-950/40 md:max-h-full">
          <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedTab("profile")}
          >
            پروفایل
            <UserIcon className={svgClasses} />
          </Tab>
          <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedTab("editProfile")}
          >
            ویرایش اطلاعات
            <PencilSquareIcon className={svgClasses} />
          </Tab>
          {user?.type === "Vendor" && (
            <Tab
              as="div"
              className={({ selected }) =>
                `tab ${selected ? "tab-selected" : "tab-hover"}`
              }
              onClick={() => setSelectedTab("houses")}
            >
              اقامتگاه ها
              <HomeIcon className={svgClasses} />
            </Tab>
          )}
          <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedTab("wallet")}
          >
            کیف پول
            <CreditCardIcon className={svgClasses} />
          </Tab>
          <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedTab("favorites")}
          >
            علاقه مندی ها
            <HeartIcon className={svgClasses} />
          </Tab>
          <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedTab("inviteFriends")}
          >
            دعوت از دوستان
            <UsersIcon className={svgClasses} />
          </Tab>
          <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() =>
              setSelectedTab(user?.type === "Vendor" ? "reserves" : "reserves")
            }
          >
            {user?.type === "Vendor" ? "رزرو ها" : "سفر های من"}
            <CalendarIcon className={svgClasses} />
          </Tab>
           <Tab
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedTab("tickets")}
          >
            تیکت ها
            <TicketIcon className={svgClasses} />
          </Tab>
          {user?.type === "Vendor" && (
            <Tab
              as="div"
              className={({ selected }) =>
                `tab ${selected ? "tab-selected" : "tab-hover"}`
              }
              onClick={() => setSelectedTab("comments")}
            >
              نظرات کاربران
              <ChatBubbleOvalLeftEllipsisIcon className={svgClasses} />
            </Tab>
            
          )}
        </Tab.List>
        </Tab.Group>
      </div>
    </div>
  );
}

export default DashboardSidebar;

