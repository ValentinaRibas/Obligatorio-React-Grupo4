import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Profile from "./screens/Profile";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import CreatePost from "./screens/CreatePost";
import Feed from "./screens/Feed";
import Notifications from "./screens/Notifications";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <div className="App" data-theme="light">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/feed" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/feed"
            element={isAuthenticated ? <Feed /> : <Navigate to="/login" />}
          />
          <Route
            path="/create"
            element={
              isAuthenticated ? <CreatePost /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile/:userId"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/notifications"
            element={
              isAuthenticated ? <Notifications /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
