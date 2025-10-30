import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderId: String,
    message: String,
    receiverId: String,
    timestamp: {type: Date, default: Date.now}
})

export const MesssageModel = mongoose.model("Messages", MessageSchema)