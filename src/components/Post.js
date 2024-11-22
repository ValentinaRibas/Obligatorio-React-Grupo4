import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bulma/css/bulma.min.css";
import "../styles/Post.css";
import heart_img from "../images/heart.png";
import black_heart_img from "../images/heart_black.png";

const Post = ({
  postId,
  profileImage,
  username,
  userId,
  currentUserId,
  time,
  image,
  caption,
  likes,
  comments,
}) => {
  const [likeImg, setLikeImg] = useState(heart_img);
  const [currentLikes, setLikes] = useState(likes);
  const [currentComments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const BASE_URL = "http://localhost:3001";
  const navigate = useNavigate();

  useEffect(() => {
    if (likes > 0) {
      setLikeImg(black_heart_img);
    }
  }, [likes]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const handleLike = async () => {
    if (likeImg === heart_img) {
      try {
        await likePost(postId);
        setLikeImg(black_heart_img);
        setLikes(currentLikes + 1);
      } catch (error) {
        console.error("Error to add like", error);
      }
    } else {
      try {
        await unlikePost(postId);
        setLikeImg(heart_img);
        setLikes(currentLikes - 1);
      } catch (error) {
        console.error("Error to remove like:", error);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    try {
      const comment = await addComment(postId, newComment);
      setComments([...currentComments, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  const likePost = async (postId) => {
    const response = await fetch(`${BASE_URL}/api/posts/${postId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to like the post");
    }
  };

  const unlikePost = async (postId) => {
    const response = await fetch(`${BASE_URL}/api/posts/${postId}/like`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to unlike the post");
    }
  };

  const addComment = async (postId, comment) => {
    const response = await fetch(`${BASE_URL}/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content: comment }),
    });
    if (!response.ok) {
      throw new Error("Failed to add comment");
    }
    const data = await response.json();
    return data;
  };

  const handleProfileClick = () => {
    if (userId !== currentUserId) {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <div className="post card">
      <div className="card-content">
        <div className="media-container">
          <div
            className="media-left"
            onClick={handleProfileClick}
            style={{ cursor: "pointer" }}
          >
            <figure className="image is-48x48">
              <img src={profileImage} alt="Profile" />
            </figure>
          </div>

          <div className="media-content">
            <div
              className="user-info"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                className="title is-6 user-name"
                onClick={handleProfileClick}
                style={{
                  marginRight: "auto",
                  cursor: "pointer",
                }}
              >
                {username}
              </p>
              <p className="subtitle is-7 post-time">{formatDate(time)}</p>
            </div>
          </div>
        </div>
        <div className="post-image" style={{ display: "flex" }}>
          <figure
            className="image"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img src={image} alt="Post" />
          </figure>
        </div>
        <div className="content">
          <figure
            className="image is-24x24 my-2"
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <img src={likeImg} alt="Like" onClick={handleLike} />
          </figure>

          <p className="subtitle is-7" style={{ display: "flex" }}>
            {currentLikes} likes
          </p>
          <p className="subtitle is-7" style={{ display: "flex" }}>
            <strong className="pr-1" style={{ color: "#1E1E1E" }}>
              {username}
            </strong>{" "}
            {caption}
          </p>
          <p className="subtitle is-7" style={{ display: "flex" }}>
            View all {comments} comments
          </p>
        </div>
        <form onSubmit={handleAddComment} className="add-comment mt-2">
          <input
            type="text"
            className="input"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ padding: "10px", border: "none" }}
          />
          <button type="submit" style={{ display: "none" }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
