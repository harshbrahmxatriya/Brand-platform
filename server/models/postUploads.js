import mongoose from "mongoose";

const postUploads = mongoose.Schema({
  title: { type: String },
  creator: { type: String },
  description: { type: String, required: true },
  images: [{ type: String }],
  comments: [
    {
      sender: String,
      comment: String,
    },
  ],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
});

const PostUploads = mongoose.model("post_uploads", postUploads);

export default PostUploads;
