import ZonesSwiperList from "./ZonesSwiperList";
import SectionsSwipers from "./SectionsSwipers";
import BecomeHostSection from "./BecomeHostSection";
import RevealSection from "../../ui/RevealSection";

function HomeBody({ onZonesLoaded }) {
  return (
    <div className="rounded-b-3xl relative max-w-96 xs:max-w-sm small:max-w-md 550:max-w-lg sm:max-w-xl md:max-w-2xl 850:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-8xl min-h-128 mb-[46rem] sm:mb-[40rem] md:mb-[34rem] lg:mb-[26rem] xl:mb-[24rem]">
      <RevealSection as="div">
        <ZonesSwiperList skeletonCount={4} onLoaded={onZonesLoaded} />
      </RevealSection>

      <RevealSection as="div">
        <SectionsSwipers />
      </RevealSection>

      <RevealSection as="div">
        <BecomeHostSection />
      </RevealSection>
    </div>
  );
}

export default HomeBody;
