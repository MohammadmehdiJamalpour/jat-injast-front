import clsx from "clsx";

export default function ScrollablePanel({
  as: Component = "div",
  maxHeight,
  className,
  children,
  ...props
}) {
  return (
    <Component
      style={maxHeight ? { maxHeight } : undefined}
      className={clsx(
        "overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary-300 scrollbar-thumb-rounded-full dark:scrollbar-thumb-primary-500/70",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
