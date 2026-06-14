import {
  Fragment,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { toast } from "react-hot-toast";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import useFetchCities from "../../useFetchCities";
import useFetchProvinces from "../../useFetchProvinces";
import { createMapIrTileLayer } from "../../../../lib/mapIr";
import { reportClientError } from "../../../../utils/reportClientError";
import { fa } from "../../../../i18n/fa";

const copy = fa.dashboard.editHouse.location;
const customMarkerImage = "/assets/location.png";
const DEFAULT_LAT = 35.6892;
const DEFAULT_LNG = 51.389;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: customMarkerImage,
  iconUrl: customMarkerImage,
  shadowUrl: null,
});

const customMarkerIcon = new L.Icon({
  iconUrl: customMarkerImage,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function SelectField({
  label,
  value,
  options,
  disabled,
  loading,
  placeholder,
  loadingLabel = copy.loading,
  onChange,
}) {
  return (
    <div className="w-full">
      <label className="mb-2 block font-medium text-gray-700 dark:text-sky-50">
        {label}
      </label>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative rounded-xl bg-white dark:bg-slate-950/60">
            <Listbox.Button className="listbox__button dark:border-primary-400/25 dark:bg-slate-950/60 dark:text-sky-50">
              <span>
                {loading ? loadingLabel : value?.label || placeholder}
              </span>
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 dark:text-sky-100 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
              />
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg scrollbar-thin dark:border-primary-400/30 dark:bg-slate-950 dark:text-sky-50">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active
                          ? "bg-primary-50 text-primary-800 dark:bg-primary-500/20 dark:text-white"
                          : "text-gray-900 dark:text-sky-50"
                      }`
                    }
                  >
                    <span className="block truncate font-normal">{option.label}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
}

const EditHouseLocationDetails = forwardRef(
  ({ houseData, loadingHouse, handleEditHouse, refetchHouseData }, ref) => {
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [latitude, setLatitude] = useState(DEFAULT_LAT);
    const [longitude, setLongitude] = useState(DEFAULT_LNG);
    const [errors, setErrors] = useState({});
    const [cityOptions, setCityOptions] = useState([]);
    const [isModified, setIsModified] = useState(false);

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const { data: provinces = [], isLoading: loadingProvinces } = useFetchProvinces();
    const { data: citiesData, isLoading: loadingCities } = useFetchCities(selectedProvince?.value);

    useEffect(() => {
      if (!houseData || !provinces.length) return;

      const initialLat = houseData.address?.geography?.latitude || DEFAULT_LAT;
      const initialLng = houseData.address?.geography?.longitude || DEFAULT_LNG;
      const provinceName =
        houseData.address?.province?.name || houseData.address?.city?.province?.name;
      const cityName = houseData.address?.city?.name;
      const initialProvince = provinces.find((province) => province.name === provinceName);

      setLatitude(initialLat);
      setLongitude(initialLng);

      if (initialProvince) {
        setSelectedProvince({
          value: initialProvince.id,
          label: initialProvince.name,
        });
      }

      if (houseData.address?.city) {
        const city = { value: houseData.address.city.id, label: cityName };
        setCityOptions([city]);
        setSelectedCity(city);
      }
    }, [houseData, provinces]);

    useEffect(() => {
      if (!selectedProvince || !citiesData?.cities) return;

      const nextCityOptions = citiesData.cities.map((city) => ({
        value: city.id,
        label: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
      }));

      setCityOptions(nextCityOptions);

      if (houseData?.address?.city && selectedCity == null) {
        const city = nextCityOptions.find(
          (option) => option.value === houseData.address.city.id,
        );
        if (city) setSelectedCity(city);
      }
    }, [selectedProvince, citiesData, houseData, selectedCity]);

    useEffect(() => {
      if (mapRef.current || !mapContainerRef.current) return undefined;

      mapRef.current = L.map(mapContainerRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 11);
      createMapIrTileLayer(L).addTo(mapRef.current);

      markerRef.current = L.marker([DEFAULT_LAT, DEFAULT_LNG], {
        draggable: true,
        icon: customMarkerIcon,
      }).addTo(mapRef.current);

      const updatePosition = ({ lat, lng }) => {
        setLatitude(lat);
        setLongitude(lng);
        setIsModified(true);
        markerRef.current?.setLatLng([lat, lng]);
        toast.success(copy.newLocationSelected);
      };

      markerRef.current.on("dragend", (event) => {
        updatePosition(event.target.getLatLng());
      });

      mapRef.current.on("click", (event) => {
        updatePosition(event.latlng);
      });

      return () => {
        mapRef.current?.remove();
        mapRef.current = null;
        markerRef.current = null;
      };
    }, []);

    useEffect(() => {
      if (mapRef.current && markerRef.current) {
        mapRef.current.setView([latitude, longitude], 11);
        markerRef.current.setLatLng([latitude, longitude]);
      }
    }, [latitude, longitude]);

    const handleProvinceChange = (option) => {
      setSelectedProvince(option);
      setSelectedCity(null);
      setCityOptions([]);
      setIsModified(true);
    };

    const handleCityChange = (option) => {
      setSelectedCity(option);
      setLatitude(option.latitude || latitude);
      setLongitude(option.longitude || longitude);
      setIsModified(true);
    };

    const validateAndSubmit = async () => {
      if (!isModified) return true;

      setErrors({});

      if (!selectedCity) {
        setErrors((prev) => ({
          ...prev,
          city_id: [copy.selectCityValidation],
        }));
        toast.error(copy.selectCityValidation);
        return false;
      }

      try {
        await handleEditHouse({
          city_id: selectedCity.value,
          latitude,
          longitude,
        });
        await refetchHouseData?.();
        toast.success(copy.saveSuccess);
        setIsModified(false);
        return true;
      } catch (error) {
        reportClientError("Submission Error:", error);
        if (error.errors?.fields) {
          setErrors(error.errors.fields);
        }
        toast.error(error.message || copy.saveError);
        return false;
      }
    };

    useImperativeHandle(ref, () => ({
      validateAndSubmit,
    }));

    if (loadingHouse) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loading type="beat" color="primary" size={8} />
        </div>
      );
    }

    const provinceOptions = provinces.map((province) => ({
      value: province.id,
      label: province.name,
    }));

    return (
      <div className="relative p-4">
        {errors.general && (
          <div className="mb-4 space-y-2">
            {errors.general.map((error) => (
              <div key={error} className="text-sm text-red-500 dark:text-red-200">
                {error}
              </div>
            ))}
          </div>
        )}

        <form className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SelectField
            label={copy.province}
            value={selectedProvince}
            options={provinceOptions}
            disabled={loadingProvinces}
            loading={loadingProvinces}
            placeholder={copy.selectProvince}
            onChange={handleProvinceChange}
          />

          <div>
            <SelectField
              label={copy.city}
              value={selectedCity}
              options={cityOptions}
              disabled={!selectedProvince || loadingCities}
              loading={Boolean(selectedProvince && loadingCities)}
              placeholder={selectedProvince ? copy.selectCity : copy.selectProvinceFirst}
              onChange={handleCityChange}
            />
            {errors.city_id && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-200">
                {errors.city_id[0]}
              </p>
            )}
          </div>

          <TextField label={copy.latitude} name="latitude" value={latitude} readOnly />
          <TextField label={copy.longitude} name="longitude" value={longitude} readOnly />

          <div
            className="z-0 mt-6 h-[400px] w-full overflow-hidden rounded-lg border shadow-centered lg:col-span-2"
            ref={mapContainerRef}
          />
        </form>
      </div>
    );
  },
);

EditHouseLocationDetails.displayName = "EditHouseLocationDetails";

export default EditHouseLocationDetails;
