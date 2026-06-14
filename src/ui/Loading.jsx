import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/BeatLoader";
import clsx from "clsx";

const Loading = ({ size, type = "clip", color, message, className }) => {
  let defaultColor = type === "beat" ? "#e9f7fa" : "#006f8c";

  // Override defaults if color prop is provided
  if (color === "primary") {
    defaultColor = "#006f8c";
  } else if (color === "secondary") {
    defaultColor = "#e9f7fa";
  }

  const LoaderComponent =
    type === "beat" ? (
      <BeatLoader color={defaultColor} size={size || 8} margin={1} />
    ) : (
      <ClipLoader color={defaultColor} size={size} />
    );

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx("flex min-w-0 items-center justify-center gap-2 text-center", className)}
    >
      {LoaderComponent}
      {message && (
        <span className="min-w-0 text-sm font-medium text-primary-800 dark:text-sky-100">
          {message}
        </span>
      )}
    </div>
  );
};

export default Loading;
