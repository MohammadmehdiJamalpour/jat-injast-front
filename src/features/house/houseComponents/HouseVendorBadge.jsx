
function HouseVendorBadge({ hostInfo }) {
  const fallbackAvatar = "/assets/images/core-transparent/jat-injast-icon-white-transparent-512.png";
  const hostName =
    hostInfo?.name ||
    [hostInfo?.first_name, hostInfo?.last_name].filter(Boolean).join(" ") ||
    "میزبان";
  const hostAvatar = hostInfo?.avatar || fallbackAvatar;
  const avatarClassName = hostInfo?.avatar
    ? "block h-full w-full object-cover"
    : "block h-full w-full bg-slate-950 object-contain";

  return (
    <div className="w-full flex gap-1 h-14 rounded-3xl  p-1 ">
      <div className="w-12  overflow-hidden  h-full  rounded-full">
        <img src={hostAvatar} alt={hostName} className={avatarClassName} />
      </div>

      <div className="flex  flex-col p-1 justify-center items-center">
        <p className="text-sm font-medium truncate">{hostName}</p>
      </div>
    </div>
  );
}

export default HouseVendorBadge;
