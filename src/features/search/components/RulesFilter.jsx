import { Disclosure, Switch } from "@headlessui/react";
import { expandableButtonClassName } from "../../../ui/ExpandableContent";

const SkeletonRules = ({ label, count = 6 }) => (
  <div className="mt-2 md:mt-0 lg:col-span-2">
    <label className="block text-sm font-medium text-gray-500 mb-3">{label}</label>
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-2 animate-pulse select-none">
          <div className="h-6 w-6 rounded-full bg-gray-300" />
          <div className="h-4 w-32 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  </div>
);

function RulesSwitchList({ options, selected, onToggle }) {
  return (
    <div className="space-y-3">
      {options.map((opt) => (
        <Switch.Group key={opt.key} as="div" className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <Switch
              checked={selected.includes(opt.key)}
              onChange={() => onToggle(opt.key)}
              className={`relative inline-flex items-center ml-1.5 h-6 w-6 border border-primary-600 rounded-full transition-colors duration-200
                ${selected.includes(opt.key) ? "bg-primary-600" : "bg-gray-200"}`}
            >
              {selected.includes(opt.key) && (
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
            <span className="text-sm font-medium text-gray-700">{opt.label}</span>
          </label>
        </Switch.Group>
      ))}
    </div>
  );
}

export default function RulesFilter({
  label = "مقررات اقامتگاه",
  options = [],
  fallbackOptions = [],
  selected = [],
  onToggle,             // (key: string) => void
  isLoading = false,
  isError = false,
}) {
  if (isLoading) return <SkeletonRules label={label} />;

  if (isError)
    return (
      <div className="mt-2 md:mt-0">
        <p className="text-sm text-red-600 mb-2">
          خطا در دریافت مقررات اقامتگاه. لطفاً بعداً دوباره تلاش کنید.
        </p>
        <RulesSwitchList options={fallbackOptions} selected={selected} onToggle={onToggle} />
      </div>
    );

  const data = options.length ? options : fallbackOptions;
  const needsCollapse = data.length > 6;

  if (!needsCollapse) {
    return (
      <div className="mt-2 md:mt-0 lg:col-span-2">
        <label className="block text-primary-800 font-bold mb-3">{label}</label>
        <RulesSwitchList options={data} selected={selected} onToggle={onToggle} />
      </div>
    );
  }

  return (
    <div className="mt-2 md:mt-0 lg:col-span-2">
      <Disclosure>
        {({ open }) => (
          <div>
            <div className="relative">
              <Disclosure.Panel
                static
                className={`transition-[max-height] duration-300 ease-in-out
                  ${open ? "max-h-[90vh] lg:max-h-[50vh] lg:overflow-y-auto" : "max-h-56 overflow-hidden"}`}
              >
                <label className="block text-primary-800 font-bold mb-3">{label}</label>
                <RulesSwitchList options={data} selected={selected} onToggle={onToggle} />
              </Disclosure.Panel>

              {!open && (
                <div className="surface-fade absolute bottom-0 left-0 h-16 w-full rounded-b-2xl pointer-events-none" />
              )}
            </div>

            <div className="mt-2 text-right">
              <Disclosure.Button className={expandableButtonClassName}>
                {open ? "بستن" : "مشاهده بیشتر..."}
              </Disclosure.Button>
            </div>
          </div>
        )}
      </Disclosure>
    </div>
  );
}
