import React from "react";
import BentoBox from "../../components/BentoBox/BentoBox";
import CustomCalendar from "../../components/CustomCalendar/CustomCalendar";
import "./HomePage.scss";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Calendar */}
      <CustomCalendar />

      {/* Bento Grid */}
      <BentoBox />
    </div>
  );
};

export default HomePage;
