import express from 'express';
import { authService } from '../../services/authService';
import authController from '../../../adapters/authController';
import { authServiceInterface } from '../../../application/services/authServiceInterfaces';
import { userRepositoryMongoDb } from '../../database/monogDB/repositories/userRepositoryMongoDb';
import { userDbRepository } from '../../../application/repositories/userDbRepository';

const authRouter=()=>{
    const router=express()

    const controller=authController(
        authService,
        authServiceInterface,
        userRepositoryMongoDb,
        userDbRepository
    )

    router.post('/signup', controller.registerUser)
    router.get('/usernameAvailability/:username',controller.usernameAvailability)
    router.get('/emailAvailability/:email',controller.emailAvailability)
    router.post('/login',controller.loginUser)

    return router
}

export default authRouter