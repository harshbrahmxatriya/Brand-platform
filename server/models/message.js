import mongoose from "mongoose";

const Messages = new mongoose.Schema({
    nameFrom: { type: String, required: true },
    nameTo: {type: String, required: true},
    message: {type: String, required: true},
    time: {type: Number, required: true}
});

const MessageSchema = mongoose.model('Messages', Messages);

export default MessageSchema;