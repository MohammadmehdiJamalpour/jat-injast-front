import React from "react";
import { Switch } from "@headlessui/react";

const ToggleSwitch = ({ checked, onChange, label, icon }) => (
  <Switch.Group
    as="div"
    className="flex items-center space-x-2  cursor-pointer ml-3"
  >
    <label className="flex items-center space-x-2 cursor-pointer">
      <Switch
        checked={checked}
        onChange={() => {
          onChange(!checked);
        }}
        className={`relative inline-flex items-center h-6 w-6 ml-1 rounded-full transition-colors ease-in-out duration-200 ${
          checked ? "bg-primary-600" : "bg-gray-200"
        }`}
      >
        {checked && (
          <svg
            className="w-4 h-4 text-white absolute inset-0 m-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </Switch>
      {icon && <img src={icon} alt={label} className="w-5 h-5" />}
      {label && (
        <span className="ml-1 text-sm font-medium text-gray-700">{label}</span>
      )}
    </label>
  </Switch.Group>
);

export default ToggleSwitch;
