import { Request, Response, response } from 'express';
import asyncHandler from 'express-async-handler'
import { AuthService } from '../../frameworks/services/authService';
import { AuthServiceInterface } from '../../application/services/authServiceInterfaces';
import { UserRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/userRepositoryMongoDb';
import { UserDbInterface } from '../../application/repositories/userDbRepository';
import { MailSenderServie } from '../../frameworks/services/mailSenderService';
import { MailSenderServiceInterface } from '../../application/services/mailSenderService';
import { OtpDbInterface } from '../../application/repositories/otpDbRepository';
import { OtpRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/otpRepositoryMongoDb';

//use-case import 
import { userLogin, userRegister, handleSendOtp, handleOtpVerification, userLoginUsingGoogle } from '../../application/user-cases/auth/userAuth';

//importing types
import { UserInterface } from '../../types/userInterface';
import { HttpStatus } from '../../types/httpStatus';
import AppError from '../../utils/appError';


const authController = (
    authServiceImpl: AuthService,
    authServieInterface: AuthServiceInterface,
    userDbRepositoryImpl: UserRepositoryMongoDb,
    userDbRepositoryInterface: UserDbInterface,
    otpDbRepositoryImpl: OtpRepositoryMongoDb,
    otpDbRepositoryInterface: OtpDbInterface,
    mailSenderServiceImpl: MailSenderServie,
    mailSenderServiceInterface: MailSenderServiceInterface
) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl())
    const authService = authServieInterface(authServiceImpl())
    const dbOtpRepository = otpDbRepositoryInterface(otpDbRepositoryImpl())
    const mailSenderService = mailSenderServiceInterface(mailSenderServiceImpl())

    const registerUser = asyncHandler(async (req: Request, res: Response) => {
        // console.log('data from body',req.body)
        const user: UserInterface = req.body;
        await userRegister(user, dbUserRepository, authService);
        res.json({
            status: 'success',
            message: 'user verified'
        })
    })

    const usernameAvailability = asyncHandler(async (req: Request, res: Response) => {
        try {
            const { username } = req.params
            const isAvailable = await dbUserRepository.getUserByUsername(username)
            // console.log('isavailable',isAvailable)
            if (!isAvailable) {
                res.json({
                    available: true,
                    status: 'Username is available'
                });
            } else {
                res.json({
                    available: false,
                    status: 'Username not available'
                })
            }
        } catch (error) {
            console.error('Error checking username availability: ', error)
        }

    })

    const emailAvailability = asyncHandler(async (req: Request, res: Response) => {
        try {
            const { email } = req.params
            const isAvailable = await dbUserRepository.getUserByEmail(email)
            // console.log('email',isAvailable)
            if (!isAvailable) {
                res.json({
                    available: true,
                    status: 'Email is available'
                })
            } else {
                res.json({
                    available: false,
                    status: 'Email already exists'
                })
            }
        } catch (error) {
            console.error('Error checking in email availability: ', error)
        }
    })

    const loginUser = asyncHandler(async (req: Request, res: Response) => {

            const { email, password }: { email: string; password: string } = req.body
            const userDetails = await userLogin(
                email,
                password,
                dbUserRepository,
                authService
            )
            res.json({
                status: 'success',
                message: 'Login successfull',
                user: userDetails
            })

    })

    const sendOtpForEmailVerification = asyncHandler(async (req: Request, res: Response) => {

            // console.log('body data', req.body)
            const { email }: { email: string } = req.body
            // console.log('email is', email)
            const response = await handleSendOtp(email, dbOtpRepository, mailSenderService)
            if (response) {
                res.status(HttpStatus.OK).json({
                    status: "success",
                    message: "Otp send to your mail",
                })
            }
    })

    const verifyOtpForEmailVerification = asyncHandler(async (req: Request, res: Response) => {

            const { otp, email } = req.body
            const verify = await handleOtpVerification(email, otp, dbOtpRepository)
            if (verify) {
                res.status(HttpStatus.OK).json({
                    status: 'success',
                    message: 'Otp verified Successfully'
                })
            }
    })

    const loginWithGoogle=asyncHandler(async(req:Request,res:Response)=>{
        const user=req.body
        const userDetails=await userLoginUsingGoogle(user,dbUserRepository,authService)
        res.json(userDetails)

    })



    return {
        registerUser,
        usernameAvailability,
        emailAvailability,
        loginUser,
        sendOtpForEmailVerification,
        verifyOtpForEmailVerification,
        loginWithGoogle
    }
}
export default authController;