import React from "react";

function HouseDescribtion({ houseData }) {
  return (
    <div className="my-3 flex  flex-col gap-1 px-3">
      <h3 className="font-bold text-lg">درباره اقامتگاه :</h3>
      <p>{houseData.description}</p>
    </div>
  );
}

export default HouseDescribtion;
