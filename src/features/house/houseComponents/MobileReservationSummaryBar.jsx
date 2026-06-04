import Loading from "../../../ui/Loading";
import toPersianNumber from "../../../utils/toPersianNumber";

function MobileReservationSummaryBar({ firstValidPrice, onToggle }) {
  return (
    <div
      className="flex w-full cursor-pointer items-center justify-between pb-4"
      onClick={onToggle}
    >
      <div className="flex gap-2 rounded-3xl px-3 py-1.5 text-primary-800 xs:mr-10">
        <p className="font-bold xs:text-lg">قیمت هر شب از :</p>
        {!firstValidPrice ? (
          <div className="flex items-center justify-center">
            <Loading type="beat" size={6} color="primary" />
          </div>
        ) : (
          <p className="font-bold xs:text-lg">
            {toPersianNumber(firstValidPrice.toLocaleString())}
          </p>
        )}
      </div>

      <button className="btn bg-primary-600 px-4 py-2 text-xs xs:text-md">
        رزرو اقامتگاه
      </button>
    </div>
  );
}

export default MobileReservationSummaryBar;
