import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/Profile.css";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";

const BASE_URL = "http://localhost:3001";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFriend, setIsFriend] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = storedUser?._id;
  const token = localStorage.getItem("token");

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
            ...data.user,
            followers: 1200,
            following: 350,
          });
          setUsername(data.user.username);
          setDescription(data.user.description);
          setIsFriend(data.user.friends.includes(currentUserId));
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
          const imageUrls = userPosts.map((post) => ({
            id: post._id,
            imageUrl: `${BASE_URL}/${post.imageUrl}`,
            caption: post.caption,
            likes: post.likes.length,
            comments: post.comments.length,
            username: post.user.username,
            profileImage: post.user.profilePicture,
          }));
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
  }, [userId, token, currentUserId]);

  const handleAddFriend = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/add-friend/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setIsFriend(true);
      } else {
        console.error("Error adding friend");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/remove-friend/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setIsFriend(false);
      } else {
        console.error("Error removing friend");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = async () => {
    const updatedData = {
      username: username || user.username,
      profilePicture: user.profilePicture || "",
      description: description || user.description,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/user/profile/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setUser({ ...user, ...data });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  const handleOpenModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <Sidebar />
      <main className="profile-main">
        <div className="profile-header">
          <img
            src={
              user.profilePicture
                ? user.profilePicture
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
              {userId === currentUserId ? (
                <button
                  className="edit-button"
                  onClick={isEditing ? handleSaveClick : handleEditClick}
                >
                  {isEditing ? "Save" : "Edit Profile"}
                </button>
              ) : (
                <button
                  className="edit-button"
                  onClick={isFriend ? handleRemoveFriend : handleAddFriend}
                >
                  {isFriend ? "Remove Friend" : "Add Friend"}
                </button>
              )}
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
            <div className="profile-bio">
              {isEditing ? (
                <input
                  type="text"
                  value={description}
                  onChange={handleDescriptionChange}
                  className="description-input"
                  placeholder="Add a description"
                />
              ) : (
                <p>{description || "No bio available"}</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-photos">
          {photos.map((photo, index) => (
            <button
              key={index}
              className="photo-button"
              onClick={() => handleOpenModal(photo)}
            >
              <img
                src={photo.imageUrl}
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

      {isModalOpen && selectedPost && (
        <div className="custom-modal">
          <div
            className="custom-modal-overlay"
            onClick={handleCloseModal}
          ></div>
          <div className="custom-modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <Post
              postId={selectedPost.id}
              profileImage={selectedPost.profileImage}
              username={selectedPost.username}
              time="2 hours ago"
              image={selectedPost.imageUrl}
              caption={selectedPost.caption}
              likes={selectedPost.likes}
              comments={selectedPost.comments}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
