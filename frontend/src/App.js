import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

// Pages & Components
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footbar from "./components/Footbar";

const socket = io("http://localhost:5000"); // Update this if hosted remotely

function App() {
  const [user, setUser] = useState(null);

  // Fetch profile if token exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        setUser(userData);

        // Join user room for socket communication
        socket.emit("join", userData._id);
      } catch (err) {
        console.error("Profile fetch failed:", err.message);
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route
          path="/register"
          element={<Register setUser={setUser} socket={socket} />}
        />
        <Route
          path="/login"
          element={<Login setUser={setUser} socket={socket} />}
        />
        <Route path="/home" element={<Home user={user} socket={socket} />} />
        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
      <Footbar/>
    </Router>
  );
}

export default App;
