import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import { useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("brand");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [number, setNumber] = useState(0);
  const [DOB, setDOB] = useState("");
  const [brandName, setBrandName] = useState("");
  const location = useLocation();
  let serverUrl = import.meta.env.VITE_SERVER_URL;

  if (!serverUrl) {
    console.log("no server url !");
    serverUrl = "https://brand-platform.onrender.com";
  }

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const login = () => {
    const requestBody = {
      email: email,
      password: password,
    };

    axios.post(`${serverUrl}/sign-in`, requestBody).then((res) => {
      console.log(res.data);
      if (res.data.message === "Login successful") {
        sessionStorage.setItem("userEmail", email);

        if (location.state) {
          window.location.href = location.state.url;
        } else {
          navigate(`/home`, {
            state: { isLoggedIn: true, userData: requestBody.email },
          });
        }
      } else {
        alert(res.data.message);
      }
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);

      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );

      const { email, given_name, family_name, picture } = userInfoResponse.data;
      console.log("User Information:", {
        email,
        given_name,
        family_name,
        picture,
      });
      setEmail(email);
      setFirstName(given_name);
      if (family_name) {
        setLastName(family_name);
      }

      const requestBody = {
        email: email,
        password: password,
        userType: userType,
        firstName: given_name,
        lastName: lastName,
        contactNumber: number,
        DOB: DOB,
        brandName: brandName,
        profilePicture: picture,
      };
      const signInRequestBody = {
        email: email,
        password: password,
      };

      axios
        .post(`${serverUrl}/sign-in`, signInRequestBody)
        .then((res) => {
          if (res.data.message === "Login successful") {
            sessionStorage.setItem("userEmail", email);
            navigate(`/home`);
          }
          if (res.data.message === "No account found with this email.") {
            axios.post(`${serverUrl}/sign-up`, requestBody).then((res) => {
              sessionStorage.setItem("userEmail", email);
              navigate(`/home`);
            });
          }
        })
        .catch((error) => {
          console.error("Error in signing in: ", error);
        });
    },
  });

  function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log("Name: " + profile.getName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

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
          className="hero-img w-full h-full object-cover 
            object-center-bottom"
          alt="brand image"
        />
      </div>
      <div className="w-1/2 h-full bg-[#f5f5f5] flex flex-col px-24 py-8 justify-between">
        <h1 className="text-xl text-[#2c2c2ce2] font-semibold ">
          Interactive Brand
        </h1>

        <div className="w-full flex flex-col max-w-[500px]">
          <div className="w-full flex flex-col mb-2">
            <h3 className="text-3xl font-semibold mb-2">Login</h3>
            <p className="text-sm mb-2">
              Welcome Back! Please enter your details.
            </p>
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
                    border-b  border-black outline-none focus:outline-none"
            />
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="w-full flex">
              <input type="checkbox" className="w-4 h-4 mr-2" />
              <p className="text-sm">Remember Me</p>
            </div>

            <acronym
              title="this feature is not yet available"
              className="no-underline"
            >
              <p className="text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2">
                Forgot Password?
              </p>
            </acronym>
          </div>

          <div className="w-full flex flex-col my-2 mt-3">
            <button
              className="w-full text-white font-semibold  
                    bg-[#060606] rounded-md p-4 text-center flex 
                    items-center justify-center"
              onClick={login}
            >
              Log in
            </button>
          </div>

          <div className="w-full flex items-center justify-center relative py-2 ">
            <div className="w-full h-[1px] bg-black"></div>
            <p className="text-md absolute text-black/80 bg-[#f5f5f5]">or</p>
          </div>

          <button
            className="w-full text-[#060606] font-semibold my-2 bg-white 
          border border-black/40 rounded-md p-4 text-center flex items-center 
          justify-center"
            onClick={() => googleLogin()}
          >
            {/*API Key AIzaSyDbZrp1MW6hzslRDsl1-7FisitCcD2Hkkc */}
            <FcGoogle className="mr-2" size={18} />
            Sign in with Google
            {/*client id 572072610434-dagn1jep8vdaddg8dtpimjlnul57u8tc.apps.googleusercontent.com */}
          </button>
        </div>

        <div className="w-full flex items-center justify-center">
          <p>
            Don't have an account?
            <Link
              to="/sign-up"
              className="font-semibold underline underline-offset-2 ml-1"
            >
              Sign up for free
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
