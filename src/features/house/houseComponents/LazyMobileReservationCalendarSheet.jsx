import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MobileReservationCalendarSheet = dynamic(
  () => import("./MobileReservationCalendarSheet"),
  {
    ssr: false,
    loading: () => null,
  },
);

function LazyMobileReservationCalendarSheet({ showCalendarModal, ...props }) {
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (showCalendarModal) setHasOpened(true);
  }, [showCalendarModal]);

  if (!hasOpened) return null;

  return (
    <MobileReservationCalendarSheet
      {...props}
      showCalendarModal={showCalendarModal}
    />
  );
}

export default LazyMobileReservationCalendarSheet;
