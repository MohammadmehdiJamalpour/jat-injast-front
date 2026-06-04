import { useMemo } from "react";
import PropTypes from "prop-types";
import Pill from "./Pill";

export default function CityBadges({ citiesByZone = [], isLoading = false }) {
  const cityList = useMemo(
    () => citiesByZone.flatMap((zone) => zone.cities || []),
    [citiesByZone],
  );

  const items = isLoading
    ? Array.from({ length: 12 }).map((_, index) => ({ key: index, isSkeleton: true }))
    : cityList.slice(0, 18).map((city) => ({
        key: city.id || city.name,
        label: city.name,
        isSkeleton: false,
      }));

  if (!items.length) return null;

  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-primary-900 dark:text-slate-100">
          شهرهای پرطرفدار
        </h3>
        <span className="hidden h-px flex-1 bg-primary-100 dark:bg-slate-800 sm:block" />
      </div>

      <div className="flex max-h-24 flex-wrap gap-2 overflow-hidden">
        {items.map(({ key, label, isSkeleton }) => (
          <Pill key={key} isLoading={isSkeleton}>
            {label}
          </Pill>
        ))}
      </div>
    </section>
  );
}

CityBadges.propTypes = {
  citiesByZone: PropTypes.array,
  isLoading: PropTypes.bool,
};
