import express from 'express';
import { GetLiveStreams } from '../controller/LiveStreamingController.js';

export const LiveRoutes = express.Router()

LiveRoutes.get('/GetAllLiveStreams', GetLiveStreams);