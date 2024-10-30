import './App.css';
import Post from './components/Post/Post';

function App() {
  const post = {
    profileImage: 'https://cdn-8.motorsport.com/images/mgl/YEQ1pGwY/s300/lewis-hamilton-mercedes.webp',
    username: 'lewishamilton',
    time: '5h',
    image: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_1320/content/dam/fom-website/drivers/2024Drivers/hamilton',
    caption: 'Ejemplo',
    likes: 100000,
    comments: 1000,
  };


  return (
    <div data-theme='light' className="App">
      <Post
        profileImage={post.profileImage}
        username={post.username}
        time={post.time}
        image={post.image}
        caption={post.caption}
        likes={post.likes}
        comments={post.comments}
      />
    </div>
  );
}

export default App;
