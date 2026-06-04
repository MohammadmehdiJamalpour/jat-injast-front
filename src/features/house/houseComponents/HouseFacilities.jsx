import React from "react";
import {
  FaBaby,
  FaBriefcase,
  FaCheckCircle,
  FaFire,
  FaKey,
  FaParking,
  FaShieldAlt,
  FaSnowflake,
  FaSwimmingPool,
  FaTree,
  FaTshirt,
  FaUtensils,
  FaWifi,
} from "react-icons/fa";
import { useFetchFacilities } from "../../../services/fetchDataService";
import FacilitiesCustomIcon from "../../../ui/FacilitiesCustomIcon";
import ExpandableContent from "../../../ui/ExpandableContent";

const FACILITY_ICONS = {
  wifi: FaWifi,
  pool: FaSwimmingPool,
  parking: FaParking,
  kitchen: FaUtensils,
  heating: FaFire,
  barbecue: FaFire,
  yard: FaTree,
  balcony: FaTree,
  elevator: FaKey,
  washing_machine: FaTshirt,
  air_conditioner: FaSnowflake,
  fireplace: FaFire,
  security_camera: FaShieldAlt,
  janitor: FaKey,
  workspace: FaBriefcase,
  playground: FaBaby,
};

function normalizeFacility(facility, fallback) {
  return {
    ...fallback,
    ...facility,
    key: facility?.key || fallback?.key || "",
    label: facility?.label || fallback?.label || fallback?.title || facility?.key || "",
    icon: facility?.icon || fallback?.icon || "",
  };
}

function HouseFacilities({ houseData }) {
  const { data: allFacilities = [], isLoading, isError } = useFetchFacilities();
  const selectedFacilities = houseData?.facilities || [];

  if (!houseData) return null;

  if (isLoading && selectedFacilities.length === 0) {
    return (
      <div className="my-3 px-3">
        <h3 className="mb-2 text-lg font-bold text-gray-800">امکانات</h3>
        <div className="h-32 w-full animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (isError && selectedFacilities.length === 0) {
    return <div className="text-red-500">خطایی در بارگذاری امکانات رخ داده است.</div>;
  }

  if (selectedFacilities.length === 0) return null;

  const facilitiesByKey = new Map(allFacilities.map((facility) => [facility.key, facility]));
  const facilities = selectedFacilities
    .map((facility) => normalizeFacility(facility, facilitiesByKey.get(facility.key)))
    .filter((facility) => facility.key || facility.label);

  return (
    <div className="px-2 pt-2">
      <h3 className="mb-2 text-lg font-bold text-gray-800">امکانات</h3>
      <div className="my-3 rounded-2xl bg-gray-50 px-3 p-1 lg:pt-2">
        <ExpandableContent
          collapsedHeight={128}
          contentClassName="grid grid-cols-1 gap-2 md:grid-cols-2"
          dir="rtl"
        >
          {facilities.map((facility) => (
            <FacilityItem key={facility.key || facility.label} facility={facility} />
          ))}
        </ExpandableContent>
      </div>
    </div>
  );
}

function FacilityItem({ facility }) {
  const { icon, label } = facility;
  const Icon = FACILITY_ICONS[facility.key] || FaCheckCircle;
  const additionalInfo = getAdditionalInfo(facility?.fields);

  return (
    <div className="m-2 flex items-center">
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

      <span className="mx-2">{label}</span>

      {additionalInfo && (
        <FacilitiesCustomIcon
          tooltipText={additionalInfo}
          className="h-4 w-4 cursor-pointer text-gray-500"
        />
      )}
    </div>
  );
}

function getAdditionalInfo(fields) {
  if (!fields || fields.length === 0) return null;

  const infoParts = fields
    .filter((field) => {
      const val = field.value;
      return !(val === false || val === null || val === "" || val === "false");
    })
    .map((field) => {
      const val = field.value;
      return val === true || val === "true"
        ? field.title
        : `${field.title}${val ? `: ${val}` : ""}`;
    });

  return infoParts.length > 0 ? infoParts.join(" - ") : null;
}

export default HouseFacilities;
