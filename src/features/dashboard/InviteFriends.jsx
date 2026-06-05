
import React from "react";
import { toast } from "react-hot-toast";
import toPersianNumber from "../../utils/toPersianNumber";

function InviteFriends({ user }) {
  if (!user) return null;

  const appOrigin =
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const referralLink = `${appOrigin}/login?referralcode=${user.referral_code}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("لینک کپی شد!");
    } catch (error) {
      toast.error("خطایی در کپی کردن لینک رخ داد!");
    }
  };

  return (
    <div className=" p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">دعوت از دوستان</h2>
      
      {/* Referral Link Display and Copy Button */}
      <div className="mb-4">
        <p className="mb-2">لینک دعوت شما:</p>
        <div className="flex  flex-col  w-full sm:w-1/2 md:w-2/3 lg:max-w-72 gap-2">
          <span className="bg-gray-200 px-4 py-2 rounded-2xl flex justify-center text-sm overflow-x-auto">
            {referralLink}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="btn bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-3xl"
          >
            کپی کردن لینک دعوت از دوستان
          </button>
        </div>
      </div>

      {/* Show referral stats */}
      <div className="mt-4">
        <div className="mb-2">
          <strong>درصد کمیسیون معرف:</strong> {toPersianNumber(user.referral_commission)}
        </div>
        <div>
          <strong>کل مبلغ کسب شده از معرف:</strong>  {toPersianNumber(user.total_referral_earned)} نفر
        </div>
      </div>
    </div>
  );
}

export default InviteFriends;
