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

  const apiUrl = import.meta.env.VITE_API_URL;

  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        const token = await user.getIdToken();
        try {
          const response = await axios.get(`${apiUrl}/api/profile/get-phone`, {
            headers: { Authorization: `Bearer ${token}` },
          });

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

  const fetchMedications = async () => {
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();

      const response = await axios.get(`${apiUrl}/api/medications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const meds = response.data;
      setMedications(meds);

      const adherenceMap = {};
      await Promise.all(
        meds.map(async (med) => {
          try {
            const adherenceResponse = await axios.get(
              `${apiUrl}/api/adherence/${med.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (adherenceResponse.data.length > 0) {
              adherenceMap[med.id] = adherenceResponse.data[0].status;
            }
          } catch (error) {
            console.error(
              `Error fetching adherence log for medication ${med.id}:`,
              error
            );
          }
        })
      );

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

  const handleChange = (e) => {
    setNewMedication({ ...newMedication, [e.target.name]: e.target.value });
  };

  const addAdherenceLog = async (medicationId, status) => {
    if (!currentUser) {
      console.error("User not authenticated");
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      await axios.post(
        `${apiUrl}/api/adherence`,
        {
          medication_id: medicationId,
          date: new Date().toISOString().split("T")[0],
          status: status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(
        `Adherence logged: ${status} for medication ID ${medicationId}`
      );

      setAdherenceStatus((prevStatus) => ({
        ...prevStatus,
        [medicationId]: status,
      }));
    } catch (error) {
      console.error("Error logging adherence:", error.response?.data || error);
    }
  };

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
        `${apiUrl}/api/medications`,
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
      await axios.delete(`${apiUrl}/api/medications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchMedications();
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
      <CustomCalendar className="medication__calendar" />
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

        <div className="medication__list">
          {medications.map((med) => (
            <div key={med.id} className="medication__card">
              <div className="medication__info">
                <div className="medication__date">
                  <span className="medication__label">Start Date:</span>
                  <span className="medication__value">
                    {new Date(med.start_date).toLocaleDateString()}
                  </span>
                </div>

                {med.end_date && (
                  <div className="medication__date">
                    <span className="medication__label">End Date:</span>
                    <span className="medication__value">
                      {new Date(med.end_date).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="medication__details">
                  <h3>{med.name}</h3>
                  <p>
                    {med.dosage} {med.dosage_unit}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(
                      `1970-01-01T${med.schedule_time}`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <button
                    className="medication__delete"
                    onClick={() => deleteMedication(med.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="medication__actions-column">
                {adherenceStatus[med.id] ? (
                  <p
                    className={`medication__status medication__status--${adherenceStatus[
                      med.id
                    ].toLowerCase()}`}
                  >
                    {adherenceStatus[med.id]}
                  </p>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          className="medication__button medication__button--add"
          onClick={() => setShowPopup(true)}
        >
          Add a Medication
        </button>

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
