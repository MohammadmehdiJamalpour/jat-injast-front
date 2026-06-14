import dynamic from "next/dynamic";

export function SectionSkeleton({ className = "h-32" }) {
  return (
    <div className={`my-3 rounded-3xl bg-gray-100 animate-pulse dark:bg-slate-800 ${className}`} />
  );
}

export function MapSkeleton() {
  return <SectionSkeleton className="h-[250px] w-full rounded-[24px]" />;
}

export const HouseFacilities = dynamic(
  () => import("./houseComponents/HouseFacilities"),
  {
    ssr: false,
    loading: () => <SectionSkeleton />,
  },
);

export const HouseLocation = dynamic(
  () => import("./houseComponents/HouseLocation"),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  },
);

export const HouseRooms = dynamic(() => import("./houseComponents/HouseRooms"), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

export const HouseSanitaries = dynamic(
  () => import("./houseComponents/HouseSanitaries"),
  {
    ssr: false,
    loading: () => <SectionSkeleton />,
  },
);

export const HouseCalendar = dynamic(
  () => import("./houseComponents/HouseCalendar"),
  {
    ssr: false,
    loading: () => <SectionSkeleton className="h-64" />,
  },
);
