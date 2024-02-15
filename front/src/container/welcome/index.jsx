import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./index.scss";

function WelcomePage() {
  const { authState, logout } = useAuth();

  return (
    <div className="welcome-page">
      <div className="welcome-page__background">
        {authState.token ? (
          <>
            <div className="welcome-page__content">
              <h1 className="title">Hello!</h1>
              <div className="subtitle">You are logged in.</div>
            </div>
            <div className="button__section">
              <button className="button button--red" onClick={logout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="welcome-page__content">
              <h1 className="title">Hello!</h1>
              <div className="subtitle">Welcome to bank app</div>
            </div>
            <div className="button__section">
              <Link to="/signup" className="button">
                Sign Up
              </Link>
              <Link to="/signin" className="button button--white">
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WelcomePage;
