import React, { useState, useEffect } from "react";
import { motion as m } from "framer-motion";
import { HiChatAlt } from "react-icons/hi";
import axios from "axios";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";

import { container, item } from "../lib/utils/animation";
import Chat from "../components/Chat";
import UserStatusList from "../components/UserStatusList";
import UserCard from "../components/UserCard";
import MainPanel from "../components/MainPanel";
import "./GetStarted.css";

const GetStarted = () => {
  const [isChatVisible, setChatVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [onlineFlag, setOnlineFlag] = useState(true);
  const userEmail = sessionStorage.getItem("userEmail");
  let serverUrl = import.meta.env.VITE_SERVER_URL;

  if (!serverUrl) {
    console.log("no server url !");
    serverUrl = "https://brand-platform.onrender.com";
  }

  const navigate = useNavigate();
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };
  useEffect(() => {
    if (sessionStorage.getItem("userEmail") === null) {
      navigate("/");
    }
  }, []);
  const toggleChat = () => setChatVisible(!isChatVisible);

  useEffect(() => {
    axios
      .get(`${serverUrl}/get-users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  useEffect(() => {
    const currentUser = users.find((item) => item.email === userEmail);
    setCurrentUser(currentUser);
  }, [users]);

  const handleProfileMenuToggle = () => {
    setProfileMenuOpen((prev) => !prev);
  };

  const handleProfileMenuItemClick = (menuItem) => {
    setProfileMenuOpen(false);
  };
  const handleUserClick = (user) => {
    setChatVisible(true);
    setSelectedUser(user);
  };
  const handleSearch = (userName) => {
    setChatVisible(true);
    if (userName && userName.length > 0) {
      const searchResults = users.filter((item) =>
        item.firstName.includes(userName)
      );
      setSearchedUsers(searchResults);
      return;
    }
    const searchResults = users.filter((item) =>
      item.firstName.includes(keyword)
    );
    setSearchedUsers(searchResults);
  };

  const redirectToUserProfile = () => {
    navigate("/profile");
  };

  return (
    <m.main
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      exit={{ opacity: 1 }}
      className="absolute w-full h-full "
    >
      <div className="w-full h-full flex">
        <div className="w-2/6 h-screen bg-white pl-2 pr-4">
          <m.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col "
          >
            <div className="flex justify-between items-center">
              <m.div
                variants={item}
                className="text-4xl hero-text m-2.5 my-4 text-[rgb(128,128,128)] 
                w-fit"
              >
                Brand Platform
              </m.div>
              <div>
                <Link to="/posts">
                  <m.button
                    variants={item}
                    className="px-4 py-2 border-2 border-stone-700 text-lg"
                  >
                    Posts
                  </m.button>
                </Link>
              </div>
            </div>

            <input
              className="w-[90%] font-montserrat self-center py-2 text-xl 
              placeholder:text-xl border-b-2 border-black
              focus:outline-none"
              placeholder="Search keyword..."
              onChange={(e) => {
                if (e.target.value === "") {
                  setSearchedUsers([]);
                  setOnlineFlag(true);
                } else {
                  setKeyword(e.target.value);
                  setOnlineFlag(false);
                  handleSearch();
                }
              }}
            />
            <div className="w-full h-full bg-white border-r-2 border-[rgba(56,56,56,0.8)]">
              {searchedUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  handleSelectUser={handleSelectUser}
                />
              ))}
            </div>
            {onlineFlag ? (
              <UserStatusList
                currentUser={currentUser}
                allUsers={users}
                handleUserClick={handleUserClick}
              />
            ) : (
              ""
            )}
          </m.div>
        </div>
        <div className="w-4/6 h-screen bg-purple-300">
          <m.div
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.5, delay: 0.8 }}
            exit={{ opacity: 1 }}
            className="h-[calc(5%+30px)]  bg-white border-l border-b px-4
        flex flex-row-reverse items-center"
          >
            {currentUser && currentUser.profilePicture && (
              <div className="dropdown ml-6 box-border">
                <div className="select" onClick={handleProfileMenuToggle}>
                  <img
                    src={currentUser.profilePicture}
                    alt={currentUser.firstName}
                    className="h-12 w-12 object-cover rounded-full
                  hover:cursor-pointer"
                  />
                </div>
              </div>
            )}
            <IoMdNotificationsOutline size={30} className="ml-6" />
            <FaRegBookmark size={22} />
          </m.div>
          {currentUser && currentUser.profilePicture && (
            <div
              className={`menu z-10 absolute ${
                profileMenuOpen ? "menu-open" : ""
              }`}
            >
              <div className="flex p-2 pt-4 items-center border-b">
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.firstName}
                  className="h-12 w-12 mr-2 object-cover rounded-full"
                />
                <h3>
                  {currentUser.firstName} {currentUser.lastName}
                </h3>
              </div>
              <ul className="list-none border-b">
                <li className="selected" onClick={redirectToUserProfile}>
                  Change Profile
                </li>
                <li onClick={() => handleProfileMenuItemClick("Go Premium")}>
                  Go Premium
                </li>
                <li onClick={() => handleProfileMenuItemClick("Settings")}>
                  Settings
                </li>
              </ul>
              <div
                className="p-2 py-4 flex items-center cursor-pointer
                hover:"
                onClick={() => {
                  sessionStorage.clear();
                  navigate("/");
                }}
              >
                <span className="text-base mr-2">Logout</span>
                <LuLogOut color="red" size="20" className="cursor-pointer" />
              </div>
            </div>
          )}
          <div
            className={`chat-overlay
          w-full h-[calc(95%-30px)] rounded-sm bg-inherit border-l
           ${isChatVisible ? "flex flex-col" : "hidden"}`}
          >
            <MainPanel selectedUser={selectedUser} currentUser={currentUser} />
          </div>
        </div>
      </div>
    </m.main>
  );
};

export default GetStarted;
