import React, { useState, useEffect } from "react";
import StyledSignup from "./styled";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import queryString from "query-string";
import validator from "validator";
import hideIcon from "assets/hide.png";
import viewIcon from "assets/view.png";
import googleLogo from "assets/googleLogo.png";
import BeatLoader from "react-spinners/BeatLoader";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
const REACT_APP_GOOGLE_REDIRECT_SIGNUP_URI =
  process.env.REACT_APP_GOOGLE_REDIRECT_SIGNUP_URI;
const REACT_APP_GOOGLE_SIGNUP_SCOPE = process.env.REACT_APP_GOOGLE_SIGNUP_SCOPE;
const REACT_APP_GOOGLE_SIGNUP_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_SIGNUP_CLIENT_ID;
const REACT_APP_BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const initError = {
    email: "",
    password: "",
    firstName: "",
  };
  const [errors, setErrors] = useState(initError);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const setError = (key: string, error: string) => {
    setErrors((prev) => {
      return { ...prev, [key]: error };
    });
  };

  const handleSubmit = async () => {
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
    if (!firstName) {
      invalidInput = true;
      setError("firstName", "Please enter your first name");
    }

    if (invalidInput) {
      return;
    }
    setLoading(true);
    const res = await axios.post(
      REACT_APP_BACKEND_BASE_URL + "/api/v1/register",
      {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
      }
    );
    if (res && res.data.statusCode === 200) {
      toast.success(res.data.message, {
        autoClose: 1000,
      });
      navigate("/login");
    } else {
      toast.error(res.data.message, {
        autoClose: 1000,
      });
    }
    setLoading(false);
  };

  const googleSignup = () => {
    const redirectUrl =
      (REACT_APP_BASE_URL || "") + (REACT_APP_GOOGLE_REDIRECT_SIGNUP_URI || "");
    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${REACT_APP_GOOGLE_SIGNUP_SCOPE}&include_granted_scopes=true&response_type=token&state=state_parameter_passthrough_value&redirect_uri=${redirectUrl}&client_id=${REACT_APP_GOOGLE_SIGNUP_CLIENT_ID}`;
    window.open(url, "_self");
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
    const first_name = data.given_name;
    const last_name = data.family_name;
    const email = data.email;
    const img_url = data.picture;
    if (email) {
      setLoading(true);
      const userInfo = await axios.post(
        REACT_APP_BACKEND_BASE_URL + "/api/v1/register-by-google",
        {
          email: email,
          first_name: first_name,
          last_name: last_name,
          img_url: img_url,
        }
      );
      if (userInfo && userInfo.data.statusCode === 200) {
        toast.success(userInfo.data.message, {
          //   position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        navigate("/login");
      } else {
        toast.error(userInfo.data.message, {
          //   position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      }
      setLoading(false);
    } else {
      toast.error("Unable to signup using google account", {
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

  return (
    <StyledSignup>
      {!loading && (
        <div className="container">
          <div className="header">Signup</div>
          <div className="body">
            <div className="col">
              <div>
                Email <span>*</span>
              </div>
              <div>
                Password <span>*</span>
              </div>
              <div>
                First Name <span>*</span>
              </div>
              <div>Last Name</div>
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
                      errors.password
                        ? "password-input error"
                        : "password-input"
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
              <div className="input-ctn">
                <input
                  type="text"
                  className={errors.firstName ? "input error" : "input"}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError("firstName", "");
                  }}
                />
                {errors.firstName && (
                  <div className="error-text">{errors.firstName} </div>
                )}
              </div>
              <div className="input-ctn">
                <input
                  type="text"
                  className={"input"}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="footer">
            <div className="submit-ctn" onClick={handleSubmit}>
              Register
            </div>
          </div>

          <div className="footer">
            <div className="submit-ctn" onClick={googleSignup}>
              <img src={googleLogo} className="google-logo" />
              <span>Continue with Google</span>
            </div>
          </div>

          <div className="footer1">
            <div className="text">Already have an account?</div>
            <div className="signup" onClick={() => navigate("/login")}>
              Login
            </div>
          </div>
        </div>
      )}
      {loading && (
        <BeatLoader
          color="cyan"
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </StyledSignup>
  );
};

export default Signup;
