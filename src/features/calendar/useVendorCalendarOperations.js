import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  addOffSiteBooking,
  addPeakDays,
  addSpecialPrice,
  removeOffSiteBooking,
  removePeakDays,
  removeSpecialPrice,
} from "../../services/houseCalendarOwnerService";

const selectDatePrompt = "لطفا تاریخ مورد نظر را وارد کنید";
const selectEndDatePrompt = "لطفا تاریخ پایان را انتخاب کنید";
const invalidEndDateMessage = "تاریخ پایان نباید قبل از تاریخ شروع باشد";
const genericErrorMessage = "خطایی رخ داد";
const priceRequiredMessage = "لطفا قیمت را وارد کنید";

function apiErrorMessage(error) {
  return error?.response?.data?.message || error?.message || genericErrorMessage;
}

export function useVendorCalendarOperations({
  houseUuid,
  isRentRoom,
  selectedRoomUuid,
  refetchCalendarData,
}) {
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);
  const [operationGroup, setOperationGroup] = useState(null);
  const [reserveDateFrom, setReserveDateFrom] = useState(null);
  const [reserveDateTo, setReserveDateTo] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(false);
  const [showOperationModal, setShowOperationModal] = useState(false);

  function handleReset() {
    setOperationGroup(null);
    setReserveDateFrom(null);
    setReserveDateTo(null);
    setPrice("");
    setQuantity(1);
    setErrorMessage(null);
    setSelectedDayDetails(null);
    setShowDayModal(false);
    setShowOperationModal(false);
    setPendingRequest(false);
  }

  function openOperationFlow(group) {
    handleReset();
    setOperationGroup(group);
    toast(selectDatePrompt, { icon: "👉" });
  }

  function handleDayClick(dayData) {
    if (
      !dayData ||
      dayData.isDisable ||
      dayData.isBlank ||
      dayData.isLock ||
      dayData.isCurrentMonth
    ) {
      return;
    }

    if (!operationGroup) {
      setSelectedDayDetails(dayData);
      setShowDayModal(true);
      return;
    }

    if (!reserveDateFrom) {
      setReserveDateFrom(dayData);
      toast.success(selectEndDatePrompt);
      return;
    }

    if (!reserveDateTo) {
      const start = new Date(reserveDateFrom.date);
      const end = new Date(dayData.date);
      if (end < start) {
        toast.error(invalidEndDateMessage);
        return;
      }
      setReserveDateTo(dayData);
      setShowOperationModal(true);
    }
  }

  function handleCloseOperationModal() {
    setShowOperationModal(false);
    handleReset();
  }

  async function runOperation(operation, successMessage) {
    if (!reserveDateFrom || !reserveDateTo) return;

    setPendingRequest(true);
    setErrorMessage(null);

    try {
      await operation();
      toast.success(successMessage);
      handleCloseOperationModal();
      await refetchCalendarData();
    } catch (error) {
      handleCloseOperationModal();
      const message = apiErrorMessage(error);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setPendingRequest(false);
    }
  }

  function roomUuidIfNeeded() {
    return isRentRoom ? selectedRoomUuid : undefined;
  }

  function quantityIfNeeded() {
    return isRentRoom ? quantity : undefined;
  }

  async function handleAddPeak() {
    await runOperation(
      () => addPeakDays(houseUuid, reserveDateFrom.date, reserveDateTo.date),
      "ایام پیک با موفقیت اضافه شد"
    );
  }

  async function handleRemovePeak() {
    await runOperation(
      () => removePeakDays(houseUuid, reserveDateFrom.date, reserveDateTo.date),
      "ایام پیک با موفقیت حذف شد"
    );
  }

  async function handleAddOffsite() {
    await runOperation(
      () =>
        addOffSiteBooking(
          houseUuid,
          reserveDateFrom.date,
          reserveDateTo.date,
          quantityIfNeeded(),
          roomUuidIfNeeded()
        ),
      "رزرو خارج از سایت با موفقیت ثبت شد"
    );
  }

  async function handleRemoveOffsite() {
    await runOperation(
      () =>
        removeOffSiteBooking(
          houseUuid,
          reserveDateFrom.date,
          reserveDateTo.date,
          roomUuidIfNeeded()
        ),
      "رزرو خارج از سایت با موفقیت حذف شد"
    );
  }

  async function handleChangePrice() {
    if (!reserveDateFrom || !reserveDateTo) return;
    if (!price) {
      toast.error(priceRequiredMessage);
      return;
    }

    await runOperation(
      () =>
        addSpecialPrice(
          houseUuid,
          reserveDateFrom.date,
          reserveDateTo.date,
          price,
          roomUuidIfNeeded()
        ),
      "قیمت ویژه تغییر کرد"
    );
  }

  async function handleRemovePrice() {
    await runOperation(
      () =>
        removeSpecialPrice(
          houseUuid,
          reserveDateFrom.date,
          reserveDateTo.date,
          roomUuidIfNeeded()
        ),
      "قیمت ویژه با موفقیت حذف شد"
    );
  }

  return {
    errorMessage,
    handleAddOffsite,
    handleAddPeak,
    handleChangePrice,
    handleCloseOperationModal,
    handleDayClick,
    handleRemoveOffsite,
    handleRemovePeak,
    handleRemovePrice,
    handleReset,
    openOperationFlow,
    operationGroup,
    pendingRequest,
    price,
    quantity,
    reserveDateFrom,
    reserveDateTo,
    selectedDayDetails,
    setPrice,
    setQuantity,
    setShowDayModal,
    showDayModal,
    showOperationModal,
  };
}
