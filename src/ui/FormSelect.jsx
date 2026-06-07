import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

/**
 * @param {boolean} compact  – optional. When true the control is shorter.
 */
function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  errorMessages,
  compact = false,
}) {
  const selectedOption =
    options.find((option) => option.value === value) || null;

  const buttonSizeClasses = compact ? "h-10 py-1" : "";
  const optionsSizeClasses = compact ? "max-h-48" : "max-h-60";

  return (
    <div className="w-full z-20">
      <label className="block font-medium text-gray-700 mb-2">{label}</label>

      <Listbox value={selectedOption} onChange={(val) => onChange(name, val.value)}>
        {({ open }) => (
          <div className="relative shadow-centered shadow-primary-50 text-primary-800 rounded-3xl">
            <Listbox.Button className={`listbox__button ${buttonSizeClasses}`}>
              <span>
                {selectedOption ? selectedOption.label : "انتخاب کنید"}
              </span>
              <ChevronDownIcon
                className={`h-5 w-5 text-primary-600 transition-transform duration-200 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
              />
            </Listbox.Button>

            <Transition as={Fragment}>
              <Listbox.Options
                className={`absolute z-50 w-full scrollbar-thin mt-1 bg-white border  rounded-3xl shadow-centered border-primary-200 overflow-y-auto ${optionsSizeClasses}`}
              >
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    className={({ active }) =>
                      `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                        active
                          ? "bg-primary-50/50 text-primary-800"
                          : "text-gray-900"
                      }`
                    }
                  >
                    <span className="block truncate font-normal">
                      {option.label}
                    </span>
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

export default FormSelect;
