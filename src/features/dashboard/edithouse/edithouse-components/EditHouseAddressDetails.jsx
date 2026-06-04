import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import Card from "../../../../ui/Card";
import Input from "../../../../ui/Input";
import Loading from "../../../../ui/Loading";
import { fa } from "../../../../i18n/fa";
import { reportClientError } from "../../../../utils/reportClientError";

const copy = fa.dashboard.editHouse.addressDetails;

const initialFormData = {
  address: "",
  neighborhood: "",
  floor: "",
  plaqueNumber: "",
  postalCode: "",
};

const getFieldError = (errors, key) => {
  const value = errors?.[key];
  return Array.isArray(value) ? value.join("، ") : value;
};

const mapAddressToForm = (address = {}) => ({
  address: address.address || "",
  neighborhood: address.village || "",
  floor: address.floor || "",
  plaqueNumber: address.house_number || "",
  postalCode: address.postal_code || "",
});

const mapFormToPayload = (formData) => ({
  address: formData.address,
  village_name: formData.neighborhood,
  floor: formData.floor,
  house_number: formData.plaqueNumber,
  postal_code: formData.postalCode,
});

const mapFormToAddress = (formData, previousAddress = {}) => ({
  ...previousAddress,
  address: formData.address,
  village: formData.neighborhood,
  floor: formData.floor,
  house_number: formData.plaqueNumber,
  postal_code: formData.postalCode,
});

const EditHouseAddressDetails = forwardRef(
  ({ houseData, setHouseData, loadingHouse, handleEditHouse }, ref) => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isModified, setIsModified] = useState(false);

    useEffect(() => {
      setFormData(mapAddressToForm(houseData?.address));
      setIsModified(false);
      setErrors({});
    }, [houseData?.address]);

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setIsModified(true);
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateAndSubmit = async () => {
      if (!isModified) return true;

      setErrors({});

      if (formData.postalCode && !/^\d{10}$/.test(formData.postalCode)) {
        setErrors({ postal_code: [copy.invalidPostalCode] });
        toast.error(copy.invalidPostalCodeToast);
        return false;
      }

      try {
        await handleEditHouse(mapFormToPayload(formData));
        toast.success(copy.saveSuccess);
        setHouseData((prevData) => ({
          ...prevData,
          address: mapFormToAddress(formData, prevData?.address),
        }));
        setIsModified(false);
        return true;
      } catch (errorData) {
        reportClientError("edit-house-address-save", errorData);

        const fieldErrors = errorData?.errors?.fields;
        if (fieldErrors) setErrors(fieldErrors);

        toast.error(errorData?.message || copy.saveError);
        return false;
      }
    };

    useImperativeHandle(ref, () => ({ validateAndSubmit }));

    if (loadingHouse) return <Loading message={copy.loading} />;

    return (
      <Card variant="surface" padding="p-4" className="bg-transparent shadow-none dark:bg-transparent">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            validateAndSubmit();
          }}
          className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
        >
          <Input
            label={copy.address}
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder={copy.addressPlaceholder}
            error={getFieldError(errors, "address")}
          />

          <Input
            label={copy.neighborhood}
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleInputChange}
            placeholder={copy.neighborhoodPlaceholder}
            error={getFieldError(errors, "village_name")}
          />

          <Input
            label={copy.floor}
            name="floor"
            value={formData.floor}
            onChange={handleInputChange}
            placeholder={copy.floorPlaceholder}
            error={getFieldError(errors, "floor")}
          />

          <Input
            label={copy.plaqueNumber}
            name="plaqueNumber"
            value={formData.plaqueNumber}
            onChange={handleInputChange}
            placeholder={copy.plaqueNumberPlaceholder}
            error={getFieldError(errors, "house_number")}
          />

          <Input
            label={copy.postalCode}
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            placeholder={copy.postalCodePlaceholder}
            error={getFieldError(errors, "postal_code")}
            inputMode="numeric"
          />
        </form>
      </Card>
    );
  },
);

EditHouseAddressDetails.displayName = "EditHouseAddressDetails";

export default EditHouseAddressDetails;
