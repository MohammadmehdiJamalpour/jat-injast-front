import React, { useState } from "react";
import AboutUsContent from "./AboutUsContent";
import AboutUsSidebar from "./AboutUsSidebar";

function AboutUsContainer() {
  // بخش انتخاب-شده در پنل اصلی
  const [selectedSection, setSelectedSection] = useState("overview");

  return (
    <div className="md:container xl:max-w-8xl flex flex-col md:grid md:grid-cols-12 gap-4 w-full min-h-[83vh] h-full">
      {/* سایدبار */}
      <div className="md:col-span-3 border border-primary-400 w-full bg-gray-50 shadow-centered rounded-xl p-2 md:p-4">
        <AboutUsSidebar
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      </div>

      {/* محتوای اصلی */}
      <div className="md:col-span-9 border border-primary-400 flex-grow w-full bg-gray-50 shadow-centered rounded-xl p-2 md:p-4">
        <AboutUsContent selectedSection={selectedSection} />
      </div>
    </div>
  );
}

export default AboutUsContainer;
