import React, { useState, useRef } from "react";

function Chat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const socketRef = useRef(null);
  const [email, setEmail] = useState("");

  const createConnection = () => {
    const token = localStorage.getItem("token");
    const socket = new WebSocket(
      "ws://localhost:8000/api/v1/websocket?token=" + token
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      console.log(event);
      setResponse(event.data);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  };

  const sendMessage = () => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ id: email, message: message }));
    } else {
      console.log("WebSocket connection is not open");
    }
  };

  return (
    <div className="App">
      <input onChange={(e) => setEmail(e.target.value)} />
      <div onClick={createConnection}>Connect</div>
      <h1>WebSocket Example</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
      <p>Response: {response}</p>
    </div>
  );
}

export default Chat;
