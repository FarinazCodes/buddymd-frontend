import React, { useState } from "react";
import "./Medication.scss";
import CustomCalendar from "../../components/CustomCalendar/CustomCalendar";
import MedsGif from "../../assets/images/Meds.gif";
const Medication = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="medication">
      {/* Calendar Section */}
      <div className="medication__calendar">
        <CustomCalendar />
      </div>
      {/* Medications Section */}
      <div className="medication__section">
        <div className="medication__title">Medications</div>
        <div className="medication__content">
          <img src={MedsGif} alt="Medication GIF" className="medication__gif" />
        </div>
        <button
          className="medication__button"
          onClick={() => setShowPopup(true)}
        >
          Add a Medication
        </button>
      </div>

      {/* Medication Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup__content">
            <h2 className="popup__title">Enter Medication Details</h2>
            <input
              type="text"
              placeholder="Medication Name"
              className="popup__input"
            />
            <input type="text" placeholder="Dosage" className="popup__input" />
            <input
              type="text"
              placeholder="Frequency"
              className="popup__input"
            />
            <div className="popup__buttons">
              <button
                className="popup__button popup__button--cancel"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button className="popup__button popup__button--save">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medication;
