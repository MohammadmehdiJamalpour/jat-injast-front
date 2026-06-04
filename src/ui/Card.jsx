import clsx from "clsx";

const variants = {
  surface:
    "border-primary-100 bg-white text-gray-950 shadow-sm shadow-primary-50/50 dark:border-slate-800 dark:bg-slate-950/55 dark:text-sky-50 dark:shadow-black/20",
  bordered:
    "border-primary-200 bg-white text-gray-950 dark:border-primary-400/35 dark:bg-slate-950/55 dark:text-sky-50",
  interactive:
    "border-primary-100 bg-white text-gray-950 shadow-sm shadow-primary-50/60 transition hover:border-primary-200 hover:shadow-centered dark:border-slate-800 dark:bg-slate-950/55 dark:text-sky-50 dark:shadow-black/20 dark:hover:border-primary-400/50",
  glass:
    "border-white/55 bg-white/70 text-gray-950 shadow-sm shadow-primary-50/40 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/45 dark:text-sky-50 dark:shadow-black/20",
};

export default function Card({
  as: Component = "div",
  variant = "surface",
  padding = "p-4",
  radius = "rounded-3xl",
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={clsx("border", variants[variant] || variants.surface, radius, padding, className)}
      {...props}
    >
      {children}
    </Component>
  );
}
