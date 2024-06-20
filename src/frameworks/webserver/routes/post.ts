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
    router.get('/getPostsByUser/:username',authMiddleware,controller.getPostsByUser)
    router.post('/editPost',authMiddleware,controller.updatePostById)
    router.get('/getAllPosts',authMiddleware,controller.getAllPosts)
    router.get('/deletePost/:postId',authMiddleware,controller.deletePost)
    router.post('/reportPost',authMiddleware,controller.reportPost)
    router.patch('/likePost/:postId',authMiddleware,controller.likePost)
    router.patch('/unlikePost/:postId',authMiddleware,controller.unlikePost)
  
    return router
}
export default postRouter
