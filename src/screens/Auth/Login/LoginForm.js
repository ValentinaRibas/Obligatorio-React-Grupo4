import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password cannot be empty");
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate("/feed");
    } else {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-form">
      <label htmlFor="email">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
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
