import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import axios from "axios";
import "./Profile.scss";
import { Link } from "react-router-dom";

const Profile = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        try {
          const token = await user.getIdToken();
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/profile/get-phone`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.phone_number) {
            setPhoneNumber(response.data.phone_number);
          }
        } catch (error) {
          console.error("Error fetching phone number:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleUpdatePhoneNumber = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profile/update-phone`,
        { phone_number: phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

      {loading ? (
        <p className="profile__loading">Loading...</p>
      ) : user ? (
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
          <div className="profile__buttons">
            <button
              className="profile__button profile__button--update"
              onClick={handleUpdatePhoneNumber}
            >
              Update Phone Number
            </button>

            <Link to="/home" className="profile__button profile__button--home">
              Home
            </Link>
          </div>
        </div>
      ) : (
        <p className="profile__loading">User not found.</p>
      )}
    </div>
  );
};

export default Profile;
