import React from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";

const BackButtonComponent = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="back-button" onClick={goBack}>
      <img src="/svg/back-button.svg" alt="" width="24" height="24" />
    </div>
  );
};

export default BackButtonComponent;
