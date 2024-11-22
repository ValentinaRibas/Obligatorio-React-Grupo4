import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/CreatePost.css";

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

    if (!file || !description) {
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
      window.location.href = "/feed";
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post. Please try again.");
    }
  };

  return (
    <div className="instagram-container">
      <Sidebar />
      <main className="main">
        <div className="create-post-container">
          <div className="create-post-content">
            <div className="media-container">
              <div className="media-left">
                <figure className="image is-48x48">
                  <img
                    src={
                      User?.profilePicture || "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                  />
                </figure>
              </div>
              <div className="media-content user-name">
                <p className="title is-6">{User?.username}</p>
              </div>
            </div>

            <h2 className="create-post-title">Create a new Post</h2>

            <form onSubmit={handleSubmit} className="create-post-form">
              <label className="file-input-label">
                <span>Choose File</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                  accept="image/*"
                />
              </label>
              <div className="post-image-preview">
                <figure className="image">
                  <img
                    src={photo ? photo : "https://via.placeholder.com/150"}
                    alt="Post Preview"
                  />
                </figure>
              </div>
              <textarea
                className="textarea caption-input"
                placeholder="Add a caption..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div className="buttons-container">
                <button type="submit" className="button is-primary">
                  Publish
                </button>
                <button
                  type="button"
                  className="button is-light"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;
