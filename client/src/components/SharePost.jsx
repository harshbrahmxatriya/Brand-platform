import React from "react";
import { MdCancel } from "react-icons/md";

const SharePost = ({ blogId, setShowSharePost }) => {
  let serverUrl = import.meta.env.VITE_SERVER_URL;
  let baseUrl = "localhost:5173/blog";
  if (!serverUrl) {
    console.log("no server url !");
    serverUrl = "https://brand-platform.vercel.app";
    baseUrl = "brand-platform.vercel.app/blog";
  }

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div
      className="w-[35%] h-[22%] p-4 px-9 relative flex items-end bg-white shadow-sm"
      onClick={handleContainerClick}
    >
      <button
        className="absolute right-6 top-3"
        onClick={() => setShowSharePost(false)}
      >
        <MdCancel size={20} color="black" />
      </button>
      <div className="border-2 w-full border-gray-500 p-2 text-lg overflow-x-scroll">
        {baseUrl}/{blogId}
      </div>
    </div>
  );
};

export default SharePost;
