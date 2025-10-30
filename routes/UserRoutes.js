import express from 'express'
import { UserInsert, UserUpdate } from '../controller/RegisterUserController.js'
import { GetAllActiveUsers, LogInController } from '../controller/LogInUserController.js';
import { DeactivateUser, GetReportedUser, ReportUser, WarningUser } from '../controller/ReportController.js';

export const UserRoutes = express.Router();

UserRoutes.post('/registerUser', UserInsert);
UserRoutes.post('/LogInUser', LogInController)
UserRoutes.put('/UpdateUser/:UserId', UserUpdate);
UserRoutes.get('/GetAllActiveUsers', GetAllActiveUsers)
UserRoutes.post('/ReportUser', ReportUser);
UserRoutes.get('/GetAllReportedUser', GetReportedUser)
UserRoutes.get('/SendWarning/:userId', WarningUser)
UserRoutes.get('/DeactivateUser/:userId', DeactivateUser)
