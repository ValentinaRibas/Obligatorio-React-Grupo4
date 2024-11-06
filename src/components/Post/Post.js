import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import './Post.css';
import heart_img from '../../images/heart.png'
import black_heart_img from '../../images/heart_black.png'

const Post = ({ postId, profileImage, username, time, image, caption, likes, comments }) => {
  const [likeImg, setLikeImg] = useState(heart_img);
  const [currentLikes, setLikes] = useState(likes);
  const [currentComments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (likes > 0) {
      setLikeImg(black_heart_img);
    }
  }, [likes]);

  const handleLike = async () => {
    if (likeImg === heart_img) {
      try {
        await likePost(postId);
        setLikeImg(black_heart_img);
        setLikes(currentLikes + 1);
      } catch (error) {
        console.error("Error al dar like:", error);
      }
    } else {
      try {
        await unlikePost(postId);
        setLikeImg(heart_img);
        setLikes(currentLikes - 1);
      } catch (error) {
        console.error("Error al quitar like:", error);
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
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to like the post');
    }
  };

  const unlikePost = async (postId) => {
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to unlike the post');
    }
  };

  const addComment = async (postId, comment) => {
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content: comment }),
    });
    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    const data = await response.json();
    return data;
  };

  return (
    <div className="post card">
      <div className="card-content">
        <div className="media-container">
          <div className="media-left">
            <figure className="image is-48x48">
              <img src={profileImage} alt="Profile" />
            </figure>
          </div>
          <div className="media-content user-name">
            <p className="title is-6" style={{ marginRight: '3px' }}>{username}</p>
            <p className="subtitle is-7">{time}</p>
          </div>
        </div>
        <div className="post-image" style={{ display: 'flex' }}>
          <figure className="image" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={image} alt="Post" />
          </figure>
        </div>
        <div className="content">
        <figure className="image is-24x24 my-2" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={likeImg} alt="Profile" onClick={handleLike} />
        </figure>
        <p className="subtitle is-7" style={{ display: 'flex' }}>{currentLikes} likes</p>
          <p className="subtitle is-7" style={{ display: 'flex' }}>
            <strong className='pr-1' style={{ color: '#1E1E1E' }}>{username}</strong> {caption}
          </p>
          <p className="subtitle is-7" style={{ display: 'flex' }}>View all {comments} comments</p>
        </div>
        <form onSubmit={handleAddComment} className="add-comment mt-2">
          <input
            type="text"
            className="input"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ padding: '10px', border: 'none' }}
          />
          <button type="submit" style={{ display: 'none' }}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Post;
