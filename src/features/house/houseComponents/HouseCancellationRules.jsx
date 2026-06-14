import ExpandableContent from "../../../ui/ExpandableContent";
import { htmlToPlainText } from "../../../utils/htmlText";

function HouseCancellationRules({ houseData }) {
  if (!houseData || !houseData.cancellation_rule) {
    return null;
  }

  const { title, guest_description } = houseData.cancellation_rule;
  const guestDescription = htmlToPlainText(guest_description);

  return (
    <div className="px-3 pt-2">
      <h3 className="mb-2 text-lg font-bold text-gray-800" title="مقررات لغو رزرو">
        مقررات لغو رزرو
      </h3>

      <div className="my-3 rounded-2xl bg-gray-50 px-3 p-1 lg:pt-2">
        <ExpandableContent collapsedHeight={128} contentClassName="text-sm text-gray-700" dir="rtl">
          <strong>سیاست {title}: </strong>
          <span className="whitespace-pre-line">{guestDescription}</span>
        </ExpandableContent>
      </div>
    </div>
  );
}

export default HouseCancellationRules;
