import { forwardRef, useId } from "react";
import clsx from "clsx";

const Input = forwardRef(
  (
    {
      id,
      label,
      helper,
      error,
      dir = "rtl",
      className,
      inputClassName,
      type = "text",
      ...props
    },
    ref,
  ) => {
    const reactId = useId();
    const inputId = id || reactId;

    return (
      <div className={clsx("space-y-2 text-right", className)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-bold text-gray-800 dark:text-sky-50">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          dir={dir}
          aria-invalid={error ? true : undefined}
          className={clsx(
            "field-surface w-full text-right placeholder:text-gray-400 dark:placeholder:text-sky-100/40",
            error && "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-400/50",
            inputClassName,
          )}
          {...props}
        />
        {(helper || error) && (
          <p className={clsx("text-xs", error ? "text-red-600 dark:text-red-200" : "text-gray-500 dark:text-sky-100/65")}>
            {error || helper}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
