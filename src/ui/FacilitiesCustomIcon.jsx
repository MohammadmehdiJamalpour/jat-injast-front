
import PropTypes from "prop-types";

const CustomInfoIcon = ({ tooltipText, className, ...props }) => (
  <div className="relative w-1/2 flex group">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="#006f8c"
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0Zm-9-3.75h.008v.008H12V8.25Z"
      />
    </svg>
    {tooltipText && (
      <div className="absolute z-50  transform right-5  hidden group-hover:block bg-primary-500 text-white text-xs rounded-2xl px-2 py-1 max-w-[10rem] break-words whitespace-normal">
        {tooltipText}
      </div>
    )}
  </div>
);

CustomInfoIcon.propTypes = {
  tooltipText: PropTypes.string,
  className: PropTypes.string,
};

export default CustomInfoIcon;
