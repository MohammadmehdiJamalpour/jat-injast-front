import { forwardRef, useId } from "react";
import clsx from "clsx";

const Textarea = forwardRef(
  (
    {
      id,
      label,
      helper,
      error,
      dir = "rtl",
      rows = 4,
      className,
      textareaClassName,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className={clsx("space-y-2 text-right", className)}>
        {label && (
          <label htmlFor={textareaId} className="text-sm font-bold text-gray-800 dark:text-sky-50">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          dir={dir}
          rows={rows}
          aria-invalid={error ? true : undefined}
          className={clsx(
            "field-surface min-h-28 w-full resize-y text-right placeholder:text-gray-400 dark:placeholder:text-sky-100/40",
            error && "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-400/50",
            textareaClassName,
          )}
          {...props}
        />
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
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
