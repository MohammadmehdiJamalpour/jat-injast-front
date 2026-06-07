import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import Spinner from "../../../../ui/Loading";
import {
  updateHousePrice,
  updateRoomPrice,
} from "../../../../services/houseService";
import {
  buildInitialPricingForm,
  formatPriceInput,
  normalizePricePayload,
  pricingSections,
} from "./pricingConfig";
import {
  PricingErrorList,
  PricingInputSection,
  PricingSubmitButton,
  RoomPricingDisclosure,
} from "./PricingSections";

const EditHousePricing = ({
  houseData,
  loadingHouse,
  houseId,
  refetchHouseData,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [errorList, setErrorList] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [priceHandleBy, setPriceHandleBy] = useState(
    houseData?.price_handle_by?.key,
  );

  const placeholderText =
    priceHandleBy === "PerPerson"
      ? "قیمت را بر اساس هر نفر به تومان وارد کنید"
      : "قیمت را بر اساس هر شب به تومان وارد کنید";

  useEffect(() => {
    if (!houseData) return;

    setPriceHandleBy(houseData?.price_handle_by?.key);
    setFormData(buildInitialPricingForm(houseData));
  }, [houseData]);

  const handleInputChange = (key, value, roomUuid = null) => {
    const formattedValue = formatPriceInput(value);

    if (houseData?.is_rent_room && roomUuid) {
      setFormData((prevData) => ({
        ...prevData,
        [roomUuid]: {
          ...prevData[roomUuid],
          [key]: formattedValue,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [key]: formattedValue,
      }));
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: null,
    }));
  };

  const handleSubmit = async (roomUuid = null) => {
    setLoadingSubmit(true);
    const priceData = roomUuid ? formData[roomUuid] : formData;
    const formattedData = normalizePricePayload(priceData);

    try {
      if (houseData?.is_rent_room && roomUuid) {
        await updateRoomPrice(houseId, roomUuid, formattedData);
        toast.success("قیمت‌های اتاق با موفقیت به روز شد");
        refetchHouseData();
      } else {
        await updateHousePrice(houseId, formattedData);
        toast.success("قیمت‌های اقامتگاه با موفقیت به روز شد");
        refetchHouseData();
      }
      setErrorList([]);
    } catch (error) {
      if (error.response?.status === 422) {
        const errorsArray = Object.values(
          error.response.data.errors.fields || {},
        ).flat();
        setErrorList(errorsArray);
        const fieldErrors = error.response.data.errors.fields;
        const updatedErrors = {};
        for (let field in fieldErrors) {
          updatedErrors[field] = fieldErrors[field][0];
        }
        setErrors(updatedErrors);
      } else {
        toast.error("مشکلی پیش آمده است");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingHouse || !houseData) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative p-2">
      <Toaster />
      <div className="overflow-auto scrollbar-thin pt-2 px-2 lg:px-4 w-full">
        <h2 className="text-right font-bold lg:text-lg mb-4">قیمت‌گذاری :</h2>

        {houseData?.is_rent_room ? (
          houseData.room &&
          houseData.room.filter((room) => !room.is_living_room).length > 0 ? (
            houseData.room
              .filter((room) => !room.is_living_room)
              .map((room, index) => (
                <RoomPricingDisclosure
                  key={room.uuid}
                  room={room}
                  index={index}
                  sections={pricingSections}
                  values={formData[room.uuid] || {}}
                  errors={errors}
                  errorList={errorList}
                  placeholder={placeholderText}
                  loadingSubmit={loadingSubmit}
                  onChange={handleInputChange}
                  onSubmit={handleSubmit}
                />
              ))
          ) : (
            <p className="text-center text-red-500 mt-4">
              هیچ اتاقی وجود ندارد لطفا ابتدا اتاق‌های خود را ثبت کنید
            </p>
          )
        ) : (
          <>
            {pricingSections.map((section) => (
              <PricingInputSection
                key={section.id}
                roomUuid={null}
                title={section.title}
                fields={section.fields}
                values={formData}
                errors={errors}
                placeholder={placeholderText}
                onChange={handleInputChange}
              />
            ))}

            <div className="mt-4 w-full flex justify-end">
              <PricingSubmitButton
                loading={loadingSubmit}
                onClick={() => handleSubmit()}
              >
                {loadingSubmit ? "در حال ثبت ..." : "ثبت قیمت‌ها"}
              </PricingSubmitButton>
            </div>

            <PricingErrorList errors={errorList} />
          </>
        )}
      </div>
    </div>
  );
};

export default EditHousePricing;
