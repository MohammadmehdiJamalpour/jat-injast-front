// components/TransactionsSection.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";

/** Hooks & utils **/
import { useDefaultTransactions, useBlockedTransactions, useChargeWallet } from "./useWallet";
import toPersianNumber from "../../../utils/toPersianNumber";

/** UI **/
import Loading from "../../../ui/Loading";
import Modal   from "../../../ui/Modal";
import { ResponsiveDataTable, WalletDataSection } from "./WalletDataSection";

/* simple formatter (English digits + commas) */
const fmt = n => n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const money = (value) => `${toPersianNumber(Number(value || 0).toLocaleString())} تومان`;
const txDescription = (tx) => tx.label || tx.description || "—";
const txReference = (tx) => tx.reference_uuid ? String(tx.reference_uuid).slice(0, 8) : "";

function TransactionsSection({ showChargeModal, setShowChargeModal }) {
  const { data: defaultTx, isLoading: defaultL, isError: defaultE } = useDefaultTransactions();
  const { data: blockedTx, isLoading: blockedL, isError: blockedE } = useBlockedTransactions();
  const defaultTransactions = Array.isArray(defaultTx) ? defaultTx : [];
  const blockedTransactions = Array.isArray(blockedTx) ? blockedTx : [];

  const chargeWalletMutation = useChargeWallet();

  const [chargePrice, setChargePrice] = useState("");
  const [chargeErrors, setChargeErrors] = useState({});

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
    setChargePrice(raw);            // store un-formatted digits only
  };

  async function handleChargeWallet() {
    try {
      setChargeErrors({});
      await chargeWalletMutation.mutateAsync({ price: parseInt(chargePrice || "0", 10) });
      toast.success("کیف پول با موفقیت شارژ شد.");
      setChargePrice("");
      setShowChargeModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "خطایی در شارژ کیف پول رخ داده است!");
      if (error.response?.status === 422) {
        setChargeErrors(error.response.data?.errors?.fields || {});
      }
    }
  }

  if (defaultL || blockedL)
    return <div className="flex justify-center items-center min-h-[30vh]"><Loading/></div>;
  if (defaultE  || blockedE )
    return <div>خطایی در دریافت تراکنش‌ها رخ داده است.</div>;

  const txColumns = [
    {
      key: "index",
      label: "#",
      mobileHidden: true,
      render: (_tx, i) => toPersianNumber(i + 1),
    },
    {
      key: "amount",
      label: "مبلغ",
      render: (tx) => (
        <span className="font-bold text-gray-900">
          {money(tx.price ?? tx.amount)}
        </span>
      ),
    },
    {
      key: "description",
      label: "توضیحات",
      align: "right",
      render: (tx) => (
        <span>
          {toPersianNumber(txDescription(tx))}
          {txReference(tx) && (
            <span className="mt-1 block text-xs text-gray-400">
              {toPersianNumber(txReference(tx))}
            </span>
          )}
        </span>
      ),
    },
  ];

  return (
    <section className="space-y-6">
      <WalletDataSection
        title="تراکنش‌های کیف پول"
        description="واریز، برداشت و پرداخت‌های آزمایشی"
      >
        <ResponsiveDataTable
          columns={txColumns}
          rows={defaultTransactions}
          emptyMessage="تراکنش عادی برای نمایش وجود ندارد."
          mobileTitle={(tx) => toPersianNumber(txDescription(tx))}
          mobileSubtitle={(tx) => txReference(tx) ? `کد پیگیری ${toPersianNumber(txReference(tx))}` : ""}
          mobileMeta={(tx) => money(tx.price ?? tx.amount)}
        />
      </WalletDataSection>

      <WalletDataSection
        title="تراکنش‌های در انتظار تسویه"
        description="مبالغی که هنوز قابل برداشت نیستند"
      >
        <ResponsiveDataTable
          columns={txColumns}
          rows={blockedTransactions}
          emptyMessage="تراکنش بلوکه‌شده‌ای برای نمایش وجود ندارد."
          mobileTitle={(tx) => toPersianNumber(txDescription(tx))}
          mobileSubtitle={(tx) => txReference(tx) ? `کد پیگیری ${toPersianNumber(txReference(tx))}` : ""}
          mobileMeta={(tx) => money(tx.price ?? tx.amount)}
        />
      </WalletDataSection>

      <Modal
        isOpen={showChargeModal}
        onClose={() => setShowChargeModal(false)}
        title="شارژ کیف پول"
        maxWidth="max-w-3xl"
      >
        <div className="p-4 flex flex-col space-y-3 max-w-md mx-auto">
          <input
            className="field-surface"
            placeholder="مبلغ به تومان"
            value={chargePrice ? fmt(chargePrice) : ""}
            onChange={handlePriceChange}
          />
          {chargeErrors.price && (
            <p className="text-red-600 text-sm mt-1">{chargeErrors.price.join(", ")}</p>
          )}

          <button
            onClick={handleChargeWallet}
            disabled={chargeWalletMutation.isLoading || !chargePrice}
            className="btn-primary btn-press min-h-11 rounded-full text-sm font-medium"
          >
            {chargeWalletMutation.isLoading
              ? <BeatLoader size={8} color="#fff" />
              : "شارژ"}
          </button>
        </div>
      </Modal>
    </section>
  );
}

export default TransactionsSection;
