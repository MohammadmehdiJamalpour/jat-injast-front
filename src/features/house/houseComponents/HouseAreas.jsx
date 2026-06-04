import React from "react";
import CustomInfoIcon from "../../../ui/CustomInfoIcon";

const HouseAreas = ({ areas}) => {
 
  return (
    <div className="mt-1 flex gap-4 items-center">
      <div>
        <div className="flex items-center gap-1 mb-2">
          <p className="font-bold">منطقه :</p>
          
        </div>
        <div className="flex flex-wrap w-full gap-1">
          {areas && areas.length > 0 ? (
            areas.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 rounded-2xl bg-primary-50 shadow-centered"
              >
                {item.icon && (
                  <img src={item.icon} alt={item.label} className="w-6 h-6" />
                )}
                <span className="font-medium">{item.label}</span>
              </div>
            ))
          ) : (
            "نامشخص"
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseAreas;
