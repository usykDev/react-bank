import React from "react";
import { useState, useEffect } from "react";
import Page from "../../page";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

import BackButtonComponent from "../../component/back-button";
import Field from "../../component/field";
import FieldPassword from "../../component/field-password";
import { saveSession } from "../../script/session";
import { useNavigate } from "react-router-dom";

import "./index.scss";

const RecoveryConfirmForm = () => {
  const [values, setValues] = useState({
    code: "",
    password: "",
  });

  const { login } = useAuth();

  const navigate = useNavigate();

  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState({ status: "", text: "" });
  const [confirmationCode, setConfirmationCode] = useState("");

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
      const res = await fetch("http://localhost:4000/recovery-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: convertData(),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ status: "success", text: data.message });
        login(data.session.user, data.session.token);
        saveSession(data.session);
        navigate("/balance");
      } else {
        setAlert({ status: "error", text: data.message });
      }
    } catch (error) {
      setAlert({ status: "error", text: error.message });
    }
  };

  const handleRenewLinkClick = async (e) => {
    e.preventDefault();

    try {
      const emailParam = new URLSearchParams(window.location.search).get(
        "email"
      );

      if (emailParam) {
        const response = await axios.get(
          `/recovery-confirm?renew=true&email=${emailParam}`
        );

        if (response.status === 200) {
          const data = response.data;

          if (data.confirm && data.confirm.code) {
            setConfirmationCode(data.confirm.code);
          }
        }
      }
    } catch (error) {
      setAlert({ status: "error", text: error.message });
    }
  };

  const convertData = () => {
    return JSON.stringify({
      code: Number(values.code),
      password: values.password,
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
          <div className="page__subtitle">Write the code you received</div>
        </h1>
        <div className="form">
          <Field
            name="code"
            type="number"
            placeholder="Your code"
            label="Code"
            errorMessage="Enter the correct value of the code"
            value={values.code}
            onChange={onChange}
            required={true}
          />
          <FieldPassword
            name="password"
            type="password"
            placeholder="Your password"
            label="Password"
            errorMessage="The password must consist of at least 8 characters, including at least one number, lowercase and uppercase letters"
            pattern={`^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$`}
            value={values.password}
            onChange={onChange}
            required={true}
          />
        </div>

        <div className="link__prefix">
          Lost your code?{" "}
          <button onClick={handleRenewLinkClick} className="link">
            Send it again
          </button>
        </div>

        <button
          type="submit"
          className={`button ${disabled ? "button--disabled" : ""}`}
        >
          Restore password
        </button>

        <span
          className={`alert ${
            disabled ? "alert--disabled" : `alert--${alert.status}`
          }`}
        >
          {alert.text}
        </span>

        <div>{confirmationCode}</div>
      </form>
    </Page>
  );
};

export default RecoveryConfirmForm;
