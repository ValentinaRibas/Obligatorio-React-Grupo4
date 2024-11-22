import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
          navigate(`/feed`);
        } else {
          console.error("Login failed");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="login-form">
      <label htmlFor="email">Email</label>
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>Login</button>
      <div className="register-link-container">
        <p>
          Create account <a href="/register">here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
