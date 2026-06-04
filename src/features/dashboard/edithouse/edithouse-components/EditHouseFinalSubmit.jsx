import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "@/lib/router-compat";

import ToggleSwitch from "../../../../ui/ToggleSwitch";
import { publishHouse } from "../../../../services/houseService";

const checklistItems = [
  "اطلاعات هویتی، مالکیت و آدرس اقامتگاه را درست وارد کرده‌ام.",
  "تصاویر، امکانات، ظرفیت و قوانین اقامتگاه با وضعیت واقعی مطابقت دارد.",
  "تقویم و قیمت‌ها را بررسی کرده‌ام و مسئولیت به‌روزرسانی آن‌ها را می‌پذیرم.",
  "می‌دانم پس از ارسال، اقامتگاه برای بررسی در اختیار تیم مدیریت قرار می‌گیرد.",
];

const EditHouseFinalSubmit = ({ houseId }) => {
  const [publishing, setPublishing] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [generalErrorMessage, setGeneralErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFinalSubmit = async () => {
    if (!confirmationChecked) return;

    setPublishing(true);
    setErrorMessages([]);
    setGeneralErrorMessage("");

    try {
      await publishHouse(houseId);
      toast.success("درخواست انتشار اقامتگاه ثبت شد.");
      navigate("/dashboard");
    } catch (error) {
      const payload = error.response?.data;
      const fields = payload?.errors?.fields;

      if (payload?.message) {
        setGeneralErrorMessage(payload.message);
      }

      if (fields) {
        setErrorMessages(Object.values(fields).flat());
      } else {
        toast.error("خطا در ثبت نهایی اقامتگاه. دوباره تلاش کنید.");
      }
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col justify-end p-4">
      {generalErrorMessage && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md mb-4">
          <h3 className="font-semibold">خطای ثبت:</h3>
          <p>{generalErrorMessage}</p>
        </div>
      )}

      {errorMessages.length > 0 && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md mb-4">
          <h3 className="font-semibold">موارد نیازمند اصلاح:</h3>
          <ul className="list-disc list-inside">
            {errorMessages.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full flex justify-end">
        <button
          className={`btn w-44 shadow-centered bg-primary-600 text-white mt-4 ${
            !confirmationChecked ? "opacity-50" : ""
          }`}
          onClick={handleFinalSubmit}
          disabled={!confirmationChecked || publishing}
        >
          {publishing ? "در حال ارسال..." : "ثبت نهایی اقامتگاه"}
        </button>
      </div>

      <div className="flex flex-col shadow-centered p-4 rounded-2xl justify-between mt-4">
        <ToggleSwitch
          checked={confirmationChecked}
          onChange={setConfirmationChecked}
          label="موارد بالا را بررسی و تایید می‌کنم"
        />
        <div className="mt-4 px-3 lg:px-5 scrollbar-thumb-primary-500 scrollbar-track-gray-200 p-2">
          <ul className="list-disc pl-5 space-y-2">
            {checklistItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditHouseFinalSubmit;
