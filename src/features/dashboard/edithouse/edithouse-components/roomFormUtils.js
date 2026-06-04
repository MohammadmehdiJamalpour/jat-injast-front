export const roomCopy = {
  title: "اطلاعات اتاق‌ها :",
  addRoom: "اضافه کردن اتاق",
  addLivingRoom: "اضافه کردن اتاق پذیرایی",
  unnamedRoom: (index) => `اتاق ${index}`,
  livingRoom: "اتاق پذیرایی",
  unsaved: "* تغییرات ذخیره نشده",
  name: "نام اتاق",
  quantity: "تعداد موجود از این اتاق",
  master: "اتاق مستر می باشد",
  singleBeds: "تعداد تخت‌های یک نفره",
  doubleBeds: "تعداد تخت‌های دو نفره",
  sofaBeds: "تعداد مبل‌های تخت خواب شو",
  floorService: "تعداد تشک‌های خواب",
  facilities: "امکانات",
  airConditions: "امکانات سرمایشی و گرمایشی",
  description: "توضیحات",
  descriptionPlaceholder: "توضیحات اتاق",
  saving: "در حال ارسال...",
  saveChanges: "ثبت تغییرات",
  saveRoom: "ثبت اتاق",
  deleting: "در حال حذف...",
  deleteRoom: "حذف اتاق",
  deleteTitle: "آیا مطمئن هستید که می‌خواهید اتاق را حذف کنید؟",
  confirmDelete: "بله حذف کن",
  cancel: "لغو",
  saveSuccess: "اتاق با موفقیت ثبت شد",
  validationError: "لطفاً خطاهای فرم را بررسی کنید",
  saveError: "خطا در ثبت اتاق",
  deleteSuccess: "اتاق با موفقیت حذف شد",
  deleteError: "خطا در حذف اتاق",
};

export function mapRoomFromApi(room) {
  return {
    roomName: room.name || "",
    isMasterRoom: room.is_master || false,
    numberSingleBeds: room.number_single_beds ?? 0,
    numberDoubleBeds: room.number_double_beds ?? 0,
    numberSofaBeds: room.number_sofa_beds ?? 0,
    numberFloorService: room.number_floor_service ?? 0,
    description: room.description || "",
    selectedFacilities: room.facilities?.map((facility) => facility.key) || [],
    selectedAirConditions:
      room.airConditions?.map((airCondition) => airCondition.key) || [],
    isLivingRoom: room.is_living_room || false,
    quantity: room.quantity ?? "",
    uuid: room.uuid || null,
    hasUnsavedChanges: false,
  };
}

export function makeInitialRooms(houseData) {
  return houseData?.room?.map(mapRoomFromApi).reverse() || [];
}

export function makeEmptyRoom({ isLivingRoom = false, isRentRoom = false }) {
  return {
    roomName: "",
    isMasterRoom: false,
    numberSingleBeds: 0,
    numberDoubleBeds: 0,
    numberSofaBeds: 0,
    numberFloorService: 0,
    description: "",
    selectedFacilities: [],
    selectedAirConditions: [],
    isLivingRoom,
    quantity: isRentRoom ? "" : null,
    uuid: null,
    hasUnsavedChanges: true,
  };
}

export function buildRoomPayload(roomData, isRentRoom) {
  return {
    name: roomData.roomName,
    is_master: roomData.isMasterRoom,
    is_living_room: roomData.isLivingRoom ? 1 : 0,
    number_single_beds: parseInt(roomData.numberSingleBeds, 10) || 0,
    number_double_beds: parseInt(roomData.numberDoubleBeds, 10) || 0,
    number_sofa_beds: parseInt(roomData.numberSofaBeds, 10) || 0,
    number_floor_service: parseInt(roomData.numberFloorService, 10) || 0,
    description: roomData.description,
    facilities: roomData.selectedFacilities,
    airConditions: roomData.selectedAirConditions,
    quantity: isRentRoom
      ? roomData.quantity === ""
        ? null
        : parseInt(roomData.quantity, 10)
      : undefined,
  };
}
