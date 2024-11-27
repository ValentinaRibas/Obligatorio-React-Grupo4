import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Profile from "./screens/Profile";
import Login from "./screens/Auth/Login/Login";
import Register from "./screens/Auth/Register/Register";
import CreatePost from "./screens/CreatePost";
import Feed from "./screens/Feed";
import Notifications from "./screens/Notifications";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className="App" data-theme="light">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/feed" /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/feed"
            element={user ? <Feed /> : <Navigate to="/login" />}
          />
          <Route
            path="/create"
            element={user ? <CreatePost /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:userId"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/notifications"
            element={user ? <Notifications /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
