"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@/lib/router-compat";
import { useUserContext } from "@/contexts/UserContext";
import Loading from "@/ui/Loading";
import AdminOverview from "./AdminOverview";
import AdminResourcePanel from "./AdminResourcePanel";
import { configs, tabs } from "./adminConfig";

function AdminPanelContainer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userData, isUserDataLoading } = useUserContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isUserDataLoading && !userData) {
      navigate("/login", { replace: true });
    }
  }, [isUserDataLoading, navigate, userData]);

  if (isUserDataLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loading size={30} />
      </div>
    );
  }

  if (!userData) return null;

  if (userData.type !== "Admin") {
    return (
      <div className="mx-auto mt-28 w-full max-w-xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-700">
        دسترسی به پنل مدیریت فقط برای مدیر فعال است.
      </div>
    );
  }

  const config = configs[activeTab];
  const closeForm = () => {
    setEditing(null);
    setCreating(false);
  };

  return (
    <div className="mx-auto mt-24 flex w-full max-w-8xl flex-col gap-4 px-3 pb-10" dir="rtl">
      <div className="flex flex-col gap-3 rounded-2xl border border-primary-100 bg-gray-50 p-4 shadow-centered md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">پنل مدیریت وب</h1>
          <p className="mt-1 text-sm text-gray-600">
            مدیریت کاربران، اقامتگاه‌ها، رزروها و گزینه‌های پایه با ظاهر سایت.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <aside className="rounded-2xl border border-gray-100 bg-white p-2 shadow-centered dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/25 lg:col-span-3 xl:col-span-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setSearch("");
                  setFilters({});
                  closeForm();
                }}
                className={`mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary-500 text-white dark:bg-primary-600 dark:text-white"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-200"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </aside>

        <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-centered dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/25 lg:col-span-9 xl:col-span-10">
          {activeTab === "overview" ? (
            <AdminOverview />
          ) : (
            <AdminResourcePanel
              config={config}
              search={search}
              setSearch={setSearch}
              filters={filters}
              setFilters={setFilters}
              editing={editing}
              setEditing={setEditing}
              creating={creating}
              setCreating={setCreating}
              closeForm={closeForm}
              queryClient={queryClient}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminPanelContainer;
