import React from "react";
import "./index.scss";

const ButtonBack = () => {
	const goBack = () => {
		window.history.back();
	}

	return (
		<div className="back-button" onClick={goBack} >
			<img src="/svg/back-button.svg" width="20" height="20" />
		</div>
	)
}

export default ButtonBack;