import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import axios from "axios";
import "./Profile.scss";

const Profile = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setPhoneNumber(user.phoneNumber || "");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleUpdatePhoneNumber = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await axios.post(
        "http://localhost:5001/api/profile/update-phone",
        { phone_number: phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update phone number in Firebase Auth
      await updateProfile(user, { phoneNumber });
      alert("Phone number updated successfully!");
    } catch (error) {
      console.error(
        "Error updating phone number:",
        error.response?.data || error
      );
    }
  };

  return (
    <div className="profile">
      <h2 className="profile__title">User Profile</h2>
      {user ? (
        <div className="profile__info">
          <p className="profile__email">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="profile__password">
            <strong>Password:</strong> (Hidden for security)
          </p>
          <div className="profile__phone">
            <label className="profile__phone-label">
              Phone Number:
              <input
                className="profile__phone-input"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
              />
            </label>
          </div>
          <button
            className="profile__button profile__button--update"
            onClick={handleUpdatePhoneNumber}
          >
            Update Phone Number
          </button>
        </div>
      ) : (
        <p className="profile__loading">Loading...</p>
      )}
    </div>
  );
};

export default Profile;
