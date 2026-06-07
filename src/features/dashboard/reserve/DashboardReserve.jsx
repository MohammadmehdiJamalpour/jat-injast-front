import { useCallback, useEffect, useState } from "react";
import {
  getActiveReserves,
  getPreviousReserves,
  getReserveByUuid,
  getVendorActiveReserves,
  getVendorPreviousReserves,
  getVendorReserveByUuid,
} from "../../../services/reserveService";
import Button from "../../../ui/Button";
import Card from "../../../ui/Card";
import EmptyState from "../../../ui/EmptyState";
import Loading from "../../../ui/Loading";
import SectionHeader from "../../../ui/SectionHeader";
import toPersianNumber from "../../../utils/toPersianNumber";
import ReserveInformation from "./ReserveInformation";
import PaymentStatusBadge from "@/components/payment/PaymentStatusBadge";
import { reportClientError } from "../../../utils/reportClientError";
import { fa } from "../../../i18n/fa";

const UNKNOWN = fa.common.fields.unknown;

const getApiData = (response) => response?.data ?? response;
const getReserveList = (response) => {
  const payload = getApiData(response);
  return Array.isArray(payload) ? payload : [];
};
const getReserveDetail = (response) => getApiData(response) || {};

const getReserveDateLabel = (reserve) => {
  const value = reserve?.reserve;
  if (!value || typeof value === "string") return value || "";

  const checkIn = value.checkin?.date_persian || value.checkin?.date;
  const checkOut = value.checkout?.date_persian || value.checkout?.date;
  return value.locale_format || [checkIn, checkOut].filter(Boolean).join(" - ");
};

const getLocationName = (reserve) => {
  const address = reserve.house?.address || {};
  return address.village || address.city?.name || address.city || reserve.house?.city?.name || UNKNOWN;
};

const getStatusLabel = (status) => {
  if (!status) return "";
  return typeof status === "string" ? status : status.label || status.title || status.value || "";
};

function ReserveRow({ label, value }) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-1 text-sm text-gray-800 dark:text-sky-50">
      <p className="font-bold">{label}</p>
      <p className="min-w-0">{value || UNKNOWN}</p>
    </div>
  );
}

function ReserveCard({ reserve, isVendorMode, onView }) {
  const copy = fa.dashboard.reservations;
  const statusLabel = getStatusLabel(reserve.status);
  const statusIcon = reserve.status && typeof reserve.status === "object" ? reserve.status.icon : null;

  return (
    <Card
      as="li"
      variant="bordered"
      className="flex min-h-64 flex-col justify-between gap-4 border-primary-500/70 p-4 dark:border-primary-300/35"
    >
      <div>
        <ReserveRow label={copy.date} value={toPersianNumber(getReserveDateLabel(reserve))} />
        <ReserveRow label={copy.nights} value={toPersianNumber(reserve.nights)} />
        <ReserveRow label={copy.houseName} value={reserve.house?.name} />
        <ReserveRow label={copy.houseLocation} value={getLocationName(reserve)} />
        <ReserveRow
          label={isVendorMode ? copy.guestName : copy.hostName}
          value={isVendorMode ? reserve.guest?.name : reserve.vendor?.name}
        />
        {reserve.room && <ReserveRow label={copy.roomName} value={reserve.room.name} />}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {statusLabel && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-900 dark:bg-primary-500/15 dark:text-sky-50">
            {statusIcon && (
              <img src={statusIcon} alt={statusLabel} className="h-5 w-5 rounded-full" />
            )}
            <span>
              {copy.status} {statusLabel}
            </span>
          </div>
        )}

        <PaymentStatusBadge status={reserve.payment_status || reserve.payment?.status} />

        <Button size="sm" onClick={() => onView(reserve.uuid)}>
          {copy.view}
        </Button>
      </div>
    </Card>
  );
}

function ReserveSection({ title, emptyMessage, reserves, isVendorMode, onView }) {
  if (!reserves.length) {
    return (
      <section className="space-y-4">
        <SectionHeader title={title} />
        <EmptyState title={emptyMessage} />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <SectionHeader title={title} />
      <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {reserves.map((reserve) => (
          <ReserveCard
            key={reserve.uuid || reserve.id}
            reserve={reserve}
            isVendorMode={isVendorMode}
            onView={onView}
          />
        ))}
      </ul>
    </section>
  );
}

function DashboardReserve({ reserveTitle, mode = "guest" }) {
  const isVendorMode = mode === "vendor";
  const [activeReserves, setActiveReserves] = useState([]);
  const [previousReserves, setPreviousReserves] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReserve, setSelectedReserve] = useState(null);
  const [isFetchingReserve, setIsFetchingReserve] = useState(false);

  const fetchAllReserves = useCallback(async () => {
    try {
      setIsInitialLoading(true);

      const [activeResponse, previousResponse] = await Promise.all([
        isVendorMode ? getVendorActiveReserves() : getActiveReserves(),
        isVendorMode ? getVendorPreviousReserves() : getPreviousReserves(),
      ]);

      setActiveReserves(getReserveList(activeResponse));
      setPreviousReserves(getReserveList(previousResponse));
      setError(null);
    } catch (err) {
      reportClientError("Error fetching reserves:", err);
      setError(err.response?.data?.message || fa.common.errors.loadReservations);
    } finally {
      setIsInitialLoading(false);
    }
  }, [isVendorMode]);

  useEffect(() => {
    fetchAllReserves();
  }, [fetchAllReserves]);

  const handleViewReserve = async (uuid) => {
    try {
      setIsFetchingReserve(true);
      const response = await (isVendorMode ? getVendorReserveByUuid(uuid) : getReserveByUuid(uuid));
      setSelectedReserve(getReserveDetail(response));
    } catch (err) {
      reportClientError("Failed to fetch single reservation:", err);
    } finally {
      setIsFetchingReserve(false);
    }
  };

  const handleUpdateSuccess = async () => {
    setSelectedReserve(null);
    await fetchAllReserves();
  };

  if (isInitialLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loading type="beat" color="primary" size={8} />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (selectedReserve) {
    return (
      <div className="relative transition-opacity duration-500">
        {isFetchingReserve && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-slate-950/55">
            <Loading type="beat" color="primary" size={8} />
          </div>
        )}
        <ReserveInformation
          reserve={selectedReserve}
          onBack={() => setSelectedReserve(null)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      </div>
    );
  }

  const copy = fa.dashboard.reservations;

  return (
    <div
      className={`relative space-y-8 transition-all duration-500 ${
        isFetchingReserve ? "opacity-50 blur-sm" : "opacity-100"
      }`}
    >
      <ReserveSection
        title={copy.activeTitle(reserveTitle)}
        emptyMessage={copy.emptyActive(reserveTitle)}
        reserves={activeReserves}
        isVendorMode={isVendorMode}
        onView={handleViewReserve}
      />
      <ReserveSection
        title={copy.previousTitle(reserveTitle)}
        emptyMessage={copy.emptyPrevious(reserveTitle)}
        reserves={previousReserves}
        isVendorMode={isVendorMode}
        onView={handleViewReserve}
      />
    </div>
  );
}

export default DashboardReserve;
