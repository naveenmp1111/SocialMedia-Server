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
    router.post('/followUser',controller.followUser)
    return router
}
export default userRouter
