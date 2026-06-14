import { useState } from "react";
import toast from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";

import {
  useCardsList,
  useWithdrawsList,
  useAddWithdraw,
} from "./useWallet";
import toPersianNumber from "../../../utils/toPersianNumber";

import Loading from "../../../ui/Loading";
import Modal from "../../../ui/Modal";
import FormSelect from "../../../ui/FormSelect";
import { ResponsiveDataTable, WalletDataSection } from "./WalletDataSection";
import { WALLET_MODAL_SIZE } from "./walletModalLayout";

const MIN_PRICE = 100_000; // ۱۰۰,۰۰۰ تومان

const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const money = (value) => `${toPersianNumber(Number(value || 0).toLocaleString())} تومان`;

function WithdrawStatus({ status }) {
  const className =
    {
      Confirmed: "bg-green-50 text-green-700",
      Reject: "bg-red-50 text-red-700",
      Pending: "bg-yellow-50 text-yellow-700",
    }[status?.key] || "bg-gray-100 text-gray-600";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {status?.label ?? "—"}
    </span>
  );
}

function WithdrawSection({
  showWithdrawModal,
  setShowWithdrawModal,
  maxBalance,
}) {
  const {
    data: cards,
    isLoading: cardsLoading,
    isError: cardsError,
  } = useCardsList();
  const {
    data: withdraws,
    isLoading: withdrawsLoading,
    isError: withdrawsError,
  } = useWithdrawsList();

  const addWithdrawMutation = useAddWithdraw();

  const [withdraw, setWithdraw] = useState({ card_id: "", price: "" });
  const [withdrawErrors, setWithdrawErrors] = useState({});

  const cardsForWithdrawOptions =
    cards?.map((c) => ({
      value: c.id,
      label: `${c.bank?.label || "—"} | ${
        c.card_number?.systemic
          ? toPersianNumber(c.card_number.systemic)
          : "---"
      }`,
      disabled: c.status?.key === "Pending",
    })) ?? [];

  function handlePriceChange(e) {
    const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
    if (!raw) {
      setWithdraw((p) => ({ ...p, price: "" }));
      return;
    }
    let num = parseInt(raw, 10);
    if (num > maxBalance) num = maxBalance;
    setWithdraw((p) => ({ ...p, price: num.toString() }));
  }

  async function handleAddWithdraw() {
    const price = parseInt(withdraw.price || "0", 10);

    if (price < MIN_PRICE) {
      toast.error(`حداقل مقدار برداشت ${toPersianNumber(MIN_PRICE)} تومان است.`);
      return;
    }
    if (price > maxBalance) {
      toast.error("مبلغ بیشتر از موجودی کیف پول است!");
      return;
    }

    try {
      setWithdrawErrors({});
      await addWithdrawMutation.mutateAsync({ ...withdraw, price });
      toast.success("درخواست برداشت با موفقیت ثبت شد.");
      setWithdraw({ card_id: "", price: "" });
      setShowWithdrawModal(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "خطایی در ایجاد درخواست برداشت رخ داده است!"
      );
      if (err.response?.status === 422) {
        setWithdrawErrors(err.response.data?.errors?.fields || {});
      }
    }
  }

  if (cardsLoading || withdrawsLoading)
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <Loading />
      </div>
    );
  if (cardsError || withdrawsError)
    return <div>خطایی در دریافت برداشت‌ها رخ داده است.</div>;

  const priceNumeric = parseInt(withdraw.price || "0", 10);

  const priceTooLow =
    withdraw.price !== "" && priceNumeric < MIN_PRICE;

  const isSubmitDisabled =
    addWithdrawMutation.isLoading ||
    !withdraw.card_id ||
    priceTooLow;

  const withdrawRows = Array.isArray(withdraws) ? withdraws : [];
  const withdrawColumns = [
    {
      key: "index",
      label: "#",
      mobileHidden: true,
      render: (_wd, i) => toPersianNumber(i + 1),
    },
    {
      key: "date",
      label: "تاریخ",
      render: (wd) => (
        <span className="text-xs sm:text-sm">
          {wd.created_at?.week_day ? `${wd.created_at.week_day}، ` : ""}
          {wd.created_at?.date_persian ?? "—"}
        </span>
      ),
    },
    {
      key: "time",
      label: "زمان",
      render: (wd) => wd.created_at?.time ? toPersianNumber(wd.created_at.time) : "—",
    },
    {
      key: "price",
      label: "مبلغ",
      render: (wd) => <span className="font-bold text-gray-900">{money(wd.price)}</span>,
    },
    {
      key: "status",
      label: "وضعیت",
      render: (wd) => <WithdrawStatus status={wd.status} />,
    },
  ];

  return (
    <section className="space-y-2">
      <WalletDataSection
        title="درخواست‌های برداشت"
        description="وضعیت درخواست‌های تسویه کیف پول"
      >
        <ResponsiveDataTable
          columns={withdrawColumns}
          rows={withdrawRows}
          emptyMessage="در حال حاضر درخواست برداشتی وجود ندارد."
          mobileTitle={(wd) => money(wd.price)}
          mobileSubtitle={(wd) =>
            `${wd.created_at?.week_day ? `${wd.created_at.week_day}، ` : ""}${wd.created_at?.date_persian ?? "—"}`
          }
          mobileMeta={(wd) => <WithdrawStatus status={wd.status} />}
        />
      </WalletDataSection>

      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="درخواست برداشت"
        size={WALLET_MODAL_SIZE}
        testId="wallet-withdraw-modal"
      >
        <div className="p-4 flex flex-col space-y-3 max-w-md mx-auto">
          <FormSelect
            label="انتخاب کارت"
            name="card_id"
            value={withdraw.card_id}
            onChange={(field, val) =>
              setWithdraw((p) => ({ ...p, [field]: val }))
            }
            options={cardsForWithdrawOptions}
          />
          {withdrawErrors.card_id && (
            <p className="text-red-600 text-sm mt-1">
              {withdrawErrors.card_id.join(", ")}
            </p>
          )}

          <div>
            <input
              className={`field-surface ${
                priceTooLow ? "border-red-400" : ""
              }`}
              placeholder={`حداقل برداشت ${fmt(MIN_PRICE)} تومان`}
              aria-label={'\u0645\u0628\u0644\u063a \u0628\u0631\u062f\u0627\u0634\u062a'}
              value={withdraw.price ? fmt(withdraw.price) : ""}
              onChange={handlePriceChange}
            />
            {withdrawErrors.price && (
              <p className="text-red-600 text-sm mt-1">
                {withdrawErrors.price.join(", ")}
              </p>
            )}
          </div>

          <p className="text-sm text-gray-600">
            حداکثر قابل برداشت: {toPersianNumber(maxBalance)} تومان
          </p>

          <button
            type="button"
            onClick={handleAddWithdraw}
            disabled={isSubmitDisabled}
            className="btn-primary btn-press min-h-11 rounded-full text-sm font-medium"
          >
            {addWithdrawMutation.isLoading ? (
              <BeatLoader size={8} color="#fff" />
            ) : (
              "ثبت درخواست برداشت"
            )}
          </button>
        </div>
      </Modal>
    </section>
  );
}

export default WithdrawSection;
