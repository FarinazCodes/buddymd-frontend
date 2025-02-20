import React from "react";
import BentoBox from "../../components/BentoBox/BentoBox";
import CustomCalendar from "../../components/CustomCalendar/CustomCalendar";
import "./HomePage.scss";

import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* ✅ Fix: Updated link to match the correct route */}
      <Link to="/profile">
        <button>View Profile</button>
      </Link>

      {/* Calendar */}
      <CustomCalendar />

      {/* Bento Grid */}
      <BentoBox />
    </div>
  );
};

export default HomePage;
