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
          <div className="media-left" onClick={handleProfileClick}>
            <figure className="image is-48x48">
              <img src={profileImage} alt="Profile" />
            </figure>
          </div>
          <div className="media-content">
            <p className="username" onClick={handleProfileClick}>
              {username}
            </p>
          </div>
          <p className="post-time">{formatDate(time)}</p>
        </div>

        <div className="post-image">
          <figure className="post-figure">
            <img className="post-img" src={image} alt="Post" />
          </figure>
        </div>

        <div className="content">
          <figure
            className="image is-24x24 my-2"
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <img src={likeImg} alt="Like" onClick={handleLike} />
          </figure>
          <p
            className="subtitle is-7"
            style={{ display: "flex", alignItems: "center" }}
          >
            {currentLikes} likes
          </p>
          <p
            className="subtitle is-7"
            style={{ display: "flex", alignItems: "baseline" }}
          >
            <strong style={{ marginRight: "5px", color: "#1E1E1E" }}>
              {username}
            </strong>
            {caption && <span>{caption}</span>}
          </p>
          <p
            className="subtitle is-7"
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: "#3498db",
            }}
          >
            View all {comments} comments
          </p>
        </div>
        <form onSubmit={handleAddComment} className="add-comment">
          <input
            type="text"
            className="add-comment-input"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="add-comment-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
