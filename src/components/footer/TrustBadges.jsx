import PropTypes from "prop-types";
import clsx from "clsx";

export default function TrustBadges({ icons = [], isLoading = false }) {
  if (!icons.length && !isLoading) return null;

  const items = isLoading ? Array.from({ length: 3 }) : icons.slice(0, 3);

  return (
    <div className="flex items-center justify-center gap-2 sm:justify-start">
      {items.map((icon, index) => (
        <div
          key={index}
          className={clsx(
            "grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-primary-100 bg-white p-1.5 dark:border-slate-700 dark:bg-slate-900",
            isLoading && "animate-pulse bg-primary-100 dark:bg-slate-800",
          )}
        >
          {!isLoading && (
            <img
              src={icon}
              alt="نماد اعتماد"
              className="h-full w-full object-contain"
              loading="lazy"
            />
          )}
        </div>
      ))}
    </div>
  );
}

TrustBadges.propTypes = {
  icons: PropTypes.array,
  isLoading: PropTypes.bool,
};
