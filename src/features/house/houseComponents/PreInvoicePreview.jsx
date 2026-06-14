import PreInvoiceSkeleton from "./PreInvoiceSkeleton";
import toPersianNumber from "../../../utils/toPersianNumber";

/**
 * Props
 * ─ preInvoiceLoading : boolean
 * ─ preInvoiceError   : string | Error | null
 * ─ preInvoiceData    : object | null
 */
function PreInvoicePreview({
  preInvoiceLoading,
  preInvoiceError,
  preInvoiceData,
}) {
  if (preInvoiceLoading) {
    return <PreInvoiceSkeleton />;
  }

  if (preInvoiceError) {
    // Normalise the error into a plain string
    const msg =
      typeof preInvoiceError === "string"
        ? preInvoiceError
        : preInvoiceError?.message || "خطایی رخ داده است!";

    return (
      <div className="text-red-600 font-bold my-3 text-center">{msg}</div>
    );
  }

  if (!preInvoiceData) return null;

  return (
    <div className="mt-2 rounded-3xl border bg-gray-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950 xs:px-4">
      {/* bills list */}
      {preInvoiceData?.data?.bills?.map((bill, i) => (
        <div
          key={i}
          className="flex min-w-0 items-start justify-between gap-3 border-b py-1.5 text-xs last:border-none dark:border-slate-800 sm:text-sm md:text-xs lg:text-sm"
        >
          <span className="min-w-0 break-words text-gray-700 dark:text-sky-100">
            {bill.title}
            {bill.nights ? ` (${bill.nights} شب)` : ""}
            {bill.persons ? ` - ${bill.persons} نفر` : ""}
          </span>
          <span className={`shrink-0 text-left ${bill.is_discount ? "text-red-600 dark:text-red-300" : "dark:text-sky-50"}`}>
            {bill.final_price
              ? `${toPersianNumber(
                  bill.final_price.toLocaleString()
                )} تومان`
              : ""}
          </span>
        </div>
      ))}

      {/* total */}
      {preInvoiceData?.total && (
        <div className="mt-2 flex min-w-0 justify-between gap-3 pt-2 text-sm sm:text-md md:text-sm lg:text-md">
          <span className="font-bold">مجموع</span>
          <span className="font-bold text-primary-700">
            {toPersianNumber(preInvoiceData.total.toLocaleString())} تومان
          </span>
        </div>
      )}
    </div>
  );
}

export default PreInvoicePreview;
