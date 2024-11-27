import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "bulma/css/bulma.min.css";
import "../styles/Post.css";
import heart_img from "../images/heart.png";
import black_heart_img from "../images/heart_black.png";
import { AuthContext } from "../context/AuthContext";

const Post = ({
  postId,
  profileImage,
  username,
  userId,
  time,
  image,
  caption,
  likes,
  comments,
}) => {
  const [likeImg, setLikeImg] = useState(heart_img);
  const [currentLikes, setLikes] = useState(likes);
  const [currentComments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentsCount, setCommentsCount] = useState(comments);

  const BASE_URL = "http://localhost:3001";
  const navigate = useNavigate();

  const { token, user } = useContext(AuthContext);

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

  const fetchComments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await response.json();

      if (response.ok && userData.posts) {
        const post = userData.posts.find((p) => p._id === postId);

        if (post && Array.isArray(post.comments)) {
          const fetchedComments = await Promise.all(
            post.comments.map(async (commentId) => {
              const commentResponse = await fetch(
                `${BASE_URL}/api/posts/comments/${commentId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (commentResponse.ok) {
                const commentData = await commentResponse.json();
                return {
                  id: commentId,
                  content: commentData.content,
                  username: commentData.user.username,
                  userId: commentData.user._id,
                };
              }
              return null;
            })
          );

          setComments(fetchedComments.filter(Boolean));
          setShowComments(!showComments);
        }
      } else {
        console.error("Failed to fetch post or comments:", userData);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
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
      setCommentsCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setComments(currentComments.filter((c) => c.id !== commentId));
        setCommentsCount((prev) => prev - 1);
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const likePost = async (postId) => {
    const response = await fetch(`${BASE_URL}/api/posts/${postId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: comment }),
    });
    if (!response.ok) {
      throw new Error("Failed to add comment");
    }
    const data = await response.json();
    return { id: data._id, content: comment, username: username };
  };

  const handleProfileClick = () => {
    navigate(`/profile/${userId}`);
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
              <img
                src={
                  profileImage ||
                  "https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0="
                }
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0=";
                }}
              />
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
          <div className="likes-container">
            <img src={likeImg} alt="Like" onClick={handleLike} />
            <p className="likes-text">{currentLikes} likes</p>
          </div>
          <p className="caption-text">
            <strong style={{ cursor: "pointer" }} onClick={handleProfileClick}>
              {username}
            </strong>{" "}
            {caption}
          </p>
          <p
            className="view-comments-text"
            onClick={fetchComments}
            style={{ cursor: "pointer", color: "#3498db" }}
          >
            View all {commentsCount} comments
          </p>
        </div>

        {showComments && (
          <div className="comments-container">
            <ul>
              {currentComments.map((comment, index) => (
                <li key={index} className="comment-item">
                  <span>
                    <strong>{comment.username}</strong>: {comment.content}
                  </span>
                  {(comment.userId === user._id || user._id === userId) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="delete-comment-button"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={(e) => handleAddComment(e)} className="add-comment">
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
