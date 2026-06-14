import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "@/lib/router-compat";
import { fa } from "@/i18n/fa";

import HouseHeader from "./HouseHeader";
import HouseImages from "./houseComponents/HouseImages";
import HouseReservationMenu from "./houseComponents/HouseReservationMenu";
import ReserveMenuDesktop from "./houseComponents/ReserveMenuDesktop";
import HouseDescription from "./houseComponents/HouseDescription";
import HouseSpace from "./houseComponents/HouseSpace";
import HouseRules from "./houseComponents/HouseRules";
import HouseCancellationRules from "./houseComponents/HouseCancellationRules";
import HouseComments from "./houseComponents/HouseComments";
import HouseTopLocation from "./houseComponents/HouseTopLocation";
import Separator from "../../ui/Separator";
import RevealSection from "../../ui/RevealSection";
import ViewportLazyBoundary from "../../ui/ViewportLazyBoundary";
import { useHouseCalendarData } from "./useHouseCalendarData";
import { useAllRoomsCalendarData } from "./useAllRoomsCalendarData";
import HouseSimilarHouses from "./houseComponents/HouseSimilarHouses";
import HouseSectionsNav from './houseComponents/HouseSectionNav';
import { HouseCalendar, HouseFacilities, HouseLocation, HouseRooms, HouseSanitaries, MapSkeleton, SectionSkeleton } from "./lazyHouseSections";

function getHeaderOffset() {
  const cssHeaderOffset =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--header-offset",
      ),
    ) || 0;
  const fixedHeaderHeight =
    document.querySelector("body nav[aria-label]")?.parentElement?.offsetHeight || 0;

  return Math.max(cssHeaderOffset, fixedHeaderHeight);
}

function getSectionNavHeight() {
  return document.querySelector("[data-testid='house-section-nav']")?.offsetHeight || 0;
}

