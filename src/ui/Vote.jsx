// Vote.jsx
import React from "react";
import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStarIcon } from "@heroicons/react/24/outline";
import toPersianNumber from "../utils/toPersianNumber";

/**
 * @param {{ vote: number|string, size?: "sm"|"lg", color?: string }}
 *
 * `color` → the base Tailwind colour to use for stars & text, e.g. "primary-600",
 *           "yellow-500", "emerald-400".  Defaults to "primary-600".
 *
 *  <Vote vote={4.2} />                 → primary-600 (default)
 *  <Vote vote={3.5} color="yellow-500" />
 */
function Vote({ vote, size = "sm", color = "primary-600" }) {
  const safeVote = Number.isFinite(Number(vote)) ? Number(vote) : 0;

  /* Utility helpers to avoid repeating class strings */
  const starClass = `text-${color}`;
  const numberClass = `text-${color}`;

  if (size === "sm") {
    return (
      <div className="flex py-0.5 bg-primary-50  rounded-2xl px-2 items-center">
        <SolidStarIcon className={`h-4 w-4 ${starClass}`} />
        <span className={`mr-1 text-xs md:text-md pt-0.5 ${numberClass}`}>
          {toPersianNumber(safeVote)}
        </span>
      </div>
    );
  }

  /* Large stars */
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const starFill = Math.min(Math.max(safeVote - (i - 1), 0), 1);
    if (starFill === 1) {
      stars.push(<SolidStarIcon key={i} className={`h-5 w-5 ${starClass}`} />);
    } else if (starFill > 0) {
      stars.push(
        <div key={i} className="relative h-5 w-5">
          <SolidStarIcon
            className={`absolute inset-0 ${starClass}`}
            style={{ clipPath: `inset(0 0 0 ${100 - starFill * 100}%)` }}
          />
          <OutlineStarIcon className={`absolute inset-0 ${starClass}`} />
        </div>
      );
    } else {
      stars.push(
        <OutlineStarIcon key={i} className={`h-5 w-5 ${starClass}`} />
      );
    }
  }

  return (
    <div className="flex py-0.5 items-center ">
      {stars}
      <span className={`mr-1 pt-0.5 text-base ${numberClass}`}>
        {toPersianNumber(safeVote)}
      </span>
    </div>
  );
}

export default Vote;
