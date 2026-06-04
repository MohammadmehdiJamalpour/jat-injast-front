import { MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import React from 'react';
import toPersianNumber from '../../../utils/toPersianNumber';
import Vote from '../../../ui/Vote';

function HouseInformation({ houseData }) {
  const city = houseData?.address?.city?.name || 'نامشخص';
  const province = houseData?.address?.city?.province?.name || 'نامشخص';
  const vote = houseData?.vote|| '';

  return (
    <div className="flex flex-col  rounded-3xl py-1 px-3">
      <div className="flex justify-self-end items-center flex-row gap-1">
        <MapPinIcon className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600" />
        <p className="text-sm truncate">
          {province}, <span>{city}</span>
        </p>
      </div>
      <Vote size='lg' vote={vote.total_vote}/>
    </div>
  );
}

export default HouseInformation;
