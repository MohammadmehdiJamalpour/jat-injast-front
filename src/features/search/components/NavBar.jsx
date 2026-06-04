import React from "react";
import MobileFilters from "./MobileFilters";
import DesktopFilters from "./DesktopFilters";

export default function NavBar() {
  const filters = [
    "تاریخ سفر",
    "تعداد نفرات",
    "محدوده اجاره‌بها",
    "تعداد تخت و اتاق",
    "منظره اقامتگاه",
    "امکانات اقامتگاه",
    "نوع اقامتگاه",
    "نوع سازه",
    "بافت محیط",
    "نوع مالکیت",          
    "مقررات اقامتگاه",
  ];

  return (
    <nav className="relative z-[6000] w-full">
      <div className="rounded-t-3xl overflow-visible">
        <MobileFilters filters={filters} />
        <DesktopFilters filters={filters} />
      </div>
    </nav>
  );
}
