import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import {
  FiHome,
  FiHeart,
  FiPlusSquare,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser ? storedUser._id : null;

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h1>fakestagram</h1>
      <ul>
        <li className={location.pathname === "/feed" ? "active" : ""}>
          <Link to="/feed">
            <FiHome className="sidebar-icon" /> Home
          </Link>
        </li>
        <li className={location.pathname === "/notifications" ? "active" : ""}>
          <Link to="/notifications">
            <FiHeart className="sidebar-icon" /> Notifications
          </Link>
        </li>
        <li className={location.pathname === "/create" ? "active" : ""}>
          <Link to="/create">
            <FiPlusSquare className="sidebar-icon" /> Create
          </Link>
        </li>
        <li
          className={location.pathname === `/profile/${userId}` ? "active" : ""}
        >
          {userId ? (
            <Link to={`/profile/${userId}`}>
              <FiUser className="sidebar-icon" /> Profile
            </Link>
          ) : (
            <span>
              <FiUser className="sidebar-icon" /> Profile
            </span>
          )}
        </li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        <FiLogOut className="sidebar-icon" /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
