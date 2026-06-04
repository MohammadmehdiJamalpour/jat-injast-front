import React from "react";
import { Switch } from "@headlessui/react";

const ToggleSwitchGroupPlain = ({ label, options, selectedOptions, onChange }) => (
  <div className="mt-2 lg:mt-0 lg:col-span-2">
    <label className="block   text-primary-800 font-bold  mb-3">
      {label}
    </label>

    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => (
        <Switch.Group key={option.key} as="div" className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            {/* round switch */}
            <Switch
              checked={selectedOptions.includes(option.key)}
              onChange={() => onChange(option.key)}
              className={`relative inline-flex items-center h-6 w-6 border border-primary-600 rounded-full transition-colors duration-200 ml-1
                ${selectedOptions.includes(option.key) ? "bg-primary-600" : "bg-gray-200"}`}
            >
              {selectedOptions.includes(option.key) && (
                <svg
                  className="w-4 h-4 text-white absolute inset-0 m-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </Switch>

            {/* text label only */}
            <span className="ml-1 text-sm font-medium text-gray-700">{option.label}</span>
          </label>
        </Switch.Group>
      ))}
    </div>
  </div>
);

export default ToggleSwitchGroupPlain;
