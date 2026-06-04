// src/ui/NumberField.jsx

import React from "react";

function NumberField({
  label,
  name,
  value,
  onChange,
  placeholder,
  readOnly,
  errorMessages,
  min,
  max,
  step,
}) {
  return (
    <div className="my-1 lg:my-2">
      <label htmlFor={name} className="text-xs md:text-sm mb-1.5 font-medium">
        {label}
      </label>
      <input
        className={`textField__input ${errorMessages ? "border-red-500" : ""}`}
        type="number"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        readOnly={readOnly}
        min={min}
        max={max}
        step={step}
      />
      {errorMessages &&
        Array.isArray(errorMessages) &&
        errorMessages.map((error, index) => (
          <p key={index} className="text-red-500 text-xs mt-1">
            {error}
          </p>
        ))}
    </div>
  );
}

export default NumberField;
