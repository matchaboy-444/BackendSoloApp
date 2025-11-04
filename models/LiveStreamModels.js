import mongoose from 'mongoose';


const LiveSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    topic: { type: String, required: true },
    timeStarted: {type: String, required: true},
    timeEnded: {type: String,required: false, default: null},
    link: {type: String, required: true},

})

export const LiveModels = mongoose.model("Live", LiveSchema)