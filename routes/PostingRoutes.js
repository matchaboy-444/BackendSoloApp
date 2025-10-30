import express from 'express';
import { DeletePost, EditPost, PostInsert, PostRead, PostUserRead, SharedPost } from '../controller/PostsController.js';
import { GetCommentPost } from '../controller/CommentsController.js';
import { AddReactions } from '../controller/ReactionsController.js';
import { upload } from '../mediahandler/mediauploads.js';


export const PostRoutes = express.Router()

PostRoutes.post('/InsertPost', upload.single("file"), PostInsert)
PostRoutes.get('/ReadPost', PostRead)
PostRoutes.get('/UserPost', PostUserRead)
PostRoutes.put('/EditPost/:id', EditPost)
PostRoutes.delete('/DeletePost/:id', DeletePost)
PostRoutes.post('/:PostId/:reactions/reacts', AddReactions)
PostRoutes.get('/:PostId/comments', GetCommentPost)
PostRoutes.post('/share', SharedPost)
