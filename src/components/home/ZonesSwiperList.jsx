import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import DynamicSwiperList from "../DynamicSwiperList";
import { listZones } from "../../services/listZoneServices";
import { reportClientError } from "../../utils/reportClientError";
import { buildDestinationHref } from "./destinationLinks";
import { fa } from "../../i18n/fa";

function ZonesSwiperList({ skeletonCount = 4, onLoaded }) {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    listZones()
      .then((data) => {
        setZones(data);
        setLoading(false);
        onLoaded?.(data);
      })
      .catch((err) => {
        reportClientError("Popular destinations fetch", err);
        setError(err);
        setLoading(false);
      });
  }, [onLoaded]);

  const renderSkeleton = (count) => (
    <div className="overflow-hidden rounded-b-3xl pb-10">
      <h2 className="mx-2 mb-3 font-bold sm:text-lg md:text-xl">
        {fa.home.popularDestinations}
      </h2>
      <div className="relative overflow-hidden px-2">
        <div className="no-scrollbar flex animate-pulse gap-4 overflow-x-auto">
          {[...Array(count)].map((_, index) => (
            <div
              key={index}
              className="relative h-48 w-3/5 flex-shrink-0 rounded-3xl bg-gray-300 sm:w-1/2 md:w-1/3 lg:w-1/5"
            >
              <div className="absolute bottom-3 left-1/2 h-4 w-3/5 -translate-x-1/2 rounded-full bg-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) return renderSkeleton(skeletonCount);

  if (error) {
    return (
      <p className="mt-4 text-center text-red-500">
        {fa.common.errors.loadDestinations}
      </p>
    );
  }

  return (
    <DynamicSwiperList
      title={fa.home.popularDestinations}
      items={zones}
      spaceBetween={8}
      slideClassName="!w-[76%] sm:!w-[48%] md:!w-[31%] lg:!w-[24%] xl:!w-[22%]"
      className="px-2 md:px-0"
      renderItem={(zone) => (
        <Link
          data-testid={`destination-card-${zone.slug || zone.id}`}
          to={buildDestinationHref(zone)}
          className="relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.03] focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300/50"
          aria-label={fa.home.searchDestination(zone.name)}
        >
          {zone.avatar && (
            <img
              src={zone.avatar}
              alt={zone.name}
              className="m-1.5 aspect-video h-36 rounded-3xl border border-primary-500 object-cover shadow-centered shadow-primary-50 transition-shadow duration-300 hover:shadow-primary-200 xs:h-40 sm:max-h-36 md:h-44"
            />
          )}
          <h3 className="destination-label -translate-y-7">{zone.name}</h3>
        </Link>
      )}
    />
  );
}

export default ZonesSwiperList;
