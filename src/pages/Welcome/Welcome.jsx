import React from "react";
import "./Welcome.scss";

import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="welcome">
      <div className="welcome__container">
        <h1 className="welcome__title">Your Personal Medication Tracker</h1>
        <div className="welcome__content">
          <Link to="/register" className="welcome__button">
            Get Started
          </Link>
          <p className="welcome__login-text">
            If you already have an account{" "}
            <Link to="/login" className="welcome__login-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
