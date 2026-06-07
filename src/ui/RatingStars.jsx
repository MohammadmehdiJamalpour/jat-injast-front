import { HiStar } from "react-icons/hi";
import toPersianNumber from './../utils/toPersianNumber';

/**
 * 0-5 star rating component.
 *
 * Props
 * -------
 * value      number   current rating (0-5)
 * onChange   func     called with new value when a star is clicked
 * readOnly   bool     disable interaction
 * size       "sm" | "md" | "lg" | "xl"   (default "lg")
 * showValue  bool     show numeric badge (default true)
 */
export default function RatingStars({
  value = 0,
  onChange,
  readOnly = false,
  size = "lg",
  showValue = true,
  className = "",
}) {
  /* tailwind size classes for the icon PLUS a matching padding-wrapper */
  const sizes = {
    sm: { icon: "w-2 h-2", pad: "p-0.5" },

    md: { icon: "w-5 h-5", pad: "p-1" },
    lg: { icon: "w-7 h-7", pad: "p-1.5" },
    xl: { icon: "w-9 h-9", pad: "p-2" },
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          /* wrapper supplies the bg & rounded pill */
          <div
            key={star}
            className={`${sizes[size].pad} ${
              filled ? "bg-primary-50 rounded-3xl" : ""
            }`}
          >
            <HiStar
              className={`${sizes[size].icon} ${
                filled ? "text-primary-500" : "text-primary-200"
              } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
              onClick={() => {
                if (!readOnly && onChange) onChange(star);
              }}
            />
          </div>
        );
      })}

      {showValue && (
        <span className="ml-2 xs:px-2 md:px-3 lg:px-4 lg:py-2  md:py-1.5 text-sm rounded-full bg-primary-50 px-1 py-0.5 font-medium text-primary-600">
          {toPersianNumber(value)}
        </span>
      )}
    </div>
  );
}
