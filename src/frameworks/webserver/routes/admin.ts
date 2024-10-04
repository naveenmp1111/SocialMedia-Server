import express from 'express';
import { authService } from '../../services/authService';
import { authServiceInterface } from '../../../application/services/authServiceInterfaces';
import { userRepositoryMongoDb } from '../../database/monogDB/repositories/userRepositoryMongoDb';
import { userDbRepository } from '../../../application/repositories/userDbRepository';
import adminController from '../../../adapters/adminController';
import { postRepositoryMongoDb } from '../../database/monogDB/repositories/postRepositoryMongoDb';
import { postDbRepository } from '../../../application/repositories/postDbRepository';
import { mailSenderService } from '../../services/mailSenderService';
import { mailSenderServiceInterface } from '../../../application/services/mailSenderService';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware';


const adminRouter = () => {
    const router = express()

    const controller = adminController(
        authService,
        authServiceInterface,
        userRepositoryMongoDb,
        userDbRepository,
        postRepositoryMongoDb,
        postDbRepository,
        mailSenderService,
        mailSenderServiceInterface
    )

    router.get('/getAllUsersForAdmin',adminAuthMiddleware, controller.getAllUsersForAdmin)
    router.patch('/blockUser/:userId',adminAuthMiddleware, controller.blockUser)
    router.patch('/unblockUser/:userId',adminAuthMiddleware, controller.unblockUser)
    router.get('/getPostReports',adminAuthMiddleware, controller.getPostReports)
    router.patch('/blockPost/:postId',adminAuthMiddleware, controller.blockPost)
    router.patch('/unBlockPost/:postId',adminAuthMiddleware, controller.unblockPost)
    router.get('/getWeeklyData',adminAuthMiddleware, controller.getWeeklyData)
    router.get('/getMonthlyData',adminAuthMiddleware, controller.getMonthlyData)
    router.get('/getYearlyData',adminAuthMiddleware, controller.getYearlyData)
    router.get('/getAllPostsForAdmin',adminAuthMiddleware, controller.getAllPostsForAdmin)

    return router
}

export default adminRouter