import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Login from "./pages/login.jsx";
import Login2 from "./pages/login2.jsx";
import Register from "./pages/register.jsx";
import GetStarted from "./pages/GetStarted.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Posts from "./pages/Posts.jsx";
import UserPage from "./pages/UserPage.jsx";
import Blog from "./pages/Blog.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="572072610434-dagn1jep8vdaddg8dtpimjlnul57u8tc.apps.googleusercontent.com">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login2" element={<Login2 />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/home" element={<App />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/user-page" element={<UserPage />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/blog/:blogId" element={<Blog />} />
      </Routes>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
