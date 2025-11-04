import express from 'express';
import { ChatAvailable } from '../controller/ChatIdController.js';

export const   ChattingRoutes = express.Router();

ChattingRoutes.get('/Available', ChatAvailable)