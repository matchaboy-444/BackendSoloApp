import mongoose from 'mongoose'

const ChatIdSchema = new mongoose.Schema({
    name: String,
    content: String,
    time: new Date()
})

export const ChatIdModel = mongoose.model('Chats', ChatIdSchema)