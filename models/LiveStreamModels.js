import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    comment: String,
    time: Date
})

const LiveSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    topic: { type: String, required: true },
    type: { type: String, required: true, enum:["SoloLive", "GroupLive"]},
    comments: [commentSchema],
    timeStarted: {type: Date, required: true},
    timeEnded: {type: Date,required: false, default: null},

})

export const LiveModels = mongoose.model("Live", LiveSchema)