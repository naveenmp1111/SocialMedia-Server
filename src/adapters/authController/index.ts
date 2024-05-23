import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler'
import { AuthService } from '../../frameworks/services/authService';
import { AuthServiceInterface } from '../../application/services/authServiceInterfaces';
import { UserRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/userRepositoryMongoDb';
import { UserDbInterface } from '../../application/repositories/userDbRepository';

//use-case import 
import { userLogin, userRegister } from '../../application/user-cases/auth/userAuth';

//importing types
import { UserInterface } from '../../types/userInterface';


const authController = (
    authServiceImpl: AuthService,
    authServieInterface: AuthServiceInterface,
    userDbRepositoryImpl: UserRepositoryMongoDb,
    userDbRepositoryInterface: UserDbInterface
) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl())
    const authService = authServieInterface(authServiceImpl())

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
            console.log('isavailable',isAvailable)
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
        try {
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

        } catch (error) {
            if (error instanceof Error) {
                res.json({
                    status: 'failed',
                    message: error.message,
                    user: null
                })
            }
            console.error('Error in the Login user', error)

        }
    })



    return {
        registerUser,
        usernameAvailability,
        emailAvailability,
        loginUser
    }
}
export default authController;