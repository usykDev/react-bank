import React from "react";
import "./index.scss";

class PasswordToggle {
	toggle = (target) => {
	  target.toggleAttribute('show');
  
	  const input = target.previousElementSibling;
  
	  const type = input.getAttribute('type');
  
	  if (type === 'password') {
		input.setAttribute('type', 'text');
	  } else {
		input.setAttribute('type', 'password');
	  }
	};
  }
  
  const FieldPassword = ({ name, label, type, placeholder, action, value }) => {
	const passwordToggle = new PasswordToggle();
  
	const handleInputChange = (event) => {
	  action(event.target.name, event.target.value);
	};
  
	const handleToggleClick = (event) => {
	  passwordToggle.toggle(event.target);
	};
  
	return (
	  <div className="field--password">
		<label htmlFor={name} className="field__label">
		  {label}
		</label>
		<div className="field__wrapper">
		  <input
			onChange={handleInputChange}
			value={value}
			type={type}
			className="field__input validation"
			name={name}
			placeholder={placeholder}
		  />
		  <span onClick={handleToggleClick} className="field__icon"></span>
		</div>
	  </div>
	);
  };
  
  export default FieldPassword;