import React, { useEffect, useState } from "react";
import StyledVerify from "./styled";
import queryString from "query-string";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

const REACT_APP_BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const Verify = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const verifyToken = async (token: string) => {
    const res = await axios.get(
      REACT_APP_BACKEND_BASE_URL + "/api/v1/verify-email",
      {
        params: {
          token: token,
        },
      }
    );
    if (res) {
      if (res.data.statusCode === 200) {
        navigate("/login");
        toast.success(res.data.message, {
          autoClose: 1000,
        });
      } else {
        toast.error(res.data.message, {
          autoClose: 1000,
        });
        setMessage("Invalid Request");
      }
    } else {
      setMessage("Invalid Request");
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    console.log(token);

    if (token) {
      verifyToken(token);
    } else {
      setMessage("Invalid Request");
    }
  }, []);

  return (
    <StyledVerify>
      <div>{message}</div>
    </StyledVerify>
  );
};

export default Verify;
