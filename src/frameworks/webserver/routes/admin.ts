import express from 'express';
import { authService } from '../../services/authService';
import { authServiceInterface } from '../../../application/services/authServiceInterfaces';
import { userRepositoryMongoDb } from '../../database/monogDB/repositories/userRepositoryMongoDb';
import { userDbRepository } from '../../../application/repositories/userDbRepository';
import adminController from '../../../adapters/adminController';


const adminRouter = () => {
    const router = express()

    const controller = adminController(
        authService,
        authServiceInterface,
        userRepositoryMongoDb,
        userDbRepository,
    )

    router.get('/getAllUsersForAdmin', controller.getAllUsersForAdmin)
    router.patch('/blockUser/:userId', controller.blockUser)
    router.patch('/unblockUser/:userId', controller.unblockUser)

    return router
}

export default adminRouter