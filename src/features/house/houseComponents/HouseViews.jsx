const HouseViews = ({ houseViews }) => {
  const views = houseViews || [];
  return (
    <div className="mt-1">
      <p className="font-bold">منظره اقامتگاه :</p>
      <div className="flex flex-wrap w-full gap-1 my-1">
        {views.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-primary-50 shadow-centered"
          >
            {item.icon ? (
              <img src={item.icon} alt={item.label} className="w-6 h-6" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-primary-500" aria-hidden="true" />
            )}
            <span className=" font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HouseViews;
