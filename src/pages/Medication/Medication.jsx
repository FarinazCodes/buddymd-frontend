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
  const [adherenceStatus, setAdherenceStatus] = useState({});

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

  // ✅ Fetch medications and adherence logs
  const fetchMedications = async () => {
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();

      // Fetch Medications
      const response = await axios.get(
        "http://localhost:5001/api/medications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const meds = response.data;
      setMedications(meds);

      // Fetch adherence logs for each medication
      const adherenceMap = {};
      await Promise.all(
        meds.map(async (med) => {
          try {
            const adherenceResponse = await axios.get(
              `http://localhost:5001/api/adherence/${med.id}`, // ✅ Pass `med.id`
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (adherenceResponse.data.length > 0) {
              adherenceMap[med.id] = adherenceResponse.data[0].status; // ✅ Store latest status
            }
          } catch (error) {
            console.error(
              `Error fetching adherence log for medication ${med.id}:`,
              error
            );
          }
        })
      );

      // ✅ Update adherence state
      setAdherenceStatus(adherenceMap);
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

  // ✅ Add Adherence Status
  const addAdherenceLog = async (medicationId, status) => {
    if (!currentUser) {
      console.error("User not authenticated");
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      await axios.post(
        "http://localhost:5001/api/adherence",
        {
          medication_id: medicationId,
          date: new Date().toISOString().split("T")[0], // ✅ Log for today's date
          status: status, // "Taken", "Missed", or "Skipped"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(
        `Adherence logged: ${status} for medication ID ${medicationId}`
      );

      // ✅ Update local state immediately to persist status
      setAdherenceStatus((prevStatus) => ({
        ...prevStatus,
        [medicationId]: status,
      }));
    } catch (error) {
      console.error("Error logging adherence:", error.response?.data || error);
    }
  };

  // ✅ Save a Medication
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

  // ✅ Delete a Medication
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
      <div className="medication__title">
        <h2>Medications</h2>
      </div>
      <div className="medication__section">
        <div className="medication__gif-card">
          <div className="medication__gif-container">
            <img
              src={MedsGif}
              alt="Medication GIF"
              className="medication__gif"
            />
          </div>
        </div>

        <ul className="medication__list">
          {medications.map((med) => (
            <li key={med.id}>
              {med.name} - {med.dosage} {med.dosage_unit} - Starts:{" "}
              {med.start_date} at {med.schedule_time}{" "}
              {med.end_date ? `until ${med.end_date}` : ""}
              <button onClick={() => deleteMedication(med.id)}>Delete</button>
              {/* ✅ Show adherence status */}
              {!adherenceStatus[med.id] ? (
                <div className="medication__actions">
                  <button
                    className="medication__button medication__button--taken"
                    onClick={() => addAdherenceLog(med.id, "Taken")}
                  >
                    Taken
                  </button>
                  <button
                    className="medication__button medication__button--missed"
                    onClick={() => addAdherenceLog(med.id, "Missed")}
                  >
                    Missed
                  </button>
                  <button
                    className="medication__button medication__button--skipped"
                    onClick={() => addAdherenceLog(med.id, "Skipped")}
                  >
                    Skipped
                  </button>
                </div>
              ) : (
                <p className="medication__status">
                  Status: <strong>{adherenceStatus[med.id]}</strong>
                </p>
              )}
            </li>
          ))}
        </ul>

        {/* ✅ Add a Medication */}
        <button
          className="medication__button"
          onClick={() => setShowPopup(true)}
        >
          Add a Medication
        </button>

        {/* ✅ Medication Popup */}
        {showPopup && (
          <div className="popup">
            <div className="popup__container">
              <h2 className="popup__title">Enter Medication Details</h2>

              <div className="popup__form">
                <input
                  className="popup__input"
                  type="text"
                  name="name"
                  placeholder="Medication Name"
                  onChange={handleChange}
                />

                <input
                  className="popup__input"
                  type="text"
                  name="dosage"
                  placeholder="Dosage"
                  onChange={handleChange}
                />

                <select
                  className="popup__select"
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

                <input
                  className="popup__input"
                  type="date"
                  name="start_date"
                  onChange={handleChange}
                />
                <input
                  className="popup__input"
                  type="time"
                  name="schedule_time"
                  onChange={handleChange}
                />
                <input
                  className="popup__input"
                  type="date"
                  name="end_date"
                  placeholder="End date (optional)"
                  onChange={handleChange}
                />
              </div>

              <div className="popup__actions">
                <button
                  className="popup__button popup__button--cancel"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  className="popup__button popup__button--save"
                  onClick={saveMedication}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medication;
