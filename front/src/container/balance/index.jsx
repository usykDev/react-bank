import "./index.scss";
import NotificationsButton from "../../component/button-notifications";
import SettingsButton from "../../component/button-settings";
import ReceiveButton from "../../component/button-receive";
import SendButton from "../../component/button-send";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Transaction from "../../component/transaction-notification";

const WalletPage = () => {
  const [data, setData] = useState(null);
  const { authState, logout } = useAuth();

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
        logout();
        console.error("Error fetching balance data:", error);
      }
    };

    fetchData();
  }, []);

  if (!authState.user.isConfirm) {
    return <Navigate to="/signup-confirm" />;
  }

  return (
    <div className="page__wallet-background">
      <div className="page">
        <header className="wallet-page__header">
          <SettingsButton />
          <div className="wallet-page__title">Main wallet</div>
          <NotificationsButton />
        </header>

        <div className="wallet-page__main">
          {data && <div className="wallet-page__balance">{data.balance}</div>}

          <div className="wallet-page__operations">
            <ReceiveButton />
            <SendButton />
          </div>
        </div>

        <div className="wallet-page__transactions-list">
          {data &&
            data.transactions &&
            data.transactions.map((transaction) => (
              <Transaction
                key={transaction.id}
                id={transaction.id}
                sender={transaction.sender}
                time={transaction.date}
                type={transaction.type}
                amount={transaction.amount}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
