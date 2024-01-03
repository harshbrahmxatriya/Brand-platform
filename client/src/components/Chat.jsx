import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import MainPanel from "./MainPanel";

const Chat = ({ userName }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const userEmail = sessionStorage.getItem("userEmail");

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

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
    console.log(currentUser);
    setCurrentUser(currentUser);
  }, [users]);

  const handleSearch = (userName) => {
    if (userName.length > 0) {
      const searchResults = users.filter((item) =>
        item.firstName.includes(userName)
      );
      setSearchedUsers(searchResults);
      console.log(searchResults);
      return;
    }
    const searchResults = users.filter((item) =>
      item.firstName.includes(keyword)
    );
    console.log(searchResults);
    setSearchedUsers(searchResults);
  };
  useEffect(() => {
    console.log(userName);
    handleSearch(userName);
  }, [userName]);

  return (
    <>
      <div className="font-montserrat bg-white flex flex-col">
        <div className="flex justify-around w-full mt-2 mb-12">
          <input
            className=" w-1/2 mx-6 px-4 py-1 text-xl placeholder:text-xl 
          border-b-2 border-black
          focus:outline-none"
            placeholder="Search keyword..."
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            className="mx-6 py-2 px-14 text-2xl font-semibold border border-black
          text-white bg-black
          focus:outline-none"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      <div
        className="grow rounded-b-sm border-2 flex border-gray-600
    "
      >
        <div className="w-2/6 h-full bg-white border-r-2 border-[rgba(56,56,56,0.8)]">
          {searchedUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              handleSelectUser={handleSelectUser}
            />
          ))}
        </div>
        <div className="w-4/6 h-full bg-purple-300 ">
          <MainPanel selectedUser={selectedUser} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default Chat;
