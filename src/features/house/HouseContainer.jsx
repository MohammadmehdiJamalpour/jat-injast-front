import {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useOutletContext } from "@/lib/router-compat";
import { fa } from "@/i18n/fa";

import HouseHeader from "./HouseHeader";
import HouseFacilities from "./houseComponents/HouseFacilities";
import HouseImages from "./houseComponents/HouseImages";
import HouseLocation from "./houseComponents/HouseLocation";
import HouseReservationMenu from "./houseComponents/HouseReservationMenu";
import ReserveMenuDesktop from "./houseComponents/ReserveMenuDesktop";
import HouseDescription from "./houseComponents/HouseDescription";
import HouseSpace from "./houseComponents/HouseSpace";
import HouseRooms from "./houseComponents/HouseRooms";
import HouseRules from "./houseComponents/HouseRules";
import HouseCancellationRules from "./houseComponents/HouseCancellationRules";
import HouseComments from "./houseComponents/HouseComments";
import HouseSanitaries from "./houseComponents/HouseSanitaries";
import HouseTopLocation from "./houseComponents/HouseTopLocation";
import Separator from "../../ui/Separator";
import RevealSection from "../../ui/RevealSection";
import { useHouseCalendarData } from "./useHouseCalendarData";
import HouseCalendar from "./houseComponents/HouseCalendar";
import { useAllRoomsCalendarData } from "./useAllRoomsCalendarData";
import HouseSimilarHouses from "./houseComponents/HouseSimilarHouses";
import HouseSectionsNav from './houseComponents/HouseSectionNav';

function HouseContainer() {
  const { houseData, uuid } = useOutletContext();

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
  const [showNav, setShowNav] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const headerHeight = houseHeaderRef.current
        ? houseHeaderRef.current.offsetHeight
        : 0;
      const desktopOffset = window.innerWidth >= 1280 ? 400 : 0;

      setShowNav(scrollTop >= headerHeight + desktopOffset);

      const threshold = window.innerHeight / 2;
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
      switch (sectionName) {
        case "calendar":
          calendarRef.current?.scrollIntoView({ behavior: "smooth" });
          break;
        case "rooms":
          roomsRef.current?.scrollIntoView({ behavior: "smooth" });
          break;
        case "rules":
          rulesRef.current?.scrollIntoView({ behavior: "smooth" });
          break;
        case "comments":
          commentsRef.current?.scrollIntoView({ behavior: "smooth" });
          break;
        default:
          break;
      }
    },
    []
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

      <div className="flex items-start -mt-10 md:-mt-5 flex-col w-full shadow-centered-lg rounded-2xl md:p-2">
        <RevealSection as="div" className="w-full md:mb-3">
          <HouseImages houseData={houseData} />
        </RevealSection>

        <div className="w-full shadow-centered-lg-top mb-12 pb-12 rounded-t-3xl mt-4  pt-2 xs:pt-3 -top-2 z-10 flex relative px-1 xs:px-2 py-1 lg:pt-3 xl:pt-6 flex-row">
          <div className="flex flex-col w-full md:w-3/5 xl:w-3/4">
            <RevealSection
              as="div"
              ref={houseHeaderRef}
              className="flex flex-col justify-between xl:flex-row"
            >
              <HouseHeader houseData={houseData} />
              <div className="flex flex-col w-full max-w-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {fa.house.location.title}
                </h3>
                <div className="w-full h-full flex relative">
                  <HouseLocation cords={houseData.address?.geography} />
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

            <RevealSection as="div" ref={roomsRef}>
              <HouseRooms houseData={houseData} />
            </RevealSection>
            <Separator />

            <RevealSection as="div">
              <HouseFacilities houseData={houseData} />
            </RevealSection>
            <Separator />

            <RevealSection as="div">
              <HouseSanitaries houseData={houseData} />
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
                <RevealSection as="div" ref={calendarRef}>
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

            <RevealSection as="div" ref={rulesRef}>
              <HouseRules houseData={houseData} />
            </RevealSection>
            <Separator />

            <RevealSection as="div">
              <HouseCancellationRules houseData={houseData} />
            </RevealSection>
            <Separator />

            <RevealSection as="div" ref={commentsRef}>
              <HouseComments houseData={houseData} />
            </RevealSection>
            <Separator />

            <RevealSection as="div">
              <HouseTopLocation topLocations={houseData.top_locations} />
            </RevealSection>
            
            <RevealSection as="div">
              <HouseSimilarHouses houseUuid={houseData.uuid} />
            </RevealSection>
          </div>

          <div className="hidden md:flex items-start relative justify-center w-2/5 xl:w-1/4 h-full">
            <div className="sticky top-24 w-full">
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
