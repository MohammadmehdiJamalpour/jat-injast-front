// src/ui/TextField.jsx

import React from "react";

function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  readOnly,
  disabled,
  errorMessages,
}) {
  return (
    <div className="my-1 lg:my-2">
      <label htmlFor={name} className="text-xs md:text-sm mb-1.5 font-medium">
        {label}
      </label>
      <input
        className={`textField__input ${errorMessages ? "border-red-500" : ""}`}
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        readOnly={readOnly}
        disabled={disabled} // <-- Add the disabled attribute
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

export default TextField;
