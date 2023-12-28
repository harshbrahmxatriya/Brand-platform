import mongoose from "mongoose";

const UserDetails = mongoose.Schema({
  email: { type: String, required: true },
  password_hash: { type: String },
  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/ddmvcifmt/image/upload/v1703165707/brand-platform/fe3uqpdpawuauj2oi3wz.png",
  },
  userType: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String },
  contactNumber: { type: Number },
  DOB: { type: Date },
  brandName: { type: String },
  profilePicture: { type: String },
});

const UserSchema = mongoose.model("login_platform", UserDetails);

export default UserSchema;
