import PropTypes from "prop-types";
import clsx from "clsx";

export default function Pill({ children, className, isLoading = false }) {
  return (
    <span
      className={clsx(
        "inline-flex max-w-full items-center justify-center truncate rounded-full border px-3 py-1 text-xs font-medium transition",
        "border-primary-100 bg-white/80 text-primary-800 hover:border-primary-300 hover:bg-white",
        "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-primary-400/60 dark:hover:bg-slate-800",
        className,
        isLoading && "h-7 w-20 animate-pulse bg-primary-100 text-transparent dark:bg-slate-800",
      )}
    >
      {isLoading ? "\u00A0" : children}
    </span>
  );
}

Pill.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
};
