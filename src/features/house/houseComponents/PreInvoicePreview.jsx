import React from "react";
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
  /* ─────────────── loading */
  if (preInvoiceLoading) {
    return <PreInvoiceSkeleton />;
  }

  /* ─────────────── error */
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

  /* ─────────────── no-data (but not an error) */
  if (!preInvoiceData) return null;

  /* ─────────────── success UI */
  return (
    <div className="border rounded-3xl py-2 px-3 xs:px-4 bg-gray-50 mt-2">
      {/* bills list */}
      {preInvoiceData?.data?.bills?.map((bill, i) => (
        <div
          key={i}
          className="flex justify-between text-xs sm:text-sm md:text-xs lg:text-sm truncate items-center border-b last:border-none py-1.5"
        >
          <span className="text-gray-700">
            {bill.title}
            {bill.nights ? ` (${bill.nights} شب)` : ""}
            {bill.persons ? ` - ${bill.persons} نفر` : ""}
          </span>
          <span className={bill.is_discount ? "text-red-600" : ""}>
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
        <div className="flex justify-between pt-2 mt-2 text-sm sm:text-md md:text-sm lg:text-md">
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
