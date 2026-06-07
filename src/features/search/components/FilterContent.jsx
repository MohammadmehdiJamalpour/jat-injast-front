import { useMemo, useState, useCallback } from "react";

import PeopleNumberFilter from "./PeopleNumberFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import BedsRoomsFilter from "./BedsRoomsFilter";
import AmenitiesFilter from "./AmenitiesFilter";
import PropertyTypeFilter from "./PropertyTypeFilter";
import RegionFilter from "./RegionFilter";
import OwnershipTypeFilter from "./OwnershipTypeFilter";
import RulesFilter from "./RulesFilter";
import DateRangeCalendar from "./DateRangeCalendar";
import PropertyViewsFilter from "./PropertyViewsFilter";
import StructureTypeFilter from "./StructureTypeFilter";

import {
  useFetchTextures,
  useFetchPrivacyOptions,
  useFetchFacilities,
  useFetchPropertyTypes,
  useFetchRules,
  useFetchHouseFloors,
  useFetchHouseViews,
} from "../../../services/fetchDataService";

const REGION_FALLBACK = [
  { key: "Village", label: "روستایی" },
  { key: "Forest", label: "جنگلی" },
  { key: "Beach", label: "ساحلی" },
];
const OWNERSHIP_FALLBACK = [
  { key: "FullPrivacy", label: "دربست" },
  { key: "HalfPrivacy", label: "نیمه دربست" },
  { key: "NoPrivacy", label: "حیاط مشترک" },
];
const AMENITIES_FALLBACK = [
  { key: "internet", label: "اینترنت" },
  { key: "parking", label: "پارکینگ" },
  { key: "ac", label: "تهویه مطبوع" },
];
const PROPERTY_TYPES_FALLBACK = [
  { key: "villa", label: "ویلا" },
  { key: "apartment", label: "آپارتمان" },
  { key: "suite", label: "سوییت" },
];
const RULES_FALLBACK = [
  { key: "IdCard", label: "ارائه مدارک شناسایی معتبر" },
  { key: "Pet", label: "ورود حیوانات خانگی به داخل اقامتگاه" },
  { key: "Smoking", label: "استعمال دخانیات در فضای داخلی" },
];
const STRUCTURE_FALLBACK = [
  { key: "OneFloor", label: "همسطح" },
  { key: "DoubleFloor", label: "دوبلکس" },
  { key: "ThirdFloor", label: "تریپلکس" },
];
const VIEWS_FALLBACK = [
  { key: "SeaView", label: "رو به دریا" },
  { key: "MountainView", label: "رو به کوهستان" },
  { key: "ForestView", label: "رو به جنگل" },
];

