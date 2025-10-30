import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { socketing } from './socketing/socket.js'
import mongoose from 'mongoose'
import express from 'express'
import { UserRoutes } from './routes/UserRoutes.js'
import { PostRoutes } from './routes/PostingRoutes.js'
import { ChattingRoutes } from './routes/ChatRoutes.js'
import cors from 'cors'
import { MessagesRoutes } from './routes/MessagesRoutes.js'
import path from 'path'
import { LiveRoutes } from './routes/LiveRoutes.js'

dotenv.config()


const app = express()

const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: '*',
        methods: '*'
    }
})

app.use(express.json({limit: '20mb'}))
app.use(cors())
app.use('/uploads', express.static(path.join(process.cwd(), "uploads")))
app.use('/users', UserRoutes)
app.use('/posts', PostRoutes)
app.use('/chats', ChattingRoutes)
app.use('/messages', MessagesRoutes)
app.use('/live', LiveRoutes)

const PORT = process.env.PORT;
const URL = process.env.MONGO_CONNECTION;

socketing(io)

mongoose.connect(URL).then(() => {
    console.log("Database is Connecting")
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is listening to ${PORT}`);
    })
}).catch((err) => { console.log(err) })

