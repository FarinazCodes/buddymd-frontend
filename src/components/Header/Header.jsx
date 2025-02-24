import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/BuddyMD Logo.png";
import profileIcon from "../../assets/images/profile.gif";
import "./Header.scss";

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header__logo-container">
        <img className="header__logo" src={logo} alt="BuddyMD Logo" />
      </div>

      {location.pathname === "/home" && (
        <Link to="/profile" className="header__profile-link">
          <img
            src={profileIcon}
            alt="Profile"
            className="header__profile-image"
          />
        </Link>
      )}
    </header>
  );
};

export default Header;
