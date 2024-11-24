import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = storedUser?._id;
  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:3001";

  const fetchNotifications = async () => {
    if (!currentUserId) {
      console.error("User ID not found in local storage");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/user/profile/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.user.notifications || []);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const getUsername = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.username : "Unknown User";
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (isLoading) return <p>Loading notifications...</p>;

  return (
    <div className="notifications-page">
      <Sidebar />
      <main className="notifications-main">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <div className="notifications-content-list">
            {notifications.map((notification) => (
              <div key={notification._id} className="notifications-item">
                <p>
                  <strong
                    className="notifications-clickable-username"
                    onClick={() => handleUserClick(notification.fromUserId)}
                  >
                    {getUsername(notification.fromUserId)}
                  </strong>{" "}
                  {notification.type === "follow" && "started following you"}
                  {notification.type === "like" &&
                    `liked your post (ID: ${notification.postId})`}
                  {notification.type === "comment" &&
                    `commented on your post (ID: ${notification.postId})`}
                </p>
                <p className="notifications-date">
                  {new Date(notification.createdAt).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications;
