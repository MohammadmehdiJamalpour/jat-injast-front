import { useCallback, useMemo, useState } from "react";
import HomeBody from "./HomeBody";
import Footer from "../Footer";

const EMPTY_ZONES = [];

function HomeContainer({ initialContent, initialZones, initialFooterContent }) {
  const normalizedInitialZones = useMemo(
    () => (Array.isArray(initialZones) ? initialZones : EMPTY_ZONES),
    [initialZones],
  );
  const [zones, setZones] = useState(normalizedInitialZones);
  const handleZonesLoaded = useCallback((nextZones) => {
    setZones(Array.isArray(nextZones) ? nextZones : []);
  }, []);

  return (
    <div className="relative flex w-full flex-col">
      <div className="relative z-20 -mt-[19vh] flex w-full flex-col items-center overflow-hidden rounded-t-[2rem] bg-transparent pt-24 sm:pt-28 md:-mt-[16vh] md:pt-32 xs:overflow-visible">
        <div className="home-wave-divider" aria-hidden="true">
          <svg
            className="home-wave-svg home-wave-svg--surface"
            viewBox="0 0 2880 180"
            preserveAspectRatio="none"
          >
            <path
              d="M0 82 C150 40 305 58 470 92 C670 132 835 122 1015 74 C1210 24 1370 52 1550 90 C1725 128 1895 128 2070 80 C2250 31 2440 43 2625 95 C2735 126 2825 113 2880 82 L2880 180 L0 180 Z"
              fill="currentColor"
            />
          </svg>
          <svg
            className="home-wave-svg home-wave-svg--wash"
            viewBox="0 0 2880 180"
            preserveAspectRatio="none"
          >
            <path
              d="M0 70 C165 36 315 55 490 86 C675 119 850 115 1025 67 C1208 18 1378 48 1550 84 C1735 122 1898 120 2075 72 C2260 27 2450 38 2632 88 C2742 118 2830 104 2880 72"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="home-wave-svg home-wave-svg--foam"
            viewBox="0 0 2880 180"
            preserveAspectRatio="none"
          >
            <path
              d="M0 124 C160 92 318 111 500 130 C688 150 840 142 1028 112 C1210 83 1378 96 1560 124 C1730 150 1908 148 2085 114 C2265 82 2455 96 2640 128 C2758 149 2845 126 2880 112"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="home-wave-content-bg" aria-hidden="true" />

        <div className="relative z-10 flex w-full flex-col items-center">
          <HomeBody
            initialContent={initialContent}
            initialZones={normalizedInitialZones}
            onZonesLoaded={handleZonesLoaded}
          />
          <Footer
            zones={zones}
            initialInfo={initialFooterContent}
            mode="home"
          />
        </div>
      </div>
    </div>
  );
}

export default HomeContainer;
