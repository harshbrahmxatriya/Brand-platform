import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { LuLogOut } from "react-icons/lu";

import PostCard from "../components/PostCard";
import "./GetStarted.css";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [creator, setCreator] = useState();
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const userEmail = sessionStorage.getItem("userEmail");
  const location = useLocation();

  let serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (location.state && location.state.creator) {
      setCreator(location.state.creator);
    }
  }, [location.state]);

  const getPosts = async () => {
    const response = await axios.get(`${serverUrl}/get-post-uploads`);
    let posts = response.data;
    let filteredPosts = posts.filter((post) => post.creator === creator.email);
    setPosts(filteredPosts);
  };

  if (!serverUrl) {
    console.log("no server url !");
    serverUrl = "https://brand-platform.onrender.com";
  }
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
    if (creator && creator.followers) {
      setFollowers(creator.followers.length);
      setFollowing(creator.following.length);
    } else {
      setFollowers(0);
      setFollowing(0);
    }
    if (creator && creator.followers.find((item) => item === userEmail)) {
      setIsFollowing(true);
    }
    getPosts();
  }, [users]);

  const Follow = async () => {
    if (!userEmail) {
      alert("Sign in first");
      return;
    } else if (!currentUser) {
      alert("sign in first");
      return;
    }
    const newIsFollowing = !isFollowing;
    const action = newIsFollowing ? "follow" : "unfollow";
    setIsFollowing(newIsFollowing);
    setFollowers(newIsFollowing ? followers + 1 : followers - 1);
    const requestBody = {
      followerEmail: currentUser.email,
      followedEmail: creator.email,
      action,
    };
    const response = await axios.post(`${serverUrl}/follow`, requestBody);
    alert(response.data.message);
  };
  const handleProfileMenuToggle = () => {
    setProfileMenuOpen((prev) => !prev);
  };
  const redirectToUserProfile = () => {
    navigate("/profile");
  };
  return (
    <div className="h-[100vh] w-[100vw] flex">
      <div className="flex w-[30%] h-full  border-r-2 border-dotted border-black">
        <div className="w-full bg-white px-10 relative flex flex-col h-full pt-10 ">
          {creator && (
            <img
              className="w-28 h-28 self-center mb-10 object-cover rounded-full"
              src={creator.profilePicture}
              alt={creator.firstName}
            />
          )}

          <h2 className="text-3xl text-center mb-10">
            {creator?.firstName} {creator?.lastName}
          </h2>
          <div className="flex w-full mb-11 justify-around">
            <div className="flex flex-col">
              <span className="text-4xl text-center">{followers}</span>
              <span className="text-2xl">followers</span>
            </div>
            <div className="flex flex-col text-center">
              <span className="text-4xl">{following}</span>
              <span className="text-2xl">following</span>
            </div>
          </div>
          <button
            className={`w-full  py-2  text-2xl
            text-center ${
              !isFollowing
                ? "bg-black text-white"
                : "border-2 text-black border-black"
            }`}
            onClick={Follow}
          >
            {!isFollowing ? "Follow" : "Following"}
          </button>
        </div>
      </div>
      <div className="h-full w-[70%]">
        <div className="h-[76px] w-full flex flex-row-reverse">
          <div className=" right-0 top-0 flex p-1.5 px-3 items-center text-md">
            {currentUser && currentUser.profilePicture && (
              <div className="dropdown box-border">
                <div className="select" onClick={handleProfileMenuToggle}>
                  <img
                    src={currentUser.profilePicture}
                    alt={currentUser.firstName}
                    className="h-16 w-16 hover:outline outline-purple-900 object-cover rounded-full cursor-pointer"
                  />
                </div>
              </div>
            )}
            {currentUser && currentUser.profilePicture && (
              <div
                className={`menu z-10 top-[4em] absolute ${
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
          </div>
        </div>
        <div className="w-full flex h-[calc(100%-76px)] bg-gray-100 ">
          <div className="w-[70%] py-2 px-5 overflow-y-scroll">
            {posts &&
              users &&
              posts.map((post) => (
                <PostCard users={users} post={post} key={post._id} />
              ))}
          </div>
          <div className="w-[30%] text-2xl px-3 pt-5 border-t-2 flex flex-col bg-white">
            Follow Suggestions:
            <hr className="w-4/5 self-center mt-6" />
            <hr className="w-4/5 self-center mt-6" />
            <hr className="w-4/5 self-center mt-6" />
            <hr className="w-4/5 self-center mt-6" />
            <hr className="w-4/5 self-center mt-6" />
            <hr className="w-4/5 self-center mt-6" />
            <hr className="w-4/5 self-center mt-6" />
            <hr className="w-4/5 self-center mt-6" />
            <hr className="w-4/5 self-center mt-6" />
            <hr className="w-4/5 self-center mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
