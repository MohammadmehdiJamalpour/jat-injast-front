import React from "react";
import { Tab } from "@headlessui/react";
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  QueueListIcon,
  BanknotesIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/solid";

function HowBecomeHostSidebar({ setSelectedSection }) {
  const svgClasses = "ml-1 w-5 h-5 text-current";

  return (
    <Tab.Group defaultIndex={0}>
      <Tab.List className="rounded-xl flex flex-col justify-center items-center p-2 gap-y-2">
        <Tab
          as="div"
          className={({ selected }) => `tab ${selected ? "tab-selected" : "tab-hover"}`}
          onClick={() => setSelectedSection("overview")}
        >
          چرا میزبان شویم؟
          <HomeIcon className={svgClasses} />
        </Tab>
        <Tab
          as="div"
          className={({ selected }) => `tab ${selected ? "tab-selected" : "tab-hover"}`}
          onClick={() => setSelectedSection("requirements")}
        >
          شرایط لازم
          <ClipboardDocumentCheckIcon className={svgClasses} />
        </Tab>
        <Tab
          as="div"
          className={({ selected }) => `tab ${selected ? "tab-selected" : "tab-hover"}`}
          onClick={() => setSelectedSection("steps")}
        >
          مراحل ثبت اقامتگاه
          <QueueListIcon className={svgClasses} />
        </Tab>
        <Tab
          as="div"
          className={({ selected }) => `tab ${selected ? "tab-selected" : "tab-hover"}`}
          onClick={() => setSelectedSection("fees")}
        >
          کارمزد و تسویه
          <BanknotesIcon className={svgClasses} />
        </Tab>
        <Tab
          as="div"
          className={({ selected }) => `tab ${selected ? "tab-selected" : "tab-hover"}`}
          onClick={() => setSelectedSection("support")}
        >
          پشتیبانی میزبان
          <LifebuoyIcon className={svgClasses} />
        </Tab>
      </Tab.List>
    </Tab.Group>
  );
}

export default HowBecomeHostSidebar;