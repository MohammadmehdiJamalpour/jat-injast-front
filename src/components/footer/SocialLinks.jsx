import PropTypes from "prop-types";
import clsx from "clsx";

const MIN_ITEMS = 3;

export default function SocialLinks({ socials = [], isLoading = false }) {
  const count = Math.max(MIN_ITEMS, socials.length);
  const items = Array.from({ length: count }).map((_, index) => {
    const item = socials[index];
    return {
      key: `social-${index}`,
      isSkeleton: isLoading || !item,
      ...item,
    };
  });

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
      {items.map((item) =>
        item.isSkeleton ? (
          <span
            key={item.key}
            className="h-9 w-9 animate-pulse rounded-full bg-primary-100 dark:bg-slate-800"
          />
        ) : (
          <a
            key={item.key}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.name}
            title={item.name}
            className={clsx(
              "grid h-9 w-9 place-items-center rounded-full border border-primary-100 bg-white text-primary-700 transition",
              "hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-900",
              "dark:border-slate-700 dark:bg-slate-900 dark:text-primary-200 dark:hover:border-primary-400/60 dark:hover:bg-slate-800",
            )}
          >
            {item.icon ? (
              <img
                src={item.icon}
                alt=""
                className="h-5 w-5 rounded-full object-contain"
                loading="lazy"
              />
            ) : (
              <span className="text-xs font-bold">{item.name?.slice(0, 1)}</span>
            )}
          </a>
        ),
      )}
    </div>
  );
}

SocialLinks.propTypes = {
  socials: PropTypes.array,
  isLoading: PropTypes.bool,
};
