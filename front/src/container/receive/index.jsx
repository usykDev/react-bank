import BackButtonComponent from "../../component/back-button";
import FieldNumber from "../../component/field-num";
import Divider from "../../component/divider";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { saveSession } from "../../script/session";
import { useAuth } from "../../context/AuthContext";
import { validateAmount } from "../../script/utilities";
import "./index.scss";

const ReceivePage = () => {
  const { authState } = useAuth();
  const [errorMessages, setErrorMessages] = useState([]);

  const navigate = useNavigate();
  const [values, setValues] = useState({
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

    const stripeCard = document.getElementById("stripeCard");
    const coinCard = document.getElementById("coinCard");

    if (stripeCard && coinCard) {
      const alert = document.querySelector(`.alert`);
      const isCardDisabled = Boolean(isDisabled);

      stripeCard.classList.toggle("card--disabled", isCardDisabled);
      coinCard.classList.toggle("card--disabled", isCardDisabled);

      if (isCardDisabled) {
        stripeCard.setAttribute("disabled", "true");
        coinCard.setAttribute("disabled", "true");
      } else {
        stripeCard.removeAttribute("disabled");
        coinCard.removeAttribute("disabled");
        alert.className = "alert alert--disabled";
      }
    }
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

  const submitStripe = async () => {
    setAlert({ status: "progress", text: "Loading" });

    try {
      const res = await fetch("http://localhost:4000/receive-stripe", {
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

  const submitCoin = async () => {
    setAlert({ status: "progress", text: "Loading" });

    try {
      const res = await fetch("http://localhost:4000/receive-coin", {
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

  const handleSubmitStripe = (e) => {
    e.preventDefault();

    submitStripe();
  };

  const handleSubmitCoin = (e) => {
    e.preventDefault();

    submitCoin();
  };

  const convertData = () => {
    return JSON.stringify({
      amount: values.amount,
      token: authState.token,
    });
  };

  return (
    <>
      <div className="page page__background--gray">
        <header className="account-page__header">
          <BackButtonComponent />

          <div className="account-page__title">Receive</div>
        </header>

        <div className="page__section">
          <div className="form">
            <div className="form__item">
              <FieldNumber
                name="amount"
                type="number"
                labelClassName="field__label--bold"
                label="Receive amount"
                value={values.amount}
                onChange={handleInputChange}
                errorMessages={errorMessages}
              />
            </div>

            <Divider />

            <div className="payment--system__cards">
              <div className="page__section--title">Payment system</div>

              <button
                onClick={handleSubmitStripe}
                id="stripeCard"
                className="card card--disabled"
              >
                <img
                  src="/svg/stripe.svg"
                  className="card__image"
                  alt=""
                  width="40"
                  height="40"
                />
                <div className="card__info">
                  <div className="card__title">Stripe</div>
                  <div className="card__types">
                    <img src="/svg/stripe-info.svg" alt="Stripe Info" />
                  </div>
                </div>
              </button>

              <button
                onClick={handleSubmitCoin}
                id="coinCard"
                className="card card--disabled"
              >
                <img
                  src="/svg/coin.svg"
                  className="card__image"
                  alt=""
                  width="40"
                  height="40"
                />
                <div className="card__info">
                  <div className="card__title">Coin</div>
                  <div className="card__types">
                    <img src="/svg/coin-info.svg" alt="Coin Info" />
                  </div>
                </div>
              </button>
            </div>

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

export default ReceivePage;
