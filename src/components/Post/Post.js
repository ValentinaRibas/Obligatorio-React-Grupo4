import React from 'react';
import 'bulma/css/bulma.min.css';
import './Post.css';

const Post = ({ profileImage, username, time, image, caption, likes, comments }) => {
  return (
    <div className="post card">
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <img src={profileImage} alt="Profile" />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-6">{username}</p>
            <p className="subtitle is-7">{time}</p>
          </div>
        </div>
        <div className="post-image">
          <figure className="image">
            <img src={image} alt="Post" />
          </figure>
        </div>
        <div className="content">
          <p>
            <strong>{username}</strong> {caption}
          </p>
          <p className="subtitle is-7">{likes} likes</p>
          <p className="subtitle is-7">View all {comments} comments</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
