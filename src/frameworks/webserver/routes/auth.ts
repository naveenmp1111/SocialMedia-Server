import express from 'express';
import { authService } from '../../services/authService';
import authController from '../../../adapters/authController';
import { authServiceInterface } from '../../../application/services/authServiceInterfaces';
import { userRepositoryMongoDb } from '../../database/monogDB/repositories/userRepositoryMongoDb';
import { userDbRepository } from '../../../application/repositories/userDbRepository';
import { otpDbRepository } from '../../../application/repositories/otpDbRepository';
import { otpRepositoryMongoDb } from '../../database/monogDB/repositories/otpRepositoryMongoDb';
import { mailSenderService } from '../../services/mailSenderService';
import { mailSenderServiceInterface } from '../../../application/services/mailSenderService';

const authRouter=()=>{
    const router=express()

    const controller=authController(
        authService,
        authServiceInterface,
        userRepositoryMongoDb,
        userDbRepository,
        otpRepositoryMongoDb,
        otpDbRepository,
        mailSenderService,
        mailSenderServiceInterface
    )

    router.post('/signup', controller.registerUser)
    router.get('/usernameAvailability/:username',controller.usernameAvailability)
    router.get('/emailAvailability/:email',controller.emailAvailability)
    router.post('/login',controller.loginUser)
    router.post('/sendOtp',controller.sendOtpForEmailVerification)
    router.post('/verifyOtp',controller.verifyOtpForEmailVerification)
    router.post('/google_auth',controller.loginWithGoogle)

    return router
}

export default authRouter