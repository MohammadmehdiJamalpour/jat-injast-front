import React from "react";
import toPersianNumber from "../../../utils/toPersianNumber";
import ExpandableContent from "../../../ui/ExpandableContent";

function HouseRules({ houseData }) {
  if (!houseData || !houseData.rules) {
    return null;
  }

  const rules = houseData.rules.types || [];
  const checkInTimeFrom =
    houseData.reservation?.timing?.enter?.from || "نامشخص";
  const checkInTimeto = houseData.reservation?.timing?.enter?.to || "نامشخص";
  const checkoutTime = houseData.reservation?.timing?.leave || "نامشخص";
  const additionalRules = houseData.rules.description;

  const renderRule = (rule, index) => (
    <div key={rule.key || index} className="mb-2 flex items-start">
      {rule.icon ? (
        <img src={rule.icon} alt={rule.label} className="ml-2 h-6 w-6" />
      ) : (
        <span className="ml-2 mt-2 h-2 w-2 rounded-full bg-primary-500" aria-hidden="true" />
      )}

      <p className="text-sm text-gray-700">
        {rule.label} {rule.status?.label}
        {rule.description && ` (${rule.description})`}.
      </p>
    </div>
  );

  return (
    <div className="px-2 pt-2">
      <h3 className="mb-2 text-lg font-bold text-gray-800" title="مقررات اقامتگاه">
        مقررات اقامتگاه
      </h3>

      <div className="my-4 w-full rounded-3xl bg-gray-50 px-5">
        <div className="mb-4 flex flex-col gap-3 rounded p-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <i className="icon_clock ml-2 h-6 w-6 text-gray-500"></i>
              <p className="text-sm font-bold text-gray-700">
                ساعت ورود از:
                <span className="mr-2 font-medium">
                  {toPersianNumber(checkInTimeFrom)}
                </span>
              </p>
            </div>
            <div className="flex items-center">
              <i className="icon_clock ml-2 h-6 w-6 text-gray-500"></i>
              <p className="text-sm font-bold text-gray-700">
                ساعت ورود تا:
                <span className="mr-2 font-medium">
                  {toPersianNumber(checkInTimeto)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <i className="icon_clock ml-2 h-6 w-6 text-gray-500"></i>
            <p className="text-sm font-bold text-gray-700">
              ساعت خروج:
              <span className="mr-2 font-medium">
                {toPersianNumber(checkoutTime)}
              </span>
            </p>
          </div>
        </div>

        <ExpandableContent
          collapsedHeight={128}
          contentClassName="flex flex-col pb-1"
          dir="rtl"
          buttonClassName="text-primary-600 hover:underline focus:outline-none"
        >
          {rules.map((rule, index) => renderRule(rule, index))}

          {additionalRules && (
            <div className="mt-4">
              <div className="flex items-start">
                <i className="icon_edit-paper ml-2 h-6 w-6 text-gray-500"></i>
                <p className="text-sm text-gray-700">سایر مقررات</p>
              </div>
              <ul className="mt-2 list-inside list-disc">
                {additionalRules.split("\n").map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ExpandableContent>
      </div>
    </div>
  );
}

export default HouseRules;
