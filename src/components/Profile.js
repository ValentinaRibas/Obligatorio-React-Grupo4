import React from "react";
import "../styles/Profile.css";
import profilePic from "../resources/images/Harrypotter.webp";
import pic1 from "../resources/images/hp1.jpg";

const Profile = () => {
  const user = {
    username: "thechosenone",
    fullName: "Harry Potter",
    profileImage: profilePic,
    bio: "The Boy Who Lived ⚡ | Gryffindor | Auror",
    followers: 1200,
    following: 350,
    posts: 45,
    photos: [
      "https://via.placeholder.com/250",
      "https://via.placeholder.com/250",
      "https://via.placeholder.com/250",
      "https://via.placeholder.com/250",
      "https://via.placeholder.com/250",
      "https://via.placeholder.com/250",
    ],
  };

  return (
    <div className="profile-page">
      <aside className="sidebar">
        <h1>fakestagram</h1>
        <ul>
          <li>Home</li>
          <li>Notifications</li>
          <li>Create</li>
          <li>Profile</li>
        </ul>
      </aside>

      <main className="profile-main">
        <div className="profile-header">
          <img
            src={user.profileImage}
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-details">
            <h2>{user.username}</h2>
            <button className="edit-button">Edit profile</button>
            <div className="profile-stats">
              <p>
                <strong>{user.posts}</strong> posts
              </p>
              <p>
                <strong>{user.followers}</strong> followers
              </p>
              <p>
                <strong>{user.following}</strong> following
              </p>
            </div>
            <p className="profile-bio">{user.bio}</p>
          </div>
        </div>

        <div className="profile-photos">
          {user.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`User post ${index}`}
              className="profile-photo"
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Profile;
