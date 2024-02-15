import BackButtonComponent from "../../component/back-button";
import Field from "../../component/field";
import FieldNumber from "../../component/field-num";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { saveSession } from "../../script/session";
import { useAuth } from "../../context/AuthContext";
import { validateAmount } from "../../script/utilities";
import "./index.scss";

const SendPage = () => {
  const { authState, login } = useAuth();
  const [errorMessages, setErrorMessages] = useState([]);

  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    amount: "",
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

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    onChange({
      target: {
        name: "amount",
        value: newValue,
      },
    });
    const newErrorMessages = validateAmount(newValue);
    setErrorMessages(newErrorMessages);
  };

  const submit = async () => {
    setAlert({ status: "progress", text: "Loading" });

    try {
      const res = await fetch("http://localhost:4000/send", {
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
      amount: values.amount,
      token: authState.token,
    });
  };

  return (
    <>
      <div className="page page__background--gray">
        <header className="account-page__header">
          <BackButtonComponent />

          <div className="account-page__title">Send</div>
        </header>

        <div className="page__section">
          <div className="form">
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
              <FieldNumber
                name="amount"
                type="number"
                label="Sum"
                value={values.amount}
                onChange={handleInputChange}
                labelClassName="field__label"
                errorMessages={errorMessages}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default SendPage;
