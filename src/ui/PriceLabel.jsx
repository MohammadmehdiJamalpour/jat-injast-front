import toPersianNumber from "../utils/toPersianNumber";

export default function PriceLabel({ value, currency = "تومان", className = "" }) {
  const amount = Number(value || 0).toLocaleString();

  return (
    <span className={className}>
      {toPersianNumber(amount)} {currency}
    </span>
  );
}
