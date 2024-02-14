import { useNavigate } from "react-router-dom";
import "./index.scss";

const SendButton = () => {
  const navigate = useNavigate();

  const locate = () => {
    navigate("/send");
  };

  return (
    <div class="button-operations__block">
      <div class="button-operation" onClick={locate}>
        <img src="/svg/button-send.svg" alt="" width="30" height="30" />
      </div>
      <label>Send</label>
    </div>
  );
};

export default SendButton;
