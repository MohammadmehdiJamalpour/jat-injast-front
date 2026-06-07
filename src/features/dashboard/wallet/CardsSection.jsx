// components/CardsSection.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";

/** Hooks & utils **/
import { useBanksList, useCardsList, useAddCard } from "./useWallet";
import formatIban       from "./formatIban";
import toPersianNumber  from "../../../utils/toPersianNumber";

/** UI **/
import Loading from "../../../ui/Loading";
import Modal   from "../../../ui/Modal";
import FormSelect from "../../../ui/FormSelect";
import { ResponsiveDataTable, WalletDataSection } from "./WalletDataSection";

function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-800">
      {status?.label ?? "—"}
    </span>
  );
}

function CardsSection({ showAddCardModal, setShowAddCardModal }) {
  const { data: banks, isLoading: banksLoading, isError: banksError } = useBanksList();
  const { data: cards, isLoading: cardsLoading, isError: cardsError } = useCardsList();

  const addCardMutation = useAddCard();

  const [newCard, setNewCard]   = useState({ account_number:"", card_number:"", iban:"IR-", bank:"" });
  const [addCardErrors, setAddCardErrors] = useState({});

  const banksOptions = banks?.map((b) => ({ value: b.key, label: b.label })) ?? [];

  async function handleAddCard() {
    try {
      setAddCardErrors({});
      await addCardMutation.mutateAsync({
        ...newCard,
        iban: newCard.iban.replace(/[^a-zA-Z0-9]/g, ""),
      });
      toast.success("کارت جدید با موفقیت اضافه شد.");
      setNewCard({ account_number: "", card_number: "", iban: "IR-", bank: "" });
      setShowAddCardModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "خطایی در افزودن کارت رخ داده است!");
      if (error.response?.status === 422) {
        setAddCardErrors(error.response.data?.errors?.fields || {});
      }
    }
  }

  if (banksLoading || cardsLoading)
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <Loading />
      </div>
    );
  if (banksError || cardsError) return <div>خطایی در دریافت اطلاعات کارت‌ها رخ داده است.</div>;

  const cardRows = Array.isArray(cards) ? cards : [];
  const cardColumns = [
    {
      key: "index",
      label: "#",
      mobileHidden: true,
      render: (_card, i) => toPersianNumber(i + 1),
    },
    {
      key: "card_number",
      label: "شماره کارت",
      render: (card) => card.card_number?.dash ? toPersianNumber(card.card_number.dash) : "—",
    },
    {
      key: "account_number",
      label: "شماره حساب",
      render: (card) => card.account_number ? toPersianNumber(card.account_number) : "—",
    },
    {
      key: "iban",
      label: "شماره شبا",
      className: "text-xs",
      render: (card) => card.iban ? toPersianNumber(formatIban(card.iban)) : "—",
    },
    {
      key: "bank",
      label: "بانک",
      render: (card) => card.bank?.label ?? "—",
    },
    {
      key: "status",
      label: "وضعیت",
      render: (card) => <StatusBadge status={card.status} />,
    },
  ];

  return (
    <section className="space-y-2">
      <WalletDataSection
        title="کارت‌ها"
        description="کارت‌های ثبت‌شده برای برداشت وجه"
      >
        <ResponsiveDataTable
          columns={cardColumns}
          rows={cardRows}
          emptyMessage="هنوز کارتی ثبت نشده است."
          mobileTitle={(card) => card.bank?.label ?? "کارت بانکی"}
          mobileSubtitle={(card) =>
            card.card_number?.systemic
              ? `کارت ${toPersianNumber(card.card_number.systemic)}`
              : ""
          }
          mobileMeta={(card) => <StatusBadge status={card.status} />}
        />
      </WalletDataSection>

      <Modal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        title="اضافه کردن کارت جدید"
        maxWidth="max-w-3xl"
      >
        <div className="p-4 flex flex-col space-y-3 max-w-md mx-auto">
          <FormSelect
            label="بانک"
            name="bank"
            value={newCard.bank}
            onChange={(field, val) => setNewCard((p) => ({ ...p, [field]: val }))}
            options={banksOptions}
            compact
          />
          {/* card_number */}
          <div>
            <input
              className="field-surface"
              placeholder="شماره کارت"
              value={newCard.card_number}
              onChange={(e) => setNewCard((p) => ({ ...p, card_number: e.target.value }))}
            />
            {addCardErrors.card_number && (
              <p className="text-red-600 text-sm mt-1">{addCardErrors.card_number.join(", ")}</p>
            )}
          </div>
          {/* account_number */}
          <div>
            <input
              className="field-surface"
              placeholder="شماره حساب"
              value={newCard.account_number}
              onChange={(e) => setNewCard((p) => ({ ...p, account_number: e.target.value }))}
            />
            {addCardErrors.account_number && (
              <p className="text-red-600 text-sm mt-1">{addCardErrors.account_number.join(", ")}</p>
            )}
          </div>
          {/* iban */}
          <div>
            <input
              className="field-surface"
              placeholder="شماره شبا"
              value={newCard.iban}
              onChange={(e) => setNewCard((p) => ({ ...p, iban: formatIban(e.target.value) }))}
            />
            {addCardErrors.iban && (
              <p className="text-red-600 text-sm mt-1">{addCardErrors.iban.join(", ")}</p>
            )}
          </div>
          <button
            onClick={handleAddCard}
            disabled={addCardMutation.isLoading}
            className="btn-primary btn-press min-h-11 rounded-full text-sm font-medium"
          >
            {addCardMutation.isLoading ? <BeatLoader size={8} color="#fff" /> : "ثبت کارت جدید"}
          </button>
        </div>
      </Modal>

    </section>
  );
}

export default CardsSection;
