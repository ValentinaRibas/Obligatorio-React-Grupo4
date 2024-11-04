import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import './Post.css';
import heart_img from '../../images/heart.png'
import black_heart_img from '../../images/heart_black.png'

const Post = ({ profileImage, username, time, image, caption, likes, comments }) => {
  const [likeImg, setLikeImg] = useState(heart_img);
  const [currentLikes, setLikes] = useState(likes);
  const [currentComments, setComments] = useState([]);

  const handleLike = () => {
    if (likeImg === heart_img){
      setLikeImg(black_heart_img)
      setLikes(currentLikes + 1)
    } else{
      setLikeImg(heart_img)
      setLikes(currentLikes - 1)
    }
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
      </div>
    </div>
  );
};

export default Post;
