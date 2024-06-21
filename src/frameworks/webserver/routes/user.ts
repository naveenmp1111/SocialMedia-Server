import express from 'express';
import { userRepositoryMongoDb } from '../../database/monogDB/repositories/userRepositoryMongoDb';
import { userDbRepository } from '../../../application/repositories/userDbRepository';
import userController from '../../../adapters/userController';
import authMiddleware from '../middlewares/authMiddleware';


const userRouter = () => {
    const router = express();

    const controller= userController(
        userRepositoryMongoDb,
        userDbRepository,
    )

    router.get('/getRestOfAllUsers',authMiddleware,controller.getRestOfAllUsers)
    router.post('/followUser',authMiddleware,controller.followUser)
    router.post('/unfollowUser',authMiddleware,controller.unfollowUser)
    router.get('/getFollowing/:userId',controller.getFollowing)
    router.get('/getFollowers/:userId',controller.getFollowers)
    router.get('/getRequests/:username',controller.getRequests)
    router.post('/acceptRequest',authMiddleware,controller.acceptRequest)
    router.patch('/removeFollower/:followerUsername',authMiddleware,controller.removeFollower)
    router.patch('/savePost/:postId',authMiddleware,controller.savePost)
    router.patch('/unsavePost/:postId',authMiddleware,controller.unsavePost)
    router.get('/getSavedPosts',authMiddleware,controller.getSavedPosts)
    return router
}
export default userRouter
