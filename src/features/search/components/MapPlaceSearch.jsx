import { fa } from "@/i18n/fa";

export default function MapPlaceSearch({
  placeQuery,
  placeResults,
  placeLoading,
  placeError,
  onQueryChange,
  onSubmit,
  onSelectPlace,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="absolute left-[6.75rem] right-3 top-2 z-[900] max-w-none md:left-24 md:right-16 md:w-auto lg:left-28 lg:right-20"
    >
      <div>
        <div className="overflow-hidden rounded-full bg-white/95 p-[5px] shadow-lg backdrop-blur dark:bg-slate-900/95">
          <div className="flex min-w-0 items-center gap-1">
            <input
              data-testid="map-place-input"
              value={placeQuery}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={fa.search.place.placeholder}
              aria-label={fa.search.place.placeholder}
              className="h-10 min-w-0 flex-1 rounded-full border border-primary-100 bg-white px-4 py-0 text-sm text-primary-900 outline-none transition placeholder:truncate focus:border-primary-500 focus:ring-1 focus:ring-primary-300 dark:border-primary-400/30 dark:bg-slate-950 dark:text-sky-50"
            />
            <button
              data-testid="map-place-submit"
              type="submit"
              className="h-10 shrink-0 rounded-full bg-primary-600 px-3 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 disabled:opacity-60"
              disabled={placeLoading}
            >
              {fa.common.actions.search}
            </button>
          </div>
        </div>

        {(placeLoading || placeError || placeResults.length > 0) && (
          <div className="mt-2 overflow-hidden rounded-xl border border-primary-100 bg-white text-sm dark:border-primary-400/30 dark:bg-slate-950">
            {placeLoading && (
              <div className="px-3 py-2 text-primary-600 dark:text-sky-100">
                {fa.search.place.loading}
              </div>
            )}

            {!placeLoading && placeError && (
              <div className="px-3 py-2 text-red-600 dark:text-red-200">
                {placeError}
              </div>
            )}

            {!placeLoading &&
              !placeError &&
              placeResults.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => onSelectPlace(place)}
                  className="block w-full border-b border-primary-50 px-3 py-2 text-right last:border-b-0 hover:bg-primary-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  <span className="block font-medium text-primary-900 dark:text-sky-50">
                    {place.title}
                  </span>
                  <span className="block truncate text-xs text-primary-500 dark:text-sky-200">
                    {place.address}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>
    </form>
  );
}