function HouseContainer() {
  const { houseData, uuid, initialSimilarHouses } = useOutletContext();

  const isRentRoom = useMemo(() => houseData?.is_rent_room ?? false, [houseData]);

  const roomOptions = useMemo(() => {
    if (!isRentRoom || !houseData?.room) return [];
    return houseData.room
      .filter((room) => !room.is_living_room)
      .map((r) => ({ uuid: r.uuid, name: r.name }));
  }, [houseData, isRentRoom]);

  const [selectedRoomUuid, setSelectedRoomUuid] = useState(null);
  useEffect(() => {
    if (isRentRoom && roomOptions.length > 0 && !selectedRoomUuid) {
      setSelectedRoomUuid(roomOptions[0].uuid);
    }
  }, [isRentRoom, roomOptions, selectedRoomUuid]);

  const [reserveDateFrom, setReserveDateFrom] = useState(null);
  const [reserveDateTo, setReserveDateTo] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(1);

  const rentRoomPrefetchCount = 2;
  const housePrefetchCount = 2;

  const {
    isLoading: isLoadingCalendarHouse,
    isError: isErrorCalendarHouse,
    error: errorCalendarHouse,
    calendarData: houseCalendarData,
  } = useHouseCalendarData({
    uuid,
    isRentRoom,
    enabled: Boolean(houseData),
    prefetchCount: housePrefetchCount,
  });

  const {
    isLoading: isLoadingAllRooms,
    isError: isErrorAllRooms,
    error: errorAllRooms,
    calendarData: allRoomsCalendarData,
  } = useAllRoomsCalendarData({
    uuid,
    isRentRoom,
    enabled: Boolean(houseData),
    prefetchCount: rentRoomPrefetchCount,
    roomOptions,
  });

  const isLoadingCalendar = isRentRoom ? isLoadingAllRooms : isLoadingCalendarHouse;
  const isErrorCalendar = isRentRoom ? isErrorAllRooms : isErrorCalendarHouse;
  const errorCalendar = isRentRoom ? errorAllRooms : errorCalendarHouse;
  const calendarData = isRentRoom ? allRoomsCalendarData : houseCalendarData;

  const houseHeaderRef = useRef(null);
  const calendarRef = useRef(null);
  const roomsRef = useRef(null);
  const rulesRef = useRef(null);
  const commentsRef = useRef(null);
  const sectionRefs = useMemo(
    () => ({
      calendar: calendarRef,
      rooms: roomsRef,
      rules: rulesRef,
      comments: commentsRef,
    }),
    [],
  );
  const [showNav, setShowNav] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const headerOffset = getHeaderOffset();
      const navHeight = getSectionNavHeight();
      const sectionOffset = headerOffset + navHeight + 24;

      if (houseHeaderRef.current) {
        const headerRect = houseHeaderRef.current.getBoundingClientRect();
        setShowNav(headerRect.bottom <= headerOffset + 16);
      } else {
        setShowNav(false);
      }

      const threshold = Math.min(sectionOffset + 96, window.innerHeight / 2);
      let currentActiveSection = "";

      if (calendarRef.current) {
        const rect = calendarRef.current.getBoundingClientRect();
        if (rect.top <= threshold && rect.bottom >= threshold) {
          currentActiveSection = "calendar";
        }
      }
      if (!currentActiveSection && roomsRef.current) {
        const rect = roomsRef.current.getBoundingClientRect();
        if (rect.top <= threshold && rect.bottom >= threshold) {
          currentActiveSection = "rooms";
        }
      }
      if (!currentActiveSection && rulesRef.current) {
        const rect = rulesRef.current.getBoundingClientRect();
        if (rect.top <= threshold && rect.bottom >= threshold) {
          currentActiveSection = "rules";
        }
      }
      if (!currentActiveSection && commentsRef.current) {
        const rect = commentsRef.current.getBoundingClientRect();
        if (rect.top <= threshold && rect.bottom >= threshold) {
          currentActiveSection = "comments";
        }
      }

      setActiveSection(currentActiveSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = useCallback(
    (sectionName) => {
      const section = sectionRefs[sectionName]?.current;
      if (!section) return;

      const headerOffset = getHeaderOffset();
      const navHeight = getSectionNavHeight();
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(0, sectionTop - headerOffset - navHeight - 24),
        behavior: "smooth",
      });
    },
    [sectionRefs],
  );

  if (isErrorCalendar) {
    return <div className="text-center py-10 text-red-600">
      {fa.house.calendar.loadError(errorCalendar?.message || "")}
    </div>;
  }

  return (
    <>
      <HouseSectionsNav
        isVisible={showNav}
        onScrollTo={scrollToSection}
        activeSection={activeSection}
      />

      <div className="mt-5 flex w-full min-w-0 flex-col items-start rounded-2xl shadow-centered-lg md:-mt-5 md:p-2">
        <RevealSection as="div" className="w-full md:mb-3">
          <HouseImages houseData={houseData} />
        </RevealSection>

        <div className="relative -top-2 z-10 mt-4 mb-12 flex w-full min-w-0 flex-row rounded-t-3xl px-1 py-1 pt-2 pb-12 shadow-centered-lg-top xs:px-2 xs:pt-3 lg:pt-3 xl:pt-6">
          <div className="flex min-w-0 flex-col w-full md:w-3/5 xl:w-3/4">
            <RevealSection
              as="div"
              ref={houseHeaderRef}
              className="flex flex-col justify-between xl:flex-row"
            >
              <HouseHeader houseData={houseData} />
              <div className="flex w-full max-w-lg min-w-0 flex-col p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {fa.house.location.title}
                </h3>
                <div className="w-full h-full flex relative">
                  <ViewportLazyBoundary
                    className="h-full w-full"
                    fallback={<MapSkeleton />}
                    rootMargin="400px"
                  >
                    <HouseLocation cords={houseData.address?.geography} />
                  </ViewportLazyBoundary>
                </div>
              </div>
            </RevealSection>

            <RevealSection as="div">
              <HouseDescription houseData={houseData} />
            </RevealSection>
            <Separator />

            <RevealSection as="div">
              <HouseSpace houseData={houseData} />
            </RevealSection>
            <Separator />

            <RevealSection as="div" ref={roomsRef} data-testid="house-section-rooms">
              <ViewportLazyBoundary fallback={<SectionSkeleton />} rootMargin="500px">
                <HouseRooms houseData={houseData} />
              </ViewportLazyBoundary>
            </RevealSection>
            <Separator />

            <RevealSection as="div">
              <ViewportLazyBoundary fallback={<SectionSkeleton />} rootMargin="500px">
                <HouseFacilities houseData={houseData} />
              </ViewportLazyBoundary>
            </RevealSection>
            <Separator />

            <RevealSection as="div">
              <ViewportLazyBoundary fallback={<SectionSkeleton />} rootMargin="500px">
                <HouseSanitaries houseData={houseData} />
              </ViewportLazyBoundary>
            </RevealSection>

            {isLoadingCalendar && (
              <div className="my-3 px-4">
                <Separator />
                <h3 className="text-lg font-bold text-gray-800 my-2">
                  {fa.house.calendar.title}
                </h3>
                <div className="w-full px-2 h-48 bg-gray-100 animate-pulse rounded-3xl my-3" />
                <Separator />
              </div>
            )}
            {!isLoadingCalendar && calendarData && calendarData.length > 0 && (
              <>
                <Separator />
                <RevealSection as="div" ref={calendarRef} data-testid="house-section-calendar">
                  <ViewportLazyBoundary
                    fallback={<SectionSkeleton className="h-64" />}
                    rootMargin="500px"
                  >
                    <HouseCalendar
                      calendarData={calendarData}
                      isRentRoom={isRentRoom}
                      roomOptions={roomOptions}
                      selectedRoomUuid={selectedRoomUuid}
                      instantBooking={houseData.instant_booking}
                      setSelectedRoomUuid={setSelectedRoomUuid}
                      reserveDateFrom={reserveDateFrom}
                      setReserveDateFrom={setReserveDateFrom}
                      reserveDateTo={reserveDateTo}
                      setReserveDateTo={setReserveDateTo}
                    />
                  </ViewportLazyBoundary>
                </RevealSection>
                <Separator />
              </>
            )}
            {!isLoadingCalendar && (!calendarData || calendarData.length === 0) && (
              <>
                <Separator />
                <div className="text-center py-8">{fa.house.calendar.empty}</div>
                <Separator />
              </>
            )}

            <RevealSection as="div" ref={rulesRef} data-testid="house-section-rules">
              <HouseRules houseData={houseData} />
            </RevealSection>
            <Separator />

            <RevealSection as="div">
              <HouseCancellationRules houseData={houseData} />
            </RevealSection>
            <Separator />

            <RevealSection as="div" ref={commentsRef} data-testid="house-section-comments">
              <HouseComments houseData={houseData} />
            </RevealSection>
            <Separator />

            <RevealSection as="div">
              <HouseTopLocation topLocations={houseData.top_locations} />
            </RevealSection>
            
            <RevealSection as="div">
              <HouseSimilarHouses
                houseUuid={houseData.uuid}
                initialHouses={initialSimilarHouses}
              />
            </RevealSection>
          </div>

          <div className="relative hidden h-full min-w-0 items-start justify-center md:flex md:w-2/5 xl:w-1/4">
            <div className="sticky top-24 w-full min-w-0">
              <ReserveMenuDesktop
                houseData={houseData}
                uuid={uuid}
                isRentRoom={isRentRoom}
                calendarData={calendarData}
                roomOptions={roomOptions}
                selectedRoomUuid={selectedRoomUuid}
                setSelectedRoomUuid={setSelectedRoomUuid}
                reserveDateFrom={reserveDateFrom}
                setReserveDateFrom={setReserveDateFrom}
                reserveDateTo={reserveDateTo}
                setReserveDateTo={setReserveDateTo}
                selectedPeople={selectedPeople}
                setSelectedPeople={setSelectedPeople}
              />
            </div>
          </div>
        </div>

        <HouseReservationMenu
          houseData={houseData}
          uuid={uuid}
          isRentRoom={isRentRoom}
          calendarData={calendarData}
          roomOptions={roomOptions}
          selectedRoomUuid={selectedRoomUuid}
          setSelectedRoomUuid={setSelectedRoomUuid}
          reserveDateFrom={reserveDateFrom}
          setReserveDateFrom={setReserveDateFrom}
          reserveDateTo={reserveDateTo}
          setReserveDateTo={setReserveDateTo}
          selectedPeople={selectedPeople}
          setSelectedPeople={setSelectedPeople}
        />
      </div>
    </>
  );
}

export default HouseContainer;
