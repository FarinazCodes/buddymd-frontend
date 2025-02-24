import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.scss";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL;

      await axios.post(
        `${apiUrl}/api/auth/register`,
        {
          uid: user.uid,
          email: user.email,
          phoneNumber: "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("User successfully added to database!");

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
