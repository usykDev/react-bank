import Notification from "../../component/notification";
import BackButtonComponent from "../../component/back-button";

import React, { useEffect, useState } from "react";
import "./index.scss";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { authState } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/notifications", {
          params: {
            token: authState.token,
          },
        });

        const data = response.data;

        if (Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        } else {
          console.error(
            "Error fetching notifications:",
            data.error || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (authState.token) {
      fetchNotifications();
    }
  }, [authState.token]);

  return (
    <div className="page page__background--gray">
      <header className="account-page__header">
        <BackButtonComponent />
        <div className="account-page__title">Notifications</div>
      </header>

      <main className="page__section">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <Notification
              key={index}
              text={notification.text}
              time={notification.date}
              type={notification.type}
            />
          ))
        ) : (
          <p>No notifications available</p>
        )}
      </main>
    </div>
  );
};

export default NotificationPage;
