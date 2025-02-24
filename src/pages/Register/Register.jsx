import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.scss";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Set display name in Firebase Auth
      await updateProfile(user, { displayName });

      // ✅ Get Firebase token for authentication
      const token = await user.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL; // ✅ Use environment variable for API URL

      // ✅ Send user data to backend
      await axios.post(
        `${apiUrl}/api/users`, // Ensure your backend has this endpoint
        {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          phoneNumber: "", // Optional, can be updated later
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("User successfully added to database!");

      // ✅ Navigate to home after successful registration
      navigate("/home");
    } catch (error) {
      console.error("Registration Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        <h2 className="register__title">Register</h2>
        {error && <p className="register__error">{error}</p>}
        <form className="register__form" onSubmit={handleRegister}>
          <label className="register__label">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="register__input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <label className="register__label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="register__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="register__label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="register__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="register__buttons">
            <button type="submit" className="register__button">
              Sign Up
            </button>
            <button
              type="button"
              className="register__button register__button--cancel"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