export default function FilterContent({ filter }) {
  const { data: textures = [], isLoading: isLoadingTextures, isError: isErrorTextures } =
    useFetchTextures();
  const regionOptions = useMemo(() => textures.map((t) => ({ key: t.key, label: t.label })), [textures]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const toggleRegion = useCallback((key) => {
    setSelectedRegions((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }, []);

  const { data: privacy = [], isLoading: isLoadingPrivacy, isError: isErrorPrivacy } =
    useFetchPrivacyOptions();
  const ownershipOptions = useMemo(() => privacy.map((p) => ({ key: p.key, label: p.label })), [privacy]);
  const [selectedOwnership, setSelectedOwnership] = useState([]);
  const toggleOwnership = useCallback((key) => {
    setSelectedOwnership((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }, []);

  const { data: facilities = [], isLoading: isLoadingFacilities, isError: isErrorFacilities } =
    useFetchFacilities();
  const amenitiesOptions = useMemo(() => facilities.map((f) => ({ key: f.key, label: f.label })), [facilities]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const toggleAmenity = useCallback((key) => {
    setSelectedAmenities((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }, []);

  const { data: propertyTypes = [], isLoading: isLoadingTypes, isError: isErrorTypes } =
    useFetchPropertyTypes();
  const propertyTypeOptions = useMemo(
    () => propertyTypes.map((item) => ({ key: item.key, label: item.label })),
    [propertyTypes]
  );
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const togglePropertyType = useCallback((key) => {
    setSelectedPropertyTypes((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }, []);

  const { data: rules = [], isLoading: isLoadingRules, isError: isErrorRules } = useFetchRules();
  const rulesOptions = useMemo(() => rules.map((r) => ({ key: r.key, label: r.label })), [rules]);
  const [selectedRules, setSelectedRules] = useState([]);
  const toggleRule = useCallback((key) => {
    setSelectedRules((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }, []);

  const { data: floors = [], isLoading: isLoadingFloors, isError: isErrorFloors } =
    useFetchHouseFloors();
  const structureOptions = useMemo(() => floors.map((f) => ({ key: f.key, label: f.label })), [floors]);
  const [selectedStructures, setSelectedStructures] = useState([]);
  const toggleStructure = useCallback((key) => {
    setSelectedStructures((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }, []);

  const { data: houseViews = [], isLoading: isLoadingViews, isError: isErrorViews } =
    useFetchHouseViews();
  const viewOptions = useMemo(() => houseViews.map((v) => ({ key: v.key, label: v.label })), [houseViews]);
  const [selectedViews, setSelectedViews] = useState([]);
  const toggleView = useCallback((key) => {
    setSelectedViews((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }, []);

  switch (filter) {
    case "تاریخ سفر":
      return <DateRangeCalendar />;
    case "تعداد نفرات":
      return <PeopleNumberFilter />;
    case "محدوده اجاره‌بها":
      return <PriceRangeFilter />;
    case "تعداد تخت و اتاق":
      return <BedsRoomsFilter />;

    case "منظره اقامتگاه":
      return (
        <PropertyViewsFilter
          label="منظره اقامتگاه"
          options={viewOptions}
          fallbackOptions={VIEWS_FALLBACK}
          selected={selectedViews}
          onToggle={toggleView}
          isLoading={isLoadingViews}
          isError={isErrorViews}
        />
      );

    case "نوع سازه":
      return (
        <StructureTypeFilter
          label="نوع سازه"
          options={structureOptions}
          fallbackOptions={STRUCTURE_FALLBACK}
          selected={selectedStructures}
          onToggle={toggleStructure}
          isLoading={isLoadingFloors}
          isError={isErrorFloors}
        />
      );

    case "بافت محیط":
      return (
        <RegionFilter
          label="بافت محیط"
          options={regionOptions}
          fallbackOptions={REGION_FALLBACK}
          selected={selectedRegions}
          onToggle={toggleRegion}
          isLoading={isLoadingTextures}
          isError={isErrorTextures}
        />
      );

    case "نوع مالکیت":
      return (
        <OwnershipTypeFilter
          label="نوع مالکیت"
          options={ownershipOptions}
          fallbackOptions={OWNERSHIP_FALLBACK}
          selected={selectedOwnership}
          onToggle={toggleOwnership}
          isLoading={isLoadingPrivacy}
          isError={isErrorPrivacy}
        />
      );

    case "امکانات اقامتگاه":
      return (
        <AmenitiesFilter
          label="امکانات اقامتگاه"
          options={amenitiesOptions}
          fallbackOptions={AMENITIES_FALLBACK}
          selected={selectedAmenities}
          onToggle={toggleAmenity}
          isLoading={isLoadingFacilities}
          isError={isErrorFacilities}
        />
      );

    case "نوع اقامتگاه":
      return (
        <PropertyTypeFilter
          label="نوع اقامتگاه"
          options={propertyTypeOptions}
          fallbackOptions={PROPERTY_TYPES_FALLBACK}
          selected={selectedPropertyTypes}
          onToggle={togglePropertyType}
          isLoading={isLoadingTypes}
          isError={isErrorTypes}
        />
      );

    case "مقررات اقامتگاه":
      return (
        <RulesFilter
          label="مقررات اقامتگاه"
          options={rulesOptions}
          fallbackOptions={RULES_FALLBACK}
          selected={selectedRules}
          onToggle={toggleRule}
          isLoading={isLoadingRules}
          isError={isErrorRules}
        />
      );

    default:
      return null;
  }
}
