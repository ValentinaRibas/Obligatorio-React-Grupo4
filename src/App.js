import './App.css';
import Login from './components/Auth/Login/Login.js';
import Register from './components/Auth/Register/Register.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
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
