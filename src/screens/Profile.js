import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import "../styles/Profile.css";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "http://localhost:3001";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isFriend, setIsFriend] = useState(false);

  const { user: currentUser, token } = useContext(AuthContext);

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
        setPosts(data.posts);
        const isAlreadyFriend = user.friends.some(
          (friend) => friend._id === currentUser._id
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
  }, [userId]);

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

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    setSelectedPost(null);

    try {
      const response = await fetch(`${BASE_URL}/api/user/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        console.error("Error fetching updated posts after closing modal");
      }
    } catch (error) {
      console.error("Error fetching updated posts:", error);
    }
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 80 * 1024;

      if (file.size > maxSize) {
        alert("Please upload a file smaller than 80KB");
        return;
      }

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
            src={
              profilePic ||
              "https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0="
            }
            alt="Profile"
            className="profile-image"
            onClick={handleImageClick}
            style={{ cursor: isEditing ? "pointer" : "default" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0=";
            }}
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
                  {userId === currentUser._id && (
                    <button className="edit-button" onClick={handleEditClick}>
                      Edit Profile
                    </button>
                  )}
                </>
              )}
              {userId !== currentUser._id && (
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
                <strong>{posts.length}</strong> Posts
              </p>
              <p>
                <strong>{user.friends.length}</strong> Friends
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
          {posts.map((post, index) => (
            <button
              key={index}
              className="photo-button"
              onClick={() => handleOpenModal(post)}
            >
              <img
                src={BASE_URL + "/" + post.imageUrl}
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
              postId={selectedPost._id}
              profileImage={profilePic}
              username={username}
              userId={userId}
              currentUserId={currentUser._id}
              time={selectedPost.createdAt}
              image={BASE_URL + "/" + selectedPost.imageUrl}
              caption={selectedPost.caption}
              likes={selectedPost.likes.length}
              comments={selectedPost.comments.length}
              onUpdate={fetchUserData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
