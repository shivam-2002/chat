import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "components/Login";
import Signup from "components/Signup";
import Message from "components/Message";
import Verify from "components/Verify";
import { useState } from "react";
import Home from "components/Home";
import axios from "axios";
import { useEffect } from "react";
const REACT_APP_BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const App = () => {
  const [authorized, setAuthorized] = useState(false);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("message_token");
      console.log("ljksdfdsf");
      console.log(token);
      if (!token) {
        setAuthorized(false);
        return;
      }
      const res = await axios.get(REACT_APP_BACKEND_BASE_URL + "/api/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res && res.data && res.data.statusCode === 200) {
        setFirstName(res.data.data.first_name);
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="*" element={<Auth />} />
          <Route path="chat" element={<Chat />} /> */}
          <Route
            path="*"
            element={
              <Home setFirstName={setFirstName} setAuthorized={setAuthorized} />
            }
          />
          <Route
            path="login"
            element={
              authorized ? (
                <Message
                  authorized={authorized}
                  setAuthorized={setAuthorized}
                  firstName={firstName}
                />
              ) : (
                <Login setAuthorized={setAuthorized} />
              )
            }
          />
          <Route path="signup" element={<Signup />} />
          <Route
            path="message"
            element={
              <Message
                authorized={authorized}
                setAuthorized={setAuthorized}
                firstName={firstName}
              />
            }
          />
          <Route path="verify" element={<Verify />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};

export default App;
