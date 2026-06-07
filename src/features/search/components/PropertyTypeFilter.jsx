import ToggleSwitchGroupPlain from "../../../ui/ToggleSwitchGroupPlain";

const SkeletonTogglePlain = ({ label, count = 4 }) => (
  <div className="mt-4 lg:col-span-2">
    <label className="block text-sm font-medium text-gray-500 mb-2">
      {label}
    </label>
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-2 animate-pulse select-none">
          <div className="h-6 w-6 rounded-full bg-gray-300" />
          <div className="h-4 w-20 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  </div>
);

export default function PropertyTypeFilter({
  label = "نوع اقامتگاه",
  options = [],
  fallbackOptions = [],
  selected = [],
  onToggle,              // (key: string) => void
  isLoading = false,
  isError = false,
}) {
  if (isLoading) return <SkeletonTogglePlain label={label} />;

  if (isError)
    return (
      <p className="mt-4 text-sm text-red-600">
        خطا در دریافت انواع اقامتگاه. لطفاً بعداً دوباره تلاش کنید.
      </p>
    );

  const data = options.length ? options : fallbackOptions;

  return (
    <ToggleSwitchGroupPlain
      label={label}
      options={data}
      selectedOptions={selected}
      onChange={onToggle}
    />
  );
}
