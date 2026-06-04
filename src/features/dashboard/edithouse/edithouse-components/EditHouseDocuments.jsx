import { useState } from "react";
import { toast } from "react-hot-toast";
import Button from "../../../../ui/Button";
import FileUpload from "../../../../ui/FileUpload";
import { uploadHouseDocument } from "../../../../services/houseService";
import { reportClientError } from "../../../../utils/reportClientError";
import { fa } from "../../../../i18n/fa";

const copy = fa.dashboard.editHouse.documents;

const EditHouseDocuments = ({ houseData, houseId, refetchHouseData }) => {
  const [loading, setLoading] = useState(false);
  const [documentFiles, setDocumentFiles] = useState({});

  const displayError = (error) => {
    toast.error(error.response?.data?.message || error.message || copy.genericError);
  };

  const handleDocumentChange = (files, documentType) => {
    const file = files?.[0];
    if (!file) return;

    setDocumentFiles((prevFiles) => ({
      ...prevFiles,
      [documentType]: file,
    }));
  };

  const handleDocumentUpload = async (documentType, file) => {
    try {
      await uploadHouseDocument(houseId, {
        document_type: documentType,
        document: file,
      });
    } catch (error) {
      displayError(error);
      reportClientError("Document Upload Error:", error);
      throw error;
    }
  };

  const handleSubmitAll = async () => {
    setLoading(true);

    try {
      const results = await Promise.allSettled(
        Object.entries(documentFiles).map(([documentType, file]) =>
          handleDocumentUpload(documentType, file),
        ),
      );

      if (results.every((result) => result.status === "fulfilled")) {
        toast.success(copy.uploadSuccess);
      } else {
        toast.error(copy.partialUploadError);
      }

      await refetchHouseData?.();
      setDocumentFiles({});
    } catch (error) {
      reportClientError("Document Upload Batch Error:", error);
      toast.error(copy.uploadError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 font-bold text-gray-950 dark:text-white">{copy.title}</h2>

      <div className="space-y-6">
        {houseData?.documents?.map((doc, index) => {
          const documentKey = doc.type.key;
          const selectedFile = documentFiles[documentKey];

          return (
            <div key={`${documentKey}-${index}`} className="space-y-3">
              <div className="m-1 flex items-center gap-2">
                {doc?.type?.icon && (
                  <img
                    src={doc.type.icon}
                    alt=""
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                )}
                <label className="mb-1 block font-medium text-gray-800 dark:text-sky-50">
                  {doc?.type?.label}
                </label>
              </div>

              <FileUpload
                label={doc?.type?.label}
                disabled={!doc.can_edit}
                files={selectedFile ? [selectedFile] : []}
                onChange={(files) => handleDocumentChange(files, documentKey)}
              />

              <div className="text-sm text-gray-600 dark:text-sky-100/75">
                {copy.status}{" "}
                <span className="font-bold text-primary-700 dark:text-sky-50">
                  {doc.status.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Button
          onClick={handleSubmitAll}
          disabled={loading || Object.keys(documentFiles).length === 0}
          loading={loading}
        >
          {loading ? copy.loading : copy.submitAll}
        </Button>
      </div>
    </div>
  );
};

export default EditHouseDocuments;
