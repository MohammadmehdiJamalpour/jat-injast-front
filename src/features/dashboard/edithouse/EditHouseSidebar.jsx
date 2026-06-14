import { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { HomeIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

function EditHouseSidebar({ setSelectedTab, selectedTab, tabSections }) {
  const [openSection, setOpenSection] = useState("آدرس و موقعیت مکانی");

  useEffect(() => {
    const relevantSection = tabSections.find((section) =>
      section.keys.some((keyObj) => keyObj.key === selectedTab),
    );
    if (relevantSection) {
      setOpenSection(relevantSection.label);
    }
  }, [selectedTab, tabSections]);

  const handleChildClick = (childKey, parentLabel) => {
    setSelectedTab(childKey);
    setOpenSection(parentLabel);
  };

  return (
    <div className="w-full overflow-auto rounded-3xl p-2 flex flex-col justify-start items-center gap-y-3">
      {tabSections.map((section) => {
        const parentLabel = section.label;

        const isSectionOpen = openSection === parentLabel;

        const isSectionActive = section.keys.some(
          (keyObj) => keyObj.key === selectedTab
        );

        return (
          <Disclosure
            key={parentLabel}
            as="div"
            className="w-full"
            open={isSectionOpen}
            onChange={(isOpening) => {
              if (isOpening) {
                setOpenSection(parentLabel);
                setSelectedTab(section.keys[0].key);
              } else {
                setOpenSection("");
              }
            }}
          >
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={`flex justify-between items-center w-full px-2 py-1.5 lg:px-4 lg:py-3 
                              rounded-xl transition-colors duration-200
                              ${
                                isSectionActive
                                  ? "bg-primary-action text-primary-contrast hover:bg-primary-action-hover dark:bg-primary-600 dark:text-white dark:hover:bg-primary-500"
                                  : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-200"
                              }`}
                >
                  <span className="text-xs lg:text-sm font-bold truncate">
                    {parentLabel}
                  </span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } w-4 h-4 lg:w-5 lg:h-5 
                       ${
                         isSectionActive ? "text-white" : "text-gray-500 dark:text-slate-400"
                       } transition-all duration-300`}
                  />
                </Disclosure.Button>

                <Disclosure.Panel>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-3 pb-2 px-1 md:px-2 lg:px-3 text-gray-500 dark:text-slate-300 space-y-2">
                      {section.keys.map((keyObj) => (
                        <div
                          key={keyObj.key}
                          className={`cursor-pointer rounded-xl transition-colors duration-200
                            ${
                              selectedTab === keyObj.key
                                ? "bg-primary-action text-primary-contrast px-3 py-2 shadow-sm dark:bg-primary-600 dark:text-white"
                                : "px-3 py-2 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-slate-800 dark:hover:text-primary-200"
                            }`}
                          onClick={() => handleChildClick(keyObj.key, parentLabel)}
                        >
                          <div className="flex items-center gap-2">
                            <HomeIcon
                              className={`w-5 h-5 ${
                                selectedTab === keyObj.key
                                  ? "text-white"
                                  : "text-gray-700 dark:text-slate-400"
                              }`}
                            />
                            <span className="text-xs lg:text-sm truncate">
                              {keyObj.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        );
      })}
    </div>
  );
}

export default EditHouseSidebar;
