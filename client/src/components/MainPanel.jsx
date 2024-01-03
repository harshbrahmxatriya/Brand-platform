import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { BsSend } from "react-icons/bs";

import { notifyUser } from "../App";
import UserCard from "./UserCard";

function MainPanel({ selectedUser, currentUser }) {
  const [message, setMessage] = useState("");
  const [nameFrom, setNameFrom] = useState("");
  const [nameTo, setNameTo] = useState("");
  const [chatArray, setChatArray] = useState([]);
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

  if (!serverUrl) {
    console.log("no server url !");
    serverUrl = "https://brand-platform.onrender.com";
    websocketUrl = "wss://brand-platform.onrender.com";
  }

  const fetchMessages = async () => {
    try {
      if (!nameFrom || !nameTo) {
        console.error("Missing sender or receiver names");
        return;
      }

      const response = await axios.get(`${serverUrl}/get-messages`);
      const allMessages = response.data;

      const filteredMessages = allMessages.filter(
        (message) =>
          (message.nameFrom === nameFrom && message.nameTo === nameTo) ||
          (message.nameFrom === nameTo && message.nameTo === nameFrom)
      );

      setChatArray(filteredMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const wsRef = useRef(null);
  useEffect(() => {
    console.log("Connecting to WebSocket...");
    wsRef.current = new WebSocket(websocketUrl);
    wsRef.current.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });
    wsRef.current.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (
        data &&
        data.message &&
        data.message.type === "message" &&
        data.message.requestBody.nameTo === nameFrom
      ) {
        notifyUser(
          `${data.message.requestBody.nameFrom}:\n${data.message.requestBody.message}`
        );
      }
    });
    wsRef.current.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
    });

    return () => wsRef.current.close();
  }, [nameFrom]);

  useEffect(() => {
    if (currentUser) {
      setNameFrom(currentUser.firstName);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedUser) {
      console.log(selectedUser);
      setNameTo(selectedUser.firstName);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (nameFrom && nameTo) {
      fetchMessages();
    }
  }, [nameFrom, nameTo]);

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (!nameFrom || !nameTo || !message) {
      // Don't send a message if any of the required values are missing
      console.error("Missing required values for sending a message");
      return;
    }

    const requestBody = {
      nameFrom: nameFrom,
      nameTo: nameTo,
      message: message,
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "message", requestBody }));
    }

    try {
      axios
        .post(`${serverUrl}/send-message`, requestBody, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          fetchMessages();
          setMessage("");
        });
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  if (!selectedUser) {
    return <div></div>;
  } else if (!currentUser) {
    return <div></div>;
  }

  return (
    <div className="chat flex  flex-col w-full h-full">
      <div className="header h-[13%]">
        {selectedUser ? (
          <UserCard isChatArea={true} user={selectedUser} />
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
      {selectedUser && (
        <div className="display-chat px-3 h-[77%] overflow-y-scroll flex flex-col">
          {chatArray.length > 0 ? (
            chatArray.map((chat) => (
              <div
                key={chat._id}
                className={`message w-fit px-3.5 py-2 mb-1 text-xl bg-white border border-gray-50 rounded-full
                ${chat.nameFrom === currentUser.firstName ? "self-end" : ""}`}
              >
                {chat.message}
              </div>
            ))
          ) : (
            <p className="text-center">Start a chat with the person</p>
          )}
        </div>
      )}
      {selectedUser && (
        <div className="send-text h-[10%] justify-self-end flex justify-center">
          <input
            type="text"
            className="w-[56%] border border-1 px-4 shadow-md h-[50px] 
            rounded-full text-lg"
            value={message}
            onChange={handleMessage}
            placeholder=" Type your message here..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            type="button"
            className="send-button rounded-full ml-2 flex justify-center
            items-center shadow-md
            text-black text-2xl w-[50px] h-[50px] bg-white"
            onClick={sendMessage}
          >
            <BsSend />
          </button>
        </div>
      )}
    </div>
  );
}

export default MainPanel;
