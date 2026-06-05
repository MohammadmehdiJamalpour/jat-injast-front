import React from "react";
import toPersianNumber from "../../../utils/toPersianNumber";

export default function ReserveDetailsPanel({ reserve }) {
  if (!reserve) return null;

  const address = reserve.house?.address || {};
  const locationName = address.village || address.city?.name || "نامشخص";

  return (
    <div className="border border-primary-500 p-4 rounded-3xl space-y-2 w-full">
      <div>
        <strong>وضعیت رزرو:</strong> {reserve.status?.label || "نامشخص"}
      </div>
      <div>
        <strong>مهمان:</strong> {reserve.guest?.name || "ناشناس"}
      </div>
      <div>
        <strong>نام اقامتگاه:</strong> {reserve.house?.name || "نامشخص"}
      </div>
      <div>
        <strong>محل اقامتگاه:</strong> {locationName}
      </div>
      <div>
        <strong>توضیح تاریخ رزرو:</strong>{" "}
        {toPersianNumber(reserve.reserve?.locale_format) || "نامشخص"}
      </div>
      <div>
        <strong>تاریخ ورود:</strong>{" "}
        {toPersianNumber(reserve.reserve?.checkin?.date_persian) || "نامشخص"}
      </div>
      <div>
        <strong>تاریخ خروج:</strong>{" "}
        {toPersianNumber(reserve.reserve?.checkout?.date_persian) || "نامشخص"}
      </div>
      <div>
        <strong>تعداد شب‌ها:</strong>{" "}
        {toPersianNumber(reserve.reserve?.nights) ?? "نامشخص"}
      </div>
      <div>
        <strong>تعداد نفرات:</strong>{" "}
        {toPersianNumber(reserve.guests?.normal_person_count) || 0}
        {reserve.guests?.extra_person_count > 0 &&
          ` + ${toPersianNumber(reserve.guests.extra_person_count)} نفر اضافه`}
      </div>
      {reserve.links?.voucher && (
        <div className="flex justify-end">
          <a
            href={reserve.links.voucher}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-primary-500 text-white rounded-3xl text-sm hover:bg-primary-600"
          >
            اجاره‌نامه
          </a>
        </div>
      )}
    </div>
  );
}
