import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler'
import { AuthService } from '../../frameworks/services/authService';
import { AuthServiceInterface } from '../../application/services/authServiceInterfaces';
import { UserRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/userRepositoryMongoDb';
import { UserDbInterface } from '../../application/repositories/userDbRepository';
import { handleBlockUser, handleGetAllUsersForAdmin, handleUnblockUser } from '../../application/user-cases/admin/adminAuth';


const adminController=(
    authServiceImpl: AuthService,
    authServieInterface: AuthServiceInterface,
    userDbRepositoryImpl: UserRepositoryMongoDb,
    userDbRepositoryInterface: UserDbInterface,
)=>{
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl())
    const authService = authServieInterface(authServiceImpl())


    const getAllUsersForAdmin=asyncHandler(async(req:Request,res:Response)=>{
          const users=await handleGetAllUsersForAdmin(dbUserRepository)
          res.json({
            users
          })
          console.log(users)
    })

    const blockUser=asyncHandler(async(req:Request,res:Response)=>{
        const {userId}=req.params
        console.log('userdddddd ',userId)
        await handleBlockUser(userId,dbUserRepository)
        res.json({
            status:'success',
            message:'User blocked successfully'
        })
    })

    const unblockUser=asyncHandler(async(req:Request,res:Response)=>{
        const {userId}=req.params
        await handleUnblockUser(userId,dbUserRepository)
        res.json({
            status:'success',
            message:'User unblocked successfully'
        })
    })

    return {
        getAllUsersForAdmin,
        blockUser,
        unblockUser
    }
}

export default adminController