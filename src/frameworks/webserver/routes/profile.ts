import express from 'express';
import { userRepositoryMongoDb } from '../../database/monogDB/repositories/userRepositoryMongoDb';
import { userDbRepository } from '../../../application/repositories/userDbRepository';
import { authService } from '../../services/authService';
import { authServiceInterface } from '../../../application/services/authServiceInterfaces';
import authMiddleware from '../middlewares/authMiddleware';
import profileController from '../../../adapters/profileController';

const profileRouter = () => {

    const router = express();

    const controller = profileController(
        userRepositoryMongoDb,
        userDbRepository,
        authService,
        authServiceInterface
    )

    router.post('/editProfile', authMiddleware, controller.editProfile)
    router.get('/getUserByUsername/:username', authMiddleware, controller.getUserByUsername)

    return router
}
export default profileRouter