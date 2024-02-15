import React from "react";
import { useState, useEffect } from "react";

import BackButtonComponent from "../../component/back-button";
import Divider from "../../component/divider";
import Field from "../../component/field";
import FieldPassword from "../../component/field-password";
import { saveSession } from "../../script/session";

import "./index.scss";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ChangeEmailForm = () => {
  const { authState, login } = useAuth();

  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState({ status: "", text: "" });

  useEffect(() => {
    checkDisabled();
  }, [values]);

  const checkDisabled = () => {
    const isDisabled = Object.values(values).some((value) => value === "");
    setDisabled(isDisabled);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    submit();
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setAlert({ status: "progress", text: "Loading" });

    try {
      const res = await fetch("http://localhost:4000/change-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: convertData(),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ status: "success", text: data.message });
        saveSession(data.session);
        login(data.session.user, data.session.token);

        navigate("/balance");
      } else {
        setAlert({ status: "error", text: data.message });
      }
    } catch (error) {
      setAlert({ status: "error", text: error.message });
    }
  };

  const convertData = () => {
    return JSON.stringify({
      email: values.email,
      password: values.password,
      token: authState.token,
    });
  };

  return (
    <div className="form">
      <div className="settings__title">Change email</div>

      <div className="form__item">
        <Field
          name="email"
          type="email"
          placeholder="Your e-mail"
          label="Email"
          errorMessage="Enter the correct value of the e-mail address"
          value={values.email}
          onChange={onChange}
        />
      </div>

      <div className="form__item">
        <FieldPassword
          name="password"
          type="password"
          placeholder="Your password"
          label="Password"
          errorMessage="Please enter the value"
          value={values.password}
          onChange={onChange}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className={`button button--white ${disabled ? "button--disabled" : ""}`}
      >
        Save email
      </button>

      <span
        className={`alert ${
          disabled ? "alert--disabled" : `alert--${alert.status}`
        }`}
      >
        {alert.text}
      </span>
    </div>
  );
};

// ===========================================

const ChangePasswordForm = () => {
  const { authState, login } = useAuth();

  const navigate = useNavigate();
  const [values, setValues] = useState({
    passwordOld: "",
    passwordNew: "",
  });

  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState({ status: "", text: "" });

  useEffect(() => {
    checkDisabled();
  }, [values]);

  const checkDisabled = () => {
    const isDisabled = Object.values(values).some((value) => value === "");
    setDisabled(isDisabled);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    submit();
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    setAlert({ status: "progress", text: "Loading" });

    try {
      const res = await fetch("http://localhost:4000/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: convertData(),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ status: "success", text: data.message });
        saveSession(data.session);
        login(data.session.user, data.session.token);

        navigate("/balance");
      } else {
        setAlert({ status: "error", text: data.message });
      }
    } catch (error) {
      setAlert({ status: "error", text: error.message });
    }
  };

  const convertData = () => {
    return JSON.stringify({
      passwordOld: values.passwordOld,
      passwordNew: values.passwordNew,
      token: authState.token,
    });
  };

  return (
    <div className="form">
      <div className="settings__title">Change password</div>

      <div className="form__item">
        <FieldPassword
          name="passwordOld"
          type="password"
          placeholder="Your password"
          label="Old password"
          errorMessage="Please enter the value"
          value={values.passwordOld}
          onChange={onChange}
        />
      </div>

      <div className="form__item">
        <FieldPassword
          name="passwordNew"
          type="password"
          placeholder="Your password"
          label="New password"
          errorMessage="The password must consist of at least 8 characters, including at least one number, lowercase and uppercase letters"
          pattern={`^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$`}
          value={values.passwordNew}
          onChange={onChange}
          required={true}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className={`button--password ${disabled ? "button--disabled" : ""}`}
      >
        Save password
      </button>

      <span
        className={`alert ${
          disabled ? "alert--disabled" : `alert--${alert.status}`
        }`}
      >
        {alert.text}
      </span>
    </div>
  );
};

const SettingsPage = () => {
  const { logout } = useAuth();

  return (
    <>
      <div className="page">
        <header className="account-page__header">
          <BackButtonComponent />

          <div className="account-page__title">Settings</div>
        </header>

        <div className="page__section">
          <ChangeEmailForm />

          <Divider />

          <ChangePasswordForm />

          <Divider />

          <button className="button button--red" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
