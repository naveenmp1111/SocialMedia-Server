import express from 'express';
import { userRepositoryMongoDb } from '../../database/monogDB/repositories/userRepositoryMongoDb';
import { userDbRepository } from '../../../application/repositories/userDbRepository';
import userController from '../../../adapters/userController';
import authMiddleware from '../middlewares/authMiddleware';
import { notficationRepositoryMongoDb } from '../../database/monogDB/repositories/notificationRepositoryMongoDb';
import { notificationDbRepository } from '../../../application/repositories/notificationDbRepository';


const userRouter = () => {
    const router = express();

    const controller = userController(
        userRepositoryMongoDb,
        userDbRepository,
        notficationRepositoryMongoDb,
        notificationDbRepository
    )

    router.get('/getRestOfAllUsers', authMiddleware, controller.getRestOfAllUsers)
    router.get('/getSuggestedUsers', authMiddleware, controller.getSuggestedUsers)
    router.post('/followUser', authMiddleware, controller.followUser)
    router.post('/unfollowUser', authMiddleware, controller.unfollowUser)
    router.get('/getFollowing/:userId', controller.getFollowing)
    router.get('/getFollowers/:userId', controller.getFollowers)
    router.get('/getRequests/:username', controller.getRequests)
    router.post('/acceptRequest', authMiddleware, controller.acceptRequest)
    router.patch('/removeFollower/:followerUsername', authMiddleware, controller.removeFollower)
    router.patch('/savePost/:postId', authMiddleware, controller.savePost)
    router.patch('/unsavePost/:postId', authMiddleware, controller.unsavePost)
    router.get('/getSavedPosts', authMiddleware, controller.getSavedPosts)
    router.patch('/cancelRequest/:friendUsername', authMiddleware, controller.cancelRequest)
    router.delete('/declineRequest/:friendUsername', authMiddleware, controller.declineRequest)
    router.patch('/blockUserByUsername/:username', authMiddleware, controller.blockUserByUsername)
    router.patch('/unblockUserByUsername/:username', authMiddleware, controller.unblockUserByUsername)
    router.get('/getBlockedUsers', authMiddleware, controller.getBlockedUsers)

    return router
}
export default userRouter
