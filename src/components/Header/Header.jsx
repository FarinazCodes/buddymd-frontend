import React from "react";
import logo from "../../assets/images/BuddyMD Logo.png";
import "./Header.scss";
const Header = () => {
  return (
    <header className="header">
      <div className="header__logo-container">
        <img className="header__logo" src={logo} alt="BuddyMD Logo" />
      </div>
    </header>
  );
};

export default Header;
