import React, { useEffect, useState } from "react";
import DynamicSwiperList from "../DynamicSwiperList";
import HouseCard from "./HouseCard";
import { fa } from "../../i18n/fa";
import { getHomeContent } from "../../services/homeService";
import { reportClientError } from "../../utils/reportClientError";

const adaptToHouse = (item) => ({
  id:   item.uuid ?? item.id,
  name: item.name,
  images: item.image ? [item.image] : [],
  image: item.image ?? null,
  vote:  item.vote ?? null,
  structure : item.structure ?? null,
  address: item.address ?? null,
  price:item.price ?? null, 

});

const SkeletonSlide = (_, i) => (
  <div
    key={i}
    className="relative flex-shrink-0 w-3/5 sm:w-1/2 md:w-1/3 lg:w-1/5
               h-48 rounded-3xl bg-gray-300"
  >
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/5 h-4 bg-gray-400 rounded-full" />
  </div>
);

const SkeletonSwiper = (_, idx) => (
  <div
    key={idx}
    className="group overflow-visible p-5 xs:p-0 pt-4 xs:mb-3
               text-primary-800 animate-pulse"
  >
    <h2 className="mb-3 mx-2 h-6 w-28 rounded bg-gray-300" />

    <div className="relative overflow-hidden px-2">
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {Array.from({ length: 4 }, SkeletonSlide)}
      </div>
    </div>
  </div>
);

function SectionsSwipers() {
  const [sections, setSections] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    getHomeContent()
      .then((data) => {
        const rawSections = data?.homepage_sections ?? [];

        const houseSections = rawSections
          .filter((s) => ["houses", "zone"].includes(s.content_type))
          .map((s) => ({
            title: s.title ?? fa.home.untitledSection,
            items: (s.content ?? []).map(adaptToHouse),
          }));

        setSections(houseSections);
        setLoading(false);
      })
      .catch((e) => {
        reportClientError("Home sections fetch", e);
        setError(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <>{Array.from({ length: 3 }, SkeletonSwiper)}</>;
  }

  if (error) {
    return (
      <p className="my-10 text-center text-red-600">
        {fa.home.sectionsLoadError}
      </p>
    );
  }

  return (
    <>
      {sections.map((section) => (
        <DynamicSwiperList
          key={section.title}
          title={section.title}
          items={section.items}
          renderItem={(house) => <HouseCard house={house} />}
        />
      ))}
    </>
  );
}

export default SectionsSwipers;
