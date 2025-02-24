import React from "react";
import BentoBox from "../../components/BentoBox/BentoBox";
import CustomCalendar from "../../components/CustomCalendar/CustomCalendar";
import "./HomePage.scss";
import Footer from "../../components/Footer/Footer";

const HomePage = () => {
  return (
    <div className="homepage">
      <CustomCalendar />

      <BentoBox />
      <Footer />
    </div>
  );
};

export default HomePage;
