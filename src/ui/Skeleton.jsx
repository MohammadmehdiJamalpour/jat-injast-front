import clsx from "clsx";

const variants = {
  line: "h-4 w-full rounded-full",
  block: "h-24 w-full rounded-3xl",
  card: "h-48 w-full rounded-3xl",
  avatar: "h-14 w-14 rounded-full",
  table: "h-12 w-full rounded-2xl",
};

export default function Skeleton({ variant = "line", className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "animate-pulse bg-primary-100/70 dark:bg-slate-800/70",
        variants[variant] || variants.line,
        className,
      )}
    />
  );
}
