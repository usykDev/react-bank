import React from "react";
import { useState, useEffect } from "react";

import Page from "../../page";
import BackButtonComponent from "../../component/back-button";
import Field from "../../component/field";
import { saveSession, getTokenSession } from "../../script/session";
import "./index.scss";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SignupConfirmForm = () => {
  const [values, setValues] = useState({
    code: "",
  });

  const { authState } = useAuth();

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
      const res = await fetch("http://localhost:4000/signup-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: convertData(),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ status: "success", text: data.message });
        authState.user.isConfirm = true;
        saveSession(data.session);
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
      code: Number(values.code),
      token: getTokenSession(),
    });
  };

  const handleRenewLinkClick = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("/signup-confirm", {
        params: {
          renew: true,
          email: authState.user.email,
        },
      });
    } catch {}
  };

  return (
    <Page>
      <header>
        <BackButtonComponent />
      </header>

      <form onSubmit={handleSubmit} className="page__section">
        <h1 className="page__header">
          <div className="page__title">Confirm account</div>
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
          Send
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

export default SignupConfirmForm;
