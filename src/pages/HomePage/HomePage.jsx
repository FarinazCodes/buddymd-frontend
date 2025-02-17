import React from "react";
import BentoBox from "../../components/BentoBox/BentoBox";
import CustomCalendar from "../../components/CustomCalendar/CustomCalendar";
import "./HomePage.scss";
import "../../components/BentoBox/BentoBox.scss";
import logo from "../../assets/images/BuddyMD Logo.png";
const HomePage = () => {
  return (
    <div className="homepage">
      {/* Header */}
      <header className="homepage__header">
        <img className="homepage__logo" src={logo} alt="BuddyMD Logo" />
      </header>

      {/* Calendar */}
      <CustomCalendar />

      {/* Bento Grid */}
      <BentoBox />
    </div>
  );
};

export default HomePage;
