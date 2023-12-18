import React from "react";
import "./index.scss";


const Field = ({ name, label, type, placeholder, action, value }) => {
  const handleInputChange = (event) => {
    action(event.target.name, event.target.value);
  };



  return (
    <div className="field">
      <label htmlFor={name} className="field__label">
        {label}
      </label>
      <input
        onChange={handleInputChange}
        type={type}
		value={value}
        className="field__input validation"
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Field;
