import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import Page from "../../page";

const WellcomePage = () => {
  return (
    <Page>
      <div className="front_page">
        <div className="front_page--background">
          <div className="front_page--content">
            <h1 className="title">Hello!</h1>
            <div className="subtitle">Welcome to bank app</div>
          </div>
          <div className="buttons_column">
            <Link to="/signup" className="button button--purple">
              Sign Up
            </Link>
            <Link to="/signin" className="button">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default WellcomePage;
