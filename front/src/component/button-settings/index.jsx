import { useNavigate } from "react-router-dom";
import "./index.scss";

const SettingsButton = () => {
  const navigate = useNavigate();

  const locate = () => {
    navigate("/settings");
  };

  return (
    <div className="button-settings" onClick={locate}>
      <img src="/svg/settings-button.svg" alt="" width="24" height="24" />
    </div>
  );
};

export default SettingsButton;
