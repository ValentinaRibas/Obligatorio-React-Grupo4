import LoginForm from "./LoginForm";
import Logo from "../assets/Logo.png";
import "../assets/Login.css";
const Login = () => {
  return (
    <div className="login">
      <img src={Logo} alt="Fakestagram Logo" />
      <h1>Fakestagram</h1>
      <LoginForm />
    </div>
  );
};

export default Login;
