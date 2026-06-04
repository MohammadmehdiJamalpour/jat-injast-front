import React, { useState, useEffect } from "react";
import { Dialog, RadioGroup } from "@headlessui/react";
import {
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  HomeIcon,
  HomeModernIcon,
  MapPinIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "@/lib/router-compat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import HouseCard from "./HouseCard";
import useFetchHouses from "./useFetchHouses";
import useFetchHouseTypes from "./useFetchHouseTypes";
import Loading from "../../ui/Loading";
import { createHouse, deleteHouse } from "../../services/houseService";
import CustomInfoIcon from "./../../ui/CustomInfoIcon";

function getHouseTypeIcon(option) {
  const text = `${option?.key || ""} ${option?.label || ""}`.toLowerCase();
  if (text.includes("آپارتمان") || text.includes("apartment")) return BuildingOffice2Icon;
  if (text.includes("مجتمع") || text.includes("اقامتی") || text.includes("complex")) return BuildingStorefrontIcon;
  if (text.includes("مهمان") || text.includes("guest")) return UserGroupIcon;
  if (text.includes("کلبه") || text.includes("cabin")) return HomeIcon;
  if (text.includes("ساحل") || text.includes("beach")) return MapPinIcon;
  if (text.includes("سوئیت") || text.includes("suite")) return SparklesIcon;
  return HomeModernIcon;
}

const Houses = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* --- data fetching – houses & house types --- */
  const {
    data: houses = [],
    isLoading: isHousesLoading,
    isError: isHousesError,
    refetch: refetchHouses,
    isFetching: isRefetchingHouses,
  } = useFetchHouses();

  const {
    data: houseTypes = [],
    isLoading: isHouseTypesLoading,
    isFetching: isHouseTypesFetching,
    isError: isHouseTypesError,
  } = useFetchHouseTypes();

  /* --- local UI state --- */
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [dialogErrorMessage, setDialogErrorMessage] = useState("");
  const [houseToDelete, setHouseToDelete] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  /* --- initialise first house-type when modal opens --- */
  useEffect(() => {
    if (isAddDialogOpen && houseTypes.length) setSelectedOption(houseTypes[0].key);
  }, [isAddDialogOpen, houseTypes]);

  /* ---------- mutations ---------- */
  const createHouseMutation = useMutation(createHouse, {
    onSuccess: async ({ uuid }) => {
      toast.success("اقامتگاه با موفقیت اضافه شد!");
      navigate(`/dashboard/edit-house/${uuid}`);
      await queryClient.invalidateQueries(["get-houses"]);
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message ??
        "خطا در اضافه کردن اقامتگاه. لطفاً دوباره تلاش کنید.";
      setDialogErrorMessage(msg);
      toast.error(msg);
    },
  });

  const deleteHouseMutation = useMutation(deleteHouse, {
    onSuccess: async () => {
      toast.success("اقامتگاه با موفقیت حذف شد!");
      setIsDeleteConfirmDialogOpen(false);
      await refetchHouses();
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message ??
        "خطا در حذف اقامتگاه. لطفاً دوباره تلاش کنید.";
      toast.error(msg);
    },
  });

  /* ---------- handlers ---------- */
  const handleAddHouse = async () => {
    setDialogErrorMessage("");
    await createHouseMutation.mutateAsync({ structure: selectedOption });
    setIsAddDialogOpen(false);
  };

  const handleDeleteHouse = (uuid) => {
    setHouseToDelete(uuid);
    setIsDeleteConfirmDialogOpen(true);
  };

  const confirmDeleteHouse = async () => {
    if (houseToDelete) {
      await deleteHouseMutation.mutateAsync(houseToDelete);
      setHouseToDelete(null);
    }
  };

  /* ---------- UI states ---------- */
  if (isRefetchingHouses)
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <Loading message="در حال بارگذاری اقامتگاه‌ها..." />
      </div>
    );

  if (isHousesError || isHouseTypesError)
    return (
      <div className="text-center text-red-500">
        خطا در بارگذاری اقامتگاه‌ها یا نوع اقامتگاه. لطفا دوباره امتحان کنید.
      </div>
    );

  return (
    <div className="w-full h-full p-2 sm:p-3">
      {/* header */}
      <div className="w-full flex justify-between items-center mb-2 lg:mb-4">
        <h2 className="text-xl">اقامتگاه ها :</h2>
        <div className="flex items-center">
          <CustomInfoIcon
            className="w-6 h-6 text-gray-500 cursor-pointer ml-2"
            onClick={() => setIsInfoModalOpen(true)}
          />
          <button
            className="btn bg-primary-600 hover:opacity-100"
            onClick={() => setIsAddDialogOpen(true)}
          >
            اضافه کردن اقامتگاه
          </button>
        </div>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
        {houses.map((h) => (
          <HouseCard
            key={h.uuid}
            house={h}
            onDelete={() => handleDeleteHouse(h.uuid)}
            isDeleting={h.uuid === houseToDelete && deleteHouseMutation.isLoading}
          />
        ))}
      </div>

      {/* Add House Modal */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        dir="rtl"
        className="relative z-50 text-right"
      >
        <div
          className="fixed inset-0 bg-white/15 backdrop-blur-md dark:bg-white/5"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            dir="rtl"
            className="w-full max-w-xl space-y-4 rounded-3xl border border-primary-100 bg-white p-5 text-right shadow-xl shadow-primary-100/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/20 sm:p-6"
          >
            <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-slate-100 sm:text-xl">
              افزودن اقامتگاه
            </Dialog.Title>
            <p className="text-sm text-gray-600 dark:text-slate-300">
              نوع اقامتگاه را انتخاب کنید.
            </p>
            {isHouseTypesFetching ? (
              <Loading message="در حال بارگذاری نوع اقامتگاه..." />
            ) : (
              <div className="w-full">
                <RadioGroup
                  value={selectedOption}
                  onChange={setSelectedOption}
                  className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                >
                  {houseTypes.map((option) => {
                    const Icon = getHouseTypeIcon(option);
                    return (
                      <RadioGroup.Option
                        key={option.key}
                        value={option.key}
                        className="flex items-center"
                      >
                        {({ checked }) => (
                        <div
                          className={`group flex min-h-12 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-2xl border px-3 py-2 text-right transition ${
                            checked
                              ? "border-primary-600 bg-primary-600 text-white shadow-sm"
                              : "border-gray-200 bg-white text-gray-800 hover:border-primary-200 hover:bg-primary-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-primary-400/60 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${
                              checked
                                ? "bg-white/20 text-white"
                                : "bg-primary-50 text-primary-700 group-hover:bg-white dark:bg-slate-900 dark:text-primary-200"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 truncate text-sm font-semibold sm:text-base">
                              {option.label}
                          </span>
                        </div>
                        )}
                      </RadioGroup.Option>
                    );
                  })}
                </RadioGroup>
              </div>
            )}
            {dialogErrorMessage && (
              <p className="text-red-500 mt-2">{dialogErrorMessage}</p>
            )}
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                className="btn-secondary btn-press px-5"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={createHouseMutation.isLoading}
              >
                لغو
              </button>
              <button
                className="btn-primary btn-press px-5"
                onClick={handleAddHouse}
                disabled={createHouseMutation.isLoading}
              >
                {createHouseMutation.isLoading
                  ? "در حال اضافه کردن ..."
                  : "اضافه کردن"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteConfirmDialogOpen}
        onClose={() => setIsDeleteConfirmDialogOpen(false)}
        dir="rtl"
        className="relative z-50 text-right"
      >
        <div
          className="fixed inset-0 bg-white/15 backdrop-blur-md dark:bg-white/5"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 text-right">
          <Dialog.Panel className="w-full max-w-lg space-y-4 rounded-3xl border bg-white p-6 text-right dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <Dialog.Title className="font-bold text-xl">
              آیا از حذف کردن این اقامتگاه مطمئن هستید؟
            </Dialog.Title>
            <div className="flex gap-4 mt-4">
              <button
                className="btn bg-gray-300 text-gray-800"
                onClick={() => setIsDeleteConfirmDialogOpen(false)}
                disabled={deleteHouseMutation.isLoading}
              >
                لغو
              </button>
              <button
                className="btn bg-red-600 text-white"
                onClick={confirmDeleteHouse}
                disabled={deleteHouseMutation.isLoading}
              >
                {deleteHouseMutation.isLoading ? "در حال حذف..." : "بله"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Info Modal */}
      <Dialog
        open={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        dir="rtl"
        className="relative z-50 text-right"
      >
        <div
          className="fixed inset-0 bg-white/15 backdrop-blur-md dark:bg-white/5"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 text-right">
          <Dialog.Panel className="w-full max-w-lg rounded-3xl border bg-white p-6 text-right dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <Dialog.Title className="font-bold text-xl">
              میزبان گرامی
            </Dialog.Title>
            <p className="mt-4 text-justify leading-7">
              میزبان گرامی، به دلیل تنوع انواع اقامتگاه و اطلاعات متفاوت آن‌ها
              در سایت ممکن است ثبت اقامتگاه برای شما کمی زمان‌بر و پیچیده باشد.
              توجه داشته باشید که ثبت و تایید اقامتگاه در سایت برای هر اقامتگاه
              فقط یک‌بار می‌باشد و در آینده تنها احتیاج به به‌روز نگهداری تقویم
              قیمت اقامتگاه است. پس با حوصله و دقیق به این کار اقدام فرمایید و
              در صورت هرگونه ایراد یا اشکال با پشتیبانی سایت تماس بگیرید.
            </p>
            <div className="flex justify-end mt-6">
              <button
                className="btn bg-primary-600 text-white"
                onClick={() => setIsInfoModalOpen(false)}
              >
                بستن
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Houses;
