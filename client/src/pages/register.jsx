import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("brand");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState(0);
  const [DOB, setDOB] = useState("");
  const [brandName, setBrandName] = useState("");
  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleUserType = (e) => setUserType(e.target.value);

  const handleFirstName = (e) => setFirstName(e.target.value);

  const handleLastName = (e) => setLastName(e.target.value);

  const handleNumber = (e) => {
    console.log(e.target.value);
    setNumber(e.target.value);
  };
  const handleDOB = (date) => {
    console.log(date.get);

    setDOB(date);
  };

  const signUp = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      const requestBody = {
        email: email,
        password: password,
        userType: userType,
        firstName: firstName,
        lastName: lastName,
        contactNumber: number,
        DOB: DOB,
        brandName: brandName,
      };
      axios.post("http://localhost:4000/sign-up", requestBody).then((res) => {
        if (res.data.message === "Sign-up successful") {
          navigate(`/home`, {
            state: { isLoggedIn: true, userData: requestBody.email },
          });
        }
      });
    }
  };

  return (
    <div className="w-full h-screen flex items-start">
      <div className="relative w-1/2 h-full flex flex-col">
        <div className="absolute top-[10%] left-[10%] flex flex-col  ">
          <h1 className="text-4xl text-white font-bold my-4">
            Turn Your Ideas into reality
          </h1>
          <p className="text-xl text-white font-normal">
            Start for free and get attractive offers
          </p>
        </div>
        <img
          src="/curology.jpg"
          className="hero-img w-full h-full object-cover object-center-bottom"
          alt="brand image"
        />
      </div>
      <div className="w-1/2 h-full overflow-y-scroll bg-[#f5f5f5] flex flex-col px-24 py-8 justify-between">
        <div className="w-full flex flex-col max-w-[500px]">
          <div className="w-full flex flex-col mb-2">
            <h3 className="text-3xl font-semibold mb-2">Sign Up</h3>
            <p className="text-sm mb-2">
              Please enter your details to register.
            </p>
          </div>

          <div className="w-full flex">
            <div className="w-1/2 mr-2 flex flex-col">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={handleFirstName}
                required
                className="w-full py-2 my-2 bg-transparent text-black 
                  border-b  border-black outline-none focus:outline-none"
              />
              <input
                type="text"
                placeholder="Contact No"
                value={number}
                onChange={handleNumber}
                className="w-full py-2 my-2 bg-transparent text-black 
                  border-b  border-black outline-none focus:outline-none"
              />
            </div>
            <div className="w-1/2 ml-2 flex flex-col">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={handleLastName}
                required
                className="w-full py-2 my-2 bg-transparent text-black 
                  border-b  border-black outline-none focus:outline-none"
              />

              <DatePicker
                onChange={handleDOB}
                placeholderText="DOB"
                selected={DOB}
                className="w-full py-2 my-2  bg-transparent text-black 
                  border-b  border-black outline-none 
                  focus:outline-none"
                showYearDropdown
              />
            </div>
          </div>

          <div className="w-full flex flex-col">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmail}
              className="w-full py-2 my-2 bg-transparent text-black 
                border-b  border-black outline-none focus:outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePassword}
              className="w-full py-2 my-2 bg-transparent text-black 
                border-b  border-black outline-none 
                focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              className="w-full py-2 my-2 bg-transparent text-black 
                border-b  border-black outline-none 
                focus:outline-none"
            />
            <p className="text-sm mt-3">You are...</p>
            <select
              className="w-full py-2 my-2 pt-1 mt-1 bg-transparent text-black 
                border-b  border-black outline-none cursor-pointer
                focus:outline-none appearance-none"
              value={userType}
              onChange={handleUserType}
            >
              <option value="admin">Administrator</option>
              <option value="brand">Brand</option>
              <option value="influencer">Influencer</option>
            </select>

            {userType === "brand" && (
              <input
                type="text"
                placeholder="Brand Name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full py-2 my-2 bg-transparent text-black 
                  border-b  border-black outline-none 
                  focus:outline-none"
              />
            )}
          </div>

          <div className="w-full flex flex-col my-2 mt-4">
            <button
              className="w-full text-white font-semibold  
                bg-[#060606] rounded-md p-4 text-center flex 
                items-center justify-center"
              onClick={signUp}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <p>
            Already have an account?
            <Link
              to="/"
              className="font-semibold underline underline-offset-2 ml-1"
            >
              Log in instead
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
