// HouseSectionsNav.jsx
import React from "react";

const sections = [
  { name: "calendar", label: "تقویم" },
  { name: "rooms",    label: "اتاق‌ها" },
  { name: "rules",    label: "قوانین" },
  { name: "comments", label: "دیدگاه‌ها" },
];

function HouseSectionsNav({ isVisible, onScrollTo, activeSection }) {
  return (
    <nav
      style={{ top: "calc(var(--header-offset, 0px) + 0.75rem)" }}
      className={`sticky z-20 mx-2 md:max-w-md 
                  rounded-3xl shadow-centered mb-4 transition-opacity duration-300
                  ${isVisible ? "opacity-100 pointer-events-auto"
                              : "opacity-0 pointer-events-none"}`}
    >
      <ul className="flex py-2 px-3 bg-primary-300 rounded-3xl
                     justify-between lg:justify-start md:gap-8 text-white">
        {sections.map(({ name, label }) => (
          <li
            key={name}
            onClick={() => onScrollTo(name)}
            className={`cursor-pointer px-3 py-1.5 rounded-3xl transition-all
                        ${activeSection === name
                          ? "bg-primary-600"
                          : "bg-primary-300"}`}
          >
            {label}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default HouseSectionsNav;
