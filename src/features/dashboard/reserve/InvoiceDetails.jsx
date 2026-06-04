// =============================
// =============================
import React from "react";
import toPersianNumber from "../../../utils/toPersianNumber";

export default function InvoiceDetails({ invoice }) {
  if (!invoice) return null;

  const bills = invoice.bills || [];

  return (
    /* 👇  added h-full flex flex-col so it can stretch */
    <div className="border border-primary-500 p-4 rounded-3xl h-full flex flex-col">
      <h3 className="font-bold text-lg mb-2">جزئیات مالی</h3>

      {bills.length > 0 ? (
        <div className="space-y-1 flex-grow">
          {bills.map((bill, idx) => (
            <div key={idx} className="flex items-center justify-between py-1">
              <span>{bill.title}</span>
              <span className="font-semibold">
                {bill.final_price !== null
                  ? `${toPersianNumber(bill.final_price)} ریال`
                  : ""}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="flex-grow">هیچ جزئیاتی برای فاکتور یافت نشد</p>
      )}

      {/* footer rows */}
      {invoice.commission > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span>کمیسیون جات اینجاست:</span>
          <span>{toPersianNumber(invoice.commission)} ریال</span>
        </div>
      )}
      {invoice.host_stoke > 0 && (
        <div className="flex items-center justify-between">
          <span>سهم میزبان:</span>
          <span>{toPersianNumber(invoice.host_stoke)} ریال</span>
        </div>
      )}
      {invoice.total > 0 && (
        <div className="flex items-center justify-between border-t mt-2 pt-2">
          <span>مجموع پرداختی:</span>
          <span className="font-bold">
            {toPersianNumber(invoice.total)} ریال
          </span>
        </div>
      )}
    </div>
  );
}
