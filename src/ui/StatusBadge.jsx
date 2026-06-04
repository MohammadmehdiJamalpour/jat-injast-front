import Badge from "./Badge";

const toneByStatus = {
  paid: "success",
  success: "success",
  accepted: "success",
  published: "success",
  pending: "warning",
  created: "warning",
  draft: "neutral",
  failed: "danger",
  rejected: "danger",
  canceled: "danger",
  refunded: "neutral",
};

const labelByStatus = {
  paid: "پرداخت شده",
  success: "موفق",
  accepted: "تایید شده",
  published: "منتشر شده",
  pending: "در انتظار",
  created: "ایجاد شده",
  draft: "پیش نویس",
  failed: "ناموفق",
  rejected: "رد شده",
  canceled: "لغو شده",
  refunded: "بازگشت داده شده",
};

export default function StatusBadge({ status, label, className }) {
  const key = String(status || "").toLowerCase();
  return (
    <Badge tone={toneByStatus[key] || "neutral"} className={className}>
      {label || labelByStatus[key] || status || "نامشخص"}
    </Badge>
  );
}
