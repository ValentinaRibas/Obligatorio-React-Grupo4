import React from "react";
import "../styles/Profile.css";
import profilePic from "../resources/images/Harrypotter.webp";

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
      "https://upload.wikimedia.org/wikipedia/en/d/d7/Harry_Potter_character_poster.jpg",
      "https://static.independent.co.uk/s3fs-public/thumbnails/image/2013/09/12/17/potter.jpg",
      "https://deadline.com/wp-content/uploads/2023/04/MCDHAPO_EC151.jpg?w=800",
      "https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/14770893/3176173-1748009911-hp.jp_.0.1547203154.jpg?quality=90&strip=all&crop=7.8125,0,84.375,100",
      "https://www.oprah.com/g/image-resizer?width=670&link=https://static.oprah.com/images/entertainment/201008/20100830-harry-potter-600x411.jpg",
      "https://static.independent.co.uk/2023/04/05/09/newFile-7.jpg",
      "https://cdn.britannica.com/81/152981-050-7891A7CF/Daniel-Radcliffe-Harry-Potter-and-the-Philosophers.jpg",
      "https://en.vogue.me/wp-content/uploads/2024/06/promo-harry-potter.jpg",
      "https://assets.vogue.in/photos/5f23c04f1d33754d11eaf778/2:3/w_2560,c_limit/harry-potter-philosophers-stone-portrait-8.jpg",
      "https://images.ctfassets.net/usf1vwtuqyxm/3SQ3X2km8wkQIsQWa02yOY/8801d7055a3e99dae8e60f54bb4b1db8/HarryPotter_WB_F4_HarryPotterMidshot_Promo_080615_Port.jpg?w=914&q=70&fm=jpg"
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
          <img src={user.profileImage} alt="Profile" className="profile-image" />
          <div className="profile-details">
            <div className="username-edit-container">
              <h2>{user.username}</h2>
              <button className="edit-button">Edit profile</button>
            </div>
            <div className="profile-stats">
              <p><strong>{user.posts}</strong> posts</p>
              <p><strong>{user.followers}</strong> followers</p>
              <p><strong>{user.following}</strong> following</p>
            </div>
            <p className="profile-bio">{user.bio}</p>
          </div>
        </div>

        <div className="profile-photos">
          {user.photos.map((photo, index) => (
            <img key={index} src={photo} alt={`User post ${index}`} className="profile-photo" />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Profile;
