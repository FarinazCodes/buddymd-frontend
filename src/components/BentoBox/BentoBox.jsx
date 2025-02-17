import React from "react";
import "./BentoBox.scss";

const BentoBox = () => {
  const bentoItems = [
    { className: "bento-box--medications", title: "Medications" },
    { className: "bento-box--recipes", title: "Recipes" },
    { className: "bento-box--insights", title: "Insights" },
    { className: "bento-box--health-tips", title: "Daily Health Tips" },
  ];

  return (
    <section className="bento-grid">
      {bentoItems.map((item, index) => (
        <div key={index} className={`bento-box ${item.className}`}>
          <div className="bento-box__title">{item.title}</div>
        </div>
      ))}
    </section>
  );
};

export default BentoBox;
