import { useState } from "react";
import PeopleNumberDropDown from "./PeopleNumberDropDown";

export default function PeopleNumberFilter() {
  const [selectedPeople, setSelectedPeople] = useState(1);

  return (
    <div className="space-y-3 md:w-52">
      {/* title row */}
      <div className="flex items-center h-7  justify-between">
        <span className="font-medium text-primary-800">تعداد نفرات</span>
      </div>

      {/* picker */}
      <div className="rounded-3xl border border-primary-600 shadow-centered shadow-primary-50/90 overflow-hidden">
        <PeopleNumberDropDown
          selectedPeople={selectedPeople}
          setSelectedPeople={setSelectedPeople}
        />
      </div>
    </div>
  );
}
