import React from 'react';
import SearchHouseCard from './SearchHouseCard';
import { fa } from '@/i18n/fa';

function ListingSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white shadow-centered animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-200" />
      <div className="p-3 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-5 bg-gray-200 rounded w-12" />
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
      className={`grid gap-4 transition-all duration-500 sm:grid-cols-2  ${
        mapExpanded ? 'grid-cols-1 md:grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
      }`}
    >
      {children}
    </div>
  );

  return (
    <div className="flex-1 px-4 pt-2 mt-9 md:mt-1 md:h-full overflow-y-visible md:overflow-y-auto scrollbar-thin scrollbar-thumb-primary-400/70 scrollbar-track-primary-100/40 scrollbar-no-arrows md:max-h-[85vh] overscroll-contain">
      <div className="md:max-w-2xl 850:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-8xl mx-auto">
        <h2
          data-testid="search-listing-title"
          className="text-lg mx-4 font-semibold mb-3 text-primary-800 dark:text-sky-100"
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
          <div className="mx-4 mt-6 text-sm text-primary-600 bg-primary-50 border border-primary-100 rounded-2xl p-4">
            {fa.search.listings.empty}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListingsSection;
