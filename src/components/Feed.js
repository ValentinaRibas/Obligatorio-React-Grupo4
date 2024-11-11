import React, { useState, useEffect } from 'react';
import './Feed.css';  
import FeedHeader from './FeedHeader';
import FeedFooter from './FeedFooter';
import Post from './Post'

const Feed = () => {

  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem("token");

  const getPosts = async () => {
    const response = await fetch('http://localhost:3001/api/posts/feed', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data); 
    console.log("data arriba");
  };

    useEffect(() =>{
        getPosts()
    }, [])

    return (
        <div className="instagram-container">

        <FeedHeader></FeedHeader>

        <main className="main">
            <div className="feed-container">
              
            </div>
        </main>

        <FeedFooter></FeedFooter>

        </div>
    );
};

export default Feed;