import clsx from "clsx";

const tones = {
  primary:
    "bg-primary-50 text-primary-800 ring-primary-100 dark:bg-primary-500/15 dark:text-sky-50 dark:ring-primary-400/25",
  success:
    "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-100 dark:ring-emerald-400/25",
  warning:
    "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/15 dark:text-amber-100 dark:ring-amber-400/25",
  danger:
    "bg-red-50 text-red-700 ring-red-100 dark:bg-red-500/15 dark:text-red-100 dark:ring-red-400/25",
  neutral:
    "bg-gray-50 text-gray-700 ring-gray-100 dark:bg-slate-800 dark:text-sky-100 dark:ring-white/10",
};

export default function Badge({ tone = "primary", className, children }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1",
        tones[tone] || tones.primary,
        className,
      )}
    >
      {children}
    </span>
  );
}
