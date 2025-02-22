import React from "react";
import { useNavigate } from "react-router-dom";
import "./BentoBox.scss";

const BentoBox = () => {
  const navigate = useNavigate();
  const bentoItems = [
    {
      className: "bento-box--medications",
      title: "Medications",
      titleClass: "title-medications",
      onClick: () => navigate("/medications"),
    },
    {
      className: "bento-box--recipes",
      title: "Recipes",
      titleClass: "title-recipes",
    },
    {
      className: "bento-box--insights",
      title: "Insights",
      titleClass: "title-insights",
      onClick: () => navigate("/insights"),
    },
    {
      className: "bento-box--health-tips",
      title: "Daily Health Tips",
      titleClass: "title-health-tips",
    },
  ];

  return (
    <section className="bento-grid">
      {bentoItems.map((item, index) => (
        <div
          key={index}
          className={`bento-box ${item.className}`}
          onClick={item.onClick}
        >
          <div className={`bento-box__title ${item.titleClass}`}>
            {item.title}
          </div>
        </div>
      ))}
    </section>
  );
};

export default BentoBox;
