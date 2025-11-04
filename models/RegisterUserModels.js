import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    socketid: { type: String, default: null },
    username: String,
    firstname: String,

    
    middlename: String,
    lastname: String,
    gender: { type: String, enum: ["Male", "Female"] },
    joinedYear: Date,
    password: String,
    idPhoto: String,    
    active: {type: Boolean, default: false, required: false},
    live: {type: Boolean, default: false, required: false},
    connectedtime: Date,
    disconnectedtime: Date,
    reported: { type: Boolean, default: false, required: false}
})

export const userModels = mongoose.model('User', UserSchema);