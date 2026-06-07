
import { useState, useEffect } from "react";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import Houses from "./Houses";
import WalletContainer from "./wallet/WalletContainer";
import Favorites from "./Favorites";
import InviteFriends from "./InviteFriends";
import DashboardReserve from "./reserve/DashboardReserve";
import DashboardComments from "./DashboardComments";
import Tickets from './ticket/Tickets';

const DashboardContent = ({ selectedTab, initialUser, onUpdateUser }) => {
  const [user, setUser] = useState(initialUser);

  // Sync local state when parent updates
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const renderContent = () => {
    switch (selectedTab) {
      case "profile":
        return <Profile user={user} onUpdateUser={onUpdateUser} />;

      case "editProfile":
        return <EditProfile user={user} onUpdateUser={onUpdateUser} />;

      case "houses":
        return user?.type === "Vendor" ? (
          <Houses user={user} />
        ) : (
          <div className="text-center text-red-500">شما میزبان نیستید</div>
        );

      case "wallet":
        return <WalletContainer user={user} />;

      case "favorites":
        return <Favorites />;

      case "inviteFriends":
        return <InviteFriends user={user} />;

      case "reserves":
        return (
          <DashboardReserve
            reserveTitle={user?.type === "Vendor" ? "رزرو ها" : "سفر های من"}
          />
        );

      case "comments":
        return user?.type === "Vendor" ? (
          <DashboardComments />
        ) : (
          <div className="text-center text-red-500">
            دسترسی برای شما وجود ندارد.
          </div>
        );

      case "tickets":
        return <Tickets user={user} />;

      default:
        return <Profile user={user} onUpdateUser={onUpdateUser} />;
    }
  };

  return <div>{renderContent()}</div>;
};

export default DashboardContent;
