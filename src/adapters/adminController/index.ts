import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler'
import { AuthService } from '../../frameworks/services/authService';
import { AuthServiceInterface } from '../../application/services/authServiceInterfaces';
import { UserRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/userRepositoryMongoDb';
import { UserDbInterface } from '../../application/repositories/userDbRepository';
import { handleBlockPost, handleBlockUser, handleGetAllUsersForAdmin, handleUnblockPost, handleUnblockUser } from '../../application/user-cases/admin/adminAuth';
import { handleGetPostReports } from '../../application/user-cases/post/postAuth';
import { PostRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/postRepositoryMongoDb';
import { PostDbInterface } from '../../application/repositories/postDbRepository';


const adminController=(
    authServiceImpl: AuthService,
    authServieInterface: AuthServiceInterface,
    userDbRepositoryImpl: UserRepositoryMongoDb,
    userDbRepositoryInterface: UserDbInterface,
    postDbRepositoryImpl:PostRepositoryMongoDb,
    postDbRepositoryInterface:PostDbInterface
)=>{
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl())
    const authService = authServieInterface(authServiceImpl())
    const dbPostRepository =postDbRepositoryInterface(postDbRepositoryImpl())


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

    const blockPost=asyncHandler(async(req:Request,res:Response)=>{
        const {postId}=req.params
        console.log('userdddddd ',postId)
        await handleBlockPost(postId,dbPostRepository)
        res.json({
            status:'success',
            message:'Post blocked successfully'
        })
    })

    const unblockPost=asyncHandler(async(req:Request,res:Response)=>{
        const {postId}=req.params
        await handleUnblockPost(postId,dbPostRepository)
        res.json({
            status:'success',
            message:'Post unblocked successfully'
        })
    })

    const getPostReports=asyncHandler(async(req:Request,res:Response)=>{
        const reports=await handleGetPostReports(dbPostRepository)
        res.json({
          status:'success',
          message:'Reports fetched successfully',
          reports
        })
      })

    return {
        getAllUsersForAdmin,
        blockUser,
        unblockUser,
        getPostReports,
        blockPost,
        unblockPost
    }
}

export default adminController