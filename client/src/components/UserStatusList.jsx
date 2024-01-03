import React, { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa6";
import { motion as m } from "framer-motion";

import { item } from "../lib/utils/animation";

const UserStatusList = ({ currentUser, allUsers, handleUserClick }) => {
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  let websocketUrl = import.meta.env.WEBSOCKET_URL;

  if (!websocketUrl) {
    console.log("no websocket url !");
    websocketUrl = "wss://brand-platform.onrender.com";
  }

  useEffect(() => {
    if (!currentUser || !currentUser.firstName || !currentUser.email) {
      return;
    }

    const ws = new WebSocket(websocketUrl);
    ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "users") {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
    });

    ws.addEventListener("open", () => {
      const userDetails = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName || "",
        email: currentUser.email,
      };

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "userDetails", userDetails }));
      }
    });

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [currentUser]);

  const isUserOnline = (email) => {
    return users.some((user) => user.email === email);
  };
  return (
    <m.div variants={item} className="my-4">
      <ul>
        {allUsers.map((user) => (
          <li
            key={user.email}
            className="flex text-lg pl-4 py-1.5 items-center justify-between
           border-b cursor-pointer"
            onClick={() => handleUserClick(user)}
          >
            {`${user.firstName} ${user.lastName}`}
            <FaCircle
              size={10}
              color={isUserOnline(user.email) ? "green" : "grey"}
            />
          </li>
        ))}
      </ul>
    </m.div>
  );
};

export default UserStatusList;
