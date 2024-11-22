import React, { useState, useEffect } from "react";
import "../styles/Feed.css";
import Post from "./Post";
import Sidebar from "../components/Sidebar";

const Feed = () => {
  const [posts, setPosts] = useState([]);
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
      setPosts(data);
    } else {
      console.error("Failed to fetch posts:", data);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="instagram-container">
      <Sidebar />

      <main className="main">
        <div className="feed-container">
          {posts.map((post, index) => (
            <Post
              key={index}
              postId={post._id}
              profileImage={post.user.profilePicture}
              username={post.user.username}
              userId={post.user._id}
              currentUserId={currentUserId}
              time={post.createdAt}
              image={apiUrl + "/" + post.imageUrl}
              caption={post.caption}
              likes={post.likes}
              comments={post.comments}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Feed;
