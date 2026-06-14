import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import {
  changeHouseMainPicture,
  createHousePicture,
  deleteHousePicture,
} from "../../../../services/houseService";
import Button from "../../../../ui/Button";
import EmptyState from "../../../../ui/EmptyState";
import FileUpload from "../../../../ui/FileUpload";
import Input from "../../../../ui/Input";
import Modal from "../../../../ui/Modal";
import Spinner from "../../../../ui/Loading";
import { fa } from "../../../../i18n/fa";
import { reportClientError } from "../../../../utils/reportClientError";
import {
  ImageCard,
  MainImageSwitch,
  getImageSource,
} from "./EditHouseImageCards";

const copy = fa.dashboard.editHouse.images;

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || copy.genericError;

const getResponseMedias = (data) => data?.medias || data?.data?.medias;

const EditHouseImages = ({ houseId, houseData, refetchHouseData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState(houseData?.medias || []);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [isMain, setIsMain] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [deleteModalLoading, setDeleteModalLoading] = useState(false);
  const [makeMainLoading, setMakeMainLoading] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setImages(houseData?.medias || []);
  }, [houseData?.medias]);

  const sortedImages = useMemo(
    () => [...images].sort((left, right) => Number(Boolean(right.main)) - Number(Boolean(left.main))),
    [images],
  );

  const refreshHouseData = async () => {
    if (!refetchHouseData) return;
    setIsRefreshing(true);
    try {
      await refetchHouseData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const resetAddForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setTitle("");
    setIsMain(false);
  };

  const closeAddModal = () => {
    setIsOpen(false);
    resetAddForm();
  };

  const handleFileChange = (files) => {
    const file = files?.[0];
    setImageFile(file || null);

    if (!file) {
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const displayError = (error) => {
    toast.error(getErrorMessage(error));
  };

  const addImageMutation = useMutation(
    async (formData) => createHousePicture(houseId, formData),
    {
      onSuccess: async (data) => {
        const nextMedias = getResponseMedias(data);
        if (nextMedias) setImages(nextMedias);
        toast.success(copy.addSuccess);
        closeAddModal();
        await refreshHouseData();
      },
      onError: (error) => {
        reportClientError("edit-house-image-add", error);
        displayError(error);
      },
    },
  );

  const deleteImageMutation = useMutation(
    async () => deleteHousePicture(houseId, imageToDelete?.id),
    {
      onMutate: () => setDeleteModalLoading(true),
      onSuccess: async () => {
        setImages((prev) => prev.filter((image) => image.id !== imageToDelete?.id));
        toast.success(copy.deleteSuccess);
        setDeleteModalOpen(false);
        setImageToDelete(null);
        await refreshHouseData();
      },
      onError: (error) => {
        reportClientError("edit-house-image-delete", error);
        displayError(error);
      },
      onSettled: () => setDeleteModalLoading(false),
    },
  );

  const makeMainImageMutation = useMutation(
    async (imageId) => {
      const imageToUpdate = images.find((image) => image.id === imageId);
      if (!imageToUpdate) throw new Error(copy.notFoundError);

      return changeHouseMainPicture(houseId, imageId, {
        title: imageToUpdate.title || "",
        main: 1,
      });
    },
    {
      onSuccess: async (data, imageId) => {
        const updatedId = data?.id || data?.data?.id || imageId;
        setImages((prevImages) =>
          prevImages.map((image) => ({ ...image, main: image.id === updatedId })),
        );
        toast.success(copy.mainSuccess);
        await refreshHouseData();
      },
      onError: (error) => {
        reportClientError("edit-house-image-main", error);
        displayError(error);
      },
      onSettled: (_data, _error, imageId) => {
        setMakeMainLoading((prev) => ({ ...prev, [imageId]: false }));
      },
    },
  );

  const handleAddImage = () => {
    if (!imageFile) {
      toast.error(copy.selectImageError);
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title.trim());
    if (isMain) formData.append("main", 1);

    addImageMutation.mutate(formData);
  };

  const handleMakeMain = (imageId) => {
    setMakeMainLoading((prev) => ({ ...prev, [imageId]: true }));
    makeMainImageMutation.mutate(imageId);
  };

  if (isRefreshing) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Spinner size={44} />
      </div>
    );
  }

  const addLoading = addImageMutation.isLoading || addImageMutation.isPending;

  return (
    <section className="space-y-5 p-4 text-right">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-gray-950 dark:text-white">{copy.title}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-sky-100/65">
            {fa.dashboard.editHouse.info.images}
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} size="sm">
          <PhotoIcon className="h-5 w-5" />
          {copy.add}
        </Button>
      </div>

      {sortedImages.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {sortedImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onDelete={(selectedImage) => {
                setImageToDelete(selectedImage);
                setDeleteModalOpen(true);
              }}
              onMakeMain={handleMakeMain}
              makeMainLoading={makeMainLoading}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<PhotoIcon className="h-9 w-9" />}
          title={copy.empty}
          description={copy.emptyDescription}
          action={
            <Button onClick={() => setIsOpen(true)} size="sm">
              {copy.add}
            </Button>
          }
        />
      )}

      <Modal open={isOpen} onClose={closeAddModal} title={copy.addTitle} size="form">
        <div className="space-y-5">
          <FileUpload
            label={copy.fileLabel}
            helper={copy.fileHelper}
            accept="image/*"
            files={imageFile ? [imageFile] : []}
            onChange={handleFileChange}
          />

          {imagePreview && (
            <div className="overflow-hidden rounded-3xl border border-primary-100 bg-primary-50 dark:border-primary-400/25 dark:bg-slate-950/45">
              <img
                src={imagePreview}
                alt={copy.previewAlt}
                className="h-56 w-full object-cover"
              />
            </div>
          )}

          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            label={copy.imageTitle}
            placeholder={copy.imageTitlePlaceholder}
          />

          <MainImageSwitch checked={isMain} onChange={setIsMain} />

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={closeAddModal}>
              {fa.common.actions.cancel}
            </Button>
            <Button loading={addLoading} onClick={handleAddImage}>
              {copy.add}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={copy.deleteTitle}
        size="confirm"
      >
        <div className="space-y-5">
          {imageToDelete && (
            <div className="overflow-hidden rounded-2xl border border-primary-100 dark:border-primary-400/25">
              <img
                src={getImageSource(imageToDelete)}
                alt={imageToDelete.title || copy.houseImageAlt}
                className="h-40 w-full object-cover"
              />
            </div>
          )}

          <p className="text-sm leading-7 text-gray-600 dark:text-sky-100/75">
            {copy.deleteMessage}
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              {fa.common.actions.cancel}
            </Button>
            <Button
              variant="danger"
              loading={deleteModalLoading}
              onClick={() => deleteImageMutation.mutate()}
            >
              <TrashIcon className="h-5 w-5" />
              {copy.confirmDelete}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default EditHouseImages;
