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
            <Post 
            postId="10" 
            profileImage="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp" 
            username="AndyChristoff" 
            time="10:50pm" 
            image="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp" 
            caption="Aca en la playa tranqui" 
            likes="152" 
            comments="">
            </Post>
            <Post 
            postId="10" 
            profileImage="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp" 
            username="AndyChristoff" 
            time="10:50pm" 
            image="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp" 
            caption="Aca en la playa tranqui" 
            likes="152" 
            comments="123">
            </Post>
            <Post 
            postId="10" 
            profileImage="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp" 
            username="AndyChristoff" 
            time="10:50pm" 
            image="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp" 
            caption="Aca en la playa tranqui" 
            likes="152" 
            comments="123">
            </Post> 
            </div>
        </main>

        <FeedFooter></FeedFooter>

        </div>
    );
};

export default Feed;