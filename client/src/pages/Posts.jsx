import React, { useEffect, useState } from "react";
import CreatePost from "../components/CreatePost";
import axios from "axios";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const navigate = useNavigate();
  let serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (sessionStorage.getItem("userEmail") === null) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);
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

  const getPosts = async () => {
    const response = await axios.get(`${serverUrl}/get-post-uploads`);
    setPosts(response.data);
    console.log(response.data);
  };
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/4 h-full border-double border-r-4 border-gray-300 ">
        <div
          className="text-4xl hero-text m-2.5 my-4 text-[rgb(128,128,128)] 
            w-fit"
        >
          Brand Platform
        </div>
      </div>
      <div className="w-2/4 h-full p-2 overflow-y-scroll">
        {posts &&
          users &&
          posts.map((post) => (
            <PostCard users={users} post={post} key={post._id} />
          ))}
      </div>
      <div
        className="w-1/4 h-full flex flex-col items-end border-double 
      border-l-4 border-gray-300"
      >
        {isLoggedIn ? (
          <button
            className="px-6 m-2.5 my-3 py-2 text-[rgb(92,92,92)] 
        border-2 border-black bg-white text-3xl"
            onClick={() => {
              setShowCreatePost(true);
            }}
          >
            Create Post
          </button>
        ) : (
          <button
            className="px-6 m-2.5 my-3 py-2 text-[rgb(92,92,92)] 
        border-2 border-black bg-white text-3xl"
            onClick={() => {
              navigate("/", { state: { url: window.location.href } });
            }}
          >
            Sign In
          </button>
        )}
      </div>
      <div
        className={`bg-[rgba(0,0,0,0.53)] h-full w-full fixed 
        flex items-center justify-center
        ${showCreatePost ? "" : "hidden"}`}
        onClick={() => {
          setShowCreatePost(false);
        }}
      >
        <CreatePost setShowCreatePost={setShowCreatePost} />
      </div>
    </div>
  );
};

export default Posts;
