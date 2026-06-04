import { useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";

import VendorCalendar from "../calendar/VendorCalendar";
import Button from "../../ui/Button";
import IconButton from "../../ui/IconButton";

const STRUCTURE_LABELS = {
  villa: "ویلا",
  apartment: "آپارتمان",
  cottage: "کلبه",
  ecolodge: "اقامتگاه بوم گردی",
};

const STATUS_LABELS = {
  draft: "پیش نویس",
  pending: "در انتظار بررسی",
  published: "منتشر شده",
  publish: "منتشر شده",
  accepted: "تایید شده",
  rejected: "رد شده",
};

function getKey(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.key || value.value || "";
}

function getLabel(value, fallbackLabels) {
  const key = getKey(value);
  if (value && typeof value === "object") {
    return value.label || value.title || fallbackLabels[key] || key || "نامشخص";
  }
  return fallbackLabels[key] || key || "نامشخص";
}

export default function HouseCard({ house, onDelete, isDeleting }) {
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [reserveDateFrom, setReserveDateFrom] = useState(null);
  const [reserveDateTo, setReserveDateTo] = useState(null);

  const statusKey = getKey(house.status).toLowerCase();
  const isPublished = statusKey === "published" || statusKey === "publish";
  const imageSrc = house.image || house.main_image?.image || "/assets/jat-injast-badge.svg";

  const detailRows = [
    { label: "نام", value: house.name || "اقامتگاه بدون نام" },
    { label: "نوع اقامتگاه", value: getLabel(house.structure, STRUCTURE_LABELS) },
    { label: "وضعیت", value: getLabel(house.status, STATUS_LABELS) },
  ];

  return (
    <div className="house-card-container group overflow-hidden shadow-sm shadow-primary-50/70 transition duration-300 hover:border-primary-200 hover:shadow-centered dark:shadow-black/25 dark:hover:border-primary-400/60">
      <div className="house-info-container">
        <div className="space-y-1">
          {detailRows.map((row) => (
            <div key={row.label} className="info-item">
              <span className="info-label">{row.label}:</span>
              <span className="info-value">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="action-buttons-container mt-auto">
          <div className={`grid w-full gap-2 ${isPublished ? "grid-cols-2" : "grid-cols-1"}`}>
            <Button size="sm" className="w-full text-sm" onClick={() => navigate(`/dashboard/edit-house/${house.uuid}`)}>
              ویرایش
            </Button>

            {isPublished && (
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-sm"
                onClick={() => setIsCalendarOpen(true)}
              >
                تقویم
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="house-icon-actions">
        {isPublished && (
          <IconButton
            onClick={() => navigate(`/house/${house.uuid}`)}
            label="مشاهده اقامتگاه"
            title="مشاهده اقامتگاه"
          >
            <EyeIcon className="h-5 w-5" />
          </IconButton>
        )}

        <IconButton
          onClick={onDelete}
          disabled={isDeleting}
          label={isDeleting ? "در حال حذف اقامتگاه" : "حذف اقامتگاه"}
          title={isDeleting ? "در حال حذف..." : "حذف اقامتگاه"}
          tone="danger"
        >
          {isDeleting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
          ) : (
            <TrashIcon className="h-5 w-5" />
          )}
        </IconButton>
      </div>

      <img src={imageSrc} className="house-image" alt={house.name || "اقامتگاه"} />

      {isCalendarOpen && (
        <VendorCalendar
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          houseUuid={house.uuid}
          reserveDateFrom={reserveDateFrom}
          setReserveDateFrom={setReserveDateFrom}
          reserveDateTo={reserveDateTo}
          setReserveDateTo={setReserveDateTo}
        />
      )}
    </div>
  );
}
