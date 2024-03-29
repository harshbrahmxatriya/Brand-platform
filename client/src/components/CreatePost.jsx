import React from "react";
import { useState } from "react";
import ReactQuillWrapper from "./ReactQuillEditor";
import axios from "axios";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState(null);
  const userEmail = sessionStorage.getItem("userEmail");
  let serverUrl = import.meta.env.VITE_SERVER_URL;

  if (!serverUrl) {
    console.log("no server url !");
    serverUrl = "https://brand-platform.onrender.com";
  }

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  function handleChange(e) {
    console.log(e.target.files);
    setFiles(e.target.files);
  }

  const createPost = () => {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("creator", userEmail);
    postData.append("description", description);

    for (let i = 0; i < files.length; i++) {
      postData.append("images", files[i]);
    }

    axios
      .post(`${serverUrl}/postUpload`, postData)
      .then((response) => {
        setTimeout(() => {
          setShowCreatePost(false);
        }, 1000);
        alert("Post created successfully");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <div
      className="w-1/2 h-4/6 p-4 px-9 flex flex-col bg-white shadow-sm"
      onClick={handleContainerClick}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-1/2 py-2 my-2 mb-6 bg-transparent text-black 
          border-b-2  border-gray-500 outline-none
          focus:outline-none
          placeholder:text-2xl"
      />
      {/* <textarea
        name="description"
        rows="7"
        cols="10"
        className="p-2 border-2  border-gray-500 focus:outline-none"
      ></textarea> */}
      <ReactQuillWrapper
        description={description}
        setDescription={setDescription}
      />
      <form encType="multipart/form-data" className="my-4 flex items-center">
        <p className="mr-4 text-xl">Upload picture:</p>
        <input
          type="file"
          name="profilePicture"
          className="text-xs"
          onChange={handleChange}
          multiple
        />
      </form>
      <button
        className="py-2 my-2 w-full bg-black text-white text-xl tracking-wide"
        onClick={createPost}
      >
        Create Post
      </button>
    </div>
  );
};

export default CreatePost;
