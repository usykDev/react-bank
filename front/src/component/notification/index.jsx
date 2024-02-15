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

  const convertTimeDifference = (time) => {
    const now = new Date();
    const timeDifferenceInSeconds = Math.floor((now - new Date(time)) / 1000);

    if (timeDifferenceInSeconds === 0) {
      return "Just now";
    } else if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds} ${
        timeDifferenceInSeconds === 1 ? "second" : "seconds"
      } ago`;
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      const remainingMinutes = Math.floor(
        (timeDifferenceInSeconds % 3600) / 60
      );
      return `${hours} ${
        hours === 1 ? "hour" : "hours"
      } and ${remainingMinutes} ${
        remainingMinutes === 1 ? "minute" : "minutes"
      } ago`;
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
          <div className="card-notification__time">
            {convertTimeDifference(time)}
          </div>
          <div className="card-notification__type">{type}</div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
