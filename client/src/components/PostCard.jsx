import React, { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { MdOutlineModeComment } from "react-icons/md";
import { GoComment } from "react-icons/go";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import axios from "axios";

const PostCard = ({ users, post }) => {
  const [isTruncated, setIsTruncated] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [creator, setCreator] = useState();
  const [likes, setLikes] = useState(post.likes);
  const userEmail = sessionStorage.getItem("userEmail");
  let serverUrl = import.meta.env.VITE_SERVER_URL;
  if (!serverUrl) {
    console.log("no server url !");
    serverUrl = "https://brand-platform.onrender.com";
  }
  useEffect(() => {
    const creatorDetails = users.find((item) => item.email === post.creator);
    console.log(creatorDetails);
    setCreator(creatorDetails);
    const isLikedByCurrentUser = post.likedBy.find(
      (email) => email === userEmail
    );
    setIsLiked(isLikedByCurrentUser);
  }, []);
  console.log(post._id);
  const renderContent = () => {
    const maxLength = 160;
    let content;
    if (post.description.length < maxLength) {
      content = isTruncated
        ? post.description.slice(0, maxLength).trim()
        : post.description;
    } else {
      content = isTruncated
        ? post.description.slice(0, maxLength).trim() + "..."
        : post.description;
    }
    const toggleTruncate = () => {
      setIsTruncated(!isTruncated);
    };
    return (
      <p className="flex flex-col">
        <span dangerouslySetInnerHTML={{ __html: content }} />

        {post.description.length > maxLength && (
          <button
            className="border-none mt-1 bg-gray-200 self-center"
            style={{ marginLeft: "5px" }}
            onClick={toggleTruncate}
          >
            {isTruncated ? "Read more" : "Read less"}
          </button>
        )}
      </p>
    );
  };

  const like = async () => {
    if (!userEmail) {
      alert("Sign in first");
      return;
    }
    setIsLiked(true);
    setLikes(likes + 1);
    const requestBody = { id: post._id, email: userEmail, action: "plus" };
    await axios.post(`${serverUrl}/update-likes`, requestBody);
  };
  const dontLike = async () => {
    setIsLiked(false);
    setLikes(likes - 1);
    const requestBody = { id: post._id, email: userEmail, action: "minus" };
    await axios.post(`${serverUrl}/update-likes`, requestBody);
  };

  return (
    <div className="w-full mb-2 bg-white flex flex-col shadow">
      <section className="p-2 border-b flex justify-between items-center">
        <h2 className="text-xl ">{post.title}</h2>
        {creator && (
          <img
            className="h-14 w-14  object-cover rounded-full"
            src={creator.profilePicture}
          />
        )}
      </section>
      <img
        src={post.images}
        alt={`image for blog ${post.title}`}
        className={`max-h-[50vh] self-center`}
      />
      <section className="m-2 mb-6 ">
        <p className="text-lg"> {renderContent()} </p>
      </section>
      <div className="border-t p-2 flex items-center justify-between">
        <div className="flex items-center">
          <BsHeart
            onClick={like}
            className={`mr-2.5 fill-slate-800 ${isLiked ? "hidden" : ""}`}
            size={26}
          />
          {isLiked && (
            <BsHeartFill
              onClick={dontLike}
              className="mr-2.5 fill-slate-800"
              size={26}
            />
          )}

          <GoComment
            className="mr-2 cursor-pointer fill-slate-800"
            color="black"
            size={30}
          />
        </div>
        <div>
          {likes}
          {`${likes > 1 ? " likes" : " like"}`}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
