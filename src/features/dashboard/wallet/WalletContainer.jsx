// components/WalletContainer.jsx
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import WalletBalances      from "./WalletBalances";
import CardsSection        from "./CardsSection";
import WithdrawSection     from "./WithdrawSection";
import TransactionsSection from "./TransactionsSection";

function WalletContainer({ user }) {
  const [showAddCardModal,  setShowAddCardModal]  = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showChargeModal,   setShowChargeModal]   = useState(false);

  const mainBalance = user?.wallet?.main ?? 0;
  const actions = [
    { label: "اضافه کردن کارت", onClick: () => setShowAddCardModal(true), variant: "secondary" },
    { label: "درخواست برداشت", onClick: () => setShowWithdrawModal(true), variant: "secondary" },
    { label: "شارژ کیف پول", onClick: () => setShowChargeModal(true), variant: "primary" },
  ];

  return (
    <div className="relative space-y-5 p-3 sm:p-5">
      <Toaster position="top-right" />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">کیف پول</h2>
          <p className="mt-1 text-xs text-gray-500">
            مدیریت کارت‌ها، برداشت‌ها و تراکنش‌های آزمایشی
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:flex-wrap">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={
                action.variant === "primary"
                  ? "btn-primary btn-press min-h-10 rounded-full px-4 text-sm font-medium"
                  : "btn-secondary btn-press min-h-10 rounded-full border border-primary-100 px-4 text-sm font-medium"
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wallet numbers */}
      <WalletBalances user={user} />

      {/* Sections */}
      <CardsSection
        showAddCardModal={showAddCardModal}
        setShowAddCardModal={setShowAddCardModal}
      />
      <WithdrawSection
        showWithdrawModal={showWithdrawModal}
        setShowWithdrawModal={setShowWithdrawModal}
        maxBalance={mainBalance}
      />
      <TransactionsSection
        showChargeModal={showChargeModal}
        setShowChargeModal={setShowChargeModal}
      />
    </div>
  );
}

export default WalletContainer;
