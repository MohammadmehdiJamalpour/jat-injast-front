import { StarIcon, TrashIcon } from "@heroicons/react/24/outline";

import Badge from "../../../../ui/Badge";
import Button from "../../../../ui/Button";
import Card from "../../../../ui/Card";
import IconButton from "../../../../ui/IconButton";
import { fa } from "../../../../i18n/fa";

const copy = fa.dashboard.editHouse.images;
const fallbackImage = "/house.jpg";

export const getImageSource = (image) => image?.media || image?.url || fallbackImage;

export const MainImageSwitch = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="btn-press flex w-full items-center justify-between rounded-2xl border border-primary-100 bg-primary-50/70 px-4 py-3 text-sm font-bold text-primary-800 transition hover:border-primary-200 hover:bg-primary-100 dark:border-primary-400/25 dark:bg-primary-500/10 dark:text-white dark:hover:bg-primary-500/20"
  >
    <span>{copy.mainToggle}</span>
    <span
      className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
        checked ? "bg-primary-action" : "bg-gray-300 dark:bg-slate-700"
      }`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white transition ${
          checked ? "translate-x-0" : "-translate-x-5"
        }`}
      />
    </span>
  </button>
);

export const ImageCard = ({ image, onDelete, onMakeMain, makeMainLoading }) => {
  const isMain = Boolean(image.main);

  return (
    <Card
      variant="interactive"
      padding="p-0"
      className="group overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-primary-50 dark:bg-slate-900">
        <img
          src={getImageSource(image)}
          alt={image.title || copy.houseImageAlt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {isMain && (
          <Badge tone="primary" className="absolute right-3 top-3 bg-white/90 backdrop-blur dark:bg-slate-950/80">
            <StarIcon className="h-4 w-4" />
            {copy.mainImage}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="min-w-0 text-right">
          <p className="text-xs font-bold text-gray-500 dark:text-sky-100/65">
            {copy.imageTitle}
          </p>
          <p className="mt-1 truncate text-base font-bold text-gray-950 dark:text-white">
            {image.title || copy.noTitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <IconButton
              tone="danger"
              label={copy.deleteTitle}
              onClick={() => onDelete(image)}
            >
              <TrashIcon className="h-5 w-5" />
            </IconButton>
          </div>

          {!isMain && (
            <Button
              variant="secondary"
              size="sm"
              loading={Boolean(makeMainLoading[image.id])}
              onClick={() => onMakeMain(image.id)}
            >
              <StarIcon className="h-4 w-4" />
              {makeMainLoading[image.id] ? copy.settingMain : copy.setMain}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
