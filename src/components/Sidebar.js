import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import { FiHome, FiHeart, FiPlusSquare, FiUser } from "react-icons/fi";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <h1>fakestagram</h1>
      <ul>
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">
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
        <li className={location.pathname === "/profile" ? "active" : ""}>
          <Link to="/profile">
            <FiUser className="sidebar-icon" /> Profile
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
