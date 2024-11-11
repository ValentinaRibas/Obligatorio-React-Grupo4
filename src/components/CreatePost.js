import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';
import '../styles/Post.css';

const User = {
    _id: 1,
    username: "Juan",
    profileImage: "https://via.placeholder.com/150"
}

const Create = ({}) => {
    const [photo, setPhoto] = useState("")
    const [description, setDescription] = useState("");
    const token = localStorage.getItem("token");

    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const base64 = await convertToBase64(file);
        setPhoto(base64);
      }
    };
  
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const handleSubmit = async () => {
        if (!photo || !description) {
          alert("Ingrese una foto y una descripción");
          return;
        }
    
        const postData = {
            user: User,
            imageUrl: photo || "",
            caption: description,
        };
    
        try {
          const response = await fetch('/api/posts',
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(postData),
          });
          console.log(response.data);
          setPhoto(null);
          setDescription('');
        } catch (error) {
          console.error('Error creating post:', error);
        }
    };

  return (
    <div className="post card">
      <div className="card-content">
        <div className="media-container">
          <div className="media-left">
            <figure className="image is-48x48">
              <img src={User.profileImage} alt="Profile" />
            </figure>
          </div>
          <div className="media-content user-name">
            <p className="title is-6" style={{ marginLeft: '5px' }}>{User.username}</p>
          </div>
        </div>
        <h2 style={{ display: 'flex', justifyContent: 'center' }}>Crear un nuevo post</h2>
        <div className="new-post">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <input type="file" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
                <div className="post-image" style={{ display: 'flex' }}>
                    <figure className="image" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={photo ? photo : "https://via.placeholder.com/150"} alt="Post" />
                    </figure>
                </div>
                <input
                type="text"
                className="input"
                placeholder="Agregar una descripción..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ margin: '10px', border: 'none' }}
                />
                <button className='button' type="submit" style={{ marginBottom: '5px' }}>Publicar</button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
