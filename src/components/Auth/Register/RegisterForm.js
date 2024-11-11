import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token && data._id) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data));
          console.log(data);
          navigate(`/profile/${data._id}`);
        } else {
          console.error("Registration failed");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="register-form">
      <label htmlFor="username">Username</label>
      <input type="text" onChange={(e) => setUsername(e.target.value)} />
      <label htmlFor="email">Email</label>
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>Register</button>
      <div className="login-link-container">
        <p>
          Already registered? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
