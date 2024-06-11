import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const res = await axios.post("http://localhost:8000/api/v1/login", {
      email: email,
      password: password,
    });
    window.alert(res.data);
    if (res && res.data.statusCode === 200) {
      localStorage.setItem("token", JSON.stringify(res.data.token));
      navigate("/chat");
      toast.success("Successfully Logged in", {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } else {
      toast.error(res.data.message, {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  const handleRegister = async () => {
    const res = await axios.post("http://localhost:8000/api/v1/register", {
      email: email,
      password: password,
    });
    if (res) {
      alert("success");
    }
  };

  return (
    <div>
      <input type="text" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <div onClick={handleSubmit}>Login</div>
      <div onClick={handleRegister}>Register</div>
    </div>
  );
};

export default Auth;
