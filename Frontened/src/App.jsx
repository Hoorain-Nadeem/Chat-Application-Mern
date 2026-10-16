import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Signup from "./Pages/Signup";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

function App() {
  // const navigate = useNavigate()

  const { authUser } = useContext(AuthContext);
  return (
    <div className="bg-[url('https://wallpaperaccess.com/full/6616740.jpg')] bg-contain bg-center">
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/chat"} />}
        />
        <Route
          path="/chat"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
      
        />
 
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
