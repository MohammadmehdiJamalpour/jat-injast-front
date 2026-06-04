import React from "react";
import { TicketIcon } from "@heroicons/react/24/outline"; // <-- Heroicons
import toPersianNumber from "../../../utils/toPersianNumber";

function HouseDiscountDetails({ houseData }) {
  const discountData = houseData?.reservation?.discount;
  if (!discountData) return null;

  const { short_term, long_term } = discountData;

  // If neither discount is present, render nothing
  if (!short_term && !long_term) return null;

  return (
    <div className="px-4 mb-4 pt-2">
      <h3 className="text-lg font-bold text-gray-800 mb-3">تخفیف‌ها</h3>

<div className="flex flex-col ">
      {/* Short-term discount */}
      {short_term?.discount && (
        <div className="flex items-center gap-2 text-primary-500 mb-2">
          <TicketIcon className="w-10 xs:w-12 sm:w-16 h-10 xs:h-12 sm:h-16 " />
          <p>
            <span className="font-semibold text-sm text-md">تخفیف کوتاه‌مدت:</span>{" "}
            {toPersianNumber(short_term.discount)} %
            {"  "}
            <span className="text-gray-500 text-xs sm:text-sm">
              (حداقل اقامت: {toPersianNumber(short_term.minimum_length_stay)} شب)
            </span>
          </p>
        </div>
      )}

      {/* Long-term discount */}
      {long_term?.discount && (
        <div className="flex items-center gap-2 text-primary-500">
          <TicketIcon className="w-10 xs:w-12 sm:w-16 h-10 xs:h-12 sm:h-16 " />
          <p>
            <span className="font-semibold text-sm text-md  ">تخفیف بلندمدت:</span>{" "}
            {toPersianNumber(long_term.discount)} %
            {"  "}
            <span className="text-gray-500 text-xs sm:text-sm">
              (حداقل اقامت: {toPersianNumber(long_term.minimum_length_stay)} شب)
            </span>
          </p>
        </div>
      )}
      </div>
    </div>
  );
}

export default HouseDiscountDetails;
