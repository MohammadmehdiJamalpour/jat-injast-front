import { forwardRef } from "react";
import clsx from "clsx";

const variants = {
  primary:
    "btn-primary text-primary-contrast shadow-sm shadow-primary-500/20 hover:shadow-primary-500/30",
  secondary:
    "btn-secondary border border-primary-100 text-primary-800 hover:border-primary-200 hover:bg-primary-100 dark:border-primary-400/30 dark:bg-primary-500/10 dark:text-white dark:hover:bg-primary-500/20",
  ghost:
    "bg-transparent text-gray-700 hover:bg-primary-50 hover:text-primary-800 dark:text-sky-50 dark:hover:bg-primary-500/10 dark:hover:text-white",
  danger:
    "border border-red-100 bg-red-50 text-red-700 hover:border-red-200 hover:bg-red-100 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100 dark:hover:bg-red-500/20",
  icon:
    "bg-white text-primary-700 hover:bg-primary-50 dark:bg-slate-900 dark:text-sky-100 dark:hover:bg-slate-800",
};

const sizes = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
};

const Button = forwardRef(
  (
    {
      as: Component = "button",
      type,
      variant = "primary",
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
        disabled={isButton ? disabled || loading : undefined}
        aria-disabled={!isButton && (disabled || loading) ? true : undefined}
        className={clsx(
          "btn-press inline-flex items-center justify-center gap-2 rounded-full font-bold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-primary-200 dark:focus-visible:ring-offset-slate-950",
          variants[variant] || variants.primary,
          sizes[size] || sizes.md,
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </Component>
    );
  },
);

Button.displayName = "Button";

export default Button;
export { variants as buttonVariants, sizes as buttonSizes };
