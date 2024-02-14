import React from "react";
import "./index.scss";

const Notification = ({ text, time, type }) => {
  const getImageSource = (notificationType) => {
    if (notificationType === "Announcement") {
      return "/svg/announcement.svg";
    } else if (notificationType === "Warning") {
      return "/svg/warning.svg";
    } else {
      return "/svg/warning.svg";
    }
  };

  return (
    <div className="card-notification">
      <img
        src={getImageSource(type)}
        className="card-notification__image"
        alt=""
        width="40"
        height="40"
      />
      <div className="card-notification__data">
        <div className="card-notification__title">{text}</div>
        <div className="card-notification__details">
          <div className="card-notification__time">{time}</div>
          <div className="card-notification__type">{type}</div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
