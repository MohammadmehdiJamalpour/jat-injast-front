import React from "react";
import { Tab } from "@headlessui/react";
import {
  BuildingOffice2Icon,
  SparklesIcon,
  EyeIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  LifebuoyIcon,
  RocketLaunchIcon,
  EnvelopeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

function AboutUsSidebar({ setSelectedSection }) {
  const svgClasses = "ml-1 w-5 h-5 text-current";

  const tabs = [
    { key: "overview", label: "درباره ما", Icon: BuildingOffice2Icon },
    { key: "mission", label: "ماموریت ما", Icon: SparklesIcon },
    { key: "vision", label: "چشم‌انداز ما", Icon: EyeIcon },
    { key: "values", label: "ارزش‌ها", Icon: ShieldCheckIcon },
    { key: "story", label: "داستان ما", Icon: BookOpenIcon },
    { key: "benefits", label: "مزایا", Icon: CheckCircleIcon },
    { key: "testimonials", label: "نظرات کاربران", Icon: ChatBubbleLeftRightIcon },
    { key: "support", label: "پشتیبانی", Icon: LifebuoyIcon },
    { key: "future", label: "طرح‌های توسعه", Icon: RocketLaunchIcon },
    { key: "contact", label: "تماس با ما", Icon: EnvelopeIcon },
    { key: "ceo", label: "سخن مدیر عامل", Icon: UserIcon },
  ];

  return (
    <Tab.Group defaultIndex={0}>
      <Tab.List className="rounded-xl flex flex-col justify-center items-center p-2 gap-y-2">
        {tabs.map(({ key, label, Icon }) => (
          <Tab
            key={key}
            as="div"
            className={({ selected }) =>
              `tab ${selected ? "tab-selected" : "tab-hover"}`
            }
            onClick={() => setSelectedSection(key)}
          >
            {label}
            <Icon className={svgClasses} />
          </Tab>
        ))}
      </Tab.List>
    </Tab.Group>
  );
}

export default AboutUsSidebar;
