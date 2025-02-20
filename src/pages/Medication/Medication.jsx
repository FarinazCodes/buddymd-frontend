import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./Medication.scss";
import CustomCalendar from "../../components/CustomCalendar/CustomCalendar";
import MedsGif from "../../assets/images/Meds.gif";

const Medication = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [medications, setMedications] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    dosage_unit: "mg",
    start_date: "",
    schedule_time: "",
    end_date: "",
  });

  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Fetch phone number from backend
        const token = await user.getIdToken();
        try {
          const response = await axios.get(
            "http://localhost:5001/api/profile/get-phone",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.phone_number) {
            setPhoneNumber(response.data.phone_number);
          }
        } catch (error) {
          console.error("Error fetching phone number:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Fetch medications from backend
  const fetchMedications = async () => {
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();
      const response = await axios.get(
        "http://localhost:5001/api/medications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMedications(response.data);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMedications();
    }
  }, [currentUser]);

  // Handle input change
  const handleChange = (e) => {
    setNewMedication({ ...newMedication, [e.target.name]: e.target.value });
  };

  // Save medication and use the stored phone number
  const saveMedication = async () => {
    if (!currentUser) {
      console.error("User not authenticated");
      return;
    }

    if (!phoneNumber) {
      alert("Please update your phone number in the profile first.");
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      await axios.post(
        "http://localhost:5001/api/medications",
        {
          ...newMedication,
          end_date:
            newMedication.end_date === "" ? null : newMedication.end_date,
          phone_number: phoneNumber,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowPopup(false);
      fetchMedications();
      console.log("Medication added successfully");
    } catch (error) {
      console.error("Error adding medication:", error.response?.data || error);
    }
  };

  const deleteMedication = async (id) => {
    if (!currentUser) {
      console.error("User not authenticated");
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      await axios.delete(`http://localhost:5001/api/medications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchMedications(); // Refresh the list after deletion
      console.log("Medication deleted successfully");
    } catch (error) {
      console.error(
        "Error deleting medication:",
        error.response?.data || error
      );
    }
  };

  return (
    <div className="medication">
      <CustomCalendar />
      <div className="medication__section">
        <img src={MedsGif} alt="Medication GIF" className="medication__gif" />

        <h2>Medications</h2>
        <ul className="medication__list">
          {medications.map((med) => (
            <li key={med.id}>
              {med.name} - {med.dosage} {med.dosage_unit} - Starts:{" "}
              {med.start_date} at {med.schedule_time}{" "}
              {med.end_date ? `until ${med.end_date}` : ""}
              <button onClick={() => deleteMedication(med.id)}>
                Delete
              </button>{" "}
            </li>
          ))}
        </ul>

        <button
          className="medication__button"
          onClick={() => setShowPopup(true)}
        >
          Add a Medication
        </button>

        {showPopup && (
          <div className="popup">
            <div className="popup__content">
              <h2>Enter Medication Details</h2>
              <input
                type="text"
                name="name"
                placeholder="Medication Name"
                onChange={handleChange}
              />
              <input
                type="text"
                name="dosage"
                placeholder="Dosage"
                onChange={handleChange}
              />
              <select
                name="dosage_unit"
                onChange={handleChange}
                value={newMedication.dosage_unit}
              >
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="%">%</option>
              </select>
              <input type="date" name="start_date" onChange={handleChange} />
              <input type="time" name="schedule_time" onChange={handleChange} />
              <input
                type="date"
                name="end_date"
                placeholder="End date (optional)"
                onChange={handleChange}
              />
              <button
                className="popup__button"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button className="popup__button" onClick={saveMedication}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medication;
