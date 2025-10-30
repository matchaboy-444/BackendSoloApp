import { MesssageModel } from "../models/MessagesModels.js";

export const MessageFetch = async (req, res) => {
    const {senderId, receiverId} = req.query
    try{
        const MessagesChat = await MesssageModel.find({$or: [
            {senderId: senderId, receiverId: receiverId},
            {senderId: receiverId, receiverId: senderId}
        
        ]}).sort({timestamp: 1})


        res.status(200).json({chatHistory: MessagesChat})

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Network Error" })
    }
}