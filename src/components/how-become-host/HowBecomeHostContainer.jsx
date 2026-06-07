import { useState } from "react";
import HowBecomeHostSidebar from "./HowBecomeHostSidebar";
import HowBecomeHostContent from "./HowBecomeHostContent";

function HowBecomeHostContainer() {
  // visible section in main panel
  const [selectedSection, setSelectedSection] = useState("overview");

  return (
    <div className="md:container xl:max-w-8xl flex flex-col md:grid md:grid-cols-12 gap-4 w-full min-h-[83vh] h-full">
      {/* sidebar */}
      <div className="md:col-span-3 border border-primary-400 w-full bg-gray-50 shadow-centered rounded-xl p-2 md:p-4">
        <HowBecomeHostSidebar setSelectedSection={setSelectedSection} />
      </div>

      {/* main content */}
      <div className="md:col-span-9 border border-primary-400 flex-grow w-full bg-gray-50 shadow-centered rounded-xl p-2 md:p-4">
        <HowBecomeHostContent selectedSection={selectedSection} />
      </div>
    </div>
  );
}

export default HowBecomeHostContainer;