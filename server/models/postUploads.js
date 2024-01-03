import mongoose from "mongoose";

const postUploads = mongoose.Schema({
  title: { type: String },
  description: { type: String, required: true },
  images: { type: String },
  comments: [{ type: String }],
  likes: { type: Number, default: 0 },
});

const PostUploads = mongoose.model("post_uploads", postUploads);

export default PostUploads;
