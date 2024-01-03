import React from "react";
import { useState } from "react";
import ReactQuillWrapper from "./ReactQuillEditor";
import axios from "axios";

const CreatePost = ({ setShowCreatePost }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  function handleChange(e) {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  }

  const createPost = () => {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("description", description);
    postData.append("images", file);

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
