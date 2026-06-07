import ToggleSwitchGroupPlain from "../../../ui/ToggleSwitchGroupPlain";

const SkeletonOwnership = ({ label, count = 4 }) => (
  <div className="mt-2 md:mt-0 lg:col-span-2">
    <label className="block text-sm font-medium text-gray-500 mb-3">{label}</label>
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

export default function OwnershipTypeFilter({
  label = "نوع مالکیت",
  options = [],
  fallbackOptions = [],
  selected = [],
  onToggle,              // (key: string) => void
  isLoading = false,
  isError = false,
}) {
  if (isLoading) return <SkeletonOwnership label={label} />;

  if (isError)
    return (
      <div className="mt-2 md:mt-0">
        <p className="text-sm text-red-600 mb-2">
          خطا در دریافت نوع مالکیت. لطفاً بعداً دوباره تلاش کنید.
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
    <div className="mt-2 md:mt-0 lg:col-span-2">
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
