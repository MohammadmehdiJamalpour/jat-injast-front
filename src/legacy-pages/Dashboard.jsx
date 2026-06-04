import React from "react";
import { Outlet } from "@/lib/router-compat";

function Dashboard() {
  return (
    <div className="md:container  xl:max-w-8xl flex justify-center  items-center h-screen">
      <Outlet />
    </div>
  );
}

export default Dashboard;
