import { forwardRef } from "react";
import clsx from "clsx";

const tones = {
  primary:
    "border-primary-100 bg-white text-primary-700 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-900 dark:border-primary-400/30 dark:bg-slate-900 dark:text-sky-100 dark:hover:bg-primary-500/15 dark:hover:text-white",
  danger:
    "border-red-100 bg-white text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-400/30 dark:bg-slate-900 dark:text-red-200 dark:hover:bg-red-500/15 dark:hover:text-red-100",
  ghost:
    "border-transparent bg-transparent text-gray-600 hover:bg-primary-50 hover:text-primary-800 dark:text-sky-100 dark:hover:bg-primary-500/15 dark:hover:text-white",
};

const sizes = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-11 w-11",
};

const IconButton = forwardRef(
  (
    {
      as: Component = "button",
      type,
      label,
      title,
      tone = "primary",
      size = "md",
      loading = false,
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isButton = Component === "button";

    return (
      <Component
        ref={ref}
        type={isButton ? type || "button" : undefined}
        title={title || label}
        aria-label={label || title}
        disabled={isButton ? disabled || loading : undefined}
        aria-disabled={!isButton && (disabled || loading) ? true : undefined}
        className={clsx(
          "btn-press inline-flex shrink-0 items-center justify-center rounded-full border shadow-sm transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-primary-200 dark:focus-visible:ring-offset-slate-950",
          tones[tone] || tones.primary,
          sizes[size] || sizes.md,
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </Component>
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;
