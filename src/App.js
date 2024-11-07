import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Profile from "./components/Profile";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";

function App() {
  return (
    <Router>
      <div className="App" data-theme="light">
        <Routes>
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
