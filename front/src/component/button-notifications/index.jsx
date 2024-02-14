import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./index.scss";

const NotificationsButton = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();

  const locate = () => {
    if (authState.token) {
      return navigate(`/notifications?token=${authState.token}`);
    } else {
      return navigate("/notifications");
    }
  };

  return (
    <div className="button-notifications" onClick={locate}>
      <img src="/svg/notifications-button.svg" alt="" width="24" height="24" />
    </div>
  );
};

export default NotificationsButton;
