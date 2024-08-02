import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler'
import { AuthService } from '../../frameworks/services/authService';
import { AuthServiceInterface } from '../../application/services/authServiceInterfaces';
import { UserRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/userRepositoryMongoDb';
import { UserDbInterface } from '../../application/repositories/userDbRepository';
import { handleBlockPost, handleBlockUser, handleGetAllPostsForAdmin, handleGetAllUsersForAdmin, handleGetMonthlyData, handleGetWeeklyData, handleGetYearlyData, handleUnblockPost, handleUnblockUser } from '../../application/user-cases/admin/adminAuth';
import { handleGetPostReports, } from '../../application/user-cases/post/postAuth';
import { PostRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/postRepositoryMongoDb';
import { PostDbInterface } from '../../application/repositories/postDbRepository';
import { MailSenderServie } from '../../frameworks/services/mailSenderService';
import { MailSenderServiceInterface } from '../../application/services/mailSenderService';


const adminController = (
  authServiceImpl: AuthService,
  authServieInterface: AuthServiceInterface,
  userDbRepositoryImpl: UserRepositoryMongoDb,
  userDbRepositoryInterface: UserDbInterface,
  postDbRepositoryImpl: PostRepositoryMongoDb,
  postDbRepositoryInterface: PostDbInterface,
  mailSenderServiceImpl: MailSenderServie,
  mailSenderServiceInterface: MailSenderServiceInterface
) => {
  const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl())
  const authService = authServieInterface(authServiceImpl())
  const dbPostRepository = postDbRepositoryInterface(postDbRepositoryImpl())
  const mailSenderService = mailSenderServiceInterface(mailSenderServiceImpl())

  const getAllUsersForAdmin = asyncHandler(async (req: Request, res: Response) => {
    const users = await handleGetAllUsersForAdmin(dbUserRepository)
    res.json({
      users
    })
  })

  const blockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    await handleBlockUser(userId, dbUserRepository)
    res.json({
      status: 'success',
      message: 'User blocked successfully'
    })
  })

  const unblockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    await handleUnblockUser(userId, dbUserRepository)
    res.json({
      status: 'success',
      message: 'User unblocked successfully'
    })
  })

  const blockPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params
    await handleBlockPost(postId, dbPostRepository,dbUserRepository,mailSenderService)
    res.json({
      status: 'success',
      message: 'Post blocked successfully'
    })
  })

  const unblockPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params
    await handleUnblockPost(postId, dbPostRepository)
    res.json({
      status: 'success',
      message: 'Post unblocked successfully'
    })
  })

  const getPostReports = asyncHandler(async (req: Request, res: Response) => {
    const reports = await handleGetPostReports(dbPostRepository)
    res.json({
      status: 'success',
      message: 'Reports fetched successfully',
      reports
    })
  })

  const getWeeklyData = asyncHandler(async (req: Request, res: Response) => {
    const weeklyData = await handleGetWeeklyData(dbPostRepository)
    res.json({
      status: 'success',
      message: 'weekly data fetched succesffully',
      weeklyData
    })
  })

  const getMonthlyData = asyncHandler(async (req: Request, res: Response) => {
    const monthlyData = await handleGetMonthlyData(dbPostRepository)
    res.json({
      status: 'success',
      message: 'monthly data fetched successfully',
      monthlyData
    })
  })

  const getYearlyData = asyncHandler(async (req: Request, res: Response) => {
    const yearlyData = await handleGetYearlyData(dbPostRepository)
    res.json({
      status: 'success',
      message: 'yearly data fetched successfully',
      yearlyData
    })
  })

  const getAllPostsForAdmin = asyncHandler(async (req: Request, res: Response) => {
    const posts = await handleGetAllPostsForAdmin(dbPostRepository)
    res.json({
      status: 'success',
      message: 'posts fetched successfully',
      posts
    })
  })

  return {
    getAllUsersForAdmin,
    blockUser,
    unblockUser,
    getPostReports,
    blockPost,
    unblockPost,
    getWeeklyData,
    getMonthlyData,
    getYearlyData,
    getAllPostsForAdmin
  }
}

export default adminController