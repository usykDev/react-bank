import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Page from "../../page";
import { useNavigate } from "react-router-dom";

import BackButtonComponent from "../../component/back-button";
import Field from "../../component/field";
import FieldPassword from "../../component/field-password";
import { saveSession } from "../../script/session";

import "./index.scss";

const RecoveryForm = () => {
  const [values, setValues] = useState({
    email: "",
  });

  const navigate = useNavigate();

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
      const res = await fetch("http://localhost:4000/recovery", {
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
        navigate("/recovery-confirm");
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
    });
  };

  return (
    <Page>
      <header>
        <BackButtonComponent />
      </header>

      <form onSubmit={handleSubmit} className="page__section">
        <h1 className="page__header">
          <div className="page__title">Recover password</div>
          <div className="page__subtitle">Choose a recovery method</div>
        </h1>
        <div className="form">
          <Field
            name="email"
            type="email"
            placeholder="Your e-mail"
            label="Email"
            errorMessage="Enter the correct value of the e-mail address"
            value={values.email}
            onChange={onChange}
            required={true}
          />
        </div>

        <button
          type="submit"
          className={`button ${disabled ? "button--disabled" : ""}`}
        >
          Send code
        </button>

        <span
          className={`alert ${
            disabled ? "alert--disabled" : `alert--${alert.status}`
          }`}
        >
          {alert.text}
        </span>
      </form>
    </Page>
  );
};

export default RecoveryForm;
