import React, { useState } from "react";
import DrugReactionsChart from "../../components/DrugReactionsChart/DrugReactionsChart";
import "./DrugReactions.scss";

const DrugReactions = () => {
  const [inputValue, setInputValue] = useState("");
  const [drugName, setDrugName] = useState("");

  // ✅ Update input value when typing
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    if (!inputValue.trim()) {
      alert("Please enter a drug name.");
      return;
    }
    setDrugName(inputValue); // Set drugName only when searching
  };

  return (
    <div className="drug-reactions">
      <div className="drug-reactions__header">
        <h2 className="drug-reactions__title">Reported Drug Reactions</h2>
      </div>
      <div className="drug-reactions__search">
        <input
          className="drug-reactions__input"
          type="text"
          placeholder="Enter drug name (e.g., Aspirin)"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className="drug-reactions__button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {drugName && <DrugReactionsChart drugName={drugName} />}
    </div>
  );
};

export default DrugReactions;
