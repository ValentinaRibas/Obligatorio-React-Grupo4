import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import Sidebar from "../components/Sidebar";

const BASE_URL = "http://localhost:3001";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmJlOTlhNTczYmU1Y2RmZjdiMTc2ZSIsImlhdCI6MTczMDkzMTA5OCwiZXhwIjoxNzMzNTIzMDk4fQ.Jtj3wi5B9hgxFoRaDlxIleyelrJ5ZhlFpyqcXrapxu0";
  const userId = "672be99a573be5cdff7b176e";
  const profilepic = "https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser({
            ...data,
            followers: 1200,
            following: 350,
            bio: "The Boy Who Lived ⚡ | Gryffindor | Auror",
          });
          setUsername(data.user.username);
        } else {
          console.error("Error fetching profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/posts/feed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const userPosts = data.filter((post) => post.user._id === userId);
          const imageUrls = userPosts.map(
            (post) => `${BASE_URL}/${post.imageUrl}`
          );
          setPhotos(imageUrls);
        } else {
          console.error("Error fetching posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [userId, token]);

  const handleEditClick = () => setIsEditing(true);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleSaveClick = () => setIsEditing(false);
  const handleImageClick = (index) => alert(`Image ${index + 1} clicked!`);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <Sidebar />
      <main className="profile-main">
        <div className="profile-header">
          <img
            src={
              user.profilePicture
                ? `${BASE_URL}/${user.profilePicture}`
                : "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-details">
            <div className="username-edit-container">
              {isEditing ? (
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="username-input"
                />
              ) : (
                <h2>{username}</h2>
              )}
              <button
                className="edit-button"
                onClick={isEditing ? handleSaveClick : handleEditClick}
              >
                {isEditing ? "Save" : "Edit Profile"}
              </button>
            </div>
            <div className="profile-stats">
              <p>
                <strong>{photos.length}</strong> posts
              </p>
              <p>
                <strong>Followers</strong> {user.followers}
              </p>
              <p>
                <strong>Following</strong> {user.following}
              </p>
            </div>
            <p className="profile-bio">{user.bio}</p>
          </div>
        </div>

        <div className="profile-photos">
          {photos.map((photo, index) => (
            <button
              key={index}
              className="photo-button"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={photo}
                alt={`Post ${index}`}
                className="profile-photo"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/250";
                }}
              />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Profile;
