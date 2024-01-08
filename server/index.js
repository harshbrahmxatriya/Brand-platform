import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

import connectDB from "./mongodb/connect.js";
import UserSchema from "./models/UserDetails.js";
import MessageSchema from "./models/message.js";
import {
  compareHashWithPassword,
  hashPassword,
} from "./lib/utils/hashPassword.js";
import PostUploads from "./models/postUploads.js";

const onlineUsers = new Set();

let wsServer;

const app = express();
app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    connectDB(
      "mongodb+srv://vibhuti:qwerty12345@cluster0.df3fdce.mongodb.net/?retryWrites=true&w=majority"
    );
    const httpServer = app.listen(4000, () =>
      console.log("Server has started on port http://localhost:4000")
    );

    wsServer = new WebSocketServer({ noServer: true });

    httpServer.on("upgrade", (req, socket, head) => {
      wsServer.handleUpgrade(req, socket, head, (ws) => {
        wsServer.emit("connection", ws, req);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

cloudinary.config({
  cloud_name: "ddmvcifmt",
  api_key: "711867851778873",
  api_secret: "JzbjpkzOMr6t3BHuWQyn6UE9DCM",
});

function broadcastOnlineUsers() {
  const usersWithDetails = Array.from(onlineUsers).map(
    (user) => user.userDetails
  );
  wsServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "users", users: usersWithDetails }));
    }
  });
}

function broadcastMessage(message) {
  wsServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "message", message }));
    }
  });
}

wsServer.on("connection", (ws) => {
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === "userDetails") {
        // Store user details in the WebSocket object
        ws.userDetails = data.userDetails;
        onlineUsers.add(ws);

        broadcastOnlineUsers();
      } else if (data.type === "message") {
        broadcastMessage(data);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    onlineUsers.delete(ws);

    broadcastOnlineUsers();
  });
});

app.get("/", async (req, res) => {
  res.send("Hello from Server" + new Date().getTime());
});

app.get("/get-users", async (req, res) => {
  try {
    const users = await UserSchema.find({});

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
});

app.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if a user with the same name exists in the database
    const existingUser = await UserSchema.findOne({ email });

    if (existingUser) {
      let passwordMatch = await compareHashWithPassword(
        password,
        existingUser.password_hash
      );
      if (passwordMatch) {
        return res
          .status(200)
          .json({ message: "Login successful", redirectTo: "/home" });
      } else {
        return res.status(200).json({ message: "Wrong Password" });
      }
    } else {
      return res
        .status(200)
        .json({ message: "No account found with this email." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while logging in." });
  }
});

app.post("/sign-up", async (req, res) => {
  try {
    const {
      email,
      password,
      userType,
      firstName,
      lastName,
      contactNumber,
      DOB,
      brandName,
      profilePicture,
    } = req.body;

    let password_hash = await hashPassword(password);

    const signup = new UserSchema({
      email,
      password_hash,
      profilePicture,
      userType,
      firstName,
      lastName,
      contactNumber,
      DOB,
      brandName,
    });

    await signup.save();
    res.status(201).json({ message: "Sign-up successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating an account" });
  }
});

app.get("/get-messages", async (req, res) => {
  try {
    const messages = await MessageSchema.find({});

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  }
});

app.post("/send-message", async (req, res) => {
  try {
    const { nameFrom, nameTo, message } = req.body;

    const newMessage = new MessageSchema({
      nameFrom,
      nameTo,
      message,
      time: new Date().getTime(),
    });

    await newMessage.save();

    res.status(201).json({ message: "Message created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while sending a message" });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("profilePicture");

app.post("/update-profile", upload, async (req, res) => {
  try {
    const { id, firstName, lastName, userType, DOB } = req.body;

    const cloudinaryResponse = await cloudinary.uploader.upload(
      req.file.path,
      { folder: "brand-platform" },
      function (error, result) {
        console.log(error);
      }
    );

    const cloudinaryImageUrl = cloudinaryResponse.secure_url;
    const cloudinaryImageId = cloudinaryResponse.public_id;
    console.log(cloudinaryImageId);
    console.log("Cloudinary URL:", cloudinaryImageUrl);

    const updatedUser = await UserSchema.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        userType,
        DOB,
        profilePicture: cloudinaryImageUrl,
      },
      { new: true }
    );

    if (updatedUser) {
      res.status(200).json({ message: "Profile updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the profile" });
  }
});

const uploadPostImage = multer({ storage: storage }).single("images");

app.post("/postUpload", uploadPostImage, async (req, res) => {
  try {
    const { title, creator, description } = req.body;
    console.log("Request body:", req.body);

    let cloudinaryResponse = "";
    let cloudinaryImageUrl = "";
    if (req.file) {
      console.log("Uploaded file:", req.file);
      try {
        cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
          folder: "brand-platform/postImages",
        });
        cloudinaryImageUrl = cloudinaryResponse.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ error: "Error uploading to Cloudinary" });
      }
    }

    const newPost = new PostUploads({
      title,
      creator,
      description,
      images: cloudinaryImageUrl,
      time: new Date().getTime(),
    });
    await newPost.save();

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post" });
  }
});

app.get("/get-post-uploads", async (req, res) => {
  try {
    const messages = await PostUploads.find({});

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  }
});

app.post("/update-likes", async (req, res) => {
  try {
    const { id, email, action } = req.body;
    let updateQuery;
    let likesUpdate;

    if (action === "plus") {
      updateQuery = { $addToSet: { likedBy: email } };
      likesUpdate = 1;
    } else if (action === "minus") {
      updateQuery = { $pull: { likedBy: email } };
      likesUpdate = -1;
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    const result = await PostUploads.findByIdAndUpdate(id, updateQuery, {
      new: true,
      upsert: true,
    });
    let newLikes;
    if (likesUpdate) {
      newLikes = result.likes = (result.likes || 0) + likesUpdate;
      await result.save();
    }

    console.log("Update Likes Result:", result);

    return res
      .status(200)
      .json({ message: "Likes updated successfully", newLikes: newLikes });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  }
});
