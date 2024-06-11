import React, { useEffect, useRef, useState } from "react";
import StyledMessage from "./styled";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router";

const REACT_APP_BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const REACT_APP_BACKEND_WEBSOCKET = process.env.REACT_APP_BACKEND_WEBSOCKET;

interface contactDataInterface {
  id: number;
  msg_id: number;
  name: string;
}

type MessageData = {
  [userId1: number]: {
    [timestamp: string]: {
      [userId2: number]: string;
    };
  };
};

interface MessageProps {
  authorized: boolean;
  setAuthorized: (val: boolean) => void;
  firstName: string;
}

const Message: React.FunctionComponent<MessageProps> = ({
  authorized,
  setAuthorized,
  firstName,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [contactData, setContactData] = useState<Array<contactDataInterface>>(
    []
  );
  const [currentId, setCurrentId] = useState<number>(0);
  const [message, setMessage] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const [messageData, setMessageData] = useState<MessageData>({});
  const [showModel, setShowModel] = useState(false);

  const addEmail = async () => {
    if (!email) {
      toast.error("Please enter valid email address", {
        autoClose: 1000,
      });
      return;
    }
    const token = localStorage.getItem("message_token");
    const res = await axios.post(
      REACT_APP_BACKEND_BASE_URL + "/api/v1/add-contact",
      {
        email: email,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res && res.data && res.data.statusCode === 200) {
      setContactData(res.data.data);
      setShowModel(false);
    } else if (res && res.data && res.data.statusCode === 400) {
      toast.error(res.data.message, {
        autoClose: 1000,
      });
    }
  };

  const createConnection = () => {
    const token = localStorage.getItem("message_token");
    if (!token) {
      toast.error("There are some error", {
        autoClose: 1000,
      });
      return;
    }
    const socket = new WebSocket(
      REACT_APP_BACKEND_WEBSOCKET + "/api/v1/websocket?token=" + token
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onmessage = (event) => {
      const temp = JSON.parse(event.data);
      if (temp.contact) {
        setContactData((prev) => {
          let flag = false;
          for (let i = 0; i < prev.length; i++) {
            if (prev[i].id === temp.contact.id) flag = true;
          }
          if (flag) {
            return prev;
          }
          return [...prev, temp.contact];
        });
      }
      setMessageData((prev) => {
        return { ...prev, ...temp.msg };
      });
      //   setResponse(event.data);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed", event);
      // setTimeout(() => {
      //   createConnection();
      // }, 5000);
    };
  };

  const sendMessage = () => {
    if (!message) {
      return;
    }
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          id: contactData[currentId].id,
          message: message,
          msg_id: contactData[currentId].msg_id,
        })
      );
      setMessage("");
    } else {
      console.log("WebSocket connection is not open");
    }
  };

  useEffect(() => {
    if (!authorized) {
      navigate("/login");
    }
    createConnection();
    const load = async () => {
      const token = localStorage.getItem("message_token");
      const res = await axios.get(
        REACT_APP_BACKEND_BASE_URL + "/api/v1/get-contacts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res && res.data && res.data.statusCode === 200) {
        setContactData(res.data.data);
      }
    };
    load();
    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("message_token");
      const res = await axios.get(
        REACT_APP_BACKEND_BASE_URL + "/api/v1/get-messages",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res && res.data && res.data.statusCode === 200) {
        setMessageData(res.data.data);
      }
    };
    load();
  }, [contactData]);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("message_token");
    setAuthorized(false);
    navigate("/login");
  };

  return (
    <StyledMessage>
      <div className="user-name">Welcome {firstName}</div>
      <div className="container">
        <div className="header">
          Messages{" "}
          <div className="logout-ctn" onClick={handleLogout}>
            Log out
          </div>
        </div>
        <div className="body">
          <div className="parent-ctn">
            <div className="col1">
              <div onClick={() => setShowModel(true)} className="add-email">
                {" "}
                Add
              </div>
              {contactData.map((item, index) => (
                <div
                  key={index}
                  className={currentId === index ? "c1 active" : "c1"}
                  onClick={() => setCurrentId(index)}
                >
                  {item.name}
                </div>
              ))}
            </div>
            <div className="msg-ctn">
              <div className="w-100 h-90">
                {contactData[currentId] && (
                  <div className="w-100">
                    {Object.entries(
                      messageData[contactData[currentId].id] || {}
                    ).map(([timestamps, userMessage]) => (
                      <div key={timestamps} className="w-100">
                        {Object.entries(userMessage).map(
                          ([userId, messageText]) => (
                            <div
                              key={userId}
                              className={
                                contactData[currentId].id === parseInt(userId)
                                  ? "right"
                                  : "left"
                              }
                            >
                              <div className=" msg-text">
                                <span className="time-stamp">
                                  {timestamps.slice(0, 16)}
                                </span>{" "}
                                <span className="message-text">
                                  {messageText}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="send-ctn">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="msg-input"
                />
                <span className="send" onClick={sendMessage}>
                  Send
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModel}
        onRequestClose={() => {}}
        contentLabel="Example Modal"
        style={customStyles}
      >
        <h2 style={{ textAlign: "center", width: "450px" }}>Add Contact</h2>
        <div
          style={{
            display: "flex",
            gap: "20px",
            margin: "50px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>Enter email</div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "200px",
              border: "1px solid grey",
              outline: "none",
              boxShadow: "none",
              padding: "5px",
              height: "20px",
              borderRadius: "5px",
            }}
          ></input>
        </div>
        <div
          style={{
            display: "flex",
            gap: "30px",
            margin: "50px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              padding: "10px 20px",
              background: "cyan",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => setShowModel(false)}
          >
            Cancel
          </div>
          <div
            style={{
              padding: "10px 20px",
              background: "#45c463",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={addEmail}
          >
            Add
          </div>
        </div>
      </Modal>
    </StyledMessage>
  );
};

export default Message;
