import './App.css';
import Login from './components/Auth/Login/Login.js';
import Register from './components/Auth/Register/Register.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Feed from './components/Feed.js';
import Profile from './components/Profile.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Feed />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
