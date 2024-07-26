import express from 'express';
import { userRepositoryMongoDb } from '../../database/monogDB/repositories/userRepositoryMongoDb';
import { userDbRepository } from '../../../application/repositories/userDbRepository';
import { authService } from '../../services/authService';
import { authServiceInterface } from '../../../application/services/authServiceInterfaces';
import authMiddleware from '../middlewares/authMiddleware';
import postController from '../../../adapters/postController';
import { postRepositoryMongoDb } from '../../database/monogDB/repositories/postRepositoryMongoDb';
import { postDbRepository } from '../../../application/repositories/postDbRepository';
import { commentRepositoryMongoDb } from '../../database/monogDB/repositories/commentRepostitoryMongoDb';
import { commentDbRepository } from '../../../application/repositories/commentDbRepository';
import { notficationRepositoryMongoDb } from '../../database/monogDB/repositories/notificationRepositoryMongoDb';
import { notificationDbRepository } from '../../../application/repositories/notificationDbRepository';

const postRouter = () => {
    const router = express();

    const controller = postController(
        userRepositoryMongoDb,
        userDbRepository,
        authService,
        authServiceInterface,
        postRepositoryMongoDb,
        postDbRepository,
        commentRepositoryMongoDb,
        commentDbRepository,
        notficationRepositoryMongoDb,
        notificationDbRepository
    )

    router.post('/createPost', authMiddleware, controller.createPost)
    router.get('/getPostsByUser/:username', authMiddleware, controller.getPostsByUser)
    router.post('/editPost', authMiddleware, controller.updatePostById)
    router.get('/getAllPosts', authMiddleware, controller.getAllPosts)
    router.get('/getAllPostsToExplore', authMiddleware, controller.getAllPostsToExplore)
    router.get('/deletePost/:postId', authMiddleware, controller.deletePost)
    router.post('/reportPost', authMiddleware, controller.reportPost)
    router.patch('/likePost/:postId', authMiddleware, controller.likePost)
    router.patch('/unlikePost/:postId', authMiddleware, controller.unlikePost)
    router.post('/addComment', authMiddleware, controller.addComment)
    router.get('/getComments/:postId', authMiddleware, controller.getComments)
    router.post('/addReply', authMiddleware, controller.addReply)
    router.get('/getTaggedPosts/:username', controller.getTaggedPosts)


    return router
}
export default postRouter
