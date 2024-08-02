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

    router.get('/getAllUsersForAdmin', controller.getAllUsersForAdmin)
    router.patch('/blockUser/:userId', controller.blockUser)
    router.patch('/unblockUser/:userId', controller.unblockUser)
    router.get('/getPostReports', controller.getPostReports)
    router.patch('/blockPost/:postId', controller.blockPost)
    router.patch('/unBlockPost/:postId', controller.unblockPost)
    router.get('/getWeeklyData', controller.getWeeklyData)
    router.get('/getMonthlyData', controller.getMonthlyData)
    router.get('/getYearlyData', controller.getYearlyData)
    router.get('/getAllPostsForAdmin', controller.getAllPostsForAdmin)

    return router
}

export default adminRouter