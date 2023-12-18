import React, { useState } from 'react';

import Page from "../../page";
import Field from "../../component/field"; 
import FieldPassword from "../../component/field-password";
import ButtonBack from "../../component/back-button";
import "./index.scss"
import { REG_EXP_EMAIL, REG_EXP_PASSWORD } from "../../script/form" ;


const SignupForm = () => {
  const [formInput, setFormInput] = useState({
    email: '',
    password: '',
  });

  const [formError, setFormError] = useState({
    email: '',
    password: '',
  });

  

  const handleEmailChange = (name, value) => {
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      [name]: value,
    }));

	const validateEmail = (value) => {
		let inputError = {
		  email: '',
		};
	
		if (!value) {
		  inputError.email = 'Please enter email address';
		} else if (!REG_EXP_EMAIL.test(value)) {
		  inputError.email = 'Please enter a valid email address';
		}


	setFormError(inputError);
  };

  validateEmail(value)

};


const handlePasswordChange = (name, value) => {
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      [name]: value,
    }));

  const validatePassword = (value) => {
	let inputError = {
	  password: '',
	};

	if (!value) {
	  inputError.password = 'Password should not be empty';
	} else if (!REG_EXP_PASSWORD.test(value)) {
	  inputError.password = 'Password should be at least 8 characters, including one uppercase letter, one lowercase letter, and one digit';
	}

	setFormError(inputError);
	};

	validatePassword(value);
};


  const validateFormInput = (event) => {
    event.preventDefault();

    let inputError = {
      email: '',
      password: '',
    };

    if (!formInput.email) {
      inputError.email = 'Please enter email address';
    } else if (!REG_EXP_EMAIL.test(formInput.email)) {
      inputError.email = 'Please enter a valid email address';
    }

    if (!formInput.password) {
      inputError.password = 'Password should not be empty';
    } else if (!REG_EXP_PASSWORD.test(formInput.password)) {
      inputError.password =
        'Password should be at least 8 characters, including one uppercase letter, one lowercase letter, and one digit';
    }

    setFormError(inputError);

    alert(formInput.email, formInput.password);
  };

  const isFormValid = () => {
    const allFieldsFilled = Object.values(formInput).every((value) => value.trim() !== '');
    return allFieldsFilled;
  };

  return (
    <Page>
      <div className="main">
        <div className="header-back">
          <ButtonBack />
        </div>

        <div className="page__title">
          <h1 className="main__title">Sign up</h1>
          <div className="sub__title">Choose a registration method</div>
        </div>

        <form onSubmit={validateFormInput} className="page__section">
          <div className="form">
            <div className="form__item">
              <Field
                value={formInput.email}
                name="email"
                label="Email"
                type="text"
                placeholder="Enter your email"
                action={handleEmailChange}
              />
              <span className="form__error--active">{formError.email}</span>
            </div>

            <div className="form__item">
              <FieldPassword
                value={formInput.password}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                action={handlePasswordChange}
              />
              <span className="form__error--active">{formError.password}</span>
            </div>
          </div>

          <span className="link__prefix">
            Already have an account?{' '}
            <a href="/signin" className="link">
              Sign in
            </a>
          </span>

          <input
            className={`button ${!isFormValid() ? 'button--disabled' : ''}`}
            type="submit"
            value="Continue"
            disabled={!isFormValid()}
          />

          <span className="alert alert--disabled">
            <span className="alert__icon"></span>
            A user with the same email already exists
          </span>
        </form>
      </div>
    </Page>
  );
};

export default SignupForm;
