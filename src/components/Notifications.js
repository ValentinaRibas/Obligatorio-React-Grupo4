import React, { useState } from "react";
import "../styles/Notifications.css";

const Notifications = ({ notifications = [] }) => {
  const [isListOpen, setIsListOpen] = useState(false);

  const toggleList = () => {
    setIsListOpen(!isListOpen);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="notifications-container">
      <button className="notifications-button" onClick={toggleList}>
        Notifications ({notifications.length})
      </button>
      {isListOpen && (
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification._id} className="notification-item">
                <p>
                  <strong>{notification.type}</strong>{" "}
                  {notification.type === "follow" && "started following you."}
                  {notification.type === "like" &&
                    `liked your post (ID: ${notification.postId}).`}
                  {notification.type === "comment" &&
                    `commented on your post (ID: ${notification.postId}).`}
                </p>
                <p className="notification-date">
                  {formatDate(notification.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
