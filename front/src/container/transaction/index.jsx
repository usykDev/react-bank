import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BackButtonComponent from "../../component/back-button";
import Divider from "../../component/divider";
import axios from "axios";
import "./index.scss";

const TransactionPage = () => {
  const [data, setData] = useState(null);
  const [transactionType, setTransactionType] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);

  const { authState } = useAuth();
  const location = useLocation();

  const convertDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate().toString();
    const month = months[date.getMonth()];
    const hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();

    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${day} ${month}, ${hours}:${minutes}`;
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const transactionId = searchParams.get("transactionId");

    const fetchData = async () => {
      try {
        const response = await axios.get("/transaction", {
          params: {
            token: authState.token,
            transactionId: transactionId,
          },
        });

        const transactionData = response.data.transaction;
        const formattedDate = convertDate(new Date(transactionData.date));

        setData({
          ...response.data,
          transaction: {
            ...transactionData,
            date: formattedDate,
          },
        });
        setTransactionType(transactionData.type);
        setFormattedDate(formattedDate);
      } catch (error) {
        console.error("Error fetching balance data:", error);
      }
    };

    if (authState.token && transactionId) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    let cardAmountElement = document.querySelector(".transaction__amount");

    if (transactionType === "Receipt") {
      cardAmountElement.classList.add("transaction__amount-plus");
      cardAmountElement.classList.remove("transaction__amount-minus");
    } else {
      cardAmountElement.classList.add("transaction__amount-minus");
      cardAmountElement.classList.remove("transaction__amount-plus");
    }
  }, [transactionType]);

  return (
    <div className="page page__background--gray">
      <header className="account-page__header">
        <BackButtonComponent />

        <div className="account-page__title">Transaction</div>
      </header>

      <main className="page-transaction__section">
        <h1 className="transaction__amount">{data?.transaction?.amount}</h1>
        <div className="card__transaction--big">
          <div className="card__transaction--big__info">
            <div className="card__transaction--big__date">
              <div>Date</div>
              <div>{data?.transaction?.date}</div>
            </div>

            <Divider />

            <div className="card__transaction--big__address">
              <div>Address</div>
              <div>{data?.recipient}</div>
            </div>

            <Divider />

            <div className="card__transaction--big__type">
              <div>Type</div>
              <div className="transaction-type">{data?.transaction?.type}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransactionPage;
