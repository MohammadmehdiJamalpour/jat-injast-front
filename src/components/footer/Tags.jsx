import PropTypes from "prop-types";

export default function Tags({ tags = [] }) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 text-xs text-white">
      {tags.map((t) => (
        <span
          key={t}
          className="bg-primary-700 px-3 py-1 rounded-3xl leading-5"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

Tags.propTypes = { tags: PropTypes.array };
