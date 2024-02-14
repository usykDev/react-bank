import React from "react";
import { useState, useEffect } from "react";
import Page from "../../page";
import { Link } from "react-router-dom";
import BackButtonComponent from "../../component/back-button";
import Field from "../../component/field";
import FieldPassword from "../../component/field-password";
import { saveSession } from "../../script/session";

import "./index.scss";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SigninForm = () => {
  const { login } = useAuth();

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
      const res = await fetch("http://localhost:4000/signin", {
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
    });
  };

  return (
    <Page>
      <header>
        <BackButtonComponent />
      </header>

      <form onSubmit={handleSubmit} className="page__section">
        <h1 className="page__header">
          <div className="page__title">Sign in</div>
          <div className="page__subtitle">Select login method</div>
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
          <FieldPassword
            name="password"
            type="password"
            placeholder="Your password"
            label="Password"
            errorMessage="Please enter the value"
            value={values.password}
            onChange={onChange}
            required={true}
          />
        </div>

        <div className="link__prefix">
          Forgot your password?{" "}
          <Link to={"/recovery"} className="link">
            Restore
          </Link>
        </div>

        <button
          type="submit"
          className={`button ${disabled ? "button--disabled" : ""}`}
        >
          Continue
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

export default SigninForm;
