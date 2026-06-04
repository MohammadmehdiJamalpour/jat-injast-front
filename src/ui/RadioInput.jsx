import React from "react";

function RadioInput({ label, value, onChange, name, id }) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="radio"
        value={value}
        onChange={onChange}
        id={id}
        name={name}
        className="form-radio accent-primary-600 text-primary-600 focus:ring-0"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export default RadioInput;
