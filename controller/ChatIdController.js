import { userModels } from "../models/RegisterUserModels.js";
import mongoose from 'mongoose'

export const ChatAvailable = async (req, res) => {
    const { id } = req.query;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("user type error")
        }
        const ChatFind = await userModels.find({ _id: { $ne: id } });
        res.status(200).json({ message: "Chat available rendered", chatbubble: ChatFind });
        console.log("Messenger Rendered");

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }
}