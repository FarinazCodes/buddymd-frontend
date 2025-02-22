import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
import HomePage from "./pages/HomePage/HomePage";
import Medication from "./pages/Medication/Medication";
import Header from "./components/Header/Header";
import Welcome from "./pages/Welcome/Welcome";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Profile from "./components/Profile/Profile";
import Insights from "./pages/Insights/Insights";
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/medications"
          element={user ? <Medication /> : <Navigate to="/login" />}
        />
        <Route
          path="/insights"
          element={user ? <Insights /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}
export default App;
