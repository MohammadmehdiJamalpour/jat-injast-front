import { useEffect, useState } from "react";
import DynamicSwiperList from "../DynamicSwiperList";
import HouseCard from "./HouseCard";
import { fa } from "../../i18n/fa";
import { getHomeContent } from "../../services/homeService";
import { reportClientError } from "../../utils/reportClientError";

const adaptToHouse = (item) => ({
  ...item,
  id: item?.uuid ?? item?.id,
});

const HOUSE_SWIPER_CLASS_NAME = "w-full !px-0 !pb-0";
const HOUSE_SCROLLER_OUTER_CLASS_NAME = "overflow-visible xs:-mx-4 sm:-mx-5";
const HOUSE_SLIDE_CLASS_NAME =
  "!w-[90%] sm:!w-[calc(45%_-_0.45rem)] xl:!w-[calc(30%_-_0.6rem)]";
const HOUSE_SKELETON_SLIDE_CLASS_NAME =
  "w-[90%] sm:w-[calc(45%_-_0.45rem)] xl:w-[calc(30%_-_0.6rem)]";

const SkeletonSlide = (_, i) => (
  <div
    key={i}
    className={`relative h-48 flex-shrink-0 rounded-3xl bg-gray-300 ${HOUSE_SKELETON_SLIDE_CLASS_NAME}`}
  >
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/5 h-4 bg-gray-400 rounded-full" />
  </div>
);

const SkeletonSwiper = (_, idx) => (
  <div
    key={idx}
    className="group overflow-visible px-0 pb-0 pt-4 text-primary-800 animate-pulse xs:mb-3 xs:p-0"
  >
    <h2 className="mb-3 mx-2 h-6 w-28 rounded bg-gray-300" />

    <div className="relative overflow-visible">
      <div className={HOUSE_SCROLLER_OUTER_CLASS_NAME}>
        <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-px-5 px-5 py-5">
          {Array.from({ length: 4 }, SkeletonSlide)}
        </div>
      </div>
    </div>
  </div>
);

function getHouseSections(content) {
  const rawSections = content?.homepage_sections ?? [];

  return rawSections
    .filter((s) => ["houses", "zone"].includes(s.content_type))
    .map((s) => ({
      title: s.title ?? fa.home.untitledSection,
      items: (s.content ?? []).map(adaptToHouse),
    }));
}

function SectionsSwipers({ initialContent }) {
  const [sections, setSections] = useState(() => getHouseSections(initialContent));
  const [loading,  setLoading]  = useState(!initialContent);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (initialContent) return undefined;

    getHomeContent()
      .then((data) => {
        setSections(getHouseSections(data));
        setLoading(false);
      })
      .catch((e) => {
        reportClientError("Home sections fetch", e);
        setError(e);
        setLoading(false);
      });
  }, [initialContent]);

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
          slideClassName={HOUSE_SLIDE_CLASS_NAME}
          className={HOUSE_SWIPER_CLASS_NAME}
          scrollerOuterClassName={HOUSE_SCROLLER_OUTER_CLASS_NAME}
        />
      ))}
    </>
  );
}

export default SectionsSwipers;
