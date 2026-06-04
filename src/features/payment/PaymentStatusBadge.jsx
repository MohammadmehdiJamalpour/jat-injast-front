import React from "react";

const fallback = { key: "none", label: "بدون پرداخت", color: "107, 114, 128" };

export default function PaymentStatusBadge({ status, className = "" }) {
  const meta = status || fallback;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}
      style={{
        backgroundColor: `rgba(${meta.color || fallback.color}, 0.12)`,
        color: `rgb(${meta.color || fallback.color})`,
      }}
    >
      {meta.label || fallback.label}
    </span>
  );
}

