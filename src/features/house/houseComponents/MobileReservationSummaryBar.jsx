import Loading from "../../../ui/Loading";
import toPersianNumber from "../../../utils/toPersianNumber";

function MobileReservationSummaryBar({ firstValidPrice, onToggle }) {
  return (
    <button
      type="button"
      className="flex min-h-16 w-full min-w-0 cursor-pointer items-center justify-between gap-3 pb-4 text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
      onClick={onToggle}
      aria-expanded="false"
    >
      <div className="flex min-w-0 flex-1 flex-wrap gap-2 rounded-3xl px-3 py-1.5 text-primary-800 dark:text-sky-100">
        <p className="font-bold xs:text-lg">قیمت هر شب از :</p>
        {!firstValidPrice ? (
          <div className="flex items-center justify-center">
            <Loading type="beat" size={6} color="primary" />
          </div>
        ) : (
          <p className="min-w-0 break-words font-bold xs:text-lg">
            {toPersianNumber(firstValidPrice.toLocaleString())}
          </p>
        )}
      </div>

      <span className="btn min-h-10 shrink-0 bg-primary-600 px-4 py-2 text-xs xs:text-md">
        رزرو اقامتگاه
      </span>
    </button>
  );
}

export default MobileReservationSummaryBar;
