import { useEffect, useMemo, useState } from "react";
import { useVendorHouseCalendarData } from "./useVendorHouseCalendarData";
import { useVendorRoomCalendarData } from "./useVendorRoomCalendarData";
import OperationButtons from "./vendorCalendar/OperationButtons";
import DateRangeSelector from "./vendorCalendar/DateRangeSelector";
import DayDetailModal from "./vendorCalendar/DayDetailModal";
import OperationModal from "./vendorCalendar/OperationModal";
import useCalendarHouseDetails from "./useCalendarHouseDetails";
import Modal from "../../ui/Modal";
import VendorCalendarContainer from "./VendorCalendarContainer";
import CalendarLegend from "./vendorCalendar/CalendarLegend";
import { useVendorCalendarOperations } from "./useVendorCalendarOperations";

export default function VendorCalendar({
  isOpen,
  onClose,
  houseUuid,
  instantBooking = false,
}) {
  const {
    data: houseData,
    isLoading: loadingHouse,
    isError: isErrorHouse,
    error: errorHouse,
  } = useCalendarHouseDetails(houseUuid);

  const isRentRoom = houseData?.is_rent_room === true;
  const isRentRoomDefined = typeof houseData?.is_rent_room !== "undefined";

  const roomOptions = useMemo(() => {
    if (!isRentRoomDefined || !isRentRoom || !houseData?.room) return [];
    return houseData.room
      .filter((r) => !r.is_living_room)
      .map((r) => ({ uuid: r.uuid, name: r.name }));
  }, [houseData, isRentRoomDefined, isRentRoom]);

  const [selectedRoomUuid, setSelectedRoomUuid] = useState(null);
  useEffect(() => {
    if (isRentRoom && roomOptions.length > 0 && !selectedRoomUuid) {
      setSelectedRoomUuid(roomOptions[0].uuid);
    }
  }, [isRentRoom, roomOptions, selectedRoomUuid]);

  const {
    isLoading: isHouseCalLoading,
    isError: isHouseCalError,
    error: houseCalError,
    data: houseCalendarData,
    refetch: houseCalendarRefetch,
    fetchNextMonth: houseFetchNextMonth,
  } = useVendorHouseCalendarData({
    uuid: houseUuid,
    enabled: isOpen && isRentRoomDefined && !isRentRoom,
  });

  const {
    isLoading: isRoomCalLoading,
    isError: isRoomCalError,
    error: roomCalError,
    data: roomCalendarData,
    refetch: roomCalendarRefetch,
    fetchNextMonth: roomFetchNextMonth,
  } = useVendorRoomCalendarData({
    uuid: houseUuid,
    enabled: isOpen && isRentRoomDefined && isRentRoom && !!selectedRoomUuid,
    selectedRoomUuid,
  });

  const finalCalendarData = useMemo(() => {
    if (!isRentRoomDefined) return [];
    return isRentRoom ? roomCalendarData : houseCalendarData;
  }, [isRentRoomDefined, isRentRoom, roomCalendarData, houseCalendarData]);

  const combinedError = useMemo(() => {
    if (isErrorHouse) {
      return errorHouse?.message || "خطا در دریافت اطلاعات اقامتگاه";
    }
    if (!isRentRoomDefined) return null;
    if (!isRentRoom && isHouseCalError) return houseCalError?.message;
    if (isRentRoom && isRoomCalError) return roomCalError?.message;
    return null;
  }, [
    isErrorHouse,
    errorHouse,
    isRentRoomDefined,
    isRentRoom,
    isHouseCalError,
    houseCalError,
    isRoomCalError,
    roomCalError,
  ]);

  async function fetchNextMonth() {
    if (!isRentRoomDefined) return 0;
    if (isRentRoom) {
      return roomFetchNextMonth();
    } else {
      return houseFetchNextMonth();
    }
  }

  const isLoadingCalendar =
    !isRentRoomDefined || (isRentRoom ? isRoomCalLoading : isHouseCalLoading);

  const [isRefetchingCalendar, setIsRefetchingCalendar] = useState(false);
  async function refetchCalendarData() {
    setIsRefetchingCalendar(true);
    if (isRentRoom) {
      await roomCalendarRefetch();
    } else {
      await houseCalendarRefetch();
    }
    setIsRefetchingCalendar(false);
  }

  const calendarOperations = useVendorCalendarOperations({
    houseUuid,
    isRentRoom,
    selectedRoomUuid,
    refetchCalendarData,
  });

  const {
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
  } = calendarOperations;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تقویم اقامتگاه"
      maxWidth="md:max-w-[80vw]"
      viewportClassName="items-start justify-center px-3 pb-3 pt-16 sm:px-6 md:pt-20"
      maxHeightClassName="max-h-[calc(100vh-5rem)] md:max-h-[calc(100vh-6rem)]"
      bodyClassName="px-3 pb-3 pt-2 sm:px-5 sm:pb-4"
    >
      {isOpen && (isLoadingCalendar || isRefetchingCalendar) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-slate-950/60">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full mt-4 border-4 border-t-primary-500 animate-spin mb-2" />
          </div>
        </div>
      )}

      <div
        dir="rtl"
        className="relative max-h-[calc(100vh-10rem)] space-y-1.5 overflow-y-auto px-1 py-0 text-right scrollbar-thin sm:px-2 md:max-h-[calc(100vh-11rem)] md:space-y-2"
      >
        {operationGroup && (
          <div className="absolute inset-0 z-10 pointer-events-none bg-white/70 backdrop-blur-sm transition duration-200 ease-in-out dark:bg-slate-950/50" />
        )}

        <div className="grid grid-cols-1 gap-1.5 rounded-2xl border border-primary-100 bg-white/85 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 md:grid-cols-2 md:grid-rows-[auto_auto] md:items-center md:gap-x-3 md:gap-y-1.5 lg:grid-cols-[minmax(0,60%)_minmax(0,40%)] lg:grid-rows-[auto_auto] xl:grid-cols-[minmax(0,70%)_minmax(0,30%)]">
          <div className="min-w-0 md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-1">
            <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center md:justify-start">
              {loadingHouse ? (
                <div className="h-7 w-full animate-pulse rounded-full bg-gray-200 dark:bg-slate-800 sm:w-64" />
              ) : houseData ? (
                <div className="flex min-w-0 justify-start">
                  <div className="inline-flex h-8 w-fit max-w-full items-center rounded-full border border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 sm:text-sm">
                    <span className="min-w-0 truncate">
                      {houseData.name} - {houseData.structure?.label}
                    </span>
                  </div>
                </div>
              ) : null}

              {isRentRoomDefined && isRentRoom && roomOptions.length > 0 && (
                <div className="w-full sm:w-52 md:w-56">
                  <select
                    className="h-8 w-full rounded-xl border border-gray-200 bg-white px-3 text-right text-xs text-gray-700 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-primary-900/40"
                    value={selectedRoomUuid || ""}
                    onChange={(e) => setSelectedRoomUuid(e.target.value)}
                  >
                    {roomOptions.map((room) => (
                      <option key={room.uuid} value={room.uuid}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <DateRangeSelector
            className="w-full min-w-0 md:col-span-2 md:row-start-2 md:self-end lg:col-span-1 lg:col-start-1 lg:row-start-2 xl:ml-auto xl:w-[60%] 2xl:w-[55%]"
            operationGroup={operationGroup}
            reserveDateFrom={reserveDateFrom}
            reserveDateTo={reserveDateTo}
          />

          <div className="w-full min-w-0 md:col-start-2 md:row-start-1 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-full lg:self-stretch">
            <OperationButtons
              operationGroup={operationGroup}
              openOperationFlow={openOperationFlow}
              handleReset={handleReset}
            />
          </div>
        </div>

        {!loadingHouse && combinedError && (
          <div className="py-1 text-center text-sm text-red-600">
            {combinedError}
          </div>
        )}

        {errorMessage && (
          <div className="text-center text-sm text-red-500">{errorMessage}</div>
        )}

        {finalCalendarData && finalCalendarData.length > 0 && (
          <div className={operationGroup ? "relative z-20" : ""}>
            <VendorCalendarContainer
              calendarData={finalCalendarData}
              onDayClick={handleDayClick}
              isRentRoom={isRentRoom}
              roomOptions={roomOptions}
              selectedRoomUuid={selectedRoomUuid}
              instantBooking={instantBooking}
              loadingCalendar={isLoadingCalendar}
              fetchNextMonth={fetchNextMonth}
              reserveDateFrom={reserveDateFrom}
              reserveDateTo={reserveDateTo}
              operationGroup={operationGroup}
            />
          </div>
        )}
        <CalendarLegend />
        <DayDetailModal
          showDayModal={!operationGroup && showDayModal}
          setShowDayModal={setShowDayModal}
          selectedDayDetails={selectedDayDetails}
        />

        <OperationModal
          showOperationModal={showOperationModal}
          operationGroup={operationGroup}
          pendingRequest={pendingRequest}
          price={price}
          quantity={quantity}
          reserveDateFrom={reserveDateFrom}
          reserveDateTo={reserveDateTo}
          onClose={() => {
            if (!pendingRequest) handleCloseOperationModal();
          }}
          setPrice={setPrice}
          setQuantity={setQuantity}
          handleAddPeak={handleAddPeak}
          handleRemovePeak={handleRemovePeak}
          handleAddOffsite={handleAddOffsite}
          handleRemoveOffsite={handleRemoveOffsite}
          handleChangePrice={handleChangePrice}
          handleRemovePrice={handleRemovePrice}
          isRentRoom={isRentRoom}
        />
      </div>
    </Modal>
  );
}
