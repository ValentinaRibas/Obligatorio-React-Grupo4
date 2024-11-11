import RegisterForm from "./RegisterForm";
import Logo from "../assets/Logo.png";
import "../assets/Register.css";
const Register = () => {
  return (
    <div className="register">
      <img src={Logo} alt="Fakestagram Logo" />
      <h1>Fakestagram</h1>
      <RegisterForm />
    </div>
  );
};

export default Register;
