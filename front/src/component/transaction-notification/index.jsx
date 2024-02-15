import React from "react";
import "./index.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Transaction = ({ id, sender, time, type, amount }) => {
  const [data, setData] = useState(null);
  const { authState } = useAuth();
  const navigate = useNavigate();

  const convertTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/balance", {
          params: {
            token: authState.token,
          },
        });

        setData(response.data);
        authState.user.isConfirm = true;
      } catch (error) {
        console.error("Error fetching balance data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let cardElements = document.querySelectorAll(".card-transaction");

    cardElements.forEach((el) => {
      let transactionTypeElement = el.querySelector(".card-transaction__type");
      let cardAmountElement = el.querySelector(".card-transaction__amount");

      let transactionType = transactionTypeElement.textContent;

      if (transactionType === "Receipt") {
        cardAmountElement.classList.add("card-transaction__amount-plus");
        cardAmountElement.classList.remove("card-transaction__amount-minus");
      } else {
        cardAmountElement.classList.add("card-transaction__amount-minus");
        cardAmountElement.classList.remove("card-transaction__amount-plus");
      }
    });
  }, []);

  const getImageSource = (transactionTitle) => {
    if (transactionTitle === "Stripe") {
      return "/svg/stripe.svg";
    } else if (transactionTitle === "Coin") {
      return "/svg/coin.svg";
    } else {
      return "/svg/person.svg";
    }
  };

  const locateTransaction = (event) => {
    const element = event.currentTarget;

    if (authState.token) {
      const transactionId = element.getAttribute("transaction-id");
      navigate(
        `/transaction?token=${authState.token}&transactionId=${transactionId}`
      );
    } else {
      navigate("/transaction");
    }
  };

  return (
    <div
      className="card-transaction"
      onClick={locateTransaction}
      transaction-id={id}
    >
      <img
        src={getImageSource(sender)}
        className="card-transaction__image"
        alt=""
        width="48"
        height="48"
      />
      <div className="card-transaction__data">
        <div className="card-transaction__title">{sender}</div>
        <div className="card-transaction__details">
          <div className="card-transaction__time">
            {convertTime(new Date(time))}
          </div>
          <div className="card-transaction__type">{type}</div>
        </div>
      </div>
      <div className="card-transaction__amount">{amount}</div>
    </div>
  );
};

export default Transaction;
