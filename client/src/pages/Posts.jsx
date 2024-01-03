import React from "react";
import { useState } from "react";
import CreatePost from "../components/CreatePost";

const Posts = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

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
      <div className="w-2/4 h-full"></div>
      <div
        className="w-1/4 h-full flex flex-col items-end border-double 
      border-l-4 border-gray-300"
      >
        <button
          className="px-6 m-2.5 my-3 py-2 text-[rgb(92,92,92)] 
        border-2 border-black bg-white text-3xl"
          onClick={() => {
            console.log("Clicked on create post button");
            setShowCreatePost(true);
          }}
        >
          Create Post
        </button>
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
