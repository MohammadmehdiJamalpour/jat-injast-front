import React from "react";
import {
  FaBath,
  FaBroom,
  FaCheckCircle,
  FaShower,
  FaSoap,
  FaSprayCan,
  FaTint,
  FaToilet,
  FaTrashAlt,
} from "react-icons/fa";
import { useFetchSanitaryOptions } from "../../../services/fetchDataService";
import ExpandableContent from "../../../ui/ExpandableContent";

const CLEANING_KEYS = new Set([
  "clean_sheets",
  "clean_towels",
  "cleaning_supplies",
  "daily_cleaning",
  "disinfected_surfaces",
  "trash_bags",
  "washing_machine",
  "washing_powder",
]);

const SANITARY_ICONS = {
  iranian_toilet: FaToilet,
  western_toilet: FaToilet,
  bathroom: FaBath,
  shower: FaShower,
  hot_water: FaTint,
  toiletries: FaCheckCircle,
  towel: FaCheckCircle,
  washing_powder: FaSoap,
  clean_sheets: FaSoap,
  clean_towels: FaSoap,
  cleaning_supplies: FaBroom,
  daily_cleaning: FaBroom,
  disinfected_surfaces: FaSprayCan,
  trash_bags: FaTrashAlt,
};

function normalizeSanitary(sanitary, fallback) {
  return {
    ...fallback,
    ...sanitary,
    key: sanitary?.key || fallback?.key || "",
    label: sanitary?.label || fallback?.label || fallback?.title || sanitary?.key || "",
    icon: sanitary?.icon || fallback?.icon || "",
  };
}

function HouseSanitaries({ houseData }) {
  const { data: allSanitaries = [], isLoading, isError } = useFetchSanitaryOptions();
  const selectedSanitaries = houseData?.sanitaries || [];

  if (!houseData) return null;

  if (isLoading && selectedSanitaries.length === 0) {
    return (
      <div className="my-3 px-2">
        <h3 className="mb-2 text-lg font-bold text-gray-800">بهداشت و نظافت</h3>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-full animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (isError && selectedSanitaries.length === 0) {
    return (
      <div className="my-3 px-2 text-red-500">
        خطایی در بارگذاری موارد بهداشتی رخ داده است.
      </div>
    );
  }

  if (selectedSanitaries.length === 0) return null;

  const sanitariesByKey = new Map(allSanitaries.map((sanitary) => [sanitary.key, sanitary]));
  const sanitaries = selectedSanitaries
    .map((sanitary) => normalizeSanitary(sanitary, sanitariesByKey.get(sanitary.key)))
    .filter((sanitary) => sanitary.key || sanitary.label);

  const cleaningItems = sanitaries.filter((item) => CLEANING_KEYS.has(item.key));
  const hygieneItems = sanitaries.filter((item) => !CLEANING_KEYS.has(item.key));

  return (
    <div className="px-2 pt-2">
      <h3 className="mb-2 pr-2 text-lg font-bold text-gray-800">بهداشت و نظافت</h3>
      <div className="my-3 space-y-3 rounded-2xl bg-gray-50 px-3 p-2 lg:pt-3">
        {hygieneItems.length > 0 && (
          <SanitaryGroup title="امکانات بهداشتی" items={hygieneItems} />
        )}
        {cleaningItems.length > 0 && (
          <SanitaryGroup title="نظافت اقامتگاه" items={cleaningItems} />
        )}
      </div>
    </div>
  );
}

function SanitaryGroup({ title, items }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-bold text-gray-700">{title}</h4>
      <ExpandableContent
        collapsedHeight={128}
        contentClassName="grid grid-cols-1 gap-2 md:grid-cols-2"
        dir="rtl"
      >
        {items.map((sanitary) => (
          <SanitaryItem key={sanitary.key || sanitary.label} sanitary={sanitary} />
        ))}
      </ExpandableContent>
    </div>
  );
}

function SanitaryItem({ sanitary }) {
  const { icon, label } = sanitary;
  const Icon = SANITARY_ICONS[sanitary.key] || FaCheckCircle;

  return (
    <div className="flex items-center gap-2 rounded-lg px-3 py-2">
      <div className="h-8 w-8 flex-shrink-0">
        {icon ? (
          <img src={icon} alt={label} className="h-full w-full object-contain" />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center rounded-full bg-primary-100 text-primary-700"
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default HouseSanitaries;
