import express from 'express'
import { MessageFetch } from "../controller/MessagesController.js";

export const MessagesRoutes = express.Router();

MessagesRoutes.get('/ChatFetch', MessageFetch)