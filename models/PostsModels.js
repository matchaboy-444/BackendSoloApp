import mongoose from "mongoose";
import { type } from "os";

const CommentSchema =new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    commentText: {type: String, required: true},
    createdAt: { type: Date, default: Date.now() }

})

const ReactionSchema =  new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    reacts: {
        type : String,
        enum: ["like", "love", "haha", "wow", "sad", "angry"],
        require: true
    }
})



const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: false },
    media: { type: String, required: false },
    reactions: [ReactionSchema],
    comments: [CommentSchema],
    sharedFrom: {type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null, required: false},
    createdAt: { type: Date, default: Date.now() }
})

export const PostModel = mongoose.model('Post', PostSchema)