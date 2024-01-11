import React, { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { MdOutlineModeComment } from "react-icons/md";
import { GoComment } from "react-icons/go";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import axios from "axios";
import SimpleImageSlider from "react-simple-image-slider";
import ReactSimplyCarousel from "react-simply-carousel";
import { CiSquareChevRight, CiSquareChevLeft } from "react-icons/ci";

const PostCard = ({ users, post }) => {
  const [isTruncated, setIsTruncated] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [creator, setCreator] = useState();
  const [likes, setLikes] = useState(post.likes);
  const userEmail = sessionStorage.getItem("userEmail");
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [commentsArray, setCommentsArray] = useState(post.comments);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const imagesArray = [];
  for (let i = 0; i < post.images.length; i++) {
    imagesArray.push({ url: post.images[i] });
  }
  console.log(imagesArray);
  console.log(post.comments);
  let serverUrl = import.meta.env.VITE_SERVER_URL;
  let websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
  if (!serverUrl) {
    console.log("no server url !");
    serverUrl = "https://brand-platform.onrender.com";
    websocketUrl = "wss://brand-platform.onrender.com";
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

  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(websocketUrl);

    socket.onopen = () => {
      const userDetails = {
        email: userEmail,
      };
      socket.send(JSON.stringify({ type: "userDetails", userDetails }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "newComment" && data.id === post._id) {
          console.log(data);
          setCommentsArray((prevComments) => [
            ...prevComments,
            { id: data.id, sender: data.sender, comment: data.comment },
          ]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [post._id]);

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

  const toggleNext = () => {
    if (activeSlideIndex === post.images.length - 1) {
      setActiveSlideIndex(0);
    } else {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };
  const togglePrevious = () => {
    if (activeSlideIndex === 0) {
      setActiveSlideIndex(post.images.length - 1);
    } else {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  };
  const sendComment = async () => {
    if (!userEmail) {
      alert("Sign in first");
      return;
    }
    const requestBody = { id: post._id, sender: userEmail, comment };
    await axios
      .post(`${serverUrl}/post-comment`, requestBody)
      .then(() => setComment(""));
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
      <div className="flex relative ">
        <img
          src={post.images[activeSlideIndex]}
          alt={`image for blog ${post.title}`}
          className={`h-[50vh] mx-auto my-auto self-center`}
        />
        {post.images.length > 1 && (
          <span className="absolute top-2 right-2 text-xl rounded-sm text-gray-800 px-1 bg-[rgba(255,255,255,0.46)] cursor-pointer">
            {`${activeSlideIndex + 1}/${post.images.length}`}
          </span>
        )}
        {post.images.length > 1 && (
          <span
            className="absolute top-[45%] left-2 text-3xl  cursor-pointer"
            onClick={togglePrevious}
          >
            <CiSquareChevLeft size={40} />
          </span>
        )}
        {post.images.length > 1 && (
          <span
            className="absolute top-[45%] right-2 text-3xl cursor-pointer"
            onClick={toggleNext}
          >
            <CiSquareChevRight size={40} />
          </span>
        )}
      </div>

      <section className="m-2 mb-6 ">
        <p className="text-lg"> {renderContent()} </p>
      </section>
      <div className="border-t p-2 flex items-center justify-between">
        <div className="flex items-center">
          <BsHeart
            onClick={like}
            className={`mr-2.5 fill-black cursor-pointer ${
              isLiked ? "hidden" : ""
            }`}
            size={26}
          />
          {isLiked && (
            <BsHeartFill
              onClick={dontLike}
              className="mr-2.5 fill-black cursor-pointer"
              size={26}
            />
          )}
          <button
            className="border-none flex justify-center items-center p-2 px-1 bg-white border-[rgba(167,167,167,0.7)] 
          hover:border hover:rounded-full hover:bg-[rgba(167,167,167,0.7)]          
          "
          >
            <GoComment
              className="mr-2 cursor-pointer fill-black ml-1"
              color="black"
              onClick={() => setShowComment(!showComment)}
              size={30}
            />
          </button>
        </div>
        <div>
          {likes}
          {`${likes > 1 ? " likes" : " like"}`}, {commentsArray.length}
          {`${commentsArray.length > 1 ? " comments" : " comment"}`}
        </div>
      </div>
      {showComment && (
        <>
          <div className="p-2 mb-4 flex px-6">
            <input
              type="text"
              placeholder="Type your comment on this post"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-3/4 py-2 bg-transparent text-black
            border-b  border-black outline-none
            focus:outline-none
            placeholder:text-base"
            />
            <button
              className="p-3 py-2 ml-4 bg-black text-white"
              onClick={sendComment}
            >
              Comment
            </button>
          </div>
          <div className="p-2 mb-2">
            {commentsArray.map((item) => {
              const commenter = users.find(
                (user) => user.email === item.sender
              );
              return (
                <div className="flex items-center mb-2 ">
                  <img
                    src={commenter.profilePicture}
                    alt={commenter.firstName}
                    className="h-12 w-12 mr-2 object-cover rounded-full"
                  />
                  <span className="mr-2 text-gray-800 font-bold">{`${commenter.firstName} ${commenter.lastName}`}</span>
                  <p key={item._id}>{item.comment}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PostCard;
