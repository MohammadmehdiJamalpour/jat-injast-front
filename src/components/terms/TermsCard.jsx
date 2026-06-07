import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Badge from "../../ui/Badge";
import Card from "../../ui/Card";
import RevealSection from "../../ui/RevealSection";

const toneIcon = {
  primary: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
};

export default function TermsCard({ id, eyebrow, title, summary, items, tone = "primary" }) {
  const Icon = toneIcon[tone] || CheckCircleIcon;

  return (
    <RevealSection id={id} className="scroll-mt-32 md:scroll-mt-28">
      <Card variant="interactive" padding="p-4 sm:p-5 md:p-7" radius="rounded-2xl md:rounded-3xl" className="overflow-hidden">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-center">
          <div className="min-w-0 space-y-4 sm:space-y-5">
            <Badge tone={tone}>{eyebrow}</Badge>
            <div className="space-y-3">
              <h2 className="text-lg font-black leading-8 text-gray-950 dark:text-white sm:text-xl sm:leading-9 md:text-2xl md:leading-10">
                {title}
              </h2>
              <p className="text-sm leading-8 text-gray-600 dark:text-sky-100/75 md:text-base">
                {summary}
              </p>
            </div>

            <ul className="grid gap-3 md:grid-cols-2">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex min-w-0 items-start gap-2 rounded-2xl border border-primary-100 bg-primary-50/60 p-3 text-sm font-bold leading-7 text-gray-700 dark:border-primary-400/20 dark:bg-primary-500/10 dark:text-sky-50"
                >
                  <ArrowLeftIcon className="mt-1 h-4 w-4 shrink-0 text-primary-700 dark:text-sky-200" />
                  <span className="min-w-0 break-words">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden min-h-48 rounded-3xl border border-primary-100 bg-primary-50 text-primary-700 dark:border-primary-400/20 dark:bg-primary-500/10 dark:text-sky-100 lg:grid lg:place-items-center">
            <Icon className="h-20 w-20" />
          </div>
        </div>
      </Card>
    </RevealSection>
  );
}
