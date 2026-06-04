import React from "react";
import { Disclosure } from "@headlessui/react";
import ToggleSwitchGroupPlain from "./../../../ui/ToggleSwitchGroupPlain";

/* ---------- Skeleton (no-icon grid) ---------- */
const SkeletonAmenities = ({ label, count = 6 }) => (
  <div className="mt-4 lg:col-span-2">
    <label className="block text-sm font-medium text-gray-500 mb-2">
      {label}
    </label>
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

export default function AmenitiesFilter({
  label = "امکانات اقامتگاه",
  options = [],
  fallbackOptions = [],
  selected = [],
  onToggle,             // (key: string) => void
  isLoading = false,
  isError = false,
}) {
  if (isLoading) return <SkeletonAmenities label={label} />;

  if (isError)
    return (
      <div className="mt-4 md:mt-0">
        <p className="text-sm text-red-600 mb-2">
          خطا در دریافت امکانات اقامتگاه. لطفاً بعداً دوباره تلاش کنید.
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
  const needsCollapse = data.length > 6;

  if (!needsCollapse) {
    return (
      <ToggleSwitchGroupPlain
        label={label}
        options={data}
        selectedOptions={selected}
        onChange={onToggle}
      />
    );
  }

  return (
    <div className="mt-4 md:mt-0 lg:col-span-2">
      <Disclosure>
        {({ open }) => (
          <div>
            <div className="relative">
              <Disclosure.Panel
                static
                className={`transition-[max-height] duration-300 scrollbar-thin ease-in-out
                  ${
                    open
                      ? "max-h-[1500px] lg:max-h-[50vh] lg:overflow-y-auto"
                      : "max-h-56 overflow-hidden"
                  }`}
              >
                <ToggleSwitchGroupPlain
                  label={label}
                  options={data}
                  selectedOptions={selected}
                  onChange={onToggle}
                />
              </Disclosure.Panel>

              {!open && (
                <div className="surface-fade absolute bottom-0 left-0 h-16 w-full rounded-b-2xl pointer-events-none" />
              )}
            </div>

            <div className="mt-2 text-right">
              <Disclosure.Button className="text-primary-600 hover:underline focus:outline-none">
                {open ? "بستن" : "مشاهده بیشتر …"}
              </Disclosure.Button>
            </div>
          </div>
        )}
      </Disclosure>
    </div>
  );
}
