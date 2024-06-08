import express from 'express';
import { userRepositoryMongoDb } from '../../database/monogDB/repositories/userRepositoryMongoDb';
import { userDbRepository } from '../../../application/repositories/userDbRepository';
import { authService } from '../../services/authService';
import { authServiceInterface } from '../../../application/services/authServiceInterfaces';
import authMiddleware from '../middlewares/authMiddleware';
import postController from '../../../adapters/postController';
import { postRepositoryMongoDb } from '../../database/monogDB/repositories/postRepositoryMongoDb';
import { postDbRepository } from '../../../application/repositories/postDbRepository';

const postRouter = () => {
    const router = express();

    const controller= postController(
        userRepositoryMongoDb,
        userDbRepository,
        authService,
        authServiceInterface,
        postRepositoryMongoDb,
        postDbRepository
    )

    router.post('/createPost', authMiddleware, controller.createPost)
    router.get('/getMyPosts',authMiddleware,controller.getMyPosts)
    router.post('/editPost',controller.updatePostById)
    router.get('/getAllPosts',authMiddleware,controller.getAllPosts)
    router.get('/deletePost/:postId',controller.deletePost)
    return router
}
export default postRouter
