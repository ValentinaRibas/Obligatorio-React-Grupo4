import React, { useState, useEffect } from 'react';
import './Feed.css';  
import FeedHeader from './FeedHeader';
import FeedFooter from './FeedFooter';
import Post from './Post'

const Feed = () => {

  const [posts, setPosts] = useState([]);


  const getPosts = async () => {
    const response = await fetch('http://localhost:3001/api/posts/feed', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(response => response.json())
      .then(data => {
    
        console.log(data);
      })
      .catch(error => {
        console.error('Error al obtener el feed de publicaciones:', error);
      });
  }

  //algunas publicaciones de ejemplo y despues implementamos el componente hecho por vale


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
            profileImage="" 
            username="AndyChristoff" 
            time="10:50pm" 
            image="" 
            caption="Aca en la playa tranqui" 
            likes="152" 
            comments="">
            </Post>
            <Post 
            postId="10" 
            profileImage="" 
            username="AndyChristoff" 
            time="10:50pm" 
            image="" 
            caption="Aca en la playa tranqui" 
            likes="152" 
            comments="">
            </Post>
            <Post 
            postId="10" 
            profileImage="" 
            username="AndyChristoff" 
            time="10:50pm" 
            image="" 
            caption="Aca en la playa tranqui" 
            likes="152" 
            comments="">
            </Post> 
            </div>
        </main>

        <FeedFooter></FeedFooter>

        </div>
    );
};

export default Feed;