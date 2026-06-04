// EditHouseContainer.js

import React, { useState } from "react";
import EditHouseSidebar from "./EditHouseSidebar";
import EditHouseContent from "./EditHouseContent";

const tabSections = [
  {
    label: "آدرس و موقعیت مکانی",
    keys: [
      { key: "address", label: "آدرس" },
      { key: "location", label: "موقعیت مکانی" },
    ],
  },
  {
    label: "اطلاعات کلی",
    keys: [
      { key: "generalInfo", label: "اطلاعات اقامتگاه" },
      { key: "environmentInfo", label: "اطلاعات محیطی" },
    ],
  },
  {
    label: "مشخصات اقامتگاه",
    keys: [
      { key: "mainFacilities", label: "امکانات اقامتگاه" },
      { key: "rooms", label: "اتاق‌ها" },
      { key: "sanitaries", label: "امکانات بهداشتی" },
    ],
  },
  {
    label: "قوانین اقامتگاه",
    keys: [
      { key: "reservationRules", label: "قوانین رزرو" },
      { key: "cancellationRules", label: "قوانین کنسلی" },
      { key: "stayRules", label: "قوانین اقامت" },
    ],
  },
  {
    label: "قیمت گذاری",
    keys: [{ key: "pricing", label: "قیمت گذاری" }],
  },
  {
    label: "تصاویر",
    keys: [
      { key: "images", label: "تصاویر اقامتگاه" },
      { key: "documents", label: "مدارک مالکیت" },
    ],
  },
  {
    label: "ثبت نهایی اقامتگاه",
    keys: [{ key: "finalSubmit", label: "ثبت نهایی اقامتگاه" }],
  },
];

function EditHouseContainer() {
  const [selectedTab, setSelectedTab] = useState("address");

  const handleNextTab = () => {
    const flatKeys = tabSections.flatMap((section) => section.keys);
    const currentIndex = flatKeys.findIndex((tab) => tab.key === selectedTab);
    if (currentIndex < flatKeys.length - 1) {
      setSelectedTab(flatKeys[currentIndex + 1].key);
    }
  };

  const handlePreviousTab = () => {
    const flatKeys = tabSections.flatMap((section) => section.keys);
    const currentIndex = flatKeys.findIndex((tab) => tab.key === selectedTab);
    if (currentIndex > 0) {
      setSelectedTab(flatKeys[currentIndex - 1].key);
    }
  };

  return (
    <div className="md:container pt-12 md:pt-20 xl:max-w-8xl flex flex-col md:grid px-2 md:grid-cols-12 gap-2 lg:gap-4 w-full min-h-[93vh] h-full">
      <div className="md:col-span-3  w-full bg-gray-50 border-primary-600 border  shadow-centered rounded-3xl md:p-3 mt-5 md:mt-0">
        <EditHouseSidebar
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
          tabSections={tabSections}
        />
      </div>

      <div className="md:col-span-9 flex flex-col h-full w-full mb-5 md:mb-0 bg-gray-50 border-primary-600 border shadow-centered rounded-3xl">
        <EditHouseContent
          selectedTab={selectedTab}
          handleNextTab={handleNextTab}
          handlePreviousTab={handlePreviousTab}
          tabSections={tabSections}
        />
      </div>
    </div>
  );
}

export default EditHouseContainer;
