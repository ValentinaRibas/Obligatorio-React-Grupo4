import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/Profile.css";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";

const BASE_URL = "http://localhost:3001";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFriend, setIsFriend] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = storedUser?._id;
  const token = localStorage.getItem("token");

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/user/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        setUser(user);
        setUsername(user.username);
        setDescription(user.description);
        setProfilePic(user.profilePicture);
        const isAlreadyFriend = user.friends.some(
          (friend) => friend._id === currentUserId
        );
        setIsFriend(isAlreadyFriend);
      } else {
        console.error("Error fetching profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [userId]);

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
        const errorData = await response.json();
        if (errorData.message === "This user is already your friend") {
          setIsFriend(true);
        }
        console.error(
          "Error adding friend:",
          errorData.message || response.statusText
        );
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUsername(user.username);
    setDescription(user.description);
    setProfilePic(user.profilePicture);
  };

  const handleSaveClick = async () => {
    const updatedData = {
      username: username || user.username,
      description: description || user.description,
      profilePicture: profilePic || user.profilePicture,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/user/profile/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        let errorMessage = "An error occurred. Please try again";
        if (response.status === 500 && username !== user.username) {
          errorMessage =
            "This username is already in use. Please choose another one";
        }
        alert(errorMessage);
        return;
      }

      const data = await response.json();
      setUser({ ...user, ...data });
      setIsEditing(false);
    } catch (error) {
      console.error("Error during profile update:", error.message);
      alert("A server error occurred. Please try again later");
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

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setProfilePic(base64);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) return <p>Profile not found</p>;

  return (
    <div className="profile-page">
      <Sidebar />
      <main className="profile-main">
        <div className="profile-header">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <img
            src={profilePic ? profilePic : "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-image"
            onClick={handleImageClick}
            style={{ cursor: isEditing ? "pointer" : "default" }}
          />
          <div className="profile-details">
            <div className="username-edit-container">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    className="username-input"
                  />
                  <button className="edit-button" onClick={handleSaveClick}>
                    Save
                  </button>
                  <button className="cancel-button" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h2>{username}</h2>
                  {userId === currentUserId && (
                    <button className="edit-button" onClick={handleEditClick}>
                      Edit Profile
                    </button>
                  )}
                </>
              )}
              {userId !== currentUserId && (
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
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/250")
                }
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
