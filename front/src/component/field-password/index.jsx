import React, { useState } from "react";
import "./index.scss";

const togglePassword = (target) => {
  target.toggleAttribute("show");

  const input = target.previousElementSibling;
  const type = input.getAttribute("type");

  input.setAttribute("type", type === "password" ? "text" : "password");
};

const FieldPassword = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, name, onChange, errorMessage, value, id, ...fieldProps } =
    props;

  const handleToggleClick = (event) => {
    togglePassword(event.target);
  };

  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div className="field field--password">
      <label htmlFor={name} className="field__label">
        {label}
      </label>
      <div className="field__wrapper">
        <input
          {...fieldProps}
          name={name}
          className="field__input"
          onChange={onChange}
          onBlur={handleFocus}
          onFocus={() => name === "passwordAgain" && setFocused(true)}
          focused={focused.toString()}
        />
        <span onClick={handleToggleClick} className="field__icon"></span>

        <span>{errorMessage}</span>
      </div>
    </div>
  );
};

export default FieldPassword;
