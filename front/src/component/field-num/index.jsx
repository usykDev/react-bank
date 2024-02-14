import { useState } from "react";
import "./index.scss";

const FieldNumber = (props) => {
  const [focused, setFocused] = useState(false);

  const {
    label,
    name,
    onChange,

    value,
    labelClassName,
    id,
    errorMessages,
    ...fieldProps
  } = props;

  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div className="field--num__wrapper">
      <div className="field">
        <label htmlFor={name} className={labelClassName}>
          {label}
        </label>
        <input
          {...fieldProps}
          name={name}
          className={`field__input-num ${
            errorMessages.length > 0 ? "field__input-num--validation" : ""
          }`}
          step="any"
          onChange={onChange}
          value={value}
          onBlur={handleFocus}
          onFocus={() => name === "amount" && setFocused(true)}
          focused={focused.toString()}
        />
        <div>
          {errorMessages.map((error, index) => (
            <div className="error__message" key={index}>
              {error}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldNumber;
