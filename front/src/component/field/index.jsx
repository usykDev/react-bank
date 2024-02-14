import { useState } from "react";
import "./index.scss";

const Field = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, name, onChange, errorMessage, value, id, ...fieldProps } =
    props;

  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div className="field">
      <label htmlFor={name} className="field__label">
        {label}
      </label>
      <input
        {...fieldProps}
        name={name}
        className="field__input"
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() => name === "passwordAgain" && setFocused(true)}
        focused={focused.toString()}
      />
      <span>{errorMessage}</span>
    </div>
  );
};

export default Field;
