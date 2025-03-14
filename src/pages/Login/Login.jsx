import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();

      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.post(
        `${apiUrl}/api/auth/verify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      sessionStorage.setItem("token", token);

      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <h2 className="login__title">Login</h2>
        {error && <p className="login__error">{error}</p>}
        <form className="login__form" onSubmit={handleLogin}>
          <label className="login__label">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="login__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="login__label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="login__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login__buttons">
            <button type="submit" className="login__button">
              Login
            </button>
            <button
              type="button"
              className="login__button login__button--cancel"
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

export default Login;
