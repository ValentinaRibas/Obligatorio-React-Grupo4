import React, { useState, useEffect } from 'react';
import './Feed.css';  
import FeedHeader from './FeedHeader';
import FeedFooter from './FeedFooter';
import Post from './Post'

const Feed = () => {

  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem("token");
  const apiUrl = "http://localhost:3001";

  const getPosts = async () => {
    const response = await fetch(`${apiUrl}/api/posts/feed`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if(response.ok){
      setPosts(data);
    }
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
                {posts.map((post, index) => (
                    <Post
                        key={index}
                        postId={post._id}
                        profileImage={post.user.profilePicture}
                        username={post.user.username}
                        time={post.createdAt}
                        image={apiUrl + '/' + post.imageUrl}
                        caption={post.caption}
                        likes={post.likes.length}
                        comments={post.comments.length}
                    />
                ))}
            </div>
        </main>

        <FeedFooter></FeedFooter>

        </div>
    );
};

export default Feed;