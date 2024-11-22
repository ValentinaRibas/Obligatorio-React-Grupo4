import React, { useState } from "react";
import "bulma/css/bulma.min.css";
import "../styles/Post.css";

const CreatePost = () => {
  const [photo, setPhoto] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const token = localStorage.getItem("token");
  const User = JSON.parse(localStorage.getItem("user"));
  const currentUserId = User?._id;
  const BASE_URL = "http://localhost:3001";

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setPhoto(base64);
      setFile(file);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo || !description) {
      alert("Please provide a photo and a caption.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", description);
    formData.append("user", currentUserId);

    try {
      const response = await fetch(`${BASE_URL}/api/posts/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post.");
      }

      const responseData = await response.json();
      console.log("Post created successfully:", responseData);
      setPhoto(null);
      setFile(null);
      setDescription("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post. Please try again.");
    }
  };

  return (
    <div className="post card">
      <div className="card-content">
        <div className="media-container">
          <div className="media-left">
            <figure className="image is-48x48">
              <img src={User.profilePicture} alt="Profile" />
            </figure>
          </div>
          <div className="media-content user-name">
            <p className="title is-6" style={{ marginLeft: "5px" }}>
              {User.username}
            </p>
          </div>
        </div>
        <h2 style={{ display: "flex", justifyContent: "center" }}>
          Create a new post
        </h2>
        <div className="new-post">
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <input
              type="file"
              onChange={handleFileChange}
              style={{ marginBottom: "10px" }}
            />
            <div className="post-image" style={{ display: "flex" }}>
              <figure
                className="image"
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src={photo ? photo : "https://via.placeholder.com/150"}
                  alt="Post"
                />
              </figure>
            </div>
            <input
              type="text"
              className="input"
              placeholder="Add a caption..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ margin: "10px", border: "none" }}
            />
            <button
              className="button"
              type="submit"
              style={{ marginBottom: "5px" }}
            >
              Publish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
