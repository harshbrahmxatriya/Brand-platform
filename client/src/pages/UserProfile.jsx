import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import ImageUploader from "react-image-upload";
import "react-image-upload/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";
import { BsCamera } from "react-icons/bs";
import { IoIosRemoveCircle } from "react-icons/io";

const ProfilePage = ({ currentUser }) => {
  function getImageFileObject(imageFile) {
    console.log({ imageFile });
  }

  function runAfterImageDelete(file) {
    console.log({ file });
  }

  return (
    <div className="w-full h-screen flex">
      <img
        src="/profilePagePic.jpg"
        className="hidden md:block hero-img w-1/2 h-full object-cover"
        alt="brand image"
      />

      <div className="md:w-1/2 w-full">
        <ProfileUI currentUser={currentUser} />
      </div>
    </div>
  );
};
const ProfileUI = ({ currentUser }) => {
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [userType, setUserType] = useState(currentUser.userType);
  const [DOB, setDOB] = useState(new Date(currentUser.DOB));

  const id = currentUser._id;
  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastName = (e) => {
    setLastName(e.target.value);
  };
  const handleUserType = (e) => {
    setUserType(e.target.value);
  };
  const handleDOB = (date) => {
    setDOB(date);
  };

  const saveChanges = async () => {
    if (
      firstName !== currentUser.firstName ||
      lastName !== currentUser.lastName ||
      userType !== currentUser.userType ||
      DOB !== currentUser.DOB ||
      file !== currentUser.profilePicture
    ) {
      const updatedProfile = new FormData();
      updatedProfile.append("id", id);
      updatedProfile.append("firstName", firstName);
      updatedProfile.append("lastName", lastName);
      updatedProfile.append("userType", userType);
      updatedProfile.append("DOB", DOB);
      updatedProfile.append("profilePicture", file);
      console.log("profile pic: ", file);
      console.log("FormData:", updatedProfile);

      axios
        .post(
          "https://brand-platform.onrender.com/update-profile",
          updatedProfile
        )
        .then((response) => {
          alert("Profile updated successfully");
          console.log(response);
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
        });
    } else {
      alert("No changes to save.");
    }
  };

  const [file, setFile] = useState(currentUser.profilePicture);
  const [userImage, setUserImage] = useState(currentUser.profilePicture);
  function handleChange(e) {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    setUserImage(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="absolute top-[5%] max-w-sm left-[5%] ">
        <h1 className="text-4xl hidden md:block text-white font-bold my-4">
          Hi {firstName} {lastName}! welcome to your profile
        </h1>
      </div>
      <div className="flex">
        <img
          className="mt-14 mb-6 w-28 ml-[30%] h-28 object-cover rounded-full"
          src={userImage}
          alt={currentUser.firstName}
        />
        <form encType="multipart/form-data" className="w-fit  self-end">
          <p className="mb-2">Change your picture</p>
          <input
            type="file"
            name="profilePicture"
            className="mb-6 w-max text-xs"
            onChange={handleChange}
          />
        </form>
      </div>
      <div className="flex flex-col lg:w-[65%] sm:w-3/4">
        <div className="flex">
          <div className="m-2 w-1/2">
            <p className="text-sm text-gray-600">First Name</p>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={handleFirstName}
              required
              className="w-full py-2  bg-transparent text-black 
                border-b  border-black outline-nonetransition duration-300
                focus:outline-none focus:border-purple-800 focus:border-b-2"
            />
          </div>
          <div className="m-2 w-1/2">
            <p className="text-sm text-gray-600">Last Name</p>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={handleLastName}
              required
              className="w-full py-2 bg-transparent text-black 
              border-b border-black outline-none transition duration-300
              focus:outline-none focus:border-purple-800 focus:border-b-2"
            />
          </div>
        </div>

        <div className="flex mt-6">
          <p className="w-1/4 text-md self-center mx-2 ">You are...</p>
          <select
            className="w-3/4 py-2 my-2 mx-2 pt-1 mt-1 bg-transparent text-black 
            border-b  border-black outline-none cursor-pointer
            focus:outline-none appearance-none
            focus:border-purple-800 focus:border-b-2"
            value={userType}
            onChange={handleUserType}
          >
            <option value="admin">Administrator</option>
            <option value="brand">Brand</option>
            <option value="influencer">Influencer</option>
          </select>
        </div>
        <div className="flex mt-6">
          <div className="w-1/2 m-2">
            <p className="text-sm text-gray-600">Date of birth</p>
            <DatePicker
              onChange={handleDOB}
              placeholderText="DOB"
              selected={DOB}
              wrapperClassName="w-full"
              className="py-2 bg-transparent text-black 
              border-b  border-black outline-none 
              focus:outline-none focus:border-purple-800 focus:border-b-2"
              showYearDropdown
            />
          </div>
          <div className="w-1/2 mx-2 flex justify-end items-center">
            <button
              className="bg-black py-2 px-6 text-white 
              text-lg rounded-sm"
              onClick={saveChanges}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const userEmail = sessionStorage.getItem("userEmail");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("userEmail") === null) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    axios
      .get("https://brand-platform.onrender.com/get-users")
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const currentUser = users.find((item) => item.email === userEmail);
    console.log(currentUser);
    setCurrentUser(currentUser);
  }, [users]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : currentUser ? (
        <>
          <ProfilePage currentUser={currentUser} />
        </>
      ) : (
        <div>No user found</div>
      )}
    </div>
  );
};

export default UserProfile;
