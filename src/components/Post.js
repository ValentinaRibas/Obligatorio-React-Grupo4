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
  likes = [],
  comments = [],
}) => {
  const [likeImg, setLikeImg] = useState(
    Array.isArray(likes) && likes.includes(currentUserId)
      ? black_heart_img
      : heart_img
  );
  const [currentLikes, setLikes] = useState(
    Array.isArray(likes) ? likes.length : 0
  );
  const [currentComments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const BASE_URL = "http://localhost:3001";
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
  }, [comments]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const fetchComments = async () => {
    try {
      const fetchedComments = await Promise.all(
        comments.map(async (commentId) => {
          const response = await fetch(
            `${BASE_URL}/api/posts/comments/${commentId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch comments");
          }
          const data = await response.json();
          return data;
        })
      );
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    try {
      if (likeImg === heart_img) {
        await likePost(postId);
        setLikeImg(black_heart_img);
        setLikes((prev) => prev + 1);
      } else {
        await unlikePost(postId);
        setLikeImg(heart_img);
        setLikes((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    try {
      const response = await fetch(`${BASE_URL}/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const comment = await response.json();
      setComments((prev) => [...prev, comment]);
      setNewComment("");
      fetchComments(); // Fetch updated comments after adding
    } catch (error) {
      console.error("Error adding comment:", error);
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

  const handleProfileClick = () => {
    if (userId !== currentUserId) {
      navigate(`/profile/${userId}`);
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
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
            <strong style={{ color: "#1E1E1E" }}>{username}</strong>
            {caption && <span style={{ marginLeft: "5px" }}>{caption}</span>}
          </p>
          {currentComments.length > 0 && (
            <p
              className="subtitle is-7"
              style={{ display: "flex", cursor: "pointer" }}
              onClick={toggleComments}
            >
              View all {currentComments.length} comments
            </p>
          )}
          {showComments && (
            <div style={{ marginTop: "10px", fontSize: "0.8rem" }}>
              {currentComments.map((comment) => (
                <p key={comment._id}>
                  <strong>{comment.user?.username}</strong>: {comment.content}
                </p>
              ))}
            </div>
          )}
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
