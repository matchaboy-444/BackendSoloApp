import express from 'express';
import { GetLiveStreams, StartLive } from '../controller/LiveStreamingController.js';

export const LiveRoutes = express.Router()

LiveRoutes.get('/GetAllLiveStreams', GetLiveStreams);
LiveRoutes.post('/StartLive', StartLive)