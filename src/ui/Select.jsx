import { useId } from "react";
import clsx from "clsx";
import { fa } from "../i18n/fa";

export default function Select({
  id,
  label,
  helper,
  error,
  options = [],
  placeholder = fa.common.actions.select,
  dir = "rtl",
  className,
  selectClassName,
  value,
  onChange,
  ...props
}) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className={clsx("space-y-2 text-right", className)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-bold text-gray-800 dark:text-sky-50">
          {label}
        </label>
      )}
      <select
        id={selectId}
        dir={dir}
        value={value ?? ""}
        onChange={onChange}
        aria-invalid={error ? true : undefined}
        className={clsx(
          "field-surface w-full text-right text-gray-800 dark:text-sky-50",
          error && "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-400/50",
          selectClassName,
        )}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(helper || error) && (
        <p
          className={clsx(
            "text-xs",
            error ? "text-red-600 dark:text-red-200" : "text-gray-500 dark:text-sky-100/65",
          )}
        >
          {error || helper}
        </p>
      )}
    </div>
  );
}
