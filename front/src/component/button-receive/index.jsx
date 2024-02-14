import { useNavigate } from "react-router-dom";
import "./index.scss";

const ReceiveButton = () => {
  const navigate = useNavigate();

  const locate = () => {
    navigate("/receive");
  };

  return (
    <div class="button-operations__block">
      <div class="button-operation" onClick={locate}>
        <img src="/svg/button-receive.svg" alt="" width="30" height="30" />
      </div>
      <label>Receive</label>
    </div>
  );
};

export default ReceiveButton;
