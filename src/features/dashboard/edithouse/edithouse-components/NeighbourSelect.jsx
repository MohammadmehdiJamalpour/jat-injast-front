// src/ui/NeighbourSelect.jsx

import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function NeighbourSelect({
  label,
  name,
  value,
  onChange,
  options,
  errorMessages,
}) {
  const selectedOption = options.find((option) => option.key === value) || null;

  return (
    <div className="w-full">
      <label className="block font-medium text-gray-700 mb-2">{label}</label>
      <Listbox
        value={selectedOption}
        onChange={(val) => onChange(name, val.key)}
      >
        {({ open }) => (
          <div className="relative bg-white rounded-xl">
            <Listbox.Button className="listbox__button">
              <div className="flex items-center">
                {selectedOption && selectedOption.icon && (
                  <img
                    src={selectedOption.icon}
                    alt=""
                    className="h-5 w-5 ml-2"
                  />
                )}
                <span>
                  {selectedOption ? selectedOption.label : "انتخاب کنید"}
                </span>
              </div>
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 absolute left-2 top-1/2 transform -translate-y-1/2 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
              />
            </Listbox.Button>

            <Transition as={Fragment}>
              <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.key}
                    value={option}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                        active
                          ? "bg-secondary-100 text-secondary-700"
                          : "text-gray-900"
                      }`
                    }
                  >
                    <div className="flex items-center">
                      {option.icon && (
                        <img
                          src={option.icon}
                          alt=""
                          className="h-5 w-5 ml-2"
                        />
                      )}
                      <span className="block truncate font-normal">
                        {option.label}
                      </span>
                    </div>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
      {errorMessages && (
        <p className="mt-2 text-sm text-red-600">{errorMessages[0]}</p>
      )}
    </div>
  );
}

export default NeighbourSelect;
