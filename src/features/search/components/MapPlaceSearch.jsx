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
      className="absolute right-3 top-3 z-[900] w-[70%] max-w-sm sm:w-[calc(100%-1.5rem)] md:left-24 md:right-16 md:w-auto md:max-w-none lg:left-28 lg:right-20"
    >
      <div className="rounded-2xl bg-white/95 p-2 shadow-lg backdrop-blur dark:bg-slate-900/95 md:pl-4">
        <div className="flex items-center gap-2">
          <input
            data-testid="map-place-input"
            value={placeQuery}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={fa.search.place.placeholder}
            className="min-w-0 flex-1 rounded-xl border border-primary-100 bg-white px-3 py-2 text-sm text-primary-900 outline-none transition focus:border-primary-500 dark:border-primary-400/30 dark:bg-slate-950 dark:text-sky-50"
          />
          <button
            data-testid="map-place-submit"
            type="submit"
            className="shrink-0 rounded-xl bg-primary-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
          >
            {fa.common.actions.search}
          </button>
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
