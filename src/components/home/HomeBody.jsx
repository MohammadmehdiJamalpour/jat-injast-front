import ZonesSwiperList from "./ZonesSwiperList";
import SectionsSwipers from "./SectionsSwipers";
import BecomeHostSection from "./BecomeHostSection";
import RevealSection from "../../ui/RevealSection";

function HomeBody({ initialContent, initialZones, onZonesLoaded }) {
  return (
    <div className="relative flow-root min-h-128 w-full max-w-full rounded-b-3xl pb-6 xs:max-w-sm small:max-w-md 550:max-w-lg sm:max-w-xl sm:pb-8 md:max-w-2xl 850:max-w-3xl lg:max-w-4xl lg:pb-10 xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-8xl">
      <RevealSection as="div">
        <ZonesSwiperList
          initialZones={initialZones}
          skeletonCount={4}
          onLoaded={onZonesLoaded}
        />
      </RevealSection>

      <RevealSection as="div">
        <SectionsSwipers initialContent={initialContent} />
      </RevealSection>

      <RevealSection as="div">
        <BecomeHostSection />
      </RevealSection>
    </div>
  );
}

export default HomeBody;
