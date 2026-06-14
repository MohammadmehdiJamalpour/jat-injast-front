import SearchHouseCard from './SearchHouseCard';
import { fa } from '@/i18n/fa';
import EmptyState from '@/ui/EmptyState';

function ListingSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl bg-white shadow-centered dark:bg-slate-900 dark:shadow-black/25">
      <div className="aspect-[4/3] w-full bg-gray-200 dark:bg-slate-800" />
      <div className="p-3 space-y-3">
        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-slate-800" />
        <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-slate-800" />
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-slate-800" />
          <div className="h-5 w-12 rounded bg-gray-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

function ListingsSection({ houses, mapExpanded, loading = false, locationLabel = "" }) {
  const hasItems = Array.isArray(houses) && houses.length > 0;

  const skeletonCount = mapExpanded ? 6 : 9;
  const Grid = ({ children }) => (
    <div
      className={`grid min-w-0 gap-4 transition-all duration-500 sm:grid-cols-2  ${
        mapExpanded ? 'grid-cols-1 md:grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
      }`}
    >
      {children}
    </div>
  );

  return (
    <div
      className="relative z-0 mt-5 min-w-0 flex-1 overflow-y-visible px-4 pt-1 md:mt-1 md:h-full md:max-h-[85vh] md:overflow-y-auto md:overscroll-contain scrollbar-thin scrollbar-no-arrows scrollbar-thumb-primary-400/70 scrollbar-track-primary-100/40"
      data-testid="search-listings-pane"
    >
      <div className="mx-auto min-w-0 md:max-w-2xl 850:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-8xl">
        <h2
          data-testid="search-listing-title"
          className="mx-1 mb-3 text-lg font-semibold text-primary-800 dark:text-sky-100 sm:mx-4"
        >
          {locationLabel
            ? fa.search.listings.titleFor(locationLabel)
            : fa.search.listings.title}
        </h2>

        {loading && (
          <Grid>
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <ListingSkeleton key={i} />
            ))}
          </Grid>
        )}

        {!loading && hasItems && (
          <Grid>
            {houses.map((house) => (
              <SearchHouseCard key={house.id} house={house} />
            ))}
          </Grid>
        )}

        {!loading && !hasItems && (
          <EmptyState
            className="mx-1 mt-6 sm:mx-4"
            title={fa.search.listings.empty}
          />
        )}
      </div>
    </div>
  );
}

export default ListingsSection;
