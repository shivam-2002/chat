import React, { useEffect, useState } from "react";
import StyledLogin from "./styled";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import queryString from "query-string";
import validator from "validator";
import hideIcon from "assets/hide.png";
import viewIcon from "assets/view.png";
import googleLogo from "assets/googleLogo.png";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
const REACT_APP_GOOGLE_REDIRECT_LOGIN_URI =
  process.env.REACT_APP_GOOGLE_REDIRECT_LOGIN_URI;
const REACT_APP_GOOGLE_SIGNUP_SCOPE = process.env.REACT_APP_GOOGLE_SIGNUP_SCOPE;
const REACT_APP_GOOGLE_SIGNUP_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_SIGNUP_CLIENT_ID;
const REACT_APP_BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

interface LoginProps {
  setAuthorized: (val: boolean) => void;
  authorized: boolean;
}
const Login: React.FunctionComponent<LoginProps> = ({
  setAuthorized,
  authorized,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const setError = (key: string, error: string) => {
    setErrors((prev) => {
      return { ...prev, [key]: error };
    });
  };

  const googleSignin = () => {
    const redirectUrl =
      (REACT_APP_BASE_URL || "") + (REACT_APP_GOOGLE_REDIRECT_LOGIN_URI || "");
    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${REACT_APP_GOOGLE_SIGNUP_SCOPE}&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=${redirectUrl}&client_id=${REACT_APP_GOOGLE_SIGNUP_CLIENT_ID}`;
    window.open(url, "_self");
  };

  const handleLogin = async () => {
    let invalidInput = false;
    if (!email) {
      invalidInput = true;
      setError("email", "Email is required field");
    }
    if (!validator.isEmail(email)) {
      invalidInput = true;
      setError("email", "Please enter valid email");
    }
    if (!password) {
      invalidInput = true;
      setError("password", "Password is required field");
    }

    if (invalidInput) {
      return;
    }

    const res = await axios.post(REACT_APP_BACKEND_BASE_URL + "/api/v1/login", {
      email: email,
      password: password,
    });
    if (res && res.data) {
      if (res.data.statusCode === 200) {
        localStorage.setItem("message_token", JSON.stringify(res.data.token));
        navigate("/message");
        setAuthorized(true);
        toast.success(res.data.message, {
          // position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      } else {
        setAuthorized(false);
        toast.error(res.data.message, {
          // position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      }
    } else {
      setAuthorized(false);
      toast.error("Invalid Credentials", {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  const getGoogleUserInfo = async (access_token: string) => {
    const url = `https://www.googleapis.com/oauth2/v3/userinfo`;
    const params = {
      access_token: access_token,
    };
    const res = await axios.get(url, {
      params: params,
    });
    return res.data;
  };

  const dataFromGoogle = async (access_token: string) => {
    const data = await getGoogleUserInfo(access_token);
    const userEmail = data.email;
    const userFirstName = data.given_name;
    if (userEmail) {
      const userInfo = await axios.post(
        REACT_APP_BACKEND_BASE_URL + "/api/v1/login-by-google",
        {
          email: userEmail,
        }
      );
      if (userInfo && userInfo.data && userInfo.data.statusCode == 200) {
        localStorage.setItem("message_token", userInfo.data.token);
        setAuthorized(true);
        toast.success(userInfo.data.message, {
          //   position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        navigate("/message");
      } else {
        setAuthorized(false);
        toast.error(`${userInfo.data.message}`, {
          //   position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      }
    } else {
      setAuthorized(false);
      toast.error("Unable to log in using google account", {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    const parsedHash = queryString.parse(window.location.hash);
    const accessToken = Array.isArray(parsedHash["access_token"])
      ? parsedHash["access_token"][0]
      : parsedHash["access_token"];
    if (accessToken) {
      dataFromGoogle(accessToken);
    }
  }, []);

  useEffect(() => {
    if (authorized) {
      navigate("/message");
      return;
    }
  }, [authorized]);

  return (
    <StyledLogin>
      <div className="container">
        <div className="header">Login</div>
        <div className="body">
          <div className="col">
            <div>Email</div>
            <div>Password</div>
          </div>
          <div className="col">
            <div className="input-ctn">
              <input
                type="text"
                className={errors.email ? "input error" : "input"}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("email", "");
                }}
              />
              {errors.email && (
                <div className="error-text">{errors.email} </div>
              )}
            </div>
            <div className="input-ctn">
              <div className="password-ctn">
                <input
                  type={showPassword ? "text" : "password"}
                  className={
                    errors.password ? "password-input error" : "password-input"
                  }
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("password", "");
                  }}
                />
                <img
                  src={showPassword ? viewIcon : hideIcon}
                  className="pass-show-icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              </div>

              {errors.password && (
                <div className="error-text">{errors.password} </div>
              )}
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="submit-ctn" onClick={handleLogin}>
            Login
          </div>
        </div>

        <div className="footer">
          <div className="submit-ctn" onClick={googleSignin}>
            <img src={googleLogo} className="google-logo" />
            <span>Continue with Google </span>
          </div>
        </div>

        <div className="footer1">
          <div className="text">Don't have an account?</div>
          <div className="signup" onClick={() => navigate("/signup")}>
            Signup
          </div>
        </div>
      </div>
    </StyledLogin>
  );
};

export default Login;
