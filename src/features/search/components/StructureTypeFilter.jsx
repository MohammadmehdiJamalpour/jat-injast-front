import React from "react";
import ToggleSwitchGroupPlain from "../../../ui/ToggleSwitchGroupPlain";

/* ---------- Skeleton ---------- */
const SkeletonStructure = ({ label, count = 6 }) => (
  <div className="mt-4 md:mt-0 lg:col-span-2">
    <label className="block text-sm font-medium text-gray-500 mb-2">{label}</label>
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-2 animate-pulse select-none">
          <div className="h-6 w-6 rounded-full bg-gray-300" />
          <div className="h-4 w-24 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  </div>
);

export default function StructureTypeFilter({
  label = "نوع سازه",
  options = [],
  fallbackOptions = [],
  selected = [],
  onToggle,              // (key: string) => void
  isLoading = false,
  isError = false,
}) {
  if (isLoading) return <SkeletonStructure label={label} />;

  if (isError)
    return (
      <div className="mt-4">
        <p className="text-sm text-red-600 mb-2">
          خطا در دریافت نوع سازه. لطفاً بعداً دوباره تلاش کنید.
        </p>
        <ToggleSwitchGroupPlain
          label={`${label} (آفلاین)`}
          options={fallbackOptions}
          selectedOptions={selected}
          onChange={onToggle}
        />
      </div>
    );

  const data = options.length ? options : fallbackOptions;

  return (
    <div className="mt-4 lg:col-span-2">
      {/* scroll container */}
      <div className="max-h-[90vh] lg:max-h-[50vh] overflow-y-auto pr-1">
        <ToggleSwitchGroupPlain
          label={label}
          options={data}
          selectedOptions={selected}
          onChange={onToggle}
        />
      </div>
    </div>
  );
}
