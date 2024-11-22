import React, { useState, useEffect } from "react";
import "../styles/Feed.css";
import Post from "./Post";
import Sidebar from "../components/Sidebar";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const apiUrl = "http://localhost:3001";

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = storedUser?._id;

  const getPosts = async () => {
    const response = await fetch(`${apiUrl}/api/posts/feed`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      const formattedPosts = data.map((post) => ({
        ...post,
        comments: post.comments.length,
      }));
      setPosts(formattedPosts);
    } else {
      console.error("Failed to fetch posts:", data);
    }
  };

  const getUsers = async () => {
    const response = await fetch(`${apiUrl}/api/user/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      const filteredUsers = data.filter((user) => user._id !== currentUserId);
      setUsers(filteredUsers);
    } else {
      console.error("Failed to fetch users:", data);
    }
  };

  useEffect(() => {
    getPosts();
    getUsers();
  }, []);

  const handleViewProfile = (userId) => {
    window.location.href = `/profile/${userId}`;
  };

  return (
    <div className="instagram-container">
      <Sidebar />

      <main className="main">
        <h2 className="users-title">View your friends profiles</h2>

        <div className="users-carousel">
          <div className="users-container">
            {users.map((user) => (
              <div key={user._id} className="user-card">
                <img
                  src={
                    user.profilePicture ||
                    "https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0="
                  }
                  alt={user.username}
                  className="user-card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0=";
                  }}
                />
                <p className="user-card-username">{user.username}</p>
                <button
                  className="view-button"
                  onClick={() => handleViewProfile(user._id)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="divider"></div>

        <div className="feed-container">
          {posts.map((post, index) => (
            <Post
              key={index}
              postId={post._id}
              profileImage={
                post.user.profilePicture ||
                "https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0="
              }
              username={post.user.username}
              userId={post.user._id}
              currentUserId={currentUserId}
              time={post.createdAt}
              image={apiUrl + "/" + post.imageUrl}
              caption={post.caption}
              likes={post.likes.length}
              comments={post.comments}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Feed;
